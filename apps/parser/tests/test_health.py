"""Health check test for spatiumai-parser."""
from httpx import AsyncClient
import pytest
from app.main import app


@pytest.mark.asyncio
async def test_health_returns_ok():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "spatiumai-parser"


@pytest.mark.asyncio
async def test_parse_returns_spatial_graph_stub():
    """Verify parse endpoint returns a valid stub even without S3/ezdxf."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/parse/", json={
            "file_key": "test/floor-plan.dxf",
            "file_format": "dxf",
        })
    assert response.status_code == 200
    data = response.json()
    assert data["spatial_graph"]["version"] == "1.0"
    assert len(data["spatial_graph"]["rooms"]) >= 1
    assert data["processing_ms"] >= 0
