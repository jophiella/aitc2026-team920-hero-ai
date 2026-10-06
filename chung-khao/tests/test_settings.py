import sys
from pathlib import Path

# Ensure src is in python path
src_dir = Path(__file__).resolve().parents[1] / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from src.core.setting import settings, get_settings, Settings
from src.agents import BaseAgent


def test_settings_singleton():
    s1 = get_settings()
    s2 = settings
    assert s1 is s2
    assert isinstance(s1, Settings)


def test_settings_default_values():
    assert settings.PROJECT_NAME == "HERO-AI Agent System"
    assert settings.AI_GATEWAY_URL == "https://live.thucchien.ai/api"
    assert settings.DEFAULT_MODEL == "gemini-2.5-flash"


def test_auth_headers():
    headers = settings.get_auth_headers()
    assert "Content-Type" in headers
    assert headers["Content-Type"] == "application/json"


def test_base_agent_integration():
    agent = BaseAgent(agent_name="TestAgent")
    status = agent.get_agent_status()
    assert status["agent_name"] == "TestAgent"
    assert status["gateway_url"] == settings.AI_GATEWAY_URL
    assert status["model"] == settings.DEFAULT_MODEL
