"""
The rules of BoxBrain.

  1. Two boxes can't have the same number.
  2. "Last opened" can't be a day in the future.
  3. Every change updates `updated_at`.

If a rule is broken we answer 409 (Conflict) with a short message the page can show.
"""

import uuid
from datetime import date, timedelta

from fastapi import HTTPException

from app.boxes.models import Box, now_in_utc
from app.boxes.repository import BoxRepository
from app.boxes.schemas import BoxChanges, NewBox


class BoxService:
    def __init__(self, repository: BoxRepository):
        self.repository = repository

    def list_boxes(self, offset: int, limit: int) -> dict:
        return {
            "items": self.repository.one_page(offset, limit),
            "total": self.repository.count_all(),
            "offset": offset,
            "limit": limit,
        }

    def find_box(self, box_id: uuid.UUID) -> Box | None:
        return self.repository.find(box_id)

    def add_box(self, data: NewBox) -> Box:
        self.number_must_be_free(data.number)
        self.date_must_not_be_future(data.last_opened_on)

        box = Box(**data.model_dump())
        return self.repository.save(box)

    def change_box(self, box: Box, data: BoxChanges) -> Box:
        # Only the fields the page actually sent
        changes = data.model_dump(exclude_unset=True)
        if not changes:
            return box  # nothing to do

        if "number" in changes and changes["number"] != box.number:
            self.number_must_be_free(changes["number"])
        if "last_opened_on" in changes:
            self.date_must_not_be_future(changes["last_opened_on"])

        for field, new_value in changes.items():
            setattr(box, field, new_value)
        box.updated_at = now_in_utc()
        return self.repository.save(box)

    def delete_box(self, box: Box) -> None:
        self.repository.remove(box)

    # ---- the rules ----

    def number_must_be_free(self, number: int):
        if self.repository.find_by_number(number):
            raise HTTPException(status_code=409, detail=f"Box number {number} is already used")

    def date_must_not_be_future(self, day: date):
        # The server clock is UTC but we are in Dhaka (UTC+6), so "today" can be one day
        # ahead for us. Allowing one extra day stops that from being rejected.
        latest_allowed = date.today() + timedelta(days=1)
        if day > latest_allowed:
            raise HTTPException(status_code=409, detail="The last opened date cannot be in the future")
