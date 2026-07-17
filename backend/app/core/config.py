"""Application configuration via Pydantic Settings."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "Ever After Events API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = "change-me-to-a-random-secret-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    BCRYPT_ROUNDS: int = 12

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./ever_after_events.db"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://build-t-chall-tckt.vercel.app"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_CONTACT_PER_MINUTE: int = 5
    RATE_LIMIT_AUTH_PER_MINUTE: int = 10

    # Redis (optional)
    REDIS_URL: Optional[str] = None

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None

    # Email (Resend)
    RESEND_API_KEY: Optional[str] = None

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # Sentry
    SENTRY_DSN: Optional[str] = None

    # File uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def normalize_cors_origins(cls, value):
        if value is None:
            return ""
        if isinstance(value, str):
            return ",".join(part.strip() for part in value.split(",") if part.strip())
        return value

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def db_connection_string(self) -> str:
        """Return the proper connection string based on environment."""
        return self.DATABASE_URL


# Resolve .env file location relative to the project root
_env_path = Path(__file__).resolve().parents[2] / ".env"
if _env_path.exists():
    settings = Settings(_env_file=str(_env_path))
else:
    settings = Settings()

# Production safety defaults: avoid using weak defaults in deployed environments.
if settings.is_production and settings.SECRET_KEY == "change-me-to-a-random-secret-in-production":
    settings.SECRET_KEY = "replace-with-a-real-production-secret"
