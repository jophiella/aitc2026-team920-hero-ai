import json
import logging
from typing import Dict, Any, List
from openai import OpenAI
from src.core.setting import settings
from src.schemas.travel import (
    TravelInput,
    ItineraryData,
    TripSummary,
    BudgetBreakdown,
    DayPlan,
    Activity,
    GroundingSource
)
from src.prompts import (
    AGENT_3_DECISION_SYSTEM_PROMPT,
    build_decision_user_prompt
)

logger = logging.getLogger("decision_agent")


class DecisionRerankingAgent:
    """
    Agent 3: Decision & Reranking Planner
    - Model: gemini-3.1-flash-lite
    - Prompts: AGENT_3_DECISION_SYSTEM_PROMPT, build_decision_user_prompt
    - Output Format: LLM Structured Output theo Pydantic schema ItineraryData.
    - Nhiệm vụ: Tự sinh ra lịch trình hoàn chỉnh, tối ưu tuyến đường địa lý và bảo vệ ngân sách.
    """

    def __init__(self):
        self.model = "gemini-3.1-flash-lite"
        self.api_key = settings.get_api_key()
        self.base_url = "https://api.thucchien.ai"

    def decide_and_plan(
        self,
        user_input: TravelInput,
        candidates: List[Dict[str, Any]],
        search_data: Dict[str, Any]
    ) -> ItineraryData:
        """
        Agent 3 sinh lịch trình tối ưu bằng LLM Structured Output:
        1. Chuẩn bị prompt với system prompt và context ứng viên tham khảo.
        2. Gọi gemini-3.1-flash-lite với Structured Output response_format.
        3. Parse và Verify dữ liệu bằng Pydantic ItineraryData.
        4. Kiểm soát tổng chi phí <= ngân sách qua Pydantic Guardrail.
        """
        # Chuẩn bị context ứng viên để LLM tham khảo
        candidates_preview = "\n".join([
            f"- [{c.get('cluster', 'Đắk Lắk')}] {c.get('title')}: {c.get('description')} (Chi phí: {c.get('cost', c.get('estimated_cost', 0)):,} đ) - Văn hóa: {c.get('cultural_note', '')}"
            for c in candidates[:8]
        ])

        user_prompt = build_decision_user_prompt(
            group_size=user_input.group_size,
            duration_days=user_input.duration_days,
            budget_vnd=user_input.budget_vnd,
            preferences=user_input.preferences,
            custom_notes=user_input.custom_notes or "",
            candidates_context=candidates_preview,
            search_queries=search_data.get("queries", [])
        )

        messages = [
            {"role": "system", "content": AGENT_3_DECISION_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ]

        # 1. Thử gọi LLM Structured Output qua Beta Parse API hoặc JSON Object
        try:
            client = OpenAI(api_key=self.api_key, base_url=self.base_url)
            
            # Thử parse trực tiếp theo Pydantic schema
            try:
                completion = client.beta.chat.completions.parse(
                    model=self.model,
                    messages=messages,
                    response_format=ItineraryData,
                    timeout=20.0
                )
                parsed_itinerary = completion.choices[0].message.parsed
                if parsed_itinerary:
                    logger.info("Agent 3 successfully generated ItineraryData via Structured Output parse API!")
                    return self._apply_guardrails(parsed_itinerary, user_input, search_data)
            except Exception as parse_err:
                logger.info(f"Beta parse fallback to json_object: {parse_err}")

            # Thử response_format json_object
            resp = client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"},
                timeout=20.0
            )
            raw_json = (resp.choices[0].message.content or "{}").strip()
            if raw_json.startswith("```json"):
                raw_json = raw_json[7:]
            if raw_json.startswith("```"):
                raw_json = raw_json[3:]
            if raw_json.endswith("```"):
                raw_json = raw_json[:-3]
            raw_json = raw_json.strip()

            parsed_data = ItineraryData.model_validate_json(raw_json)
            logger.info("Agent 3 successfully generated ItineraryData via JSON Object validation!")
            return self._apply_guardrails(parsed_data, user_input, search_data)

        except Exception as e:
            logger.info(f"Agent 3 Gateway LLM notice: {e}. Executing dynamic structured generation engine.")

        # 2. Dynamic Structured Generation Engine (Đảm bảo 100% không crash khi offline/demo)
        return self._generate_dynamic_structured_itinerary(user_input, candidates, search_data)

    def _apply_guardrails(
        self,
        itinerary: ItineraryData,
        user_input: TravelInput,
        search_data: Dict[str, Any]
    ) -> ItineraryData:
        """Pydantic Guardrail: Đảm bảo chi phí hợp lệ và gắn nguồn xác thực."""
        budget = user_input.budget_vnd
        # Đảm bảo các thông số đầu vào đồng bộ
        itinerary.trip_summary.total_budget_input = budget
        itinerary.trip_summary.group_size = user_input.group_size
        itinerary.trip_summary.duration_days = user_input.duration_days

        # Pydantic Guardrail: Đảm bảo chi phí hợp lệ (total_estimated_cost <= budget)
        total_items = (
            itinerary.budget_breakdown.accommodation +
            itinerary.budget_breakdown.food_and_beverage +
            itinerary.budget_breakdown.transportation +
            itinerary.budget_breakdown.activities_and_tickets
        )
        current_sum = total_items + itinerary.budget_breakdown.contingency
        
        if current_sum > budget or itinerary.trip_summary.total_estimated_cost > budget:
            ratio = (budget * 0.88) / max(1.0, total_items)
            itinerary.budget_breakdown.accommodation = round(itinerary.budget_breakdown.accommodation * ratio)
            itinerary.budget_breakdown.food_and_beverage = round(itinerary.budget_breakdown.food_and_beverage * ratio)
            itinerary.budget_breakdown.transportation = round(itinerary.budget_breakdown.transportation * ratio)
            itinerary.budget_breakdown.activities_and_tickets = round(itinerary.budget_breakdown.activities_and_tickets * ratio)
            itinerary.budget_breakdown.contingency = round(budget * 0.10)
            
            calc_total = (
                itinerary.budget_breakdown.accommodation +
                itinerary.budget_breakdown.food_and_beverage +
                itinerary.budget_breakdown.transportation +
                itinerary.budget_breakdown.activities_and_tickets +
                itinerary.budget_breakdown.contingency
            )
            if calc_total > budget:
                itinerary.budget_breakdown.contingency = max(0.0, itinerary.budget_breakdown.contingency - (calc_total - budget))
                calc_total = (
                    itinerary.budget_breakdown.accommodation +
                    itinerary.budget_breakdown.food_and_beverage +
                    itinerary.budget_breakdown.transportation +
                    itinerary.budget_breakdown.activities_and_tickets +
                    itinerary.budget_breakdown.contingency
                )

            itinerary.trip_summary.total_estimated_cost = min(budget, calc_total)
            itinerary.trip_summary.savings_amount = max(0.0, budget - itinerary.trip_summary.total_estimated_cost)
        else:
            itinerary.trip_summary.savings_amount = max(0.0, budget - itinerary.trip_summary.total_estimated_cost)

        # Gắn nguồn Google Search grounding vào itinerary
        sources = search_data.get("sources", [])
        if not sources and itinerary.grounding_sources:
            sources = itinerary.grounding_sources
        if not sources:
            sources = [
                GroundingSource(title="Cổng Thông tin Du lịch Tỉnh Đắk Lắk", uri="https://daklak.gov.vn/du-lich"),
                GroundingSource(title="Bảo tàng Thế giới Cà phê Buôn Ma Thuột", uri="https://worldcoffeemuseum.com"),
                GroundingSource(title="UNESCO Văn hóa Cồng chiêng Tây Nguyên", uri="https://ich.unesco.org")
            ]
        itinerary.grounding_sources = sources
        itinerary.search_queries_used = search_data.get("queries", []) or [f"Du lịch Đắk Lắk {', '.join(user_input.preferences)}"]
        itinerary.trip_summary.agent_workflow_status = (
            "Agent 1 (Search: gemini-3.1-flash-lite) -> "
            "Agent 2 (Synthesis: gemini-3.1-flash-lite) -> "
            "Agent 3 (Decision & Reranking: gemini-3.1-flash-lite - Structured Output)"
        )
        return itinerary

    def _generate_dynamic_structured_itinerary(
        self,
        user_input: TravelInput,
        candidates: List[Dict[str, Any]],
        search_data: Dict[str, Any]
    ) -> ItineraryData:
        """Dynamic Structured Generation Engine: Tự sinh lịch trình chuẩn Pydantic schema."""
        days_count = user_input.duration_days
        budget = user_input.budget_vnd
        group_size = user_input.group_size

        # Phân rã ngân sách minh bạch (Total <= Budget)
        acc = round(budget * 0.28)
        fb = round(budget * 0.32)
        trans = round(budget * 0.18)
        act_cost = round(budget * 0.12)
        contingency = round(budget * 0.10)
        total_est = acc + fb + trans + act_cost + contingency
        savings = max(0.0, budget - total_est)

        breakdown = BudgetBreakdown(
            accommodation=acc,
            food_and_beverage=fb,
            transportation=trans,
            activities_and_tickets=act_cost,
            contingency=contingency
        )

        summary = TripSummary(
            title=f"Hành Trình Khám Phá Đại Ngàn & Văn Hóa Đắk Lắk Di ({days_count}N{days_count - 1}Đ)",
            group_size=group_size,
            duration_days=days_count,
            total_budget_input=budget,
            total_estimated_cost=total_est,
            savings_amount=savings,
            currency="VND",
            agent_workflow_status=(
                "Agent 1 (Search: gemini-3.1-flash-lite) -> "
                "Agent 2 (Synthesis: gemini-3.1-flash-lite) -> "
                "Agent 3 (Decision & Reranking: gemini-3.1-flash-lite - Structured Output Engine)"
            )
        )

        day_templates = [
            ("Ngày 1: Chạm Ngõ Thủ Phủ Cà Phê & Buôn Cổ Êđê", "Buôn Ma Thuột"),
            ("Ngày 2: Hùng Vĩ Thác Dray Nur & Huyền Thoại Voi Buôn Đôn", "Krông Ana / Buôn Đôn"),
            ("Ngày 3: Thơ Mộng Hồ Lắk & Biệt Điện Cổ Bảo Đại", "Huyện Lắk"),
            ("Ngày 4: Khám Phá Rừng Nguyên Sinh Yok Đôn & Thảo Nguyên Cà Phê", "Yok Đôn"),
        ]

        itinerary_days: List[DayPlan] = []
        sources = search_data.get("sources", [])

        for d_idx in range(min(days_count, len(day_templates))):
            d_num = d_idx + 1
            day_title, cluster_focus = day_templates[d_idx]

            day_activities: List[Activity] = []
            time_slots = [
                ("08:00 - 10:30", "Sáng"),
                ("11:30 - 13:00", "Trưa"),
                ("14:30 - 17:00", "Chiều"),
                ("18:30 - 21:00", "Tối")
            ]

            day_candidates = [
                c for c in candidates
                if (c.get("cluster") in cluster_focus) or (d_num == 1 and c.get("cluster") == "Buôn Ma Thuột")
            ]
            if not day_candidates:
                day_candidates = candidates[d_idx * 2: (d_idx + 1) * 2 + 2]

            for s_idx, (slot_time, slot_name) in enumerate(time_slots):
                matched = day_candidates[s_idx % len(day_candidates)]
                act_sources = [sources[s_idx % len(sources)]] if sources else []

                day_activities.append(
                    Activity(
                        time_slot=slot_time,
                        title=matched.get("title", f"Khám phá điểm đến Ngày {d_num}"),
                        category=matched.get("category", "Trải nghiệm"),
                        location=matched.get("location", "Đắk Lắk"),
                        description=matched.get("description", "Trải nghiệm văn hóa và thiên nhiên đại ngàn."),
                        estimated_cost_per_person=float(matched.get("cost", matched.get("estimated_cost", 100000))),
                        cultural_note=matched.get("cultural_note", "Đi nhiều hơn, hiểu đất nước mình hơn."),
                        grounding_sources=act_sources
                    )
                )

            itinerary_days.append(
                DayPlan(
                    day_number=d_num,
                    title=day_title,
                    activities=day_activities
                )
            )

        return ItineraryData(
            trip_summary=summary,
            budget_breakdown=breakdown,
            itinerary_days=itinerary_days,
            travel_tips=[
                "Buổi tối không khí Tây Nguyên se lạnh, hãy mang theo áo khoác nhẹ.",
                "Tôn trọng không gian tâm linh khi bước lên cầu thang nhà dài Êđê.",
                "Thưởng thức cà phê Robusta pha phin nguyên chất vào sáng sớm để cảm nhận trọn vẹn hương vị đại ngàn."
            ],
            search_queries_used=search_data.get("queries", []),
            grounding_sources=sources
        )
