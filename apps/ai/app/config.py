from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../../.env", extra="ignore")

    ENVIRONMENT: str = "development"
    SERVICE_NAME: str = "spatiumai-ai"
    HOST: str = "0.0.0.0"
    PORT: int = 8002

    SENTRY_DSN: str | None = None

    # Anthropic Claude API
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"

    # LLM settings
    LLM_MAX_TOKENS: int = 2048
    LLM_TEMPERATURE: float = 0.3  # lower = more deterministic/architectural
    LLM_TIMEOUT_SECONDS: int = 45

    # Max concurrent LLM calls (rate limit guard)
    MAX_CONCURRENT_LLM_CALLS: int = 5


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
