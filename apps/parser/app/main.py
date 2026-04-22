# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — FastAPI entrypoint
# Handles IFC/DXF file parsing → returns SpatialGraph JSON
# Port: 8001
# ─────────────────────────────────────────────────────────────────────────────
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.lib.logger import get_logger
from app.routers import health, parse

logger = get_logger(__name__)


def _init_sentry() -> None:
    if not settings.SENTRY_DSN:
        logger.warning("SENTRY_DSN not set — Sentry disabled")
        return
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
    logger.info("Sentry initialized", dsn=settings.SENTRY_DSN[:20] + "...")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    _init_sentry()
    logger.info(
        "spatiumai-parser starting",
        port=settings.PORT,
        environment=settings.ENVIRONMENT,
    )
    yield
    # Shutdown
    logger.info("spatiumai-parser shutting down")


app = FastAPI(
    title="SpatiumAI Parser Service",
    description="Parses DXF/IFC architectural files into a SpatialGraph JSON",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # only from api service
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router)
app.include_router(parse.router)
