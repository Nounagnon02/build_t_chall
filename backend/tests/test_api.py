"""Basic API tests for the Ever After Events backend."""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test the health check endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "version" in data


@pytest.mark.asyncio
async def test_list_services():
    """Test the services listing endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/services")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_budget_estimate():
    """Test the budget estimator endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/budget/estimate",
            params={"guest_count": 150, "region": "provence", "service_type": "coordination_complete"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_estimated" in data
        assert "breakdown" in data
        assert data["guest_count"] == 150


@pytest.mark.asyncio
async def test_list_faq():
    """Test the FAQ listing endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/faq")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_gallery_pagination():
    """Test gallery with pagination."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/gallery?page=1&page_size=5")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data


@pytest.mark.asyncio
async def test_contact_submission():
    """Test contact form submission."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/contact", json={
            "first_name": "Test",
            "email": "test@example.com",
            "phone": "0612345678",
            "message": "Test message for contact form",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True


@pytest.mark.asyncio
async def test_user_registration():
    """Test user registration."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/register", json={
            "email": "newuser@example.com",
            "password": "SecurePass123",
            "first_name": "New",
            "last_name": "User",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    """Test login with wrong password."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "WrongPass123",
        })
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_partners():
    """Test partners listing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/partners")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_newsletter_subscribe():
    """Test newsletter subscription."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/newsletter/subscribe", json={
            "email": "newsletter@test.com",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True


@pytest.mark.asyncio
async def test_404_not_found():
    """Test that unknown routes return 404 in API."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/nonexistent-route")
        assert response.status_code in (404,)
