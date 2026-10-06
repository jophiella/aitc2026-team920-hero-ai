AGENT_1_SEARCH_SYSTEM_PROMPT = """Bạn là Tác nhân Tìm kiếm Thông tin Du lịch Đắk Lắk (Agent 1: Search & Grounding Agent).
Mô hình đảm nhiệm: gemini-3.1-flash-lite với công cụ Google Search Grounding.

Nhiệm vụ của bạn:
1. Sử dụng công cụ Google Search để tìm kiếm thông tin thời gian thực về tỉnh Đắk Lắk:
   - Các điểm đến nổi tiếng: Bảo tàng Thế giới Cà phê, Buôn Akŏ Dhŏ, Cụm Thác Dray Nur / Dray Sap, Vườn Quốc Gia Yok Đôn, Buôn Đôn, Hồ Lắk, Núi đá Voi Cha.
   - Làng nghề và nghệ nhân: Làng gốm Yang Tao (nghệ nhân H'Phi La), nghệ nhân cồng chiêng Ê Đê / M'Nông, dệt thổ cẩm.
   - Ẩm thực đặc sản: Bún đỏ, Gà nướng than cơm lam, Lẩu cá lăng sông Sêrêpôk, Cà đắng cá trích, Rượu cần, Cà phê Robusta Fine.
   - Giá vé tham quan thực tế mới nhất, thời gian di chuyển giữa các huyện.
2. Trả lời bằng tiếng Việt chi tiết, súc tích, cập nhật và có dẫn chứng số liệu thực tế.
"""


def build_search_user_prompt(
    group_size: int,
    duration_days: int,
    budget_vnd: float,
    preferences: list,
    custom_notes: str = ""
) -> str:
    """Tạo user prompt chuẩn cho Agent 1 tra cứu thông tin."""
    pref_str = ", ".join(preferences) if preferences else "Văn hóa, Thiên nhiên, Cà phê, Ẩm thực"
    notes_section = f"\n- Ghi chú riêng từ du khách: {custom_notes}" if custom_notes else ""

    return f"""Hãy tra cứu và cung cấp thông tin du lịch Đắk Lắk mới nhất cho chuyến đi:
- Số người tham gia: {group_size} người
- Thời lượng: {duration_days} ngày
- Ngân sách tối đa: {budget_vnd:,.0f} VNĐ / người
- Sở thích ưu tiên: {pref_str}{notes_section}

Yêu cầu tra cứu:
1. Giá vé tham quan, trải nghiệm các điểm đến phù hợp với sở thích trên.
2. Quán ăn, nhà hàng đặc sản địa phương uy tín và chi phí ước tính.
3. Cung đường và thời gian di chuyển thực tế giữa Buôn Ma Thuột và các huyện lân cận (Buôn Đôn, Lắk, Krông Ana).
"""
