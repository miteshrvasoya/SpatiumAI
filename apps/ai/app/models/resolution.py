from __future__ import annotations
from typing import Any, Optional
from pydantic import BaseModel


class ResolutionOption(BaseModel):
    index: int
    title: str
    description: str
    spatial_change: str = ""
    affected_element_ids: list[str] = []
    estimated_impact: dict[str, Any] = {}
    confidence: str = "low"
    ayush_rating: Optional[str] = None

    model_config = {"populate_by_name": True}

    # Allow camelCase aliases for JSON compat with TypeScript
    class Config:
        alias_generator = None


class ResolutionSet(BaseModel):
    evaluationId: str
    constraintId: str
    constraintCode: str
    conflictDescription: str
    options: list[ResolutionOption]
    generatedAt: str
    modelUsed: str
    tokensUsed: Optional[int] = None
    acceptedOptionIndex: Optional[int] = None
    acceptedAt: Optional[str] = None
    acceptedBy: Optional[str] = None


class ResolveRequest(BaseModel):
    evaluationId: str
    constraintId: str
    constraint: dict[str, Any]
    conflict: dict[str, Any]
    spatialContext: dict[str, Any]


class ResolveResponse(BaseModel):
    resolutionSet: ResolutionSet
    processingMs: int
