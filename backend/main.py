"""
LostSpot backend: the FastAPI app.

Run it locally with:  fastapi dev main.py
Then open http://localhost:8000/api/docs to try the API.
"""

from pathlib import Path

from fastapi import FastAPI

from app.database import create_tables
from app.items.router import router as items_router

app = FastAPI(
    title="LostSpot API",
    description="Post what you lost or found on campus, and where.",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)

# All the /api/items routes
app.include_router(items_router)

# Make sure the tables exist before the first request comes in
create_tables()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

# dist/ only exists after `npm run build`; in dev the Vite server serves the UI.
if FRONTEND_DIR.is_dir():
    app.frontend("/", directory=FRONTEND_DIR, fallback="index.html")
