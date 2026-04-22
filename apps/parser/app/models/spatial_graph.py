# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser — Pydantic Models
# Mirrors the TypeScript SpatialGraph types from @spatiumai/shared.
# These are the exact shapes returned by the parser service.
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class SpaceType(str, Enum):
    BEDROOM = "bedroom"
    LIVING = "living"
    DINING = "dining"
    KITCHEN = "kitchen"
    BATHROOM = "bathroom"
    TOILET = "toilet"
    CORRIDOR = "corridor"
    STAIRCASE = "staircase"
    BALCONY = "balcony"
    STUDY = "study"
    UTILITY = "utility"
    POOJA = "pooja"
    GARAGE = "garage"
    LOBBY = "lobby"
    STORE = "store"
    UNKNOWN = "unknown"


class WallType(str, Enum):
    EXTERIOR = "exterior"
    INTERIOR = "interior"
    PARTITION = "partition"
    STRUCTURAL = "structural"


class OpeningType(str, Enum):
    DOOR = "door"
    WINDOW = "window"
    OPENING = "opening"
    SLIDING_DOOR = "sliding_door"
    FRENCH_DOOR = "french_door"


class FacingDirection(str, Enum):
    N = "N"
    NE = "NE"
    E = "E"
    SE = "SE"
    S = "S"
    SW = "SW"
    W = "W"
    NW = "NW"


class Point2D(BaseModel):
    x: float
    y: float


class BoundingBox(BaseModel):
    min: Point2D
    max: Point2D
    width_m: float = Field(alias="widthM", ge=0)
    height_m: float = Field(alias="heightM", ge=0)

    model_config = {"populate_by_name": True}


class Room(BaseModel):
    id: str
    label: str
    space_type: SpaceType = Field(alias="spaceType")
    area_sqm: float = Field(alias="areaSqm", ge=0)
    bounding_box: BoundingBox = Field(alias="boundingBox")
    polygon: list[Point2D] = Field(min_length=3)
    centroid: Point2D
    facing_direction: Optional[FacingDirection] = Field(None, alias="facingDirection")
    floor_level: int = Field(alias="floorLevel", ge=0)
    window_count: int = Field(alias="windowCount", ge=0)
    door_count: int = Field(alias="doorCount", ge=0)
    window_area_sqm: float = Field(alias="windowAreaSqm", ge=0)

    model_config = {"populate_by_name": True}


class Wall(BaseModel):
    id: str
    type: WallType
    start: Point2D
    end: Point2D
    length_m: float = Field(alias="lengthM", gt=0)
    thickness_mm: float = Field(alias="thicknessMm", gt=0)
    height_mm: Optional[float] = Field(None, alias="heightMm", gt=0)
    adjacent_rooms: tuple[Optional[str], Optional[str]] = Field(alias="adjacentRooms")
    floor_level: int = Field(alias="floorLevel", ge=0)

    model_config = {"populate_by_name": True}


class Opening(BaseModel):
    id: str
    type: OpeningType
    wall_id: str = Field(alias="wallId")
    width_mm: float = Field(alias="widthMm", gt=0)
    height_mm: Optional[float] = Field(None, alias="heightMm")
    sill_height_mm: Optional[float] = Field(None, alias="sillHeightMm")
    position: Point2D
    facing_direction: Optional[FacingDirection] = Field(None, alias="facingDirection")
    connects_rooms: tuple[Optional[str], Optional[str]] = Field(alias="connectsRooms")

    model_config = {"populate_by_name": True}


class AdjacencyEntry(BaseModel):
    room_a_id: str = Field(alias="roomAId")
    room_b_id: str = Field(alias="roomBId")
    shared_wall_length_m: float = Field(alias="sharedWallLengthM", ge=0)
    has_direct_door: bool = Field(alias="hasDirectDoor")

    model_config = {"populate_by_name": True}


class SpatialGraphMetadata(BaseModel):
    parser_version: str = Field(alias="parserVersion")
    file_format: Literal["dxf", "dxf_dwg", "ifc", "pdf", "image"] = Field(alias="fileFormat")
    unit_system: Literal["metric", "imperial"] = Field(alias="unitSystem")
    coordinate_system: Optional[str] = Field(None, alias="coordinateSystem")
    warnings: list[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class SpatialGraph(BaseModel):
    """
    The complete spatial graph output from the parser.
    Matches the TypeScript SpatialGraph interface in @spatiumai/shared exactly.
    """
    version: Literal["1.0"] = "1.0"
    source_file: str = Field(alias="sourceFile")
    parse_timestamp: str = Field(alias="parseTimestamp")
    total_area_sqm: float = Field(alias="totalAreaSqm", ge=0)
    floor_count: int = Field(alias="floorCount", ge=1)
    rooms: list[Room] = Field(min_length=1)
    walls: list[Wall] = Field(default_factory=list)
    openings: list[Opening] = Field(default_factory=list)
    adjacencies: list[AdjacencyEntry] = Field(default_factory=list)
    metadata: SpatialGraphMetadata

    model_config = {
        "populate_by_name": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }
