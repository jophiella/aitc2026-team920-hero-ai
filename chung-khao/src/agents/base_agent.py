import httpx
from src.core.setting import settings


class BaseAgent:
    """
    Base AI Agent class demonstrating how API keys and configurations
    are accessed across the project via core.setting.
    """

    def __init__(self, agent_name: str = "BaseAgent"):
        self.agent_name = agent_name
        self.gateway_url = settings.AI_GATEWAY_URL
        self.default_model = settings.DEFAULT_MODEL
        self.temperature = settings.LLM_TEMPERATURE

    def is_configured(self) -> bool:
        """Check if the agent has a valid API key configured."""
        api_key = settings.get_api_key()
        return bool(api_key and len(api_key) > 0)

    def get_agent_status(self) -> dict:
        """Return agent configuration status (masking secret keys)."""
        return {
            "agent_name": self.agent_name,
            "configured": self.is_configured(),
            "gateway_url": self.gateway_url,
            "model": self.default_model,
            "environment": settings.ENVIRONMENT,
            "debug": settings.DEBUG,
        }

    async def call_llm_gateway(self, prompt: str) -> dict:
        """
        Example method demonstrating API Gateway invocation using settings headers.
        """
        headers = settings.get_auth_headers()
        payload = {
            "model": self.default_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": self.temperature,
            "max_tokens": settings.MAX_TOKENS,
        }
        
        # Example async call structure using httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.gateway_url}/v1/chat/completions",
                json=payload,
                headers=headers
            )
            return {
                "status_code": response.status_code,
                "is_success": response.is_success,
            }
