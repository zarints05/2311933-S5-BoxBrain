# The `box` database table; only the repository reads and writes it.
import uuid
from datetime import date, datetime, timezone

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# table=True maps this class to the `box` table. One row is one physical container.
class Box(SQLModel, table=True):
    # UUIDs are generated here, so ids are not guessable and don't depend on the database.
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    # The number written on the physical box, e.g. 17 for "BOX 17". Unique.
    number: int = Field(unique=True, index=True)
    label: str = Field(max_length=200)
    # Where the box is kept, e.g. "Bedroom, cupboard, top shelf".
    location: str = Field(max_length=200)
    # What is inside, one item per line.
    contents: str = Field(default="", max_length=2000)
    notes: str | None = Field(default=None, max_length=1000)
    # The last day the box was opened; used to find boxes nobody has opened in a long time.
    last_opened_on: date
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
