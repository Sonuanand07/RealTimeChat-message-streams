
# Chat App Backend

This directory should contain your Python FastAPI backend code. The frontend in this project is configured to connect to a WebSocket server running at `ws://localhost:8000/ws`.

## Getting Started

1. Create a Python virtual environment
2. Install the requirements from requirements.txt
3. Run the FastAPI server

## Sample Backend Implementation

You should implement a backend using FastAPI with WebSockets support. Here's a simplified example of what you might implement:

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import List

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connected WebSocket clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the message to all connected clients
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

Save this code in a file named `main.py` and run it with:

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Note: This is a simplified example. For a production application, you would want to add error handling, authentication, and other features.
