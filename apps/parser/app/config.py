# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — Settings
# ─────────────────────────────────────────────────────────────────────────────
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../../.env", extra="ignore")

    ENVIRONMENT: str = "development"
    SERVICE_NAME: str = "spatiumai-parser"
    HOST: str = "0.0.0.0"
    PORT: int = 8001

    # Sentry
    SENTRY_DSN: str | None = None

    # AWS S3 (for downloading uploaded files)
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BUCKET: str = ""
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None

    # Parser config
    MAX_FILE_SIZE_MB: int = 100
    PARSER_TIMEOUT_SECONDS: int = 90


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
