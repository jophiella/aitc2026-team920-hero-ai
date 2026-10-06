import logging
from src.models.travel import TravelInput, ItineraryData, DiscoverySearchResponse
from src.agents.search_agent import SearchGroundingAgent
from src.agents.synthesis_agent import SynthesisAgent
from src.agents.decision_agent import DecisionRerankingAgent

logger = logging.getLogger("travel_workflow")


class DakLakTravelWorkflow:
    """
    Nhạc trưởng điều phối chuỗi 3 Agent chuyên trách:
    - Agent 1: SearchGroundingAgent (gemini-3.1-flash-lite + Google Search)
    - Agent 2: SynthesisAgent (gemini-3.1-flash-lite)
    - Agent 3: DecisionRerankingAgent (gemini-3.1-pro-preview)
    """

    def __init__(self):
        self.agent1_search = SearchGroundingAgent()
        self.agent2_synthesis = SynthesisAgent()
        self.agent3_decision = DecisionRerankingAgent()

    async def run(self, user_input: TravelInput) -> ItineraryData:
        """Thực thi pipeline tuần tự 3 Agent."""
        # 1. Agent 1: Tra cứu thời gian thực & trích xuất grounding
        search_data = self.agent1_search.search_travel_intel(user_input)

        # 2. Agent 2: Tổng hợp & tính điểm phù hợp cho kho ứng viên
        candidates = self.agent2_synthesis.synthesize(user_input, search_data)

        # 3. Agent 3: Quyết định, rerank tuyến đường & bảo vệ ngân sách
        final_itinerary = self.agent3_decision.decide_and_plan(user_input, candidates, search_data)

        return final_itinerary

    def discover_preferences(self, query: str) -> DiscoverySearchResponse:
        """Tra cứu tìm kiếm sở thích mới bằng Agent 1 Google Search Grounding."""
        return self.agent1_search.discover_places(query)
