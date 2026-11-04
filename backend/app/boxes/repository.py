# Data access layer: every database query for boxes lives here, called only by the service.
import uuid

from sqlmodel import Session, func, select

from app.boxes.models import Box


# The only class that knows where boxes are stored; the service calls it and never sees SQL.
class BoxRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    # Ordered by box number, the way the boxes are labelled in real life.
    def list(self, offset: int, limit: int) -> list[Box]:
        statement = select(Box).order_by(Box.number).offset(offset).limit(limit)
        return list(self.session.exec(statement).all())

    def count(self) -> int:
        return self.session.exec(select(func.count()).select_from(Box)).one()

    def get(self, box_id: uuid.UUID) -> Box | None:
        return self.session.get(Box, box_id)

    def get_by_number(self, number: int) -> Box | None:
        return self.session.exec(select(Box).where(Box.number == number)).first()

    def create(self, box: Box) -> Box:
        return self._save(box)

    def update(self, box: Box, patch: dict) -> Box:
        box.sqlmodel_update(patch)
        return self._save(box)

    def delete(self, box: Box) -> None:
        self.session.delete(box)
        self.session.commit()

    def _save(self, box: Box) -> Box:
        self.session.add(box)
        self.session.commit()
        self.session.refresh(box)
        return box
