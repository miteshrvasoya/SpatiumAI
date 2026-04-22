# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — IFC Parser
# Uses IfcOpenShell to extract spatial elements from IFC/BIM files.
# Sprint 0: structural scaffold with stubs.
# Sprint 1: full IfcSpace, IfcWall, IfcDoor, IfcWindow extraction.
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations
import uuid
from datetime import datetime, timezone

from app.lib.logger import get_logger
from app.models.spatial_graph import (
    AdjacencyEntry, BoundingBox, Point2D, Room, SpatialGraph,
    SpatialGraphMetadata, SpaceType, Wall,
)

logger = get_logger(__name__)
PARSER_VERSION = "0.1.0"


class IFCParser:
    """
    Parses IFC files into a SpatialGraph using IfcOpenShell.

    Sprint 0: Returns a validated stub for pipeline testing.
    Sprint 1: Implement full extraction:
              - IfcSpace → Room
              - IfcWall / IfcWallStandardCase → Wall
              - IfcDoor / IfcWindow → Opening
              - IfcRelSpaceBoundary → adjacencies
              - IfcBuildingStorey → floor levels
    """

    def __init__(self, file_content: bytes, file_name: str):
        self.file_content = file_content
        self.file_name = file_name
        self.warnings: list[str] = []

    def parse(self) -> SpatialGraph:
        logger.info("Starting IFC parse", filename=self.file_name, size_bytes=len(self.file_content))

        try:
            import ifcopenshell  # type: ignore
            # Write bytes to temp file — ifcopenshell requires a file path
            import tempfile, os
            with tempfile.NamedTemporaryFile(suffix=".ifc", delete=False) as tmp:
                tmp.write(self.file_content)
                tmp_path = tmp.name
            try:
                model = ifcopenshell.open(tmp_path)  # type: ignore
                return self._extract_from_model(model)
            finally:
                os.unlink(tmp_path)
        except ImportError:
            logger.warning("ifcopenshell not available — returning stub spatial graph")
            self.warnings.append("ifcopenshell not available — stub output returned")
            return self._stub_graph()
        except Exception as e:
            logger.error("IFC parse failed", error=str(e), filename=self.file_name)
            raise ValueError(f"Failed to parse IFC file '{self.file_name}': {e}") from e

    def _extract_from_model(self, model: object) -> SpatialGraph:
        """TODO Sprint 1: Extract IfcSpace, IfcWall, IfcDoor, IfcWindow."""
        self.warnings.append("Full IFC extraction not yet implemented — Sprint 1 target")
        return self._stub_graph()

    def _stub_graph(self) -> SpatialGraph:
        room_id = str(uuid.uuid4())
        pts = [Point2D(x=0, y=0), Point2D(x=6, y=0), Point2D(x=6, y=5), Point2D(x=0, y=5)]
        bbox = BoundingBox(min=Point2D(x=0, y=0), max=Point2D(x=6, y=5), widthM=6.0, heightM=5.0)
        room = Room(
            id=room_id, label="IFC-SPACE-001", spaceType=SpaceType.LIVING,
            areaSqm=30.0, boundingBox=bbox, polygon=pts,
            centroid=Point2D(x=3, y=2.5), floorLevel=0,
            windowCount=2, doorCount=1, windowAreaSqm=3.0,
        )
        return SpatialGraph(
            version="1.0", sourceFile=self.file_name,
            parseTimestamp=datetime.now(timezone.utc).isoformat(),
            totalAreaSqm=30.0, floorCount=1, rooms=[room],
            walls=[], openings=[], adjacencies=[],
            metadata=SpatialGraphMetadata(
                parserVersion=PARSER_VERSION, fileFormat="ifc",
                unitSystem="metric", warnings=self.warnings,
            ),
        )
