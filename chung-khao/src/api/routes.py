import datetime
from fastapi import APIRouter, HTTPException, status
from src.schemas import (
    TravelInput,
    ItineraryResponse,
    DiscoverySearchRequest,
    DiscoverySearchResponse
)
from src.agents.travel_workflow import DakLakTravelWorkflow
from src.agents.knowledge_base import DAKLAK_KNOWLEDGE_POOL

router = APIRouter(prefix="/api/v1", tags=["Travel AI Assistant"])
workflow = DakLakTravelWorkflow()


@router.get("/health")
async def health_check():
    """Endpoint kiểm tra sức khỏe hệ thống Backend AI Gateway"""
    return {
        "status": "ok",
        "service": "daklak-di-backend",
        "brand": "Đắk Lắk Di",
        "super_goal": "Đi nhiều hơn, hiểu đất nước mình hơn",
        "workflow": "3-Agent Workflow (Search: gemini-3.1-flash-lite, Synthesis: gemini-3.1-flash-lite, Decision: gemini-3.1-flash-lite)",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


@router.get("/destinations")
async def get_destinations():
    """Cung cấp danh mục điểm đến, làng nghề gặp gỡ nghệ nhân và sự kiện theo tháng."""
    return {
        "success": True,
        "data": {
            "destinations_pool": DAKLAK_KNOWLEDGE_POOL,
            "artisans_and_villages": [
                {
                    "id": "gom-yang-tao",
                    "name": "Làng Gốm Cổ Yang Tao",
                    "artisan": "Nghệ nhân H'Phi La",
                    "highlight": "Nghệ thuật làm gốm thủ công không dùng bàn xoay độc nhất vô nhị của người M'Nông",
                    "image": "/images/placeholders/gom-yang-tao.jpg"
                },
                {
                    "id": "cong-chieng-ako-dho",
                    "name": "Buôn Akŏ Dhŏ (Buôn Cô Thôn)",
                    "artisan": "Nghệ nhân Cồng chiêng Ê Đê",
                    "highlight": "Không gian Di sản Văn hóa Cồng chiêng Tây Nguyên đại diện nhân loại",
                    "image": "/images/placeholders/nghe-nhan-cong-chieng.jpg"
                }
            ],
            "monthly_events": [
                {
                    "month": "Tháng 3",
                    "name": "Lễ Hội Cà Phê Buôn Ma Thuột & Lễ Cúng Bến Nước",
                    "desc": "Tôn vinh Thủ phủ Cà phê thế giới kết hợp nghi lễ truyền thống của người Ê Đê.",
                    "image": "/images/placeholders/le-hoi-ca-phe.jpg"
                },
                {
                    "month": "Tháng 4",
                    "name": "Hội Đua Thuyền Truyền Thống Hồ Lắk",
                    "desc": "Lễ hội văn hóa thể thao sông nước rộn rã của đồng bào M'Nông.",
                    "image": "/images/placeholders/dua-thuyen-ho-lak.jpg"
                }
            ]
        }
    }


@router.post("/generate-itinerary", response_model=ItineraryResponse)
@router.post("/plan-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(input_data: TravelInput):
    """
    Endpoint tạo lịch trình du lịch Đắk Lắk (Đi đâu - Ăn gì - Chi phí thế nào)
    Chạy Agentic Workflow 3 giai đoạn:
    1. SearchGroundingAgent (gemini-3.1-flash-lite + Google Search Tool)
    2. SynthesisAgent (gemini-3.1-flash-lite)
    3. DecisionRerankingAgent (gemini-3.1-flash-lite - LLM Structured Output)
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
