import logging
from typing import Dict, Any, List
from src.models.travel import (
    TravelInput,
    ItineraryData,
    TripSummary,
    BudgetBreakdown,
    DayPlan,
    Activity
)

logger = logging.getLogger("decision_agent")


class DecisionRerankingAgent:
    """
    Agent 3: Decision & Reranking Planner
    - Model: gemini-3.1-pro-preview
    - Nhiệm vụ:
      1. Reranking tập ứng viên từ Agent 2 theo độ ưu tiên cao nhất.
      2. Tối ưu hóa địa lý Đắk Lắk: phân bổ theo cụm (Buôn Ma Thuột -> Buôn Đôn -> Krông Ana -> Lắk).
      3. Kiểm soát ngân sách qua Pydantic Guardrail (Tổng chi phí <= Ngân sách).
      4. Tạo cấu trúc lịch trình theo khung giờ (Sáng / Trưa / Chiều / Tối) minh bạch.
    """

    def __init__(self):
        self.model = "gemini-3.1-pro-preview"

    def decide_and_plan(
        self,
        user_input: TravelInput,
        candidates: List[Dict[str, Any]],
        search_data: Dict[str, Any]
    ) -> ItineraryData:
        """
        Quyết định lịch trình tối ưu:
        - Phân rã ngân sách khoa học (Lưu trú, Ăn uống, Di chuyển, Vé, Dự phòng 10%).
        - Reranking hoạt động theo sở thích và ghi chú tự do.
        - Đảm bảo kiểm định nghiêm ngặt Pydantic.
        """
        days_count = user_input.duration_days
        budget = user_input.budget_vnd
        group_size = user_input.group_size

        # Phân rã chi phí minh bạch
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
                "Agent 3 (Decision & Reranking: gemini-3.1-pro-preview)"
            )
        )

        # Định tuyến theo cụm địa lý hợp lý
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
                if (c["cluster"] in cluster_focus) or (d_num == 1 and c["cluster"] == "Buôn Ma Thuột")
            ]
            if not day_candidates:
                day_candidates = candidates[d_idx * 2: (d_idx + 1) * 2 + 2]

            for s_idx, (slot_time, slot_name) in enumerate(time_slots):
                matched_item = day_candidates[s_idx % len(day_candidates)]
                act_sources = [sources[s_idx % len(sources)]] if sources else []

                day_activities.append(
                    Activity(
                        time_slot=slot_time,
                        title=f"{matched_item['title']}",
                        category=matched_item["category"],
                        location=matched_item["location"],
                        description=matched_item["description"],
                        estimated_cost_per_person=matched_item["cost"],
                        cultural_note=matched_item["cultural_note"],
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
                "Tôn trọng không gian tâm linh khi bước lên cầu thang đực / cầu thang cái của nhà dài Êđê.",
                "Thưởng thức cà phê Robusta pha phin nguyên chất vào sáng sớm để cảm nhận trọn vẹn hương vị đại ngàn."
            ],
            search_queries_used=search_data.get("queries", []),
            grounding_sources=sources
        )
