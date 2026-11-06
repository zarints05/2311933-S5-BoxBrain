"""
What the API accepts and what it sends back.

  NewBox     -> body of POST   (every field is needed)
  BoxChanges -> body of PATCH  (send only the fields you want to change)
  BoxOut     -> one box in a response
  BoxList    -> one page of boxes in a response
"""

import uuid
from datetime import date, datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator


def strip_spaces(value):
    """'  Kitchen  ' -> 'Kitchen'. Anything that is not text is left alone."""
    if isinstance(value, str):
        return value.strip()
    return value


class NewBox(BaseModel):
    number: int = Field(ge=1, le=99999)
    label: str = Field(min_length=1, max_length=200)
    location: str = Field(min_length=1, max_length=200)
    contents: str = Field(default="", max_length=2000)
    notes: str | None = Field(default=None, max_length=1000)
    last_opened_on: date

    # Runs before the length checks, so a label of only spaces counts as empty
    @field_validator("label", "location", "contents", mode="before")
    @classmethod
    def remove_extra_spaces(cls, value):
        return strip_spaces(value)


class BoxChanges(BaseModel):
    number: int | None = Field(default=None, ge=1, le=99999)
    label: str | None = Field(default=None, min_length=1, max_length=200)
    location: str | None = Field(default=None, min_length=1, max_length=200)
    contents: str | None = Field(default=None, max_length=2000)
    notes: str | None = Field(default=None, max_length=1000)
    last_opened_on: date | None = None

    @field_validator("label", "location", "contents", mode="before")
    @classmethod
    def remove_extra_spaces(cls, value):
        return strip_spaces(value)

    # Notes can be emptied with null, but a box always needs these fields.
    # (This only runs for fields that were actually sent.)
    @field_validator("number", "label", "location", "contents", "last_opened_on")
    @classmethod
    def no_null_here(cls, value):
        if value is None:
            raise ValueError("this field can't be empty")
        return value


class BoxOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # lets us build it straight from a Box row

    id: uuid.UUID
    number: int
    label: str
    location: str
    contents: str
    notes: str | None
    last_opened_on: date
    created_at: datetime
    updated_at: datetime

    # SQLite forgets the time zone when it saves a datetime. We always save UTC, so put it back.
    @field_validator("created_at", "updated_at")
    @classmethod
    def mark_as_utc(cls, value: datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class BoxList(BaseModel):
    items: list[BoxOut]
    total: int   # how many boxes exist in total, not only on this page
    offset: int
    limit: int
