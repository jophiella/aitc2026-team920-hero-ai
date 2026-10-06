import logging
from typing import Dict, Any, List
from src.models.travel import TravelInput
from src.agents.knowledge_base import DAKLAK_KNOWLEDGE_POOL

logger = logging.getLogger("synthesis_agent")


class SynthesisAgent:
    """
    Agent 2: Synthesis & Recommendation Agent
    - Model: gemini-3.1-flash-lite
    - Nhiệm vụ:
      1. Tiếp nhận kết quả tra cứu thô từ Agent 1.
      2. Phân loại cấu trúc ứng viên ("Đi đâu", "Ăn gì", "Trải nghiệm", "Văn hóa").
      3. Tính toán điểm phù hợp sở thích (Relevance Scoring) và sắp xếp kho ứng viên (Candidate Pool).
    """

    def __init__(self):
        self.model = "gemini-3.1-flash-lite"

    def synthesize(self, user_input: TravelInput, search_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Lọc và gán điểm ban đầu cho các ứng viên địa điểm, ẩm thực."""
        candidates = []
        user_tags = set(user_input.preferences)

        for item in DAKLAK_KNOWLEDGE_POOL:
            item_tags = set(item.get("tags", []))
            # Tính điểm tương đồng sở thích
            match_count = len(user_tags.intersection(item_tags))
            score = 1.0 + (match_count * 0.5)

            candidate = dict(item)
            candidate["relevance_score"] = score
            candidates.append(candidate)

        # Sắp xếp ứng viên theo relevance_score cao nhất
        candidates.sort(key=lambda x: x["relevance_score"], reverse=True)
        return candidates
