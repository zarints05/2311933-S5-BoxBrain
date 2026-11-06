"""
BoxBrain settings.

There is really only one setting: which database to talk to.
  * Online (Vercel): Supabase gives us POSTGRES_URL, or I set DATABASE_URL myself.
  * On my laptop: nothing is set, so a small SQLite file called boxbrain.db is used.
"""

import os
from pathlib import Path

# backend/app/config.py -> going up two folders gives the "backend" folder
BACKEND_DIR = Path(__file__).resolve().parent.parent

# Supabase adds these to the end of its URL, but the psycopg driver does not know them
UNKNOWN_TO_PSYCOPG = {"pgbouncer", "supa"}


def tidy_postgres_url(url: str) -> str:
    """Make a Supabase URL usable by SQLAlchemy + psycopg."""
    # 1. Tell SQLAlchemy to use the psycopg driver: "postgres://..." -> "postgresql+psycopg://..."
    scheme, rest = url.split("://", 1)
    url = "postgresql+psycopg://" + rest

    # 2. Throw away the options psycopg would complain about, keep the rest
    address, _, options = url.partition("?")
    good_options = []
    for option in options.split("&"):
        name = option.split("=")[0]
        if option and name not in UNKNOWN_TO_PSYCOPG:
            good_options.append(option)

    if good_options:
        return address + "?" + "&".join(good_options)
    return address


def pick_database_url() -> str:
    url = os.environ.get("DATABASE_URL") or os.environ.get("POSTGRES_URL")

    if url and url.startswith("postgres"):
        return tidy_postgres_url(url)
    if url:
        return url  # any other URL (for example sqlite:///...) is used as it is

    # Nothing set: use SQLite. Vercel only lets us write inside /tmp.
    on_vercel = bool(os.environ.get("VERCEL"))
    folder = Path("/tmp") if on_vercel else BACKEND_DIR
    return "sqlite:///" + (folder / "boxbrain.db").as_posix()


DATABASE_URL = pick_database_url()
