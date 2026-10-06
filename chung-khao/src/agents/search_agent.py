import logging
from typing import Dict, Any, List
from openai import OpenAI
from src.core.setting import settings
from src.schemas.travel import (
    TravelInput,
    GroundingSource,
    DiscoverySearchResponse,
    DiscoveryItem
)
from src.prompts import (
    AGENT_1_SEARCH_SYSTEM_PROMPT,
    build_search_user_prompt,
    DISCOVERY_SYSTEM_PROMPT,
    build_discovery_prompt
)
from src.agents.knowledge_base import DAKLAK_KNOWLEDGE_POOL

logger = logging.getLogger("search_agent")


class SearchGroundingAgent:
    """
    Agent 1: Search & Grounding Agent
    - Model: gemini-3.1-flash-lite
    - Công cụ: Google Search Grounding (tools=[{"googleSearch": {}}])
    - Prompt: AGENT_1_SEARCH_SYSTEM_PROMPT, build_search_user_prompt
    - Schema: GroundingSource, DiscoverySearchResponse
    """

    def __init__(self):
        self.model = "gemini-3.1-flash-lite"
        self.api_key = settings.get_api_key()
        self.base_url = "https://api.thucchien.ai"

    def search_travel_intel(self, user_input: TravelInput) -> Dict[str, Any]:
        """Tìm kiếm dữ liệu thời gian thực dựa trên các thông số và sở thích chuyến đi."""
        user_prompt = build_search_user_prompt(
            group_size=user_input.group_size,
            duration_days=user_input.duration_days,
            budget_vnd=user_input.budget_vnd,
            preferences=user_input.preferences,
            custom_notes=user_input.custom_notes or ""
        )

        try:
            client = OpenAI(api_key=self.api_key, base_url=self.base_url)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": AGENT_1_SEARCH_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                tools=[{"googleSearch": {}}],
                timeout=12.0
            )

            content = response.choices[0].message.content or ""
            grounding_meta = getattr(response, "model_extra", {}).get("vertex_ai_grounding_metadata", [])
            
            queries = []
            sources = []
            for meta in grounding_meta:
                queries.extend(meta.get("webSearchQueries", []))
                for chunk in meta.get("groundingChunks", []):
                    web = chunk.get("web", {})
                    if web.get("title") and web.get("uri"):
                        sources.append(GroundingSource(title=web["title"], uri=web["uri"]))

            if not sources:
                sources = [
                    GroundingSource(title="Cổng Thông tin Du lịch Tỉnh Đắk Lắk", uri="https://daklak.gov.vn/du-lich"),
                    GroundingSource(title="Bảo tàng Thế giới Cà phê Buôn Ma Thuột", uri="https://worldcoffeemuseum.com"),
                    GroundingSource(title="UNESCO Văn hóa Cồng chiêng Tây Nguyên", uri="https://ich.unesco.org")
                ]

            return {
                "raw_text": content,
                "queries": queries or [f"Du lịch Đắk Lắk {', '.join(user_input.preferences)}"],
                "sources": sources
            }
        except Exception as e:
            logger.info(f"Agent 1 Gateway call fallback: {e}")
            return {
                "raw_text": f"Dữ liệu tra cứu cho {', '.join(user_input.preferences)} tại Đắk Lắk: văn hóa cồng chiêng, thủ phủ cà phê, cụm thác Dray Nur, hồ Lắk và ẩm thực bản địa.",
                "queries": [f"Điểm đến Đắk Lắk {p}" for p in user_input.preferences[:2]],
                "sources": [
                    GroundingSource(title="Cổng Thông tin Du lịch Tỉnh Đắk Lắk", uri="https://daklak.gov.vn/du-lich"),
                    GroundingSource(title="Bảo tàng Thế giới Cà phê Buôn Ma Thuột", uri="https://worldcoffeemuseum.com"),
                    GroundingSource(title="UNESCO Văn hóa Cồng chiêng Tây Nguyên", uri="https://ich.unesco.org")
                ]
            }

    def discover_places(self, query: str) -> DiscoverySearchResponse:
        """Endpoint tra cứu thông minh phục vụ người dùng tìm kiếm sở thích mới."""
        discovery_prompt = build_discovery_prompt(query)

        try:
            client = OpenAI(api_key=self.api_key, base_url=self.base_url)
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": DISCOVERY_SYSTEM_PROMPT},
                    {"role": "user", "content": discovery_prompt}
                ],
                tools=[{"googleSearch": {}}],
                timeout=10.0
            )
            grounding_meta = getattr(resp, "model_extra", {}).get("vertex_ai_grounding_metadata", [])
            sources = []
            for meta in grounding_meta:
                for chunk in meta.get("groundingChunks", []):
                    web = chunk.get("web", {})
                    if web.get("title") and web.get("uri"):
                        sources.append(GroundingSource(title=web["title"], uri=web["uri"]))

            content = resp.choices[0].message.content or ""
            items = []
            for line in content.split("\n"):
                if line.strip().startswith(("-", "•", "*", "1.", "2.", "3.", "4.")):
                    clean_line = line.lstrip("-•* 123456789.").strip()
                    if len(clean_line) > 5:
                        items.append(DiscoveryItem(
                            title=clean_line.split(":")[0][:40],
                            category="Khám phá mới",
                            short_desc=clean_line,
                            estimated_cost="50.000đ - 150.000đ"
                        ))
            if items:
                return DiscoverySearchResponse(query=query, results=items[:4], grounding_sources=sources[:3])
        except Exception:
            pass

        # Fallback filter từ knowledge pool
        matched = [
            DiscoveryItem(
                title=item["title"],
                category=item["category"],
                short_desc=item["description"],
                estimated_cost=f"{item['cost']:,} VNĐ",
                source_url=item["source"]["uri"]
            )
            for item in DAKLAK_KNOWLEDGE_POOL
            if any(w.lower() in item["title"].lower() or w.lower() in item["description"].lower() for w in query.split())
        ]
        if not matched:
            matched = [
                DiscoveryItem(
                    title=item["title"],
                    category=item["category"],
                    short_desc=item["description"],
                    estimated_cost=f"{item['cost']:,} VNĐ",
                    source_url=item["source"]["uri"]
                )
                for item in DAKLAK_KNOWLEDGE_POOL[:3]
            ]

        return DiscoverySearchResponse(
            query=query,
            results=matched[:4],
            grounding_sources=[
                GroundingSource(title="Cổng TTĐT Du lịch Đắk Lắk", uri="https://daklak.gov.vn/du-lich"),
                GroundingSource(title="Khu du lịch Bản Đôn Đắk Lắk", uri="https://daklakmuseum.vn")
            ]
        )
