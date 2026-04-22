import structlog
from app.config import settings


def configure_logging() -> None:
    import logging
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(colors=settings.ENVIRONMENT != "production"),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.DEBUG if settings.ENVIRONMENT != "production" else logging.INFO
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )


configure_logging()


def get_logger(name: str) -> structlog.BoundLogger:
    return structlog.get_logger(name).bind(service=settings.SERVICE_NAME)
