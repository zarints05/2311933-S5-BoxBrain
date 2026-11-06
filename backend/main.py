"""
Start of the BoxBrain backend.

Vercel (and `fastapi dev`) look for the `app` object in this file.
"""

from fastapi import FastAPI

from app.boxes.router import router as boxes_router
from app.config import BACKEND_DIR
from app.database import build_tables

app = FastAPI(
    title="BoxBrain API",
    description="Keeps track of what is inside each box and where the box is.",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)

# Make the table when the app starts (works on Vercel too, where there is no long-running server)
build_tables()

app.include_router(boxes_router)


@app.get("/api/health")
def health():
    """A quick way to check that the backend is alive."""
    return {"status": "ok"}


# After `npm run build` the React app is in frontend/dist and the backend serves it too.
# Any unknown path (like /boxes/<id>) gets index.html so React Router can show the right page.
REACT_BUILD = BACKEND_DIR.parent / "frontend" / "dist"
if REACT_BUILD.is_dir():
    app.frontend("/", directory=REACT_BUILD, fallback="index.html")
