"""Pytest configuration for FastAPI async tests."""

from __future__ import annotations

import asyncio
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base, get_db
from app.main import app

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    """Create tables before each test, drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Override the get_db dependency for testing."""
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """FastAPI test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Direct database session for test setup."""
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient, db_session: AsyncSession) -> dict:
    """Register a test user and return authorization headers."""
    from app.core.security import get_password_hash
    from app.models import User

    # Create user directly
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("Test1234"),
        first_name="Test",
        last_name="User",
        is_verified=True,
    )
    db_session.add(user)
    await db_session.flush()
    await db_session.commit()

    # Login to get token
    response = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "Test1234",
    })
    token = response.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}
