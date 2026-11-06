"""
The URLs of the BoxBrain API. All of them start with /api/v1/boxes.

  GET    /api/v1/boxes           list boxes (a page at a time)
  POST   /api/v1/boxes           add a box
  GET    /api/v1/boxes/{box_id}  one box
  PATCH  /api/v1/boxes/{box_id}  change some fields of a box
  DELETE /api/v1/boxes/{box_id}  delete a box
"""

from fastapi import APIRouter, Depends, Query

from app.boxes.dependencies import box_or_404, get_service
from app.boxes.models import Box
from app.boxes.schemas import BoxChanges, BoxList, BoxOut, NewBox
from app.boxes.service import BoxService

router = APIRouter(prefix="/api/v1/boxes", tags=["boxes"])


@router.get("", response_model=BoxList)
def list_boxes(
    offset: int = Query(default=0, ge=0),          # how many boxes to skip
    limit: int = Query(default=20, ge=1, le=100),  # how many boxes to send
    service: BoxService = Depends(get_service),
):
    return service.list_boxes(offset, limit)


@router.post("", response_model=BoxOut, status_code=201)
def add_box(data: NewBox, service: BoxService = Depends(get_service)):
    return service.add_box(data)


@router.get("/{box_id}", response_model=BoxOut)
def get_box(box: Box = Depends(box_or_404)):
    return box


@router.patch("/{box_id}", response_model=BoxOut)
def change_box(
    data: BoxChanges,
    box: Box = Depends(box_or_404),
    service: BoxService = Depends(get_service),
):
    return service.change_box(box, data)


# 204 = it worked, and there is nothing to send back
@router.delete("/{box_id}", status_code=204)
def delete_box(box: Box = Depends(box_or_404), service: BoxService = Depends(get_service)):
    service.delete_box(box)
