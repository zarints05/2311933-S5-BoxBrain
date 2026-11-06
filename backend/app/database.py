"""
Database connection.

`engine` is the connection to the database.
`get_db()` gives each request its own session (a short "conversation" with the database)
and closes it automatically when the request is finished.
"""

from sqlalchemy.pool import NullPool
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_database_url

DATABASE_URL = get_database_url()

if DATABASE_URL.startswith("sqlite"):
    # SQLite: allow FastAPI's worker threads to share the connection
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Supabase (PostgreSQL) through its connection pooler on port 6543:
    # - NullPool: don't keep our own pool, Supabase already does the pooling
    # - prepare_threshold=None: the pooler does not support prepared statements
    engine = create_engine(DATABASE_URL, poolclass=NullPool, connect_args={"prepare_threshold": None})


def create_tables() -> None:
    """Create every table that does not exist yet. Existing tables and data are left alone."""
    SQLModel.metadata.create_all(engine)


def get_db():
    """Open a session for one request, then close it."""
    with Session(engine) as db:
        yield db
