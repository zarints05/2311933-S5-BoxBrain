"""
The connection to the database.

`engine` knows how to reach the database.
`open_session()` hands one session to each request and closes it afterwards.
"""

from sqlalchemy.pool import NullPool
from sqlmodel import Session, SQLModel, create_engine

from app.config import DATABASE_URL

if DATABASE_URL.startswith("sqlite"):
    # FastAPI may use the SQLite file from more than one thread, so we allow that
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Supabase's pooler (port 6543) already pools connections and does not
    # support prepared statements, so we switch both off on our side
    engine = create_engine(
        DATABASE_URL,
        poolclass=NullPool,
        connect_args={"prepare_threshold": None},
    )


def build_tables():
    """Create the `box` table if it is missing. Boxes already saved are not touched."""
    SQLModel.metadata.create_all(engine)


def open_session():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
