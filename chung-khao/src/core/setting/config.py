import os
from pathlib import Path
from typing import Optional, List
from pydantic import Field, SecretStr, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


def find_env_files() -> List[str]:
    """Dynamically discover available .env files across the project workspace."""
    current_dir = Path(__file__).resolve().parent
    root_dir = current_dir.parents[3]  # root repo directory
    chung_khao_dir = current_dir.parents[2]  # chung-khao directory
    
    candidates = [
        root_dir / ".env",
        chung_khao_dir / ".env",
        Path.cwd() / ".env",
    ]
    
    env_files = [str(p) for p in candidates if p.is_file()]
    if not env_files:
        env_files = [".env"]
    return env_files


class Settings(BaseSettings):
    """
    Core Configuration Settings for AI Agent System.
    Powered by Pydantic V2 BaseSettings and Pydantic Core.
    Loads environment variables from .env files securely.
    """
    model_config = SettingsConfigDict(
        env_file=find_env_files(),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )

    # Project metadata
    PROJECT_NAME: str = Field(default="HERO-AI Agent System")
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)

    # API Keys & Gateway Configuration
    AI_LOG_API_KEY: Optional[SecretStr] = Field(
        default=None,
        description="BTC API Log Key (starts with aitc_)"
    )
    LLM_API_KEY: Optional[SecretStr] = Field(
        default=None,
        validation_alias=AliasChoices("LLM_API_KEY", "API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"),
        description="LLM Provider Virtual Key (starts with sk-)"
    )
    
    # Gateway & Log URLs
    AI_LOG_SERVER: str = Field(
        default="https://live.thucchien.ai/api/ingest",
        description="BTC AI log server URL"
    )
    AI_GATEWAY_URL: str = Field(
        default=os.getenv("GOOGLE_GEMINI_BASE_URL", "https://api.thucchien.ai"),
        description="Internal API Gateway Base URL"
    )

    # LLM Parameters
    DEFAULT_MODEL: str = Field(
        default="gemini-3.1-flash-lite",
        description="Default LLM model name"
    )
    LLM_TEMPERATURE: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="LLM temperature setting"
    )
    MAX_TOKENS: int = Field(
        default=2048,
        description="Maximum completion token limit"
    )

    def get_api_key(self) -> str:
        """
        Lấy API key cho LLM Gateway (ưu tiên key bắt đầu bằng sk-).
        Tự động .strip() loại bỏ khoảng trắng thừa.
        """
        for env_name in ["LLM_API_KEY", "GEMINI_API_KEY", "API_KEY", "OPENAI_API_KEY"]:
            val = os.getenv(env_name, "").strip()
            if val and val.startswith("sk-"):
                return val

        if self.LLM_API_KEY:
            val = self.LLM_API_KEY.get_secret_value().strip()
            if val and val.startswith("sk-"):
                return val

        for env_name in ["LLM_API_KEY", "GEMINI_API_KEY", "API_KEY", "OPENAI_API_KEY"]:
            val = os.getenv(env_name, "").strip()
            if val:
                return val

        if self.AI_LOG_API_KEY:
            return self.AI_LOG_API_KEY.get_secret_value().strip()

        return os.getenv("AI_LOG_API_KEY", "").strip()

    def get_auth_headers(self) -> dict:
        """
        Construct standard Authorization HTTP headers for API Gateway requests.
        """
        api_key = self.get_api_key()
        headers = {
            "Content-Type": "application/json"
        }
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
            headers["X-API-Key"] = api_key
        return headers



# Global singleton settings instance
settings = Settings()


def get_settings() -> Settings:
    """Dependency getter function for settings."""
    return settings
