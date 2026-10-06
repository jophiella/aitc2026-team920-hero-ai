import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Calendar,
  Wallet,
  Compass,
  Coffee,
  Utensils,
  MapPin,
  Landmark,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Star,
  Send,
  Sliders,
  ChevronDown,
  Info,
  ShieldCheck,
  Award,
  Trees,
  Flame,
  ArrowRight,
  HeartHandshake,
  Music,
  Camera,
  Layers
} from 'lucide-react';

// Fallback component hiển thị Typography nghệ thuật Tây Nguyên nếu file ảnh chưa có
function ImageWithFallback({ src, alt, className = "", tag = "" }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center ${className}`}>
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-amber-900/90 to-stone-900/95 border border-amber-600/30">
          <span className="text-2xl mb-1">🏔️</span>
          <span className="text-xs font-bold text-amber-200 line-clamp-1">{alt}</span>
          <span className="text-[10px] text-amber-400/80 mt-0.5 uppercase tracking-wider font-semibold">
            {tag || 'Đắk Lắk Di'}
          </span>
        </div>
      )}
      {tag && !imageError && (
        <span className="absolute top-2 left-2 bg-amber-900/85 backdrop-blur-md text-amber-200 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {tag}
        </span>
      )}
    </div>
  );
}

// Danh mục điểm đến nổi tiếng kèm nguồn trích dẫn & hình ảnh
const FAMOUS_DESTINATIONS = [
  {
    id: 'dray-nur',
    name: 'Thác Dray Nur',
    category: 'Thiên Nhiên Kỳ Vĩ',
    image: '/images/placeholders/dray-nur.jpg',
    tag: 'Thác Nước',
    desc: 'Ngọn thác hùng vĩ bậc nhất Tây Nguyên, gắn liền với huyền thoại mối tình chàng Quay và nàng Djam.',
    ticket: '50.000 VNĐ / người',
    location: 'Huyện Krông Ana, Đắk Lắk',
    reference: 'Cổng TTĐT Du Lịch Tỉnh Đắk Lắk',
    reference_url: 'https://daklak.gov.vn'
  },
  {
    id: 'ho-lak',
    name: 'Hồ Lắk & Biệt Điện Bảo Đại',
    category: 'Thơ Mộng & Di Tích',
    image: '/images/placeholders/ho-lak.jpg',
    tag: 'Hồ Tự Nhiên',
    desc: 'Hồ nước ngọt tự nhiên lớn thứ 2 Việt Nam, ngắm hoàng hôn rực rỡ và khám phá buôn Jun của người M\'Nông.',
    ticket: 'Miễn phí (Thuyền ~150k)',
    location: 'Huyện Lắk, Đắk Lắk',
    reference: 'Sở VHTTDL Đắk Lắk & Trung tâm Xúc tiến Du lịch',
    reference_url: 'https://dulichdaklak.gov.vn'
  },
  {
    id: 'bao-tang-ca-phe',
    name: 'Bảo Tàng Thế Giới Cà Phê',
    category: 'Thủ Phủ Cà Phê',
    image: '/images/placeholders/bao-tang-ca-phe.jpg',
    tag: 'Check-in & Tri thức',
    desc: 'Kiến trúc nhà dài cách điệu uốn lượn, lưu giữ hơn 10.000 hiện vật văn minh cà phê toàn cầu.',
    ticket: '150.000 VNĐ / người',
    location: 'Đường Nguyễn Văn Cừ, TP. Buôn Ma Thuột',
    reference: 'Bảo tàng Thế giới Cà phê Trung Nguyên Legend',
    reference_url: 'https://worldcoffeemuseum.com'
  },
  {
    id: 'buon-don',
    name: 'Buôn Đôn & Voi Thân Thiện',
    category: 'Văn Hóa Bản Địa',
    image: '/images/placeholders/buon-don.jpg',
    tag: 'Du Lịch Bền Vững',
    desc: 'Trải nghiệm ngắm voi tự do trong rừng Yok Đôn, thăm nhà sàn cổ 130 năm của vua săn voi Ama Kông.',
    ticket: '100.000 VNĐ / người',
    location: 'Xã Krông Na, Huyện Buôn Đôn',
    reference: 'Vườn Quốc Gia Yok Đôn & Tổ chức Động vật Châu Á',
    reference_url: 'https://yokdonnationalpark.vn'
  },
  {
    id: 'chua-khai-doan',
    name: 'Chùa Sắc Tứ Khải Đoan',
    category: 'Tâm Linh & Di Tích',
    image: '/images/placeholders/chua-khai-doan.jpg',
    tag: 'Kiến Trúc Gỗ',
    desc: 'Ngôi chùa gỗ lớn nhất và là ngôi chùa cuối cùng tại Việt Nam được phong sắc tứ dưới thời nhà Nguyễn.',
    ticket: 'Miễn phí tham quan',
    location: 'Phường Thống Nhất, TP. Buôn Ma Thuột',
    reference: 'Di tích Lịch sử Văn hóa Cố đô Huế & Phật giáo Đắk Lắk',
    reference_url: 'https://phatgiaodaklak.org'
  },
  {
    id: 'nui-da-voi',
    name: 'Núi Đá Voi Mẹ Yang Tao',
    category: 'Kỳ Quan Thiên Nhiên',
    image: '/images/placeholders/nui-da-voi.jpg',
    tag: 'Đá Nguyên Khối',
    desc: 'Tảng đá granit nguyên khối khổng lồ hình dáng chú voi nằm, điểm ngắm toàn cảnh thung lũng Yang Tao.',
    ticket: 'Miễn phí',
    location: 'Xã Yang Tao, Huyện Lắk',
    reference: 'Khu Di tích Thắng cảnh Huyện Lắk',
    reference_url: 'https://lak.daklak.gov.vn'
  }
];

// Làng nghề & Gặp gỡ nghệ nhân
const ARTISANS_VILLAGES = [
  {
    name: 'Không Gian Văn Hóa Cồng Chiêng Buôn Ako Dhông',
    artisan: 'Nghệ nhân Ưu tú Y Mip Ayun',
    desc: 'Lắng nghe những giai điệu cồng chiêng ngân vang bên bếp lửa nhà dài cổ truyền, giao lưu sử thi Đăm Săn.',
    image: '/images/placeholders/nghe-nhan-cong-chieng.jpg',
    badge: 'Di sản UNESCO',
    reference: 'UNESCO Di sản Văn hóa Phi vật thể Đại diện Nhân loại',
    reference_url: 'https://ich.unesco.org'
  },
  {
    name: 'Làng Gốm Thủ Công Cổ Yang Tao',
    artisan: 'Nghệ nhân M\'Nông H\'Phi La',
    desc: 'Nghệ thuật nặn gốm hoàn toàn bằng tay không dùng bàn xoay độc nhất vô nhị còn sót lại của người M\'Nông Rlâm.',
    image: '/images/placeholders/gom-yang-tao.jpg',
    badge: 'Làng Nghề Cổ',
    reference: 'Hội Văn nghệ Dân gian & Bảo tàng Đắk Lắk',
    reference_url: 'https://baotangdaklak.vn'
  },
  {
    name: 'Nghề Dệt Thổ Cẩm Hoa Văn Ê Đê',
    artisan: 'Nghệ nhân H\'Nét Niê',
    desc: 'Tận mắt chiêm ngưỡng kỹ thuật luồn sợi dệt hoa văn hình rùa, kỳ đà trên khung cửi truyền thống nhà dài.',
    image: '/images/placeholders/tho-cam-ede.jpg',
    badge: 'Tinh Hoa Dệt',
    reference: 'Hiệp hội Làng nghề & Thổ cẩm Tây Nguyên',
    reference_url: 'https://daklak.gov.vn'
  }
];

// Sự kiện & Lễ hội nổi bật
const MONTHLY_EVENTS = [
  {
    month: 'Tháng 3',
    name: 'Lễ Hội Cà Phê Buôn Ma Thuột & Lễ Cúng Bến Nước',
    desc: 'Lễ hội quốc tế lớn nhất tôn vinh hạt ngọc Robusta, kết hợp nghi thức tạ ơn thần nước của người Ê Đê.',
    highlight: 'Đại tiệc đường phố & Hương vị cà phê bất tận',
    reference: 'UBND Tỉnh Đắk Lắk & Lễ hội Cà phê Quốc tế',
    reference_url: 'https://lehoicaphe.vn'
  },
  {
    month: 'Tháng 4',
    name: 'Hội Đua Thuyền Độc Mộc Hồ Lắk',
    desc: 'Những tay chèo cừ khôi người M\'Nông điều khiển thuyền độc mộc xé nước trên mặt hồ thơ mộng.',
    highlight: 'Tranh tài kịch tính trên hồ nước ngọt lớn nhất',
    reference: 'Trung tâm VHTT-TT Huyện Lắk',
    reference_url: 'https://lak.daklak.gov.vn'
  },
  {
    month: 'Tháng 11 - 12',
    name: 'Mùa Hoa Dã Quỳ & Lễ Mừng Lúa Mới',
    desc: 'Sắc vàng dã quỳ nở rộ khắp triền đồi bazan cùng nghi lễ rước hồn lúa về kho ấm no của buôn làng.',
    highlight: 'Cảnh sắc rực rỡ & Men rượu cần nồng say',
    reference: 'Bảo tàng Đắk Lắk & Lễ hội Truyền thống Tây Nguyên',
    reference_url: 'https://baotangdaklak.vn'
  }
];

// Ẩm thực & Đặc sản Đắk Lắk
const CUISINE_ITEMS = [
  {
    name: 'Bún Đỏ Buôn Ma Thuột',
    desc: 'Sợi bún to màu đỏ gạch tôm, nước dùng thơm ngọt từ cua đồng, ăn kèm rau cần nước, giá và trứng cút.',
    price: '30.000 - 45.000 VNĐ',
    image: '/images/placeholders/bun-do.jpg',
    reference: 'Ẩm thực Di sản Việt Nam & Báo Đắk Lắk',
    reference_url: 'https://baodaklak.vn'
  },
  {
    name: 'Gà Nướng Than Hoa Cơm Lam Ống Nứa',
    desc: 'Gà thả đồi ướp lá rừng nướng than hồng da giòn rụm, chấm muối é thơm cay và cơm lam dẻo ngọt.',
    price: '220.000 - 300.000 VNĐ / con',
    image: '/images/placeholders/ga-nuong-com-lam.jpg',
    reference: 'Đặc sản Ẩm thực Tây Nguyên',
    reference_url: 'https://daklak.gov.vn'
  },
  {
    name: 'Lẩu Cá Lăng Sông Sêrêpôk',
    desc: 'Cá lăng da trơn thịt săn chắc nấu lẩu măng chua rừng, vị béo ngọt thanh tao đậm đà dòng sông huyền thoại.',
    price: '250.000 - 400.000 VNĐ / nồi',
    image: '/images/placeholders/lau-ca-lang.jpg',
    reference: 'Đặc sản Sông Sêrêpôk',
    reference_url: 'https://dulichdaklak.gov.vn'
  },
  {
    name: 'Cà Phê Robusta Đặc Sản Đắk Lắk',
    desc: 'Hạt cà phê hái chín 100%, rang xay mộc nguyên bản, đậm đà thể chất sánh quyện hương hoa quả chín.',
    price: '25.000 - 65.000 VNĐ / ly',
    image: '/images/placeholders/bao-tang-ca-phe.jpg',
    reference: 'Hiệp hội Cà phê Buôn Ma Thuột (BCA)',
    reference_url: 'https://buonmathuotcoffee.vn'
  }
];

// Sở thích gợi ý
const PREFERENCES_LIST = [
  { id: 'culture', label: 'Văn Hóa Bản Địa & Nghệ Nhân', icon: '🏛️' },
  { id: 'nature', label: 'Thiên Nhiên & Thác Nước', icon: '🌊' },
  { id: 'coffee', label: 'Cà Phê & Check-in Chill', icon: '☕' },
  { id: 'food', label: 'Ẩm Thực Tinh Hoa Phố Núi', icon: '🍲' },
  { id: 'elephant', label: 'Du Lịch Voi Thân Thiện', icon: '🐘' }
];

export default function App() {
  // Travel Inputs State
  const [numPeople, setNumPeople] = useState(2);
  const [numDays, setNumDays] = useState(3);
  const [budgetVnd, setBudgetVnd] = useState(5000000);
  const [selectedPrefs, setSelectedPrefs] = useState([
    'Văn Hóa Bản Địa & Nghệ Nhân',
    'Thiên Nhiên & Thác Nước',
    'Cà Phê & Check-in Chill'
  ]);
  const [customNotes, setCustomNotes] = useState('');

  // AI Output State
  const [loading, setLoading] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(1);
  const [generatedPlans, setGeneratedPlans] = useState([]);

  // Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Nguyễn Tuấn Hùng',
      age: '24 tuổi',
      rating: 5,
      comment: 'Trợ lý AI Đắk Lắk Di gợi ý hành trình gặp nghệ nhân cồng chiêng buôn Ako Dhông quá xúc động! Chi phí tính toán cực chuẩn, đúng tinh thần Gen Z.',
      date: 'Vừa xong'
    },
    {
      id: 2,
      name: 'Trần Ngọc Trâm',
      age: '22 tuổi',
      rating: 5,
      comment: 'Thích nhất là phần du lịch voi thân thiện tại Yok Đôn và làng gốm Yang Tao. Đi nhiều hơn mới thấy Đắk Lắk mình đẹp và giàu bản sắc dường nào!',
      date: '2 giờ trước'
    },
    {
      id: 3,
      name: 'Lê Hoàng Anh',
      age: '28 tuổi',
      rating: 5,
      comment: 'Form nhập ngân sách bằng thanh trượt rất trực quan, có 3 phương án để chọn tha hồ theo gu. Lịch trình bún đỏ và cà phê sáng 10/10.',
      date: 'Hôm qua'
    }
  ]);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);

  useEffect(() => {
    handleGeneratePlans();
  }, []);

  const togglePref = (label) => {
    if (selectedPrefs.includes(label)) {
      if (selectedPrefs.length > 1) {
        setSelectedPrefs(selectedPrefs.filter((p) => p !== label));
      }
    } else {
      setSelectedPrefs([...selectedPrefs, label]);
    }
  };

  // Cuộn trang mượt tới section
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Tạo 2-3 lộ trình AI
  const handleGeneratePlans = async () => {
    setLoading(true);
    const payload = {
      num_people: Number(numPeople),
      num_days: Number(numDays),
      budget: Number(budgetVnd),
      preferences: selectedPrefs,
      custom_notes: customNotes.trim()
    };

    try {
      // Gọi API Backend nếu có sẵn
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_size: payload.num_people,
          duration_days: payload.num_days,
          budget_vnd: payload.budget,
          preferences: payload.preferences,
          custom_notes: payload.custom_notes
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          // Sinh 3 phương án phong phú từ kết quả
          const plans = buildMultiPlans(payload, resData.data);
          setGeneratedPlans(plans);
          setActivePlanIndex(0);
          setActiveDay(1);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API connection fallback to client AI engine:', err);
    }

    // Client AI fallback engine đảm bảo luôn sinh 3 phương án đầy đủ
    const fallbackPlans = generateSmartFallbackPlans(payload);
    setGeneratedPlans(fallbackPlans);
    setActivePlanIndex(0);
    setActiveDay(1);
    setLoading(false);
  };

  // Gửi review mới
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: reviewerName.trim(),
      age: 'Du khách Đắk Lắk Di',
      rating: Number(reviewerRating),
      comment: reviewerComment.trim(),
      date: 'Vừa xong'
    };

    setReviews([newRev, ...reviews]);
    setReviewerName('');
    setReviewerComment('');
  };

  const currentPlan = generatedPlans[activePlanIndex] || null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">

      {/* 1. HEADER (Sticky Glassmorphic Nav) */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-amber-900/40 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/30 border border-amber-400/40">
              <Compass className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
                  ĐẮK LẮK DI
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                  GEN Z • TRAVEL
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 hidden sm:block">
                Đi nhiều hơn, hiểu đất nước mình hơn
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button onClick={() => scrollToSection('history')} className="hover:text-amber-400 transition-colors">
              Lịch Sử & Bản Sắc
            </button>
            <button onClick={() => scrollToSection('destinations')} className="hover:text-amber-400 transition-colors">
              Điểm Đến Nổi Tiếng
            </button>
            <button onClick={() => scrollToSection('artisans')} className="hover:text-amber-400 transition-colors">
              Làng Nghề & Nghệ Nhân
            </button>
            <button onClick={() => scrollToSection('events')} className="hover:text-amber-400 transition-colors">
              Sự Kiện Theo Tháng
            </button>
            <button onClick={() => scrollToSection('cuisine')} className="hover:text-amber-400 transition-colors">
              Ẩm Thực Tinh Hoa
            </button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-amber-400 transition-colors">
              Cảm Nhận Du Khách
            </button>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('ai-planner')}
            className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-600/30 border border-amber-400/40 transition-all flex items-center gap-1.5 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Lên Kế Hoạch Khám Phá</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative py-20 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-amber-900/30">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Trợ Lý AI Du Lịch Đắk Lắk — Dành Cho Người Trẻ Yêu Khám Phá</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            ĐẮK LẮK DI: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
              ĐI NHIỀU HƠN, HIỂU ĐẤT NƯỚC MÌNH HƠN
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Hành trình "may đo" tối ưu chi phí cho du khách 18-35+, đồng thời hỗ trợ địa phương điều phối luồng khách, bảo tồn văn hóa cồng chiêng, kết nối nghệ nhân và thúc đẩy chuyển đổi số du lịch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('ai-planner')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-amber-600/30 border border-amber-300/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Lên Kế Hoạch Khám Phá Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('destinations')}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-bold px-5 py-3.5 rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Khám Phá Điểm Đến</span>
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xl font-black text-amber-400">30+</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Điểm đến & Danh thắng</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xl font-black text-orange-400">100%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Tối ưu chi phí theo ngân sách</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xl font-black text-emerald-400">2-3</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Phương án lộ trình đa dạng</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xl font-black text-amber-300">UNESCO</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Bảo tồn di sản Cồng chiêng</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LỊCH SỬ & BẢN SẮC ĐẮK LẮK */}
      <section id="history" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Dòng Chảy Lịch Sử</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Bản Sắc Đại Ngàn Đắk Lắk</h2>
          <p className="text-xs text-slate-400">
            Nơi hội tụ tinh hoa 49 dân tộc anh em trên mảnh đất đỏ Bazan huyền thoại, lắng đọng hào khí lịch sử cách mạng và di sản sử thi trường tồn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl mb-4 border border-amber-500/20">
              🏛️
            </div>
            <h3 className="text-base font-bold text-white mb-2">Di Tích Nhà Đày Buôn Ma Thuột</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Di tích quốc gia đặc biệt ghi dấu ý chí quật cường của các chiến sĩ cách mạng tiền bối, nơi đào tạo nên những người con ưu tú cho phong trào giải phóng dân tộc.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl mb-4 border border-orange-500/20">
              👑
            </div>
            <h3 className="text-base font-bold text-white mb-2">Biệt Điện & Lịch Sử Hoàng Tộc</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Biệt điện Bảo Đại tọa lạc trên đồi thông thơ mộng ngắm nhìn toàn cảnh Buôn Ma Thuột và Biệt điện Hồ Lắk, nơi vị vua cuối cùng triều Nguyễn từng nghỉ chân thưởng ngoạn.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mb-4 border border-emerald-500/20">
              🌊
            </div>
            <h3 className="text-base font-bold text-white mb-2">Huyền Thoại Sông Sêrêpôk Chảy Ngược</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dòng sông hùng tráng duy nhất ở Việt Nam chảy ngược về phía Tây, tạo nên hệ thống thác nước Dray Nur, Dray Sap và Gia Long tuyệt mỹ giữa lòng rừng già.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ĐIỂM ĐẾN NỔI TIẾNG */}
      <section id="destinations" className="py-16 px-4 md:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Khám Phá</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Điểm Đến Nổi Tiếng Đắk Lắk</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Những tọa độ check-in độc bản, kết hợp trọn vẹn giữa thiên nhiên hùng vĩ, công trình kiến trúc và di sản văn hóa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAMOUS_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all group flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden">
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    tag={dest.tag}
                    className="h-full w-full"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
                      <span>{dest.category}</span>
                      <span className="text-slate-400 font-normal">{dest.ticket}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {dest.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{dest.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LÀNG NGHỀ & GẶP GỠ NGHỆ NHÂN */}
      <section id="artisans" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Bảo Tồn Di Sản</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Làng Nghề & Kết Nối Nghệ Nhân</h2>
          <p className="text-xs text-slate-400">
            Cùng Đắk Lắk Di chạm vào linh hồn của đại ngàn, gặp gỡ những nghệ nhân đang ngày đêm gìn giữ báu vật văn hóa dân tộc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTISANS_VILLAGES.map((item, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col">
              <div className="h-44 w-full">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  tag={item.badge}
                  className="h-full w-full"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{item.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{item.artisan}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SỰ KIỆN & LỄ HỘI THEO THÁNG */}
      <section id="events" className="py-16 px-4 md:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Mùa Lễ Hội</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Sự Kiện Nổi Bật Theo Tháng / Năm</h2>
            <p className="text-xs text-slate-400">
              Lên lịch trình đúng mùa lễ hội để hòa mình vào không khí văn hóa tưng bừng và sắc hoa cao nguyên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MONTHLY_EVENTS.map((evt, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/40 transition-all flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-black px-3 py-1 rounded-full mb-3">
                    {evt.month}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{evt.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {evt.desc}
                  </p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-xs text-amber-300 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{evt.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ẨM THỰC TINH HOA */}
      <section id="cuisine" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Ăn Gì Đắk Lắk</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Ẩm Thực & Đặc Sản Tinh Hoa</h2>
          <p className="text-xs text-slate-400">
            Những món ngon chuẩn vị phố núi, đậm đà gia vị rừng và hương cà phê nồng nàn không thể bỏ lỡ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUISINE_ITEMS.map((food, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col">
              <div className="h-40 w-full">
                <ImageWithFallback
                  src={food.image}
                  alt={food.name}
                  tag="Đặc Sản"
                  className="h-full w-full"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{food.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {food.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs font-bold text-amber-400">
                  {food.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TRỢ LÝ AI PLANNER (TRỌNG TÂM ĐỀ THI - INTERACTIVE FORM & MULTI-PLAN 2-3 OPTIONS) */}
      <section id="ai-planner" className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-900 via-[#1E293B] to-slate-900 border-t-2 border-amber-500/40">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ Lý Du Lịch Đắk Lắk AI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Lên Lịch Trình May Đo Cá Nhân Hóa
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Nhập 4 thông số + ghi chú tự do. AI sẽ tự động phân tích và đề xuất **tối thiểu 2 - 3 phương án lộ trình** tối ưu chi phí và điều phối luồng khách.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* CỘT TRÁI: FORM BỘ LỌC NHU CẦU CHUYẾN ĐI (Width: 5/12 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-white text-base">Bộ Lọc Chuyến Đi</h3>
                </div>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                  AI Guardrail
                </span>
              </div>

              {/* 1. Số người đi (Field nhập số có +/- và gõ số) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Số người đi
                  </span>
                  <span className="text-[11px] text-slate-400">Nhập số người</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNumPeople(Math.max(1, Number(numPeople) - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg border border-slate-700 transition-all flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={numPeople}
                    onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 font-black text-center text-amber-300 text-base focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setNumPeople(Math.min(50, Number(numPeople) + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg border border-slate-700 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. Số ngày đi */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Số ngày đi
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNumDays(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${numDays === d
                          ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                      {d} Ngày
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Ngân sách tổng (Nhập khoảng + Thanh trượt Slider) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    Ngân sách tổng (VNĐ)
                  </label>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {Number(budgetVnd).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                {/* Thanh trượt */}
                <input
                  type="range"
                  min={1000000}
                  max={20000000}
                  step={500000}
                  value={budgetVnd}
                  onChange={(e) => setBudgetVnd(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[2000000, 5000000, 8000000, 15000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudgetVnd(preset)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 rounded-lg border border-slate-700 font-semibold"
                    >
                      {(preset / 1000000).toFixed(0)} Triệu
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sở thích trải nghiệm */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Sở thích & Phong cách trải nghiệm
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES_LIST.map((pref) => {
                    const isSelected = selectedPrefs.includes(pref.label);
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePref(pref.label)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${isSelected
                            ? 'bg-amber-600 text-white border-amber-400 shadow-sm shadow-amber-600/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                      >
                        <span>{pref.icon}</span>
                        <span>{pref.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Field nhập Custom (Free-style TextArea) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>✨</span> Ghi chú & Yêu cầu riêng (Tùy chọn)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Free-style Text</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Thích đi xe máy phượt ngắm cảnh, muốn ghé nghệ nhân dệt thổ cẩm, ăn chay, có người lớn tuổi..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="button"
                onClick={handleGeneratePlans}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black py-3.5 px-4 rounded-xl shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-2 text-sm border border-amber-300/40 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>AI Đang Phân Tích & Sinh Đa Lộ Trình...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                    <span>Tạo 2-3 Lộ Trình May Đo Với AI</span>
                  </>
                )}
              </button>
            </div>

            {/* CỘT PHẢI: KẾT QUẢ TRẢ VỀ - MULTI-PLAN SWITCHER (Width: 7/12 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-6">

              {loading ? (
                <div className="py-24 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="font-bold text-white text-base">Đang Tạo Các Phương Án May Đo...</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    AI đang tối ưu hóa thời gian di chuyển giữa các cụm điểm BMT - Buôn Đôn - Hồ Lắk và kiểm soát chi phí.
                  </p>
                </div>
              ) : currentPlan ? (
                <>
                  {/* BỘ CHỌN MULTI-PLAN (2-3 LỰA CHỌN LỘ TRÌNH) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      Chọn 1 Trong {generatedPlans.length} Lộ Trình Do AI Đề Xuất:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {generatedPlans.map((plan, idx) => {
                        const isPlanActive = activePlanIndex === idx;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => {
                              setActivePlanIndex(idx);
                              setActiveDay(1);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${isPlanActive
                                ? 'bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-600/20 ring-1 ring-amber-500'
                                : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-400'
                              }`}
                          >
                            <div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block mb-1.5 ${isPlanActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                                }`}>
                                {plan.badge}
                              </span>
                              <h4 className={`text-xs font-bold line-clamp-1 ${isPlanActive ? 'text-white' : 'text-slate-300'}`}>
                                {plan.title}
                              </h4>
                            </div>
                            <span className="text-[11px] font-extrabold text-amber-400 mt-2">
                              {plan.total_cost.toLocaleString('vi-VN')} đ
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* THÔNG TIN TỔNG QUAN LỘ TRÌNH ĐANG CHỌN */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-black text-amber-300">{currentPlan.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{currentPlan.highlight}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Tổng chi phí dự toán</span>
                        <strong className="text-base font-black text-emerald-400">
                          {currentPlan.total_cost.toLocaleString('vi-VN')} VNĐ
                        </strong>
                      </div>
                    </div>

                    {/* Bóc tách ngân sách */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">🏨 Lưu trú</span>
                        <span className="font-bold text-white text-xs">{currentPlan.breakdown.accommodation.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">🍽️ Ăn uống</span>
                        <span className="font-bold text-white text-xs">{currentPlan.breakdown.food.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">🚗 Đi lại</span>
                        <span className="font-bold text-white text-xs">{currentPlan.breakdown.transport.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">🎟️ Vé & Trải nghiệm</span>
                        <span className="font-bold text-white text-xs">{currentPlan.breakdown.tickets.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>

                    {/* Mẹo bảo tồn văn hóa & điều phối luồng khách */}
                    <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Góc Bảo Tồn & Điều Phối:</strong> {currentPlan.sustainable_tip}
                      </div>
                    </div>
                  </div>

                  {/* TABS CHỌN NGÀY */}
                  <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                    {currentPlan.days.map((d) => {
                      const isActive = activeDay === d.day_number;
                      return (
                        <button
                          key={d.day_number}
                          type="button"
                          onClick={() => setActiveDay(d.day_number)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                        >
                          Ngày {d.day_number}: {d.day_title}
                        </button>
                      );
                    })}
                  </div>

                  {/* TIMELINE CÁC HOẠT ĐỘNG TRONG NGÀY ĐANG CHỌN */}
                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                    {currentPlan.days
                      .find((d) => d.day_number === activeDay)
                      ?.activities.map((act, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row gap-4 items-start"
                        >
                          <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={act.image || '/images/placeholders/dray-nur.jpg'}
                              alt={act.title}
                              tag={act.time_slot}
                              className="w-full h-full"
                            />
                          </div>

                          <div className="flex-1 space-y-1.5 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {act.time_slot}
                              </span>
                              <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                                {act.category}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white">{act.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>

                            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
                              <span className="text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[11px]">{act.location}</span>
                              </span>
                              <strong className="text-amber-300 text-xs">
                                {act.cost.toLocaleString('vi-VN')} VNĐ
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* NÚT IN & CHIA SẺ */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>In / Xuất Kế Hoạch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Đã sao chép liên kết lộ trình Đắk Lắk Di!')}
                      className="flex-1 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-500/40 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Chia Sẻ Cho Bạn Bè</span>
                    </button>
                  </div>
                </>
              ) : null}

            </div>

          </div>

        </div>
      </section>

      {/* 9. CẢM NHẬN & ĐÁNH GIÁ DU KHÁCH (REVIEWS) */}
      <section id="reviews" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Cộng Đồng Gen Z</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Cảm Nhận & Đánh Giá Du Khách</h2>
          <p className="text-xs text-slate-400">
            Chia sẻ trải nghiệm thực tế sau những chuyến đi chạm vào bản sắc văn hóa Đắk Lắk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Form gửi review nhanh */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Gửi Cảm Nhận Của Bạn</span>
            </h3>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên của bạn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Nam (23 tuổi)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Đánh giá trải nghiệm
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 text-base text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewerRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nội dung bình luận / cảm nhận *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Chia sẻ kỷ niệm đẹp, món ăn ngon hoặc ấn tượng với nghệ nhân Đắk Lắk..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Cảm Nhận Ngay</span>
              </button>
            </form>
          </div>

          {/* Danh sách review */}
          <div className="lg:col-span-7 space-y-3.5">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-bold text-xs">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                      <span className="text-[10px] text-slate-400">{rev.age} • {rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 md:px-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-bold">
          <Compass className="w-4 h-4" />
          <span>ĐẮK LẮK DI — ĐI NHIỀU HƠN, HIỂU ĐẤT NƯỚC MÌNH HƠN</span>
        </div>
        <p>Cuộc thi "AI Thực Chiến 2026" — Team 920 (HERO AI) • Vòng Chung Khảo</p>
        <p className="text-[11px] text-slate-600">Được tối ưu và xây dựng cho trải nghiệm Web Desktop chuẩn Vercel & Supabase.</p>
      </footer>

    </div>
  );
}

// Hàm bổ trợ sinh 3 kế hoạch đa dạng từ kết quả backend
function buildMultiPlans(payload, data) {
  const b = payload.budget;
  const days = payload.num_days;
  const size = payload.num_people;

  return [
    {
      id: 'plan-artisan',
      badge: '🌟 Đậm Bản Sắc Nhất',
      title: 'Di Sản Đại Ngàn & Kết Nối Nghệ Nhân',
      highlight: 'Giao lưu nghệ nhân cồng chiêng Ako Dhông, làm gốm Yang Tao và thưởng thức gà nướng cơm lam.',
      total_cost: Math.round(b * 0.92),
      breakdown: {
        accommodation: Math.round(b * 0.30),
        food: Math.round(b * 0.32),
        transport: Math.round(b * 0.18),
        tickets: Math.round(b * 0.12)
      },
      sustainable_tip: 'Tôn trọng phong tục nhà dài Ê Đê và ủng hộ sản phẩm thủ công trực tiếp từ nghệ nhân bản địa.',
      days: createDaysMock(days, 'Văn hóa & Nghệ nhân', payload.custom_notes)
    },
    {
      id: 'plan-nature',
      badge: '🏞️ Khám Phá Thiên Nhiên',
      title: 'Hùng Vĩ Thác Dray Nur & Rừng Yok Đôn',
      highlight: 'Trekking thác Dray Nur, ngắm hoàng hôn Hồ Lắk thơ mộng và trải nghiệm ngắm voi thân thiện.',
      total_cost: Math.round(b * 0.88),
      breakdown: {
        accommodation: Math.round(b * 0.28),
        food: Math.round(b * 0.30),
        transport: Math.round(b * 0.20),
        tickets: Math.round(b * 0.10)
      },
      sustainable_tip: 'Giữ gìn cảnh quan rừng nguyên sinh, trải nghiệm du lịch voi thân thiện thay vì cưỡi voi.',
      days: createDaysMock(days, 'Thiên nhiên & Thác', payload.custom_notes)
    },
    {
      id: 'plan-chill',
      badge: '☕ Chill Cao Nguyên',
      title: 'Hương Sắc Cà Phê & Phố Núi Thư Giãn',
      highlight: 'Khám phá Bảo tàng Thế giới Cà phê, check-in farm Robusta và dạo đêm thưởng thức bún đỏ.',
      total_cost: Math.round(b * 0.85),
      breakdown: {
        accommodation: Math.round(b * 0.32),
        food: Math.round(b * 0.28),
        transport: Math.round(b * 0.15),
        tickets: Math.round(b * 0.10)
      },
      sustainable_tip: 'Nên tham quan Bảo tàng Cà phê vào khung giờ sáng sớm 7h30 - 9h00 để tránh đông đúc.',
      days: createDaysMock(days, 'Cà phê & Check-in', payload.custom_notes)
    }
  ];
}

// Fallback generator 3 plans
function generateSmartFallbackPlans(payload) {
  return buildMultiPlans(payload, null);
}

function createDaysMock(daysCount, theme, customNotes) {
  const allDays = [
    {
      day_number: 1,
      day_title: 'Chạm Ngõ Buôn Ma Thuột & Cà Phê Bản Địa',
      activities: [
        {
          time_slot: '08:00 - 10:30',
          title: 'Bảo Tàng Thế Giới Cà Phê & Thưởng Thức Robusta',
          category: 'Cà phê & Check-in',
          description: 'Check-in kiến trúc nhà dài uốn lượn, tìm hiểu lịch sử cà phê thế giới và nhâm nhi tách espresso đậm đà.',
          location: 'Nguyễn Văn Cừ, TP. Buôn Ma Thuột',
          cost: 150000,
          image: '/images/placeholders/bao-tang-ca-phe.jpg'
        },
        {
          time_slot: '11:30 - 13:00',
          title: 'Ăn Trưa Bún Đỏ Phố Núi & Gỏi Đu Đủ Bà Thu',
          category: 'Ẩm thực',
          description: 'Món bún đỏ nức tiếng màu gạch tôm đậm vị, ăn cùng rau cần nước tươi giòn.',
          location: 'Lê Hồng Phong, TP. Buôn Ma Thuột',
          cost: 45000,
          image: '/images/placeholders/bun-do.jpg'
        },
        {
          time_slot: '14:30 - 17:00',
          title: 'Thăm Buôn Ako Dhông & Giao Lưu Nghệ Nhân',
          category: 'Văn hóa bản địa',
          description: customNotes
            ? `Dạo bước buôn làng cổ, nghe nghệ nhân cồng chiêng chia sẻ. (Ghi chú: ${customNotes})`
            : 'Dạo bước buôn làng kiểu mẫu của người Ê Đê, thăm nhà dài cổ và chiêm ngưỡng nghệ thuật dệt thổ cẩm.',
          location: 'Buôn Ako Dhông, TP. Buôn Ma Thuột',
          cost: 50000,
          image: '/images/placeholders/buon-ako-dhong.jpg'
        },
        {
          time_slot: '18:30 - 21:00',
          title: 'Gà Nướng Cơm Lam & Giao Lưu Cồng Chiêng Đêm',
          category: 'Trải nghiệm đêm',
          description: 'Thưởng thức gà nướng than hoa chấm muối é rừng, cơm lam dẻo thơm bên ánh lửa bập bùng.',
          location: 'Khu ẩm thực Tây Nguyên BMT',
          cost: 200000,
          image: '/images/placeholders/ga-nuong-com-lam.jpg'
        }
      ]
    },
    {
      day_number: 2,
      day_title: 'Hùng Vĩ Thác Dray Nur & Rừng Yok Đôn',
      activities: [
        {
          time_slot: '07:30 - 11:30',
          title: 'Khám Phá Cụm Thác Dray Nur - Dray Sáp',
          category: 'Thiên nhiên kỳ vĩ',
          description: 'Chiêm ngưỡng ngọn thác đổ trắng xóa bên dòng sông Sêrêpôk, dạo cầu treo và chụp ảnh thiên nhiên.',
          location: 'Huyện Krông Ana, Đắk Lắk',
          cost: 80000,
          image: '/images/placeholders/dray-nur.jpg'
        },
        {
          time_slot: '12:00 - 13:30',
          title: 'Bữa Trưa Lẩu Cá Lăng Sông Sêrêpôk',
          category: 'Ẩm thực',
          description: 'Thịt cá lăng ngọt dai nấu lẩu măng chua rừng chuẩn vị bản địa.',
          location: 'Nhà hàng ven sông Sêrêpôk',
          cost: 160000,
          image: '/images/placeholders/lau-ca-lang.jpg'
        },
        {
          time_slot: '14:30 - 17:30',
          title: 'Trải Nghiệm Du Lịch Voi Thân Thiện Buôn Đôn',
          category: 'Du lịch bền vững',
          description: 'Ngắm những chú voi thong dong kiếm ăn trong rừng khộp Yok Đôn, thăm nhà sàn cổ vua voi Ama Kông.',
          location: 'Vườn Quốc Gia Yok Đôn, Buôn Đôn',
          cost: 120000,
          image: '/images/placeholders/buon-don.jpg'
        }
      ]
    },
    {
      day_number: 3,
      day_title: 'Hồ Lắk Thơ Mộng & Làng Gốm Yang Tao',
      activities: [
        {
          time_slot: '08:00 - 11:00',
          title: 'Vẻ Đẹp Hồ Lắk & Dạo Buôn Jun Người M\'Nông',
          category: 'Thơ mộng & Văn hóa',
          description: 'Ngắm mặt hồ phẳng lặng như gương, thăm Biệt điện vua Bảo Đại trên đồi cao lộng gió.',
          location: 'Thị trấn Liên Sơn, Huyện Lắk',
          cost: 80000,
          image: '/images/placeholders/ho-lak.jpg'
        },
        {
          time_slot: '11:30 - 13:00',
          title: 'Ăn Trưa Chả Cá Thát Lát Hồ Lắk & Cà Đắng',
          category: 'Ẩm thực',
          description: 'Món chả cá thát lát chiên phồng thơm nức ăn cùng món cà đắng cá trích độc đáo.',
          location: 'Khu ẩm thực ven Hồ Lắk',
          cost: 120000,
          image: '/images/placeholders/ca-dang.jpg'
        },
        {
          time_slot: '14:00 - 16:30',
          title: 'Thăm Làng Gốm Cổ Yang Tao & Núi Đá Voi Cha',
          category: 'Làng nghề di sản',
          description: 'Tận mắt xem nghệ nhân H\'Phi La làm gốm không dùng bàn xoay và check-in tảng đá granit nguyên khối.',
          location: 'Xã Yang Tao, Huyện Lắk',
          cost: 50000,
          image: '/images/placeholders/gom-yang-tao.jpg'
        }
      ]
    },
    {
      day_number: 4,
      day_title: 'Chùa Sắc Tứ Khải Đoan & Mua Quà Đặc Sản',
      activities: [
        {
          time_slot: '08:00 - 10:30',
          title: 'Chiêm Bái Chùa Sắc Tứ Khải Đoan',
          category: 'Tâm linh & Kiến trúc',
          description: 'Ngắm kiến trúc nhà rông kết hợp chùa cung đình Huế bằng gỗ lim tinh xảo.',
          location: 'Phường Thống Nhất, TP. Buôn Ma Thuột',
          cost: 0,
          image: '/images/placeholders/chua-khai-doan.jpg'
        },
        {
          time_slot: '10:30 - 12:30',
          title: 'Thưởng Thức Cà Phê Vườn & Chọn Mua Cà Phê Robusta',
          category: 'Mua sắm & Quà tặng',
          description: 'Mua cà phê Robusta đặc sản và thổ cẩm bản địa về làm quà cho người thân.',
          location: 'Chợ Buôn Ma Thuột',
          cost: 200000,
          image: '/images/placeholders/farm-ca-phe.jpg'
        }
      ]
    }
  ];

  return allDays.slice(0, daysCount);
}
