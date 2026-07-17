"""Logging middleware for request/response tracking."""

from __future__ import annotations

import logging
import time
import uuid

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("ever_after_events.api")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Logs request duration, method, path, and status code."""

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id

        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000

        logger.info(
            "[%s] %s %s → %s (%dms)",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )

        response.headers["X-Request-ID"] = request_id
        return response
