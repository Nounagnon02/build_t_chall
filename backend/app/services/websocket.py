"""WebSocket manager for real-time messaging."""

from __future__ import annotations

from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections grouped by wedding project."""

    def __init__(self):
        self._connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, wedding_id: str, websocket: WebSocket):
        await websocket.accept()
        if wedding_id not in self._connections:
            self._connections[wedding_id] = set()
        self._connections[wedding_id].add(websocket)

    def disconnect(self, wedding_id: str, websocket: WebSocket):
        if wedding_id in self._connections:
            self._connections[wedding_id].discard(websocket)
            if not self._connections[wedding_id]:
                del self._connections[wedding_id]

    async def broadcast(self, wedding_id: str, message: dict):
        """Send a message to all connected clients for a wedding project."""
        if wedding_id not in self._connections:
            return
        stale = set()
        for ws in self._connections[wedding_id]:
            try:
                await ws.send_json(message)
            except Exception:
                stale.add(ws)
        for ws in stale:
            self._connections[wedding_id].discard(ws)
        if not self._connections.get(wedding_id):
            del self._connections[wedding_id]


manager = ConnectionManager()
