# ─────────────────────────────────────────────────────────────────────────────
# spatiumai-parser Dockerfile
# Python 3.12-slim — includes ezdxf + ifcopenshell
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

# Install OS-level deps needed by ezdxf and ifcopenshell
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgles2 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 8001

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import httpx; httpx.get('http://localhost:8001/health').raise_for_status()"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
