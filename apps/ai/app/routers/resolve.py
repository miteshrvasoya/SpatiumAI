from fastapi import APIRouter, HTTPException
from app.models.resolution import ResolveRequest, ResolveResponse
from app.resolvers.resolution_generator import ResolutionGenerator
from app.lib.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/resolve", tags=["resolve"])

_generator = ResolutionGenerator()


@router.post("/", response_model=ResolveResponse)
async def resolve(req: ResolveRequest) -> ResolveResponse:
    """
    Generate 2–3 resolution options for a constraint violation.
    Called by spatiumai-worker for each failed constraint result.
    """
    try:
        return await _generator.generate(req)
    except Exception as e:
        logger.error("Resolution generation failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Resolution failed: {e}") from e
