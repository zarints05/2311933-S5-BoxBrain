"""
Settings for LostSpot.

The only setting we need is where the database is:
- On Vercel we set DATABASE_URL to the Supabase connection string.
- On my own computer nothing is set, so we fall back to a small SQLite file.
"""

import os
from pathlib import Path

# The "backend" folder (this file is backend/app/config.py, so we go up two levels)
BACKEND_FOLDER = Path(__file__).resolve().parent.parent

# Extra options Supabase sometimes puts at the end of the URL that our driver does not understand
OPTIONS_TO_REMOVE = ("pgbouncer=", "supa=")


def get_database_url() -> str:
    url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")

    # No database configured -> use a local SQLite file.
    # (On Vercel only the /tmp folder can be written to.)
    if not url:
        folder = "/tmp" if os.getenv("VERCEL") else BACKEND_FOLDER
        return f"sqlite:///{folder}/lostspot.db"

    # SQLAlchemy needs to know which driver to use, so "postgresql://" becomes "postgresql+psycopg://"
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]

    # Remove the options psycopg can't read, keep everything else
    if "?" in url:
        address, options = url.split("?", 1)
        kept = [option for option in options.split("&") if not option.startswith(OPTIONS_TO_REMOVE)]
        url = address + ("?" + "&".join(kept) if kept else "")

    return url
