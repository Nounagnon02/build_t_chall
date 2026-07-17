"""Authentication endpoints — register, login, refresh token."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import (
    create_token_pair,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models import User
from app.schemas import (
    TokenRefresh,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.api.v1.deps import get_current_user

router = APIRouter()
security = HTTPBearer(auto_error=False)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    tokens = create_token_pair(user.id, user.email, user.role)
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate and return JWT tokens."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    user.last_login = datetime.now(timezone.utc)
    await db.flush()

    tokens = create_token_pair(user.id, user.email, user.role)
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: TokenRefresh):
    """Refresh an expired access token using a valid refresh token."""
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        user_id = payload.get("sub")
        email = payload.get("email", "")
        role = payload.get("role", "client")
        tokens = create_token_pair(user_id, email, role)
        return tokens
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
