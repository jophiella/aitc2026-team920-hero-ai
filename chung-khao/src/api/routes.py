import datetime
from fastapi import APIRouter, HTTPException, status
from src.models.travel import (
    TravelInput,
    ItineraryResponse,
    DiscoverySearchRequest,
    DiscoverySearchResponse
)
from src.agents.travel_workflow import DakLakTravelWorkflow

router = APIRouter(prefix="/api/v1", tags=["Travel AI Assistant"])
workflow = DakLakTravelWorkflow()


@router.get("/health")
async def health_check():
    """Endpoint kiểm tra sức khỏe hệ thống Backend AI Gateway"""
    return {
        "status": "ok",
        "service": "daklak-travel-ai-backend",
        "workflow": "3-Agent Workflow (Search: gemini-3.1-flash-lite, Synthesis: gemini-3.1-flash-lite, Decision: gemini-3.1-pro-preview)",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


@router.post("/generate-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(input_data: TravelInput):
    """
    Endpoint tạo lịch trình du lịch Đắk Lắk (Đi đâu - Ăn gì - Chi phí thế nào)
    Chạy Agentic Workflow 3 giai đoạn:
    1. SearchGroundingAgent (gemini-3.1-flash-lite + Google Search Tool)
    2. SynthesisAgent (gemini-3.1-flash-lite)
    3. DecisionRerankingAgent (gemini-3.1-pro-preview)
    """
    try:
        data = await workflow.run(input_data)
        return ItineraryResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống lập lịch trình đa tác nhân: {str(e)}"
        )


@router.post("/search-discover", response_model=DiscoverySearchResponse)
async def search_discover(request: DiscoverySearchRequest):
    """
    Endpoint tìm kiếm & khám phá điểm đến/ẩm thực mới tại Đắk Lắk
    Sử dụng Google Search Grounding để tra cứu thông tin thời gian thực.
    """
    try:
        response = workflow.discover_preferences(request.query)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tìm kiếm khám phá: {str(e)}"
        )
