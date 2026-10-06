import json
import logging
from typing import Dict, Any, List
from openai import OpenAI
from src.core.setting import settings
from src.schemas.travel import TravelInput, CandidateItem, CandidatePoolResponse
from src.prompts import (
    AGENT_2_SYNTHESIS_SYSTEM_PROMPT,
    build_synthesis_user_prompt
)
from src.agents.knowledge_base import DAKLAK_KNOWLEDGE_POOL

logger = logging.getLogger("synthesis_agent")


class SynthesisAgent:
    """
    Agent 2: Synthesis & Recommendation Agent
    - Model: gemini-3.1-flash-lite
    - Prompts: AGENT_2_SYNTHESIS_SYSTEM_PROMPT, build_synthesis_user_prompt
    - Schemas: CandidateItem, CandidatePoolResponse
    """

    def __init__(self):
        self.model = "gemini-3.1-flash-lite"
        self.api_key = settings.get_api_key()
        self.base_url = "https://api.thucchien.ai"

    def synthesize(self, user_input: TravelInput, search_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Tổng hợp dữ liệu từ Agent 1 và tri thức tham khảo thành Candidate Pool.
        Thực hiện gọi LLM để trích xuất candidates; nếu offline thì tính điểm tương đồng.
        """
        user_prompt = build_synthesis_user_prompt(
            preferences=user_input.preferences,
            custom_notes=user_input.custom_notes or "",
            raw_search_intel=search_data.get("raw_text", ""),
            reference_knowledge=DAKLAK_KNOWLEDGE_POOL
        )

        try:
            client = OpenAI(api_key=self.api_key, base_url=self.base_url)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": AGENT_2_SYNTHESIS_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                timeout=12.0
            )

            content = response.choices[0].message.content or "{}"
            parsed = json.loads(content)
            candidates_list = parsed.get("candidates", [])
            if candidates_list and isinstance(candidates_list, list):
                return candidates_list
        except Exception as e:
            logger.info(f"Agent 2 Gateway call notice: {e}")

        # Fallback: Tính điểm tương đồng dựa trên tri thức tham khảo
        candidates = []
        user_tags = set(user_input.preferences)

        for item in DAKLAK_KNOWLEDGE_POOL:
            item_tags = set(item.get("tags", []))
            match_count = len(user_tags.intersection(item_tags))
            score = 1.0 + (match_count * 0.5)

            candidate = dict(item)
            candidate["relevance_score"] = score
            candidates.append(candidate)

        candidates.sort(key=lambda x: x["relevance_score"], reverse=True)
        return candidates
