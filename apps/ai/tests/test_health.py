"""Health check and resolve endpoint tests for spatiumai-ai."""
from httpx import AsyncClient
import pytest
from app.main import app


@pytest.mark.asyncio
async def test_health_returns_ok():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["service"] == "spatiumai-ai"


@pytest.mark.asyncio
async def test_resolve_returns_stub_options():
    """Verify resolve endpoint returns structured options even in stub mode."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/resolve/", json={
            "evaluationId": "00000000-0000-0000-0000-000000000001",
            "constraintId": "00000000-0000-0000-0000-000000000002",
            "constraint": {
                "code": "NBC-3-4.2.1",
                "domain": "nbc",
                "severity": "major",
                "plainDescription": "Bedroom area below NBC minimum",
                "resolutionHints": ["Extend east wall by 500mm"],
            },
            "conflict": {
                "affectedElementIds": ["room-1"],
                "measuredValue": 8.2,
                "thresholdValue": 9.5,
                "unit": "sqm",
            },
            "spatialContext": {
                "roomCount": 3,
                "totalAreaSqm": 75.0,
                "affectedRooms": [{"id": "room-1", "spaceType": "bedroom", "areaSqm": 8.2, "adjacentTo": []}],
            },
        })
    assert response.status_code == 200
    data = response.json()
    assert len(data["resolutionSet"]["options"]) >= 1
    assert data["processingMs"] >= 0
