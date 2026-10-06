from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class GroundingSource(BaseModel):
    title: str = Field(..., description="Tiêu đề trang nguồn tham khảo từ Google Search")
    uri: str = Field(..., description="Đường dẫn nguồn")


class TravelInput(BaseModel):
    group_size: int = Field(default=3, ge=1, le=20, description="Số lượng người đi trong đoàn")
    duration_days: int = Field(default=3, ge=1, le=7, description="Số ngày đi du lịch Đắk Lắk")
    budget_vnd: float = Field(default=3500000.0, description="Ngân sách dự kiến mỗi người (VNĐ)")
    preferences: List[str] = Field(
        default_factory=lambda: [
            "Văn hóa Cồng chiêng",
            "Thác nước & Trekking",
            "Cà phê Buôn Ma Thuột",
            "Ẩm thực Tây Nguyên"
        ],
        description="Các danh mục sở thích cá nhân hóa"
    )
    custom_notes: Optional[str] = Field(
        default="",
        description="Ghi chú tự do từ du khách (yêu cầu riêng, sức khỏe, phương tiện...)"
    )


class Activity(BaseModel):
    time_slot: str = Field(..., description="Khung giờ (VD: 08:00 - 10:30, Sáng / Trưa / Chiều / Tối)")
    title: str = Field(..., description="Tên hoạt động hoặc địa điểm cụ thể tại Đắk Lắk")
    category: str = Field(..., description="Phân loại: Đi đâu / Ăn gì / Văn hóa / Thiên nhiên / Trải nghiệm")
    location: str = Field(..., description="Địa chỉ hoặc khu vực (Buôn Ma Thuột, Buôn Đôn, Krông Ana, Lắk...)")
    description: str = Field(..., description="Mô tả trải nghiệm chi tiết, hoạt động cụ thể")
    estimated_cost_per_person: float = Field(default=0.0, ge=0.0, description="Chi phí ước tính/người (VNĐ)")
    cultural_note: Optional[str] = Field(default=None, description="Ghi chú câu chuyện văn hóa, lịch sử, đồng bào Êđê/M'Nông")
    grounding_sources: Optional[List[GroundingSource]] = Field(
        default_factory=list,
        description="Nguồn dữ liệu xác thực từ Google Search Grounding"
    )


class DayPlan(BaseModel):
    day_number: int = Field(..., ge=1, le=7, description="Thứ tự ngày trong hành trình")
    title: str = Field(..., description="Chủ đề của ngày (VD: Ngày 1: Chạm Ngõ Thủ Phủ Cà Phê & Buôn Cổ Êđê)")
    activities: List[Activity] = Field(..., description="Danh sách các hoạt động trong ngày được xếp theo thời gian")


class BudgetBreakdown(BaseModel):
    accommodation: float = Field(default=0.0, description="Chi phí lưu trú (Khách sạn/Homestay)")
    food_and_beverage: float = Field(default=0.0, description="Chi phí ăn uống & đặc sản")
    transportation: float = Field(default=0.0, description="Chi phí di chuyển địa phương")
    activities_and_tickets: float = Field(default=0.0, description="Chi phí vé tham quan & hoạt động")
    contingency: float = Field(default=0.0, description="Chi phí dự phòng (10%)")


class TripSummary(BaseModel):
    title: str = Field(..., description="Tên hành trình tổng quát")
    group_size: int
    duration_days: int
    total_budget_input: float
    total_estimated_cost: float
    savings_amount: float
    currency: str = Field(default="VND")
    agent_workflow_status: Optional[str] = Field(
        default="Agent 1 (Search: gemini-3.1-flash-lite) -> Agent 2 (Synthesis: gemini-3.1-flash-lite) -> Agent 3 (Decision & Reranking: gemini-3.1-flash-lite)",
        description="Trạng thái chuỗi Agentic Workflow"
    )


class ItineraryData(BaseModel):
    trip_summary: TripSummary
    budget_breakdown: BudgetBreakdown
    itinerary_days: List[DayPlan]
    travel_tips: List[str] = Field(default_factory=list, description="Lời khuyên địa phương hữu ích cho chuyến đi")
    search_queries_used: Optional[List[str]] = Field(default_factory=list, description="Các truy vấn tìm kiếm đã thực thi")
    grounding_sources: Optional[List[GroundingSource]] = Field(default_factory=list, description="Danh sách nguồn từ Google Search")


class ItineraryResponse(BaseModel):
    success: bool = True
    data: Optional[ItineraryData] = None
    error: Optional[str] = None


# --- SCHEMAS CHO CANDIDATE RECOMMENDATION (AGENT 2) ---

class CandidateItem(BaseModel):
    title: str
    category: str
    location: str
    description: str
    estimated_cost: float
    cultural_note: Optional[str] = None
    cluster: str
    relevance_score: float = 1.0
    tags: List[str] = Field(default_factory=list)


class CandidatePoolResponse(BaseModel):
    candidates: List[CandidateItem]


# --- SCHEMAS CHO DISCOVERY SEARCH (TÌM KIẾM SỞ THÍCH MỚI) ---

class DiscoverySearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Từ khóa hoặc nhu cầu khám phá tại Đắk Lắk")


class DiscoveryItem(BaseModel):
    title: str = Field(..., description="Tên địa điểm / món ăn / trải nghiệm")
    category: str = Field(..., description="Phân loại: Đi đâu / Ăn gì / Văn hóa / Thiên nhiên")
    short_desc: str = Field(..., description="Mô tả tóm tắt")
    estimated_cost: Optional[str] = Field(default=None, description="Khoảng chi phí tham khảo")
    source_url: Optional[str] = Field(default=None, description="Link tham khảo")


class DiscoverySearchResponse(BaseModel):
    success: bool = True
    query: str
    results: List[DiscoveryItem]
    grounding_sources: List[GroundingSource] = Field(default_factory=list)
    model_used: str = "gemini-3.1-flash-lite"
