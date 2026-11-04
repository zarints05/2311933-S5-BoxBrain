# Per-request wiring: builds session -> repository -> service, and loads the box for {box_id} routes.
import uuid
from typing import Annotated

from fastapi import Depends, HTTPException

from app.boxes.models import Box
from app.boxes.repository import BoxRepository
from app.boxes.service import BoxService
from app.database import SessionDep


# Builds the service for this request: session -> repository -> service.
def get_box_service(session: SessionDep) -> BoxService:
    return BoxService(BoxRepository(session))


ServiceDep = Annotated[BoxService, Depends(get_box_service)]


# Resolves {box_id} from the path into a Box, or answers 404; routes just declare BoxDep.
def valid_box(box_id: uuid.UUID, service: ServiceDep) -> Box:
    box = service.get_box(box_id)
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    return box


BoxDep = Annotated[Box, Depends(valid_box)]
