"""
Talking to the database.

Every query about boxes is written in this one class.
The service asks for boxes; it never writes SQL itself.
"""

import uuid

from sqlmodel import Session, func, select

from app.boxes.models import Box


class BoxRepository:
    def __init__(self, session: Session):
        self.db = session

    def one_page(self, offset: int, limit: int) -> list[Box]:
        # Sorted by box number, like the boxes on a shelf
        query = select(Box).order_by(Box.number).offset(offset).limit(limit)
        return list(self.db.exec(query))

    def count_all(self) -> int:
        query = select(func.count()).select_from(Box)
        return self.db.exec(query).one()

    def find(self, box_id: uuid.UUID) -> Box | None:
        return self.db.get(Box, box_id)

    def find_by_number(self, number: int) -> Box | None:
        query = select(Box).where(Box.number == number)
        return self.db.exec(query).first()

    def save(self, box: Box) -> Box:
        """Insert a new box or store the changes of an existing one."""
        self.db.add(box)
        self.db.commit()
        self.db.refresh(box)  # reload it so we get the saved values back
        return box

    def remove(self, box: Box) -> None:
        self.db.delete(box)
        self.db.commit()
