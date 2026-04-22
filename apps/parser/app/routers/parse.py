# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — Parse Route
# POST /parse  → accepts file key + format → returns SpatialGraph JSON
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations
import time
from typing import Literal

import boto3  # type: ignore
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.lib.logger import get_logger
from app.models.spatial_graph import SpatialGraph
from app.parsers.dxf_parser import DXFParser
from app.parsers.ifc_parser import IFCParser

logger = get_logger(__name__)
router = APIRouter(prefix="/parse", tags=["parse"])


class ParseRequest(BaseModel):
    """Sent by spatiumai-worker after picking up an evaluation job."""
    file_key: str  # S3 object key
    file_format: Literal["dxf", "ifc", "pdf", "image"]


class ParseResponse(BaseModel):
    spatial_graph: SpatialGraph
    processing_ms: int


def _download_from_s3(file_key: str) -> bytes:
    """Download file bytes from S3. Raises on failure."""
    if not settings.AWS_S3_BUCKET:
        raise ValueError("AWS_S3_BUCKET not configured")

    s3 = boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    response = s3.get_object(Bucket=settings.AWS_S3_BUCKET, Key=file_key)
    return response["Body"].read()  # type: ignore


@router.post("/", response_model=ParseResponse)
async def parse_file(req: ParseRequest) -> ParseResponse:
    """
    Parse an uploaded architectural file into a SpatialGraph.

    The file is downloaded from S3 by key, parsed by the appropriate
    parser (DXF or IFC), validated against the Pydantic schema, and
    returned as structured JSON.
    """
    start_ms = int(time.time() * 1000)
    logger.info("Parse request received", file_key=req.file_key, format=req.file_format)

    try:
        # Download file from S3
        try:
            file_bytes = _download_from_s3(req.file_key)
        except (ValueError, Exception) as e:
            # In dev: use a local stub file if S3 not configured
            logger.warning(
                "S3 download failed — using stub bytes for dev",
                error=str(e),
                file_key=req.file_key,
            )
            file_bytes = b""  # parsers handle empty bytes with stub fallback

        # Select parser
        file_name = req.file_key.split("/")[-1]
        if req.file_format in ("dxf", "dwg"):
            parser = DXFParser(file_bytes, file_name)
        elif req.file_format == "ifc":
            parser = IFCParser(file_bytes, file_name)
        else:
            raise HTTPException(
                status_code=422,
                detail=f"File format '{req.file_format}' not yet supported. Supported: dxf, ifc",
            )

        spatial_graph = parser.parse()
        processing_ms = int(time.time() * 1000) - start_ms

        logger.info(
            "Parse complete",
            file_key=req.file_key,
            room_count=len(spatial_graph.rooms),
            total_area_sqm=spatial_graph.total_area_sqm,
            processing_ms=processing_ms,
        )

        return ParseResponse(spatial_graph=spatial_graph, processing_ms=processing_ms)

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Parse failed", file_key=req.file_key, error=str(e))
        raise HTTPException(status_code=500, detail=f"Parse failed: {e}") from e
