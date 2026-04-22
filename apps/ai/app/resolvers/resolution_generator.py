# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-ai — Resolution Generator
# Sprint 0: Structured stub with correct interface.
# Sprint 4: Full LangChain + Claude API implementation with:
#   - Structured output (JSON) via Claude's tool_use mode
#   - Hallucination guard: validate all element IDs against spatial graph
#   - Token usage logging for cost tracking
#   - Fallback to plain_description + resolution_hints on LLM failure
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Any

from app.lib.logger import get_logger
from app.config import settings
from app.models.resolution import (
    ResolutionOption,
    ResolutionSet,
    ResolveRequest,
    ResolveResponse,
)

logger = get_logger(__name__)


class ResolutionGenerator:
    """
    Generates 2–3 architecturally-valid resolution options for a constraint violation.

    Sprint 0: Returns structured stubs for pipeline testing.
    Sprint 4: Connects to Claude API via LangChain with:
      - System prompt embedding Ayush's domain expertise
      - resolution_hints from KB as initial direction
      - Structured JSON output mode
      - Element ID validation (hallucination guard)
      - Cost tracking (token usage → estimated ₹ cost)
    """

    def __init__(self) -> None:
        self._llm_available = bool(settings.ANTHROPIC_API_KEY)
        if not self._llm_available:
            logger.warning("ANTHROPIC_API_KEY not set — resolution generator in stub mode")

    async def generate(self, req: ResolveRequest) -> ResolveResponse:
        start_ms = int(datetime.now(timezone.utc).timestamp() * 1000)

        logger.info(
            "Generating resolutions",
            evaluation_id=req.evaluationId,
            constraint_id=req.constraintId,
            constraint_code=req.constraint.get("code"),
        )

        if self._llm_available:
            try:
                resolution_set = await self._generate_with_llm(req)
            except Exception as e:
                logger.error("LLM generation failed — falling back to stub", error=str(e))
                resolution_set = self._fallback_resolution(req)
        else:
            resolution_set = self._stub_resolution(req)

        processing_ms = int(datetime.now(timezone.utc).timestamp() * 1000) - start_ms
        logger.info(
            "Resolutions generated",
            option_count=len(resolution_set.options),
            processing_ms=processing_ms,
        )

        return ResolveResponse(resolutionSet=resolution_set, processingMs=processing_ms)

    async def _generate_with_llm(self, req: ResolveRequest) -> ResolutionSet:
        """
        TODO Sprint 4: Claude API call via LangChain.
        Steps:
        1. Build system prompt with constraint domain context
        2. Inject resolution_hints from KB
        3. Inject anonymized spatial context (no project names)
        4. Use claude tool_use for structured JSON output
        5. Validate all element IDs in output against req.spatialContext
        6. Log token usage for cost tracking
        """
        raise NotImplementedError("LLM generation not implemented — Sprint 4 target")

    def _fallback_resolution(self, req: ResolveRequest) -> ResolutionSet:
        """
        Fallback when LLM fails.
        Shows the constraint description + resolution hints without LLM generation.
        Roadmap requirement: 'Never show an error. Always degrade gracefully.'
        """
        hints = req.constraint.get("resolutionHints", [])
        options = [
            ResolutionOption(
                index=i,
                title=f"Option {i + 1}",
                description=hint,
                spatialChange="Review and apply this change to the affected elements.",
                affectedElementIds=req.conflict.get("affectedElementIds", []),
                estimatedImpact={
                    "complianceScoreDelta": 0,
                    "resolvedConstraints": [req.constraintId],
                    "potentialNewConflicts": [],
                },
                confidence="low",
            )
            for i, hint in enumerate(hints[:3])
        ] or [self._default_option(req)]

        return ResolutionSet(
            evaluationId=req.evaluationId,
            constraintId=req.constraintId,
            constraintCode=req.constraint.get("code", "UNKNOWN"),
            conflictDescription=req.constraint.get("plainDescription", ""),
            options=options,
            generatedAt=datetime.now(timezone.utc).isoformat(),
            modelUsed="fallback",
        )

    def _stub_resolution(self, req: ResolveRequest) -> ResolutionSet:
        """Structured stub for Sprint 0 pipeline testing."""
        return ResolutionSet(
            evaluationId=req.evaluationId,
            constraintId=req.constraintId,
            constraintCode=req.constraint.get("code", "STUB"),
            conflictDescription=req.constraint.get("plainDescription", "Stub conflict"),
            options=[
                ResolutionOption(
                    index=0,
                    title="Stub Resolution Option",
                    description="[Sprint 0 Stub] This resolution will be AI-generated in Sprint 4.",
                    spatialChange="No spatial change — stub only.",
                    affectedElementIds=req.conflict.get("affectedElementIds", []),
                    estimatedImpact={
                        "complianceScoreDelta": 0,
                        "resolvedConstraints": [],
                        "potentialNewConflicts": [],
                    },
                    confidence="low",
                )
            ],
            generatedAt=datetime.now(timezone.utc).isoformat(),
            modelUsed="stub",
        )

    def _default_option(self, req: ResolveRequest) -> ResolutionOption:
        return ResolutionOption(
            index=0,
            title="Review Required",
            description=req.constraint.get("plainDescription", "Review this constraint with your architect."),
            spatialChange="Manual review required.",
            affectedElementIds=[],
            estimatedImpact={"complianceScoreDelta": 0, "resolvedConstraints": [], "potentialNewConflicts": []},
            confidence="low",
        )
