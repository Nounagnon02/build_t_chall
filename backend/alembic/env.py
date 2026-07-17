"""Alembic migrations environment configuration."""

from __future__ import annotations

import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, pool

from app.core.database import Base
from app.models import *  # noqa: F401, F403 — ensure all models are loaded

# Alembic Config object
config = context.config

# Resolve the DB URL. In production we read DATABASE_URL from the environment;
# we cannot use config.set_main_option() because Alembic's underlying ConfigParser
# performs %-interpolation and would crash on passwords containing '%'.
# Alembic uses a synchronous engine: convert async schemes (asyncpg/aiosqlite)
# back to their sync equivalents.

def _resolve_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url.replace("+asyncpg", "").replace("+aiosqlite", "")
    return config.get_main_option("sqlalchemy.url")


# Set up Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# MetaData for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (emit SQL without executing)."""
    context.configure(
        url=_resolve_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (connect to DB and execute)."""
    connectable = create_engine(_resolve_url(), poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
