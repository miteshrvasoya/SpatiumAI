# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — structlog Logger
# Every log line: service, level, request_id, duration_ms
# ─────────────────────────────────────────────────────────────────────────────
import logging
import structlog
from app.config import settings


def configure_logging() -> None:
    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if settings.ENVIRONMENT == "production":
        processors = shared_processors + [
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer(),
        ]
    else:
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer(colors=True),
        ]

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.DEBUG if settings.ENVIRONMENT != "production" else logging.INFO
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


# Call once at module import
configure_logging()


def get_logger(name: str) -> structlog.BoundLogger:
    return structlog.get_logger(name).bind(service=settings.SERVICE_NAME)
