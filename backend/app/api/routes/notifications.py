from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from ...core.websocket import manager
from ..deps import get_current_user
from ...db.database import get_database

router = APIRouter(tags=["websockets"])

@router.websocket("/ws/notifications/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db=Depends(get_database)):
    # Simple token validation for WS (ideally use a helper that doesn't rely on oauth2_scheme headers)
    from jose import jwt
    from ...core.config import settings
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email = payload.get("sub")
        user = await db.users.find_one({"email": email})
        if not user:
            await websocket.close(code=1008)
            return
        user_id = str(user["_id"])
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming client messages if any
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
