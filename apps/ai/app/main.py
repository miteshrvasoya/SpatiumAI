# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-ai — FastAPI entrypoint
# LLM orchestration via Claude API + LangChain. Port: 8002
# Separated from spatiumai-parser because LLM calls have different
# timeout profiles (up to 60s) and scaling needs.
# ─────────────────────────────────────────────────────────────────────────────
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.lib.logger import get_logger
from app.routers import health, resolve

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=0.1,
        )
        logger.info("Sentry initialized")
    else:
        logger.warning("SENTRY_DSN not set — Sentry disabled")

    logger.info("spatiumai-ai starting", port=settings.PORT, environment=settings.ENVIRONMENT)
    yield
    logger.info("spatiumai-ai shutting down")


app = FastAPI(
    title="SpatiumAI AI Service",
    description="LLM-powered resolution generator — Claude API + LangChain",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # api service only
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(resolve.router)
