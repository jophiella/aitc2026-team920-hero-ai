"""
Kho tri thức chuyên sâu về du lịch, văn hóa và ẩm thực Đắk Lắk.
Phục vụ các tác nhân AI tra cứu, đối chiếu và tối ưu tuyến đường địa lý.
"""

DAKLAK_KNOWLEDGE_POOL = [
    {
        "cluster": "Buôn Ma Thuột",
        "title": "Bảo tàng Thế giới Cà phê & Thưởng thức Espresso Tây Nguyên",
        "category": "Đi đâu & Cà phê",
        "location": "Đường Nguyễn Văn Cừ, TP. Buôn Ma Thuột",
        "description": "Chiêm ngưỡng kiến trúc nhà dài cách điệu, khám phá hơn 10.000 hiện vật cà phê và check-in không gian văn minh cà phê toàn cầu.",
        "cost": 120000,
        "cultural_note": "Bảo tàng được mệnh danh là trái tim của Thủ phủ Cà phê Buôn Ma Thuột.",
        "tags": ["Cà phê Buôn Ma Thuột", "Văn hóa Cồng chiêng", "Check-in"],
        "source": {"title": "Bảo tàng Thế giới Cà phê Đắk Lắk", "uri": "https://worldcoffeemuseum.com"}
    },
    {
        "cluster": "Buôn Ma Thuột",
        "title": "Dạo Buôn Akŏ Dhŏ (Buôn Cô Thôn) & Thăm Nhà Dài Cổ",
        "category": "Đi đâu & Văn hóa",
        "location": "Phường Tân Lợi, TP. Buôn Ma Thuột",
        "description": "Tản bộ dưới hàng cau thẳng tắp, chiêm ngưỡng kiến trúc nhà dài mẫu hệ Êđê và giao lưu nghệ nhân dệt thổ cẩm.",
        "cost": 50000,
        "cultural_note": "Buôn Akŏ Dhŏ là buôn làng mẫu mực gìn giữ văn hóa truyền thống Êđê giữa lòng thành phố.",
        "tags": ["Văn hóa Cồng chiêng", "Nhà dài Êđê"],
        "source": {"title": "Cổng TTĐT Du lịch Đắk Lắk", "uri": "https://daklak.gov.vn/du-lich"}
    },
    {
        "cluster": "Buôn Ma Thuột",
        "title": "Thưởng thức Bún Đỏ Buôn Ma Thuột & Lẩu Lá Rừng",
        "category": "Ăn gì",
        "location": "Phan Đình Giót / Lê Hồng Phong, TP. Buôn Ma Thuột",
        "description": "Tô bún đỏ sợi to màu hạt điều óng ánh kèm chả cua thơm lừng và lẩu lá rừng nấu từ hơn 10 loại lá thuốc nam quý.",
        "cost": 100000,
        "cultural_note": "Bún đỏ là thức quà ẩm thực độc nhất vô nhị chỉ có tại TP. Buôn Ma Thuột.",
        "tags": ["Ẩm thực Tây Nguyên", "Ăn gì"],
        "source": {"title": "Đặc sản ẩm thực Tây Nguyên", "uri": "https://vietnamtourism.gov.vn"}
    },
    {
        "cluster": "Buôn Ma Thuột",
        "title": "Đêm Nhạc Cồng Chiêng, Uống Rượu Cần & Gà Nướng Cơm Lam",
        "category": "Ăn gì & Trải nghiệm",
        "location": "Khu sinh thái Bản Đôn / TP. Buôn Ma Thuột",
        "description": "Thưởng thức gà thả đồi nướng than hồng, cơm lam dẻo thơm và hòa mình vào vũ điệu cồng chiêng bên bếp lửa bập bùng.",
        "cost": 220000,
        "cultural_note": "Không gian Văn hóa Cồng chiêng Tây Nguyên là Di sản Kiệt tác Phi vật thể Nhân loại do UNESCO công nhận.",
        "tags": ["Văn hóa Cồng chiêng", "Ẩm thực Tây Nguyên"],
        "source": {"title": "UNESCO Di sản Cồng Chiêng Tây Nguyên", "uri": "https://ich.unesco.org"}
    },
    {
        "cluster": "Krông Ana",
        "title": "Chinh Phục Thác Dray Nur - Hùng Vĩ Sông Serepôk",
        "category": "Đi đâu & Thiên nhiên",
        "location": "Xã Ea Na, Huyện Krông Ana (cách BMT ~25km)",
        "description": "Ngắm dòng nước cuồn cuộn đổ từ vách đá bazán kỳ vĩ, đi bộ qua cầu treo đung đưa và trải nghiệm chèo thuyền vượt thác.",
        "cost": 90000,
        "cultural_note": "Thác Dray Nur (thác Vợ) gắn liền với thiên tình sử huyền thoại đầy bi tráng của chàng Quay và nàng Djam.",
        "tags": ["Thác nước & Trekking", "Thiên nhiên"],
        "source": {"title": "Khu du lịch Thác Dray Nur", "uri": "https://draynurwaterfall.vn"}
    },
    {
        "cluster": "Buôn Đôn",
        "title": "Khám Phá Huyền Thoại Voi Buôn Đôn & Nhà Sàn Cổ Ama Kông",
        "category": "Đi đâu & Lịch sử",
        "location": "Xã Krông Na, Huyện Buôn Đôn (cách BMT ~40km)",
        "description": "Tham quan nhà sàn gỗ lim 130 năm tuổi của vua săn voi Khun Yu Nốp, cầu treo bắc qua rặng si cổ thụ và tìm hiểu bài thuốc Amakông.",
        "cost": 80000,
        "cultural_note": "Buôn Đôn là cái nôi thuần dưỡng voi rừng lừng danh Đông Nam Á.",
        "tags": ["Voi Buôn Đôn & Sông Serepôk", "Văn hóa Cồng chiêng"],
        "source": {"title": "Di tích Lịch sử Nhà sàn cổ Buôn Đôn", "uri": "https://daklakmuseum.vn"}
    },
    {
        "cluster": "Buôn Đôn",
        "title": "Bữa Trưa Cá Lăng Sông Serepôk Nướng Muối Ớt Rừng",
        "category": "Ăn gì",
        "location": "Nhà hàng ven sông Serepôk, Buôn Đôn",
        "description": "Thịt cá lăng sông tự nhiên dai ngọt nướng than hồng, chấm muối kiến vàng hoặc ớt rừng cay nồng ăn cùng canh chua giang.",
        "cost": 150000,
        "cultural_note": "Sông Serepôk là dòng sông độc đáo chảy ngược hướng Tây sang Campuchia.",
        "tags": ["Ẩm thực Tây Nguyên", "Voi Buôn Đôn & Sông Serepôk"],
        "source": {"title": "Ẩm thực sông Serepôk", "uri": "https://daklak.gov.vn"}
    },
    {
        "cluster": "Huyện Lắk",
        "title": "Ngắm Bình Minh Trên Hồ Lắk & Dạo Buôn Jun Bản Địa",
        "category": "Đi đâu & Thơ mộng",
        "location": "Thị trấn Liên Sơn, Huyện Lắk (cách BMT ~55km)",
        "description": "Hồ nước ngọt tự nhiên lớn thứ hai Việt Nam, ngắm Biệt điện cổ của Cựu hoàng Bảo Đại trên đồi cao và thăm buôn làng người M'Nông.",
        "cost": 80000,
        "cultural_note": "Hồ Lắk là không gian sinh tồn và gắn liền với thần thoại lửa và nước của người M'Nông.",
        "tags": ["Hồ Lắk & Biệt điện Bảo Đại", "Văn hóa Cồng chiêng"],
        "source": {"title": "Khu bảo tồn thiên nhiên Hồ Lắk", "uri": "https://laklake-daklak.vn"}
    },
    {
        "cluster": "Huyện Lắk",
        "title": "Thưởng Thức Chả Cá Thát Lát Hồ Lắk & Rau Rừng Xào Tỏi",
        "category": "Ăn gì",
        "location": "Quán ven hồ Lắk, TT. Liên Sơn",
        "description": "Chả cá thát lát nạo tươi dẻo quánh chiên vàng giòn rụm hoặc nấu lẩu chua cay ăn kèm rau rừng tươi mát.",
        "cost": 120000,
        "cultural_note": "Cá thát lát hồ Lắk nức tiếng khắp cả nước vì độ dai và ngọt tự nhiên hiếm có.",
        "tags": ["Ẩm thực Tây Nguyên", "Hồ Lắk & Biệt điện Bảo Đại"],
        "source": {"title": "Đặc sản Đắk Lắk", "uri": "https://daklak.gov.vn"}
    }
]
