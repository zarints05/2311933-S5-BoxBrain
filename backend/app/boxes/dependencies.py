"""
Small helpers FastAPI runs before a route, using Depends(...).

  get_service -> gives the route a BoxService that uses this request's database session
  box_or_404  -> turns the {box_id} in the URL into a Box, or stops with 404
"""

import uuid

from fastapi import Depends, HTTPException
from sqlmodel import Session

from app.boxes.models import Box
from app.boxes.repository import BoxRepository
from app.boxes.service import BoxService
from app.database import open_session


def get_service(session: Session = Depends(open_session)) -> BoxService:
    return BoxService(BoxRepository(session))


def box_or_404(box_id: uuid.UUID, service: BoxService = Depends(get_service)) -> Box:
    box = service.find_box(box_id)
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    return box
