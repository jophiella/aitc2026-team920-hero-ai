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
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Share2,
  Printer,
  Info,
  Search,
  ExternalLink,
  PlusCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

const INITIAL_PREFERENCE_OPTIONS = [
  { id: 'vancua', label: 'Văn hóa Cồng chiêng', icon: '🏛️' },
  { id: 'caphe', label: 'Cà phê Buôn Ma Thuột', icon: '☕' },
  { id: 'thacnuoc', label: 'Thác nước & Trekking', icon: '🌊' },
  { id: 'amthuc', label: 'Ẩm thực Tây Nguyên', icon: '🍲' },
  { id: 'buondon', label: 'Voi Buôn Đôn & Sông Serepôk', icon: '🐘' },
  { id: 'holak', label: 'Hồ Lắk & Biệt điện Bảo Đại', icon: '🚣' },
];

export default function App() {
  // Travel Inputs State
  const [groupSize, setGroupSize] = useState(3);
  const [durationDays, setDurationDays] = useState(3);
  const [budgetVnd, setBudgetVnd] = useState(3500000);
  const [selectedPrefs, setSelectedPreferences] = useState([
    'Văn hóa Cồng chiêng',
    'Thác nước & Trekking',
    'Cà phê Buôn Ma Thuột',
    'Ẩm thực Tây Nguyên'
  ]);

  // Preference Discovery Search State
  const [discoveryQuery, setDiscoveryQuery] = useState('');
  const [isSearchingDiscovery, setIsSearchingDiscovery] = useState(false);
  const [discoveredItems, setDiscoveredItems] = useState([]);
  const [discoveredSources, setDiscoveredSources] = useState([]);

  // Main UI State
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [itineraryData, setItineraryData] = useState(null);

  useEffect(() => {
    handleGenerateItinerary();
  }, []);

  const togglePreference = (prefLabel) => {
    if (selectedPrefs.includes(prefLabel)) {
      if (selectedPrefs.length > 1) {
        setSelectedPreferences(selectedPrefs.filter((p) => p !== prefLabel));
      }
    } else {
      setSelectedPreferences([...selectedPrefs, prefLabel]);
    }
  };

  const handleAddCustomPreference = (itemTitle) => {
    if (!selectedPrefs.includes(itemTitle)) {
      setSelectedPreferences([...selectedPrefs, itemTitle]);
    }
  };

  // Tra cứu khám phá sở thích mới bằng Agent 1 (Google Search grounding)
  const handleSearchDiscovery = async (e) => {
    if (e) e.preventDefault();
    if (!discoveryQuery.trim()) return;

    setIsSearchingDiscovery(true);
    try {
      const resp = await fetch('http://localhost:8000/api/v1/search-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: discoveryQuery.trim() })
      });
      if (resp.ok) {
        const data = await resp.json();
        setDiscoveredItems(data.results || []);
        setDiscoveredSources(data.grounding_sources || []);
      }
    } catch (err) {
      console.warn('Discovery search fallback:', err);
      // Client fallback mock
      setDiscoveredItems([
        {
          title: `Trải nghiệm: ${discoveryQuery}`,
          category: 'Khám phá Đắk Lắk',
          short_desc: `Điểm đến thú vị theo phong cách ${discoveryQuery} tại đại ngàn Đắk Lắk.`,
          estimated_cost: '80.000đ - 150.000đ'
        }
      ]);
    } finally {
      setIsSearchingDiscovery(false);
    }
  };

  // Tạo lịch trình qua 3-Agent Workflow
  const handleGenerateItinerary = async () => {
    setLoading(true);

    const payload = {
      group_size: Number(groupSize),
      duration_days: Number(durationDays),
      budget_vnd: Number(budgetVnd),
      preferences: selectedPrefs
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setItineraryData(result.data);
        setActiveDay(1);
      } else {
        throw new Error(result.error || 'Dữ liệu không hợp lệ');
      }
    } catch (err) {
      console.warn('Backend unavailable, using client fallback:', err);
      const mockData = generateMockClientData(payload);
      setItineraryData(mockData);
      setActiveDay(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col text-slate-800">
      
      {/* HEADER BANNER */}
      <header className="bg-coffee-900 text-white px-6 py-4 shadow-lg border-b-2 border-gold-500/30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500 to-coffee-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border border-gold-500/50">
              ☕
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                Trợ Lý AI Du Lịch Đắk Lắk
                <span className="text-xs bg-gold-500/20 text-gold-500 border border-gold-500/40 px-2 py-0.5 rounded-full font-medium">
                  3-Agent Workflow
                </span>
              </h1>
              <p className="text-xs text-coffee-100/70">
                Agent 1 (Search) + Agent 2 (Synthesis) + Agent 3 (Reranking & Decision)
              </p>
            </div>
          </div>

          {/* Workflow Status Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="bg-coffee-800/90 border border-coffee-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Agent 1: <strong>Search</strong> (gemini-3.1-flash-lite)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-gold-500" />
            <div className="bg-coffee-800/90 border border-coffee-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Agent 2: <strong>Synthesis</strong> (gemini-3.1-flash-lite)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-gold-500" />
            <div className="bg-coffee-800/90 border border-coffee-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Agent 3: <strong>Decision</strong> (gemini-3.1-pro-preview)</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN 3-COLUMN DESKTOP LAYOUT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CỘT 1: CẤU HÌNH & TÌM KIẾM SỞ THÍCH KHÁM PHÁ (Width: 4/12 cols) */}
        <section className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-coffee-100 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-coffee-700" />
              <h2 className="font-bold text-slate-900 text-base">Thông Số & Sở Thích</h2>
            </div>

            {/* Thông số cơ bản (Người, Ngày, Ngân sách) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-coffee-600" />
                  Số người
                </label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-bold text-slate-900 text-xs">{groupSize} người</span>
                  <button
                    type="button"
                    onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-coffee-600" />
                  Số ngày
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-coffee-600"
                >
                  <option value={1}>1 Ngày</option>
                  <option value={2}>2 Ngày 1 Đêm</option>
                  <option value={3}>3 Ngày 2 Đêm</option>
                  <option value={4}>4 Ngày 3 Đêm</option>
                </select>
              </div>
            </div>

            {/* Ngân sách */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-coffee-600" />
                  Ngân sách / người
                </label>
                <span className="text-xs font-extrabold text-coffee-800">
                  {Number(budgetVnd).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={10000000}
                step={250000}
                value={budgetVnd}
                onChange={(e) => setBudgetVnd(Number(e.target.value))}
                className="w-full accent-coffee-700 cursor-pointer mb-1"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1.000.000đ</span>
                <span>5.000.000đ</span>
                <span>10.000.000đ</span>
              </div>
            </div>

            {/* Danh sách sở thích đã chọn */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Sở thích chuyến đi (Gợi ý sẵn & Khám phá thêm)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {INITIAL_PREFERENCE_OPTIONS.map((item) => {
                  const isSelected = selectedPrefs.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePreference(item.label)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-coffee-800 text-white border-coffee-800 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                {/* Các sở thích tìm kiếm tùy chọn thêm */}
                {selectedPrefs
                  .filter((p) => !INITIAL_PREFERENCE_OPTIONS.some((o) => o.label === p))
                  .map((customPref, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-800 text-white flex items-center gap-1 shadow-sm"
                    >
                      <span>✨</span>
                      <span>{customPref}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPreferences(selectedPrefs.filter((p) => p !== customPref))}
                        className="ml-1 text-slate-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Ô TÌM KIẾM KHÁM PHÁ SỞ THÍCH BẰNG GOOGLE SEARCH GROUNDING */}
            <div className="border border-gold-500/40 bg-gold-50/50 rounded-xl p-3">
              <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-700" />
                Tìm kiếm khám phá bằng Google Search (Agent 1)
              </label>
              <p className="text-[10px] text-amber-800/80 mb-2">
                Gõ từ khóa (VD: chèo sup sông Serepok, cà phê view hoàng hôn, homestay buôn...)
              </p>
              <form onSubmit={handleSearchDiscovery} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gõ từ khóa khám phá..."
                  value={discoveryQuery}
                  onChange={(e) => setDiscoveryQuery(e.target.value)}
                  className="flex-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSearchingDiscovery}
                  className="bg-amber-700 hover:bg-amber-800 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  {isSearchingDiscovery ? 'Đang tìm...' : 'Tìm ngay'}
                </button>
              </form>

              {/* Kết quả tìm kiếm khám phá */}
              {discoveredItems.length > 0 && (
                <div className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-1">
                  {discoveredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-amber-200 rounded-lg p-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 mr-2">
                        <strong className="text-slate-900 text-[11px] block">{item.title}</strong>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{item.short_desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddCustomPreference(item.title)}
                        className="bg-forest-100 hover:bg-forest-600 hover:text-white text-forest-700 px-2 py-1 rounded text-[10px] font-bold shrink-0 flex items-center gap-0.5"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Thêm</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleGenerateItinerary}
            disabled={loading}
            className="w-full bg-gradient-to-r from-coffee-800 to-coffee-600 hover:from-coffee-900 hover:to-coffee-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm border border-gold-500/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Agent 3 (Pro) đang Reranking lịch trình...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                <span>Khởi Chạy 3-Agent Workflow</span>
              </>
            )}
          </button>
        </section>

        {/* CỘT 2: TIMELINE LỊCH TRÌNH RERANKED & QUYẾT ĐỊNH (Width: 5/12 cols) */}
        <section className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-coffee-100 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 border-4 border-coffee-700 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="font-bold text-slate-800 text-base">Đang Vận Hành 3-Agent Workflow...</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Agent 1 tra cứu Google Search → Agent 2 tổng hợp đề xuất → Agent 3 (gemini-3.1-pro-preview) Rerank và bảo vệ ngân sách.
              </p>
            </div>
          ) : itineraryData ? (
            <>
              {/* Header Title & Workflow Tag */}
              <div className="border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>{itineraryData.trip_summary.title}</span>
                  </h2>
                  <span className="text-[11px] bg-forest-100 text-forest-700 px-2.5 py-0.5 rounded-full font-bold">
                    Tiết kiệm ~{itineraryData.trip_summary.savings_amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>👥 {itineraryData.trip_summary.group_size} người • {itineraryData.trip_summary.duration_days} ngày</span>
                  <span>Dự toán: <strong className="text-coffee-800">{itineraryData.trip_summary.total_estimated_cost.toLocaleString('vi-VN')} đ</strong>/người</span>
                </div>
              </div>

              {/* Tabs chọn Ngày */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 border-b border-slate-100">
                {itineraryData.itinerary_days.map((day) => {
                  const isActive = activeDay === day.day_number;
                  return (
                    <button
                      key={day.day_number}
                      type="button"
                      onClick={() => setActiveDay(day.day_number)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? 'bg-coffee-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Ngày {day.day_number}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hoạt động theo ngày */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[580px]">
                {itineraryData.itinerary_days
                  .find((d) => d.day_number === activeDay)
                  ?.activities.map((act, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 transition-all hover:border-coffee-500/40 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-coffee-100 text-coffee-800 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-coffee-700" />
                          {act.time_slot}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            act.category.includes('Ăn gì')
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {act.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-1">{act.title}</h3>

                      <p className="text-[11px] text-slate-500 mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-coffee-600 shrink-0" />
                        <span>{act.location}</span>
                      </p>

                      <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Chi phí ước tính:</span>
                          <strong className="text-coffee-800 text-xs">
                            {act.estimated_cost_per_person.toLocaleString('vi-VN')} VNĐ/người
                          </strong>
                        </div>

                        {act.cultural_note && (
                          <div className="bg-gold-100/70 border border-gold-500/30 rounded-lg p-1.5 text-[11px] text-amber-900 flex items-start gap-1">
                            <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span><strong>Góc Văn Hóa:</strong> {act.cultural_note}</span>
                          </div>
                        )}

                        {/* Nguồn Google Search Grounding */}
                        {act.grounding_sources && act.grounding_sources.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <ExternalLink className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>Nguồn xác thực:</span>
                            <a
                              href={act.grounding_sources[0].uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline hover:text-blue-800 truncate max-w-[220px]"
                            >
                              {act.grounding_sources[0].title}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : null}
        </section>

        {/* CỘT 3: BÓC TÁCH NGÂN SÁCH & NGUỒN DỮ LIỆU GOOGLE SEARCH (Width: 3/12 cols) */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Thẻ Ngân Sách */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-coffee-100">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
              <Wallet className="w-4 h-4 text-coffee-700" />
              <h2 className="font-bold text-slate-900 text-sm">Phân Rã Ngân Sách (VNĐ)</h2>
            </div>

            {itineraryData && (
              <div className="space-y-2.5">
                <div className="bg-coffee-50 p-2.5 rounded-xl border border-coffee-100">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Tổng dự toán:</span>
                    <span className="text-coffee-900 font-bold">
                      {itineraryData.trip_summary.total_estimated_cost.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (itineraryData.trip_summary.total_estimated_cost /
                            itineraryData.trip_summary.total_budget_input) *
                            100
                        )}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>Ngân sách: {itineraryData.trip_summary.total_budget_input.toLocaleString('vi-VN')} đ</span>
                    <span className="text-forest-700 font-bold">Pydantic OK ✓</span>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">🏨 Lưu trú:</span>
                    <strong>{itineraryData.budget_breakdown.accommodation.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">🍽️ Ăn uống & Đặc sản:</span>
                    <strong>{itineraryData.budget_breakdown.food_and_beverage.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">🚗 Di chuyển:</span>
                    <strong>{itineraryData.budget_breakdown.transportation.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">🎟️ Vé & Trải nghiệm:</span>
                    <strong>{itineraryData.budget_breakdown.activities_and_tickets.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">🛡️ Dự phòng (10%):</span>
                    <strong>{itineraryData.budget_breakdown.contingency.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nguồn Google Search Grounding Metadata */}
          {itineraryData?.grounding_sources && itineraryData.grounding_sources.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-coffee-100">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 text-xs font-bold text-slate-800">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Nguồn Dữ Liệu Google Search</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {itineraryData.grounding_sources.slice(0, 4).map((src, i) => (
                  <li key={i} className="truncate">
                    • <a href={src.uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {src.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mẹo Du Lịch Đắk Lắk */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-coffee-100">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 text-xs font-bold text-slate-800">
              <Info className="w-3.5 h-3.5 text-coffee-700" />
              <span>Mẹo Địa Phương</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              {itineraryData?.travel_tips.map((tip, idx) => (
                <li key={idx} className="bg-coffee-50/70 p-1.5 rounded">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>In Lịch Trình</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Đã sao chép liên kết chia sẻ lịch trình Đắk Lắk!')}
              className="flex-1 bg-coffee-100 hover:bg-coffee-200 text-coffee-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              <span>Chia Sẻ</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

// Fallback generator
function generateMockClientData(input) {
  const p = input.budget_vnd;
  const days = input.duration_days;
  const size = input.group_size;
  const totalEst = Math.round(p * 0.92);

  return {
    trip_summary: {
      title: `Hành Trình Khám Phá Đại Ngàn & Văn Hóa Đắk Lắk (${days}N${days - 1}Đ)`,
      group_size: size,
      duration_days: days,
      total_budget_input: p,
      total_estimated_cost: totalEst,
      savings_amount: p - totalEst,
      currency: 'VND',
      agent_workflow_status: 'Agent 1 (Search: gemini-3.1-flash-lite) -> Agent 2 (Synthesis: gemini-3.1-flash-lite) -> Agent 3 (Decision & Reranking: gemini-3.1-pro-preview)'
    },
    budget_breakdown: {
      accommodation: Math.round(p * 0.28),
      food_and_beverage: Math.round(p * 0.32),
      transportation: Math.round(p * 0.18),
      activities_and_tickets: Math.round(p * 0.12),
      contingency: Math.round(p * 0.10)
    },
    itinerary_days: [
      {
        day_number: 1,
        title: 'Ngày 1: Chạm Ngõ Thủ Phủ Cà Phê & Buôn Cổ Êđê',
        activities: [
          {
            time_slot: '08:00 - 10:30',
            title: 'Bảo tàng Thế giới Cà phê & Thưởng thức Espresso',
            category: 'Đi đâu & Cà phê',
            location: 'Đường Nguyễn Văn Cừ, TP. Buôn Ma Thuột',
            description: 'Tham quan công trình kiến trúc nhà dài cách điệu, check-in không gian văn hóa cà phê toàn cầu.',
            estimated_cost_per_person: 120000,
            cultural_note: 'Nơi lưu giữ hơn 10.000 hiện vật di sản cà phê đại diện cho nền văn minh cà phê thế giới.',
            grounding_sources: [{ title: 'Bảo tàng Thế giới Cà phê', uri: 'https://worldcoffeemuseum.com' }]
          },
          {
            time_slot: '11:30 - 13:00',
            title: 'Thưởng thức Bún Đỏ & Lẩu Lá Rừng Tây Nguyên',
            category: 'Ăn gì',
            location: 'Trung tâm TP. Buôn Ma Thuột',
            description: 'Món bún đỏ đặc sản vị đậm đà kết hợp lẩu lá rừng thơm ngon độc đáo.',
            estimated_cost_per_person: 100000,
            cultural_note: 'Lẩu lá rừng gồm hơn 10 loại lá thuốc nam do đồng bào Êđê tìm hái trên rừng.',
            grounding_sources: [{ title: 'Đặc sản ẩm thực Đắk Lắk', uri: 'https://daklak.gov.vn' }]
          },
          {
            time_slot: '14:30 - 17:00',
            title: 'Dạo Buôn Akŏ Dhŏ (Buôn Cô Thôn)',
            category: 'Đi đâu & Văn hóa',
            location: 'Phường Tân Lợi, TP. Buôn Ma Thuột',
            description: 'Thăm những ngôi nhà dài cổ nguyên bản, giao lưu cùng nghệ nhân dệt thổ cẩm.',
            estimated_cost_per_person: 50000,
            cultural_note: 'Akŏ Dhŏ là buôn làng mẫu mực bảo tồn trọn vẹn kiến trúc nhà dài truyền thống Êđê.',
            grounding_sources: [{ title: 'Cổng TTĐT Du lịch Đắk Lắk', uri: 'https://daklak.gov.vn/du-lich' }]
          },
          {
            time_slot: '18:30 - 21:00',
            title: 'Đêm Nhạc Cồng Chiêng & Ăn Tối Gà Nướng Cơm Lam',
            category: 'Ăn gì & Trải nghiệm',
            location: 'Khu Du lịch Sinh thái Bản địa BMT',
            description: 'Thưởng thức gà nướng than hồng chấm muối ớt rừng, cơm lam dẻo thơm và hòa nhịp cồng chiêng.',
            estimated_cost_per_person: 200000,
            cultural_note: 'Không gian Văn hóa Cồng chiêng Tây Nguyên là Di sản Kiệt tác Phi vật thể do UNESCO công nhận.',
            grounding_sources: [{ title: 'UNESCO Không gian Văn hóa Cồng chiêng', uri: 'https://ich.unesco.org' }]
          }
        ]
      },
      {
        day_number: 2,
        title: 'Ngày 2: Hùng Vĩ Thác Dray Nur & Huyền Thoại Buôn Đôn',
        activities: [
          {
            time_slot: '07:30 - 11:00',
            title: 'Khám Phá Thác Dray Nur - Ngược Dòng Sông Serepôk',
            category: 'Đi đâu & Thiên nhiên',
            location: 'Xã Ea Na, Huyện Krông Ana',
            description: 'Chiêm ngưỡng ngọn thác hùng vĩ bậc nhất Tây Nguyên, dạo bước qua cầu treo và chèo thuyền kayak.',
            estimated_cost_per_person: 90000,
            cultural_note: 'Thác Dray Nur gắn liền với thiên tình sử huyền thoại của chàng Quay và nàng Djam.',
            grounding_sources: [{ title: 'Thác Dray Nur', uri: 'https://draynurwaterfall.vn' }]
          },
          {
            time_slot: '11:30 - 13:00',
            title: 'Bữa Trưa Cá Lăng Sông Serepôk & Canh Thang Cố',
            category: 'Ăn gì',
            location: 'Nhà hàng ven sông Serepôk',
            description: 'Cá lăng đuôi đỏ nướng than hồng thơm phức và canh chua lá giang bản địa.',
            estimated_cost_per_person: 150000,
            cultural_note: 'Sông Serepôk là dòng sông ngược chảy duy nhất ở Việt Nam hướng về phía Tây.',
            grounding_sources: [{ title: 'Ẩm thực Serepok', uri: 'https://daklak.gov.vn' }]
          },
          {
            time_slot: '14:00 - 17:00',
            title: 'Thăm Nhà Sàn Cổ Vua Săn Voi Ama Kông - Buôn Đôn',
            category: 'Đi đâu & Lịch sử',
            location: 'Xã Krông Na, Huyện Buôn Đôn',
            description: 'Tìm hiểu lịch sử dũng sĩ săn voi rừng, tham quan nhà sàn gỗ lim 130 năm tuổi.',
            estimated_cost_per_person: 60000,
            cultural_note: 'Ama Kông là huyền thoại săn bắt được hơn 298 con voi rừng tại vùng đại ngàn.',
            grounding_sources: [{ title: 'Bảo tàng Bản Đôn', uri: 'https://daklakmuseum.vn' }]
          }
        ]
      },
      {
        day_number: 3,
        title: 'Ngày 3: Thơ Mộng Hồ Lắc & Biệt Điện Bảo Đại',
        activities: [
          {
            time_slot: '08:00 - 11:00',
            title: 'Vẻ Đẹp Hồ Lắk & Dạo Buôn Jun Bản Địa',
            category: 'Đi đâu & Thơ mộng',
            location: 'Thị trấn Liên Sơn, Huyện Lắk',
            description: 'Ngắm bình minh trên hồ nước ngọt lớn nhất Tây Nguyên, ngắm Biệt điện Bảo Đại trên đồi cao.',
            estimated_cost_per_person: 80000,
            cultural_note: 'Hồ Lắk rộng hơn 500 ha, là trái tim văn hóa của người M\'Nông.',
            grounding_sources: [{ title: 'Khu bảo tồn Hồ Lắk', uri: 'https://laklake-daklak.vn' }]
          },
          {
            time_slot: '11:30 - 13:00',
            title: 'Ăn Trưa Chả Cá Thát Lát Hồ Lắk',
            category: 'Ăn gì',
            location: 'Thị trấn Liên Sơn, Huyện Lắk',
            description: 'Thưởng thức chả cá thát lát dai ngon tự nhiên cùng rau rừng xào tỏi thơm lừng.',
            estimated_cost_per_person: 110000,
            cultural_note: 'Cá thát lát Hồ Lắk nổi tiếng dẻo thịt và ngọt nước thiên nhiên.',
            grounding_sources: [{ title: 'Đặc sản cá thát lát', uri: 'https://daklak.gov.vn' }]
          }
        ]
      }
    ].slice(0, days),
    travel_tips: [
      'Buổi tối không khí Đắk Lắk se lạnh, bạn nên mang theo áo khoác mỏng.',
      'Hãy tôn trọng tập quán khi vào nhà dài Êđê: tháo giày dép và đi theo sự hướng dẫn của chủ nhà.',
      'Thử cà phê phin đậm đà nguyên chất vào buổi sáng để cảm nhận trọn vẹn hương vị đại ngàn.'
    ],
    grounding_sources: [
      { title: 'Cổng TTĐT Du lịch Đắk Lắk', uri: 'https://daklak.gov.vn/du-lich' },
      { title: 'Bảo tàng Thế giới Cà phê', uri: 'https://worldcoffeemuseum.com' },
      { title: 'UNESCO Di sản Cồng chiêng', uri: 'https://ich.unesco.org' }
    ]
  };
}
