"""
The `box` table.

Each row is one real cardboard box in the house.
"""

import uuid
from datetime import date, datetime, timezone

from sqlmodel import Field, SQLModel


def now_in_utc():
    return datetime.now(timezone.utc)


class Box(SQLModel, table=True):
    __tablename__ = "box"

    # A random id, made by Python when the box is created
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # The number I write on the box with a marker ("BOX 17"). Two boxes can't share a number.
    number: int = Field(unique=True, index=True)

    label: str = Field(max_length=200)          # a short name, e.g. "Winter clothes"
    location: str = Field(max_length=200)       # where it is kept, e.g. "Store room, top shelf"
    contents: str = Field(default="", max_length=2000)  # what is inside, one thing per line
    notes: str | None = Field(default=None, max_length=1000)

    # The last day somebody opened the box
    last_opened_on: date

    created_at: datetime = Field(default_factory=now_in_utc)
    updated_at: datetime = Field(default_factory=now_in_utc)
