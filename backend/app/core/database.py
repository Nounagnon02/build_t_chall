"""Database engine, session factory, and base model."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator, AsyncIterator

from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

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

is_postgres = "postgresql+asyncpg" in settings.db_connection_string

# Supabase pooler (PgBouncer transaction mode): NullPool + no prepared statements.
if is_postgres:
    async_engine = create_async_engine(
        settings.db_connection_string,
        poolclass=NullPool,
        connect_args={"statement_cache_size": 0, "prepared_statement_cache_size": 0, "ssl": "require"},
        echo=settings.DEBUG,
    )
else:
    async_engine = create_async_engine(
        settings.db_connection_string,
        echo=settings.DEBUG,
        pool_pre_ping=True,
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


# --- Sync engine (used by Alembic only — created lazily to avoid PgBouncer issues) ---

def get_sync_engine():
    """Create a sync engine on demand (Alembic use only)."""
    _sync_url = settings.db_connection_string.replace("+aiosqlite", "").replace("+asyncpg", "")
    return create_engine(_sync_url, echo=settings.DEBUG, pool_pre_ping=True)


async def init_db():
    """Create all tables via raw asyncpg connection (bypasses PgBouncer prepared stmt issue)."""
    if is_postgres:
        import asyncpg
        url = settings.db_connection_string.replace("postgresql+asyncpg://", "postgresql://")
        conn = await asyncpg.connect(url, statement_cache_size=0, ssl="require")
        try:
            # Import all models to populate metadata
            import app.models  # noqa: F401
            # Generate DDL and execute each statement individually
            from sqlalchemy.schema import CreateTable
            from sqlalchemy import inspect as sa_inspect
            for table in Base.metadata.sorted_tables:
                ddl = str(CreateTable(table).compile(dialect=async_engine.dialect))
                try:
                    await conn.execute(ddl)
                except asyncpg.exceptions.DuplicateTableError:
                    pass
        finally:
            await conn.close()
    else:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose of the engine."""
    await async_engine.dispose()
