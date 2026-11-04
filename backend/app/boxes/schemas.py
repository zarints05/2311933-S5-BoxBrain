# Request and response shapes; FastAPI validates input against these before any box code runs.
import uuid
from datetime import date, datetime, timezone
from typing import Annotated

from pydantic import StringConstraints, field_validator
from sqlmodel import Field, SQLModel

# Spaces are trimmed before the length check, so "   " is rejected.
Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Location = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Contents = Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)]
BoxNumber = Annotated[int, Field(ge=1, le=99999)]


class BoxBase(SQLModel):
    number: BoxNumber
    label: Label
    location: Location
    contents: Contents = ""
    notes: str | None = Field(default=None, max_length=1000)
    last_opened_on: date


class BoxCreate(BoxBase):
    pass


class BoxUpdate(SQLModel):
    number: BoxNumber | None = None
    label: Label | None = None
    location: Location | None = None
    contents: Contents | None = None
    notes: str | None = Field(default=None, max_length=1000)
    last_opened_on: date | None = None

    # notes may be cleared with null; the other fields may not.
    @field_validator("number", "label", "location", "contents", "last_opened_on")
    @classmethod
    def not_null(cls, value: object) -> object:
        if value is None:
            raise ValueError("cannot be null")
        return value


class BoxRead(BoxBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    # SQLite returns naive datetimes; they are stored as UTC.
    @field_validator("created_at", "updated_at")
    @classmethod
    def as_utc(cls, value: datetime) -> datetime:
        return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


# One page of the list; total counts all boxes, not just this page.
class BoxPage(SQLModel):
    items: list[BoxRead]
    total: int
    offset: int
    limit: int
