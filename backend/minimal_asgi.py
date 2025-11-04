from asyncio import run
from typing import Callable, Dict, Any
import traceback
import json

async def app(scope: Dict[str, Any], receive: Callable, send: Callable) -> None:
    """Minimal ASGI application without FastAPI dependencies."""
    if scope["type"] == "lifespan":
        while True:
            message = await receive()
            if message["type"] == "lifespan.startup":
                await send({"type": "lifespan.startup.complete"})
            elif message["type"] == "lifespan.shutdown":
                await send({"type": "lifespan.shutdown.complete"})
                return
    elif scope["type"] == "http":
        await receive()  # Get request body (ignore it)
        response = {"message": "Hello from minimal ASGI server"}
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": [
                [b"content-type", b"application/json"],
            ],
        })
        await send({
            "type": "http.response.body",
            "body": json.dumps(response).encode(),
        })

if __name__ == "__main__":
    import uvicorn
    
    config = uvicorn.Config(
        app=app,
        host="127.0.0.1",
        port=9000,
        log_level="debug"
    )
    server = uvicorn.Server(config)
    try:
        print("\nStarting minimal ASGI server on http://127.0.0.1:9000")
        run(server.serve())
    except Exception as e:
        print("\nServer error:", e)
        print("\nStack trace:")
        traceback.print_exc()