# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — DXF Parser
# Uses ezdxf to extract rooms, walls, openings from DXF/DWG files.
# Sprint 0: structural scaffold with stubs.
# Sprint 1: full room extraction, area calculation, adjacency graph.
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations
import math
import uuid
from datetime import datetime, timezone
from typing import Any

from app.lib.logger import get_logger
from app.models.spatial_graph import (
    AdjacencyEntry,
    BoundingBox,
    Opening,
    OpeningType,
    Point2D,
    Room,
    SpatialGraph,
    SpatialGraphMetadata,
    SpaceType,
    Wall,
    WallType,
)

logger = get_logger(__name__)

PARSER_VERSION = "0.1.0"

# Layer name → SpaceType mapping
# DXF conventions vary by firm — these cover common Indian practice
LAYER_SPACE_MAP: dict[str, SpaceType] = {
    "BEDROOM": SpaceType.BEDROOM,
    "BED ROOM": SpaceType.BEDROOM,
    "MASTER BEDROOM": SpaceType.BEDROOM,
    "LIVING": SpaceType.LIVING,
    "LIVING ROOM": SpaceType.LIVING,
    "DRAWING": SpaceType.LIVING,
    "DINING": SpaceType.DINING,
    "KITCHEN": SpaceType.KITCHEN,
    "BATH": SpaceType.BATHROOM,
    "BATHROOM": SpaceType.BATHROOM,
    "TOILET": SpaceType.TOILET,
    "WC": SpaceType.TOILET,
    "CORRIDOR": SpaceType.CORRIDOR,
    "PASSAGE": SpaceType.CORRIDOR,
    "STAIR": SpaceType.STAIRCASE,
    "STAIRCASE": SpaceType.STAIRCASE,
    "BALCONY": SpaceType.BALCONY,
    "TERRACE": SpaceType.BALCONY,
    "STORE": SpaceType.STORE,
    "POOJA": SpaceType.POOJA,
    "PUJA": SpaceType.POOJA,
    "GARAGE": SpaceType.GARAGE,
    "PARKING": SpaceType.GARAGE,
    "LOBBY": SpaceType.LOBBY,
    "UTILITY": SpaceType.UTILITY,
}


def _infer_space_type(label: str) -> SpaceType:
    """Fuzzy match room label to SpaceType."""
    upper = label.upper().strip()
    for key, space_type in LAYER_SPACE_MAP.items():
        if key in upper:
            return space_type
    return SpaceType.UNKNOWN


def _polygon_area(points: list[Point2D]) -> float:
    """Shoelace formula — returns signed area; take abs for actual area."""
    n = len(points)
    if n < 3:
        return 0.0
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += points[i].x * points[j].y
        area -= points[j].x * points[i].y
    return abs(area) / 2.0


def _centroid(points: list[Point2D]) -> Point2D:
    n = len(points)
    if n == 0:
        return Point2D(x=0, y=0)
    cx = sum(p.x for p in points) / n
    cy = sum(p.y for p in points) / n
    return Point2D(x=cx, y=cy)


def _wall_length(p1: Point2D, p2: Point2D) -> float:
    return math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)


class DXFParser:
    """
    Parses DXF/DWG files into a SpatialGraph.

    Sprint 0: Returns a validated stub for testing the pipeline.
    Sprint 1: Implement full ezdxf-based extraction with:
              - LWPOLYLINE room boundary extraction
              - HATCH-based room detection
              - INSERT (block) based door/window detection
              - Text/MTEXT label extraction
    """

    def __init__(self, file_content: bytes, file_name: str):
        self.file_content = file_content
        self.file_name = file_name
        self.warnings: list[str] = []

    def parse(self) -> SpatialGraph:
        """Parse DXF file and return a SpatialGraph."""
        logger.info("Starting DXF parse", filename=self.file_name, size_bytes=len(self.file_content))

        try:
            import ezdxf  # type: ignore
            doc = ezdxf.read(self.file_content)  # type: ignore
            return self._extract_from_doc(doc)
        except ImportError:
            logger.warning("ezdxf not available — returning stub spatial graph")
            self.warnings.append("ezdxf library not available — stub output returned")
            return self._stub_graph()
        except Exception as e:
            logger.error("DXF parse failed", error=str(e), filename=self.file_name)
            raise ValueError(f"Failed to parse DXF file '{self.file_name}': {e}") from e

    def _extract_from_doc(self, doc: Any) -> SpatialGraph:
        """
        Full extraction from an ezdxf Document.
        TODO Sprint 1: Implement full layer/entity extraction.
        """
        self.warnings.append("Full DXF extraction not yet implemented — Sprint 1 target")
        return self._stub_graph()

    def _stub_graph(self) -> SpatialGraph:
        """
        Returns a minimal valid SpatialGraph for pipeline testing.
        Used when ezdxf is unavailable or full extraction isn't implemented yet.
        """
        room_id = str(uuid.uuid4())
        pts = [
            Point2D(x=0, y=0),
            Point2D(x=5, y=0),
            Point2D(x=5, y=4),
            Point2D(x=0, y=4),
        ]
        bbox = BoundingBox(
            min=Point2D(x=0, y=0),
            max=Point2D(x=5, y=4),
            widthM=5.0,
            heightM=4.0,
        )
        room = Room(
            id=room_id,
            label="TEST-BEDROOM",
            spaceType=SpaceType.BEDROOM,
            areaSqm=20.0,
            boundingBox=bbox,
            polygon=pts,
            centroid=Point2D(x=2.5, y=2.0),
            floorLevel=0,
            windowCount=1,
            doorCount=1,
            windowAreaSqm=1.6,
        )
        return SpatialGraph(
            version="1.0",
            sourceFile=self.file_name,
            parseTimestamp=datetime.now(timezone.utc).isoformat(),
            totalAreaSqm=20.0,
            floorCount=1,
            rooms=[room],
            walls=[],
            openings=[],
            adjacencies=[],
            metadata=SpatialGraphMetadata(
                parserVersion=PARSER_VERSION,
                fileFormat="dxf",
                unitSystem="metric",
                warnings=self.warnings,
            ),
        )
