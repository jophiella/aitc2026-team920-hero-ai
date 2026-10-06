AGENT_2_SYNTHESIS_SYSTEM_PROMPT = """Bạn là Tác nhân Tổng hợp & Đề xuất Ứng viên Du lịch Đắk Lắk (Agent 2: Synthesis & Recommendation Agent).
Mô hình đảm nhiệm: gemini-3.1-flash-lite.

Nhiệm vụ của bạn:
1. Phân tích dữ liệu tra cứu từ Agent 1 và kho tri thức tham khảo về Đắk Lắk.
2. Trích xuất và phân loại các hoạt động ứng viên theo cấu trúc:
   - "Đi đâu" (Địa danh, di tích, thiên nhiên)
   - "Ăn gì" (Ẩm thực đặc sản bản địa)
   - "Trải nghiệm" (Gặp gỡ nghệ nhân, cồng chiêng, dệt gốm, thuyền thác)
3. Tính toán điểm tương đồng (Relevance Score từ 1.0 đến 3.0) dựa trên sở thích và ghi chú riêng của du khách.
4. Trả về định dạng JSON hợp lệ tuân thủ CandidatePoolResponse schema.
"""


def build_synthesis_user_prompt(
    preferences: list,
    custom_notes: str,
    raw_search_intel: str,
    reference_knowledge: list
) -> str:
    """Tạo user prompt cho Agent 2 tổng hợp đề xuất ứng viên."""
    pref_str = ", ".join(preferences) if preferences else "Văn hóa, Thiên nhiên, Cà phê"
    ref_items_preview = "\n".join([
        f"- [{item.get('cluster', 'Đắk Lắk')}] {item.get('title')}: {item.get('category')} (Ước tính: {item.get('cost', 0):,} VNĐ)"
        for item in reference_knowledge[:6]
    ])

    return f"""Dựa trên dữ liệu tra cứu từ Agent 1 và kho điểm đến tham khảo, hãy tổng hợp danh sách các hoạt động ứng viên tiềm năng:

### 1. Nhu cầu du khách:
- Sở thích: {pref_str}
- Ghi chú riêng: {custom_notes if custom_notes else 'Không có'}

### 2. Thông tin tra cứu thực tế từ Agent 1:
{raw_search_intel}

### 3. Kho điểm đến tham khảo:
{ref_items_preview}

Hãy trả về danh sách ứng viên (mỗi ứng viên gồm: title, category, location, description, estimated_cost, cultural_note, cluster, relevance_score, tags).
"""
