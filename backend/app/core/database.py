"""Database engine, session factory, and base model."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator, AsyncIterator

from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

if settings.is_production and "sqlite" in settings.DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL must be set to a PostgreSQL URL in production. "
        "Set it in the Render dashboard (Environment → DATABASE_URL)."
    )

# Convention for naming constraints
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}
metadata = MetaData(naming_convention=convention)


class Base(DeclarativeBase):
    metadata = metadata


# --- Async engine (used by FastAPI) ---

engine_kwargs = {"echo": settings.DEBUG, "pool_pre_ping": True}
if "sqlite" not in settings.db_connection_string:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

# asyncpg : désactiver le cache de prepared statements car Supabase (en mode
# pooler PgBouncer / transaction) ne les supporte pas. Sans danger en direct.
async_connect_args: dict = {}
if "postgresql+asyncpg" in settings.db_connection_string:
    async_connect_args["statement_cache_size"] = 0
    async_connect_args["ssl"] = "require"

async_engine = create_async_engine(
    settings.db_connection_string,
    connect_args=async_connect_args,
    **engine_kwargs,
)

AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context() -> AsyncIterator[AsyncSession]:
    """Context manager version for background tasks."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# --- Sync engine (used by Alembic scripts) ---

sync_engine_kwargs = {"echo": settings.DEBUG, "pool_pre_ping": True}
if "sqlite" not in settings.db_connection_string:
    sync_engine_kwargs["pool_size"] = 10
    sync_engine_kwargs["max_overflow"] = 20

sync_engine = create_engine(
    settings.db_connection_string.replace("+aiosqlite", "").replace("+asyncpg", ""),
    **sync_engine_kwargs,
)


async def init_db():
    """Create all tables (useful for development without Alembic)."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose of the engine."""
    await async_engine.dispose()
