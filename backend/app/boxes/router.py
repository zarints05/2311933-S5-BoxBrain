# HTTP layer for /api/v1/boxes: takes the request, calls the service, returns the response.
from typing import Annotated

from fastapi import APIRouter, Query

from app.boxes.dependencies import BoxDep, ServiceDep
from app.boxes.models import Box
from app.boxes.schemas import BoxCreate, BoxPage, BoxRead, BoxUpdate

router = APIRouter(prefix="/api/v1/boxes", tags=["boxes"])


# Create a box with its number, label, location and contents.
@router.post("", response_model=BoxRead, status_code=201)
def create_box(data: BoxCreate, service: ServiceDep) -> Box:
    return service.create_box(data)


# List boxes ordered by number, with the total so clients know when they reached the end.
@router.get("", response_model=BoxPage)
def list_boxes(
    service: ServiceDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> BoxPage:
    return service.list_boxes(offset, limit)


# Read one box by id, or 404 if it does not exist.
@router.get("/{box_id}", response_model=BoxRead)
def get_box(box: BoxDep) -> Box:
    return box


# Update only the fields that were sent; the others stay unchanged.
@router.patch("/{box_id}", response_model=BoxRead)
def update_box(box: BoxDep, data: BoxUpdate, service: ServiceDep) -> Box:
    return service.update_box(box, data)


# Delete a box; 204 means success with no response body.
@router.delete("/{box_id}", status_code=204)
def delete_box(box: BoxDep, service: ServiceDep) -> None:
    service.delete_box(box)
