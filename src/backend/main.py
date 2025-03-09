
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import List, Dict, Any
from pydantic import BaseModel, Field
import asyncio
import uuid

app = FastAPI(title="Chat App API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Message model for validation
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender: str
    content: str
    timestamp: int
    
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "sender": "user123",
                "content": "Hello, world!",
                "timestamp": 1625097600000,
            }
        }

# Connected WebSocket clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_count: int = 0

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_count += 1
        print(f"New connection established. Total connections: {self.connection_count}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.connection_count -= 1
            print(f"Connection closed. Total connections: {self.connection_count}")

    async def broadcast(self, message: Dict[str, Any]):
        if not self.active_connections:
            print("No active connections to broadcast to")
            return
            
        # Convert to JSON string for sending
        message_json = json.dumps(message)
        
        # Track failed connections for cleanup
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception as e:
                print(f"Failed to send message: {str(e)}")
                disconnected.append(connection)
                
        # Clean up any disconnected clients
        for conn in disconnected:
            self.disconnect(conn)


# Initialize connection manager
manager = ConnectionManager()

@app.get("/")
async def get_root():
    """Health check endpoint"""
    return {"status": "online", "connections": manager.connection_count}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for messages from this client
            data = await websocket.receive_text()
            
            try:
                # Parse the received JSON
                message_data = json.loads(data)
                
                # Validate with pydantic model (this will raise an error if invalid)
                message = Message(**message_data)
                
                # Broadcast the message to all clients including the sender
                await manager.broadcast(message_data)
                
            except json.JSONDecodeError:
                print("Received invalid JSON")
                await websocket.send_text(
                    json.dumps({
                        "error": "Invalid message format. Expected valid JSON."
                    })
                )
            except Exception as e:
                print(f"Error processing message: {str(e)}")
                await websocket.send_text(
                    json.dumps({
                        "error": f"Error processing message: {str(e)}"
                    })
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
