# Business rules for boxes (unique number, date check, updated_at); called by the router, stores data via the repository.
import uuid
from datetime import date, timedelta

from app.boxes.models import Box, utc_now
from app.boxes.repository import BoxRepository
from app.boxes.schemas import BoxCreate, BoxPage, BoxUpdate


class BoxRuleError(Exception):
    """A business rule was broken; main.py turns it into a 409 response."""


# Business rules only: no HTTP and no database calls, everything stored goes through the repository.
class BoxService:
    def __init__(self, repo: BoxRepository) -> None:
        self.repo = repo

    def list_boxes(self, offset: int, limit: int) -> BoxPage:
        return BoxPage(items=self.repo.list(offset, limit), total=self.repo.count(), offset=offset, limit=limit)

    def get_box(self, box_id: uuid.UUID) -> Box | None:
        return self.repo.get(box_id)

    def create_box(self, data: BoxCreate) -> Box:
        self._check_number_free(data.number)
        self._check_opened_date(data.last_opened_on)
        return self.repo.create(Box.model_validate(data))

    def update_box(self, box: Box, data: BoxUpdate) -> Box:
        changes = data.model_dump(exclude_unset=True)
        if not changes:
            return box
        if "number" in changes and changes["number"] != box.number:
            self._check_number_free(changes["number"])
        if "last_opened_on" in changes:
            self._check_opened_date(changes["last_opened_on"])
        changes["updated_at"] = utc_now()
        return self.repo.update(box, changes)

    def delete_box(self, box: Box) -> None:
        self.repo.delete(box)

    def _check_number_free(self, number: int) -> None:
        if self.repo.get_by_number(number) is not None:
            raise BoxRuleError(f"Box number {number} is already used")

    def _check_opened_date(self, opened_on: date) -> None:
        # The server runs in UTC; one day of slack lets users ahead of UTC (Dhaka is UTC+6) pick their today.
        if opened_on > date.today() + timedelta(days=1):
            raise BoxRuleError("The last opened date cannot be in the future")
