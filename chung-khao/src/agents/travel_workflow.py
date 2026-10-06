import logging
from typing import TypedDict, Dict, Any, List, Optional
from langgraph.graph import StateGraph, START, END

from src.schemas import TravelInput, ItineraryData, DiscoverySearchResponse
from src.agents.search_agent import SearchGroundingAgent
from src.agents.synthesis_agent import SynthesisAgent
from src.agents.decision_agent import DecisionRerankingAgent

logger = logging.getLogger("travel_workflow")


class TravelWorkflowState(TypedDict):
    """Trạng thái luân chuyển dữ liệu giữa các Node trong LangGraph."""
    user_input: TravelInput
    search_data: Dict[str, Any]
    candidates: List[Dict[str, Any]]
    final_itinerary: Optional[ItineraryData]
    workflow_logs: List[str]


class DakLakTravelWorkflow:
    """
    Agentic Workflow chuẩn mực xây dựng trên LangGraph StateGraph:
    - Node 1: search_node (Agent 1: gemini-3.1-flash-lite + Google Search Tool)
    - Node 2: synthesis_node (Agent 2: gemini-3.1-flash-lite)
    - Node 3: decision_node (Agent 3: gemini-3.1-flash-lite - LLM Structured Output)
    """

    def __init__(self):
        self.agent1_search = SearchGroundingAgent()
        self.agent2_synthesis = SynthesisAgent()
        self.agent3_decision = DecisionRerankingAgent()
        
        # Khởi tạo và biên dịch LangGraph StateGraph
        self.graph = self._build_graph()

    def _build_graph(self):
        builder = StateGraph(TravelWorkflowState)

        # Định nghĩa các Node trong LangGraph
        builder.add_node("search_agent", self._search_step)
        builder.add_node("synthesis_agent", self._synthesis_step)
        builder.add_node("decision_agent", self._decision_step)

        # Định nghĩa luồng luân chuyển State giữa các Agent
        builder.add_edge(START, "search_agent")
        builder.add_edge("search_agent", "synthesis_agent")
        builder.add_edge("synthesis_agent", "decision_agent")
        builder.add_edge("decision_agent", END)

        return builder.compile()

    def _search_step(self, state: TravelWorkflowState) -> Dict[str, Any]:
        """Node 1 trong LangGraph: Agent 1 tra cứu thông tin thời gian thực."""
        user_input = state["user_input"]
        logger.info(f"[LangGraph Node 1] SearchGroundingAgent khởi chạy cho {user_input.duration_days} ngày...")
        
        search_data = self.agent1_search.search_travel_intel(user_input)
        logs = state.get("workflow_logs", []) + [
            f"Agent 1: Tra cứu {len(search_data.get('queries', []))} truy vấn và {len(search_data.get('sources', []))} nguồn thành công"
        ]
        return {
            "search_data": search_data,
            "workflow_logs": logs
        }

    def _synthesis_step(self, state: TravelWorkflowState) -> Dict[str, Any]:
        """Node 2 trong LangGraph: Agent 2 tổng hợp và tính điểm ứng viên."""
        user_input = state["user_input"]
        search_data = state["search_data"]
        logger.info(f"[LangGraph Node 2] SynthesisAgent tổng hợp dữ liệu ứng viên...")

        candidates = self.agent2_synthesis.synthesize(user_input, search_data)
        logs = state.get("workflow_logs", []) + [
            f"Agent 2: Tổng hợp được {len(candidates)} ứng viên tiềm năng"
        ]
        return {
            "candidates": candidates,
            "workflow_logs": logs
        }

    def _decision_step(self, state: TravelWorkflowState) -> Dict[str, Any]:
        """Node 3 trong LangGraph: Agent 3 (gemini-3.1-flash-lite) sinh lịch trình Structured Output."""
        user_input = state["user_input"]
        candidates = state["candidates"]
        search_data = state["search_data"]
        logger.info(f"[LangGraph Node 3] DecisionRerankingAgent (gemini-3.1-flash-lite) đang ra quyết định và reranking...")

        final_itinerary = self.agent3_decision.decide_and_plan(user_input, candidates, search_data)
        logs = state.get("workflow_logs", []) + [
            "Agent 3: Hoàn thành quyết định lịch trình qua LLM Structured Output & Pydantic Guardrail"
        ]
        return {
            "final_itinerary": final_itinerary,
            "workflow_logs": logs
        }

    async def run(self, user_input: TravelInput) -> ItineraryData:
        """Thực thi LangGraph StateGraph tuần tự qua các node."""
        initial_state: TravelWorkflowState = {
            "user_input": user_input,
            "search_data": {},
            "candidates": [],
            "final_itinerary": None,
            "workflow_logs": []
        }

        # Gọi LangGraph invoke
        result_state = self.graph.invoke(initial_state)
        for log_entry in result_state.get("workflow_logs", []):
            logger.info(f"[Workflow Execution Log] {log_entry}")

        return result_state["final_itinerary"]

    def discover_preferences(self, query: str) -> DiscoverySearchResponse:
        """Tra cứu tìm kiếm sở thích mới bằng Agent 1 Google Search Grounding."""
        return self.agent1_search.discover_places(query)
