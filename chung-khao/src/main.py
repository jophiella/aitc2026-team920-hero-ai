import sys
from pathlib import Path

# Add project root and src directory to python path
src_dir = Path(__file__).resolve().parent
chung_khao_dir = src_dir.parent
root_dir = chung_khao_dir.parent

for path in [str(root_dir), str(chung_khao_dir), str(src_dir)]:
    if path not in sys.path:
        sys.path.insert(0, path)

from src.core.setting import settings
from src.agents import BaseAgent


def main():
    """Application entrypoint demonstrating setting loading."""
    print("==================================================")
    print(f"Project Name : {settings.PROJECT_NAME}")
    print(f"Environment  : {settings.ENVIRONMENT}")
    print(f"Debug Mode   : {settings.DEBUG}")
    print(f"Gateway URL  : {settings.AI_GATEWAY_URL}")
    print(f"Log Server   : {settings.AI_LOG_SERVER}")
    print(f"Default Model: {settings.DEFAULT_MODEL}")
    
    api_key = settings.get_api_key()
    has_key = bool(api_key)
    masked_key = f"{api_key[:8]}...***" if has_key and len(api_key) > 8 else ("Configured" if has_key else "Not set")
    print(f"API Key Status: {masked_key}")
    print("==================================================")

    agent = BaseAgent(agent_name="DemoAgent")
    print("Agent Status:", agent.get_agent_status())


if __name__ == "__main__":
    main()
