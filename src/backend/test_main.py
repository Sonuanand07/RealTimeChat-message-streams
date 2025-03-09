
import pytest
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
import json
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

from main import app, manager

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "online"
    assert "connections" in data

@pytest.mark.asyncio
async def test_connection_manager_connect():
    # Create a mock WebSocket
    mock_websocket = AsyncMock(spec=WebSocket)
    
    # Test the connect method
    await manager.connect(mock_websocket)
    
    # Verify the WebSocket was accepted
    mock_websocket.accept.assert_called_once()
    
    # Verify the connection was added
    assert mock_websocket in manager.active_connections
    
    # Clean up by removing the mock connection
    manager.disconnect(mock_websocket)

@pytest.mark.asyncio
async def test_connection_manager_disconnect():
    # Create a mock WebSocket
    mock_websocket = AsyncMock(spec=WebSocket)
    
    # Add the WebSocket to active connections
    manager.active_connections.append(mock_websocket)
    initial_count = len(manager.active_connections)
    
    # Test the disconnect method
    manager.disconnect(mock_websocket)
    
    # Verify the connection was removed
    assert mock_websocket not in manager.active_connections
    assert len(manager.active_connections) == initial_count - 1

@pytest.mark.asyncio
async def test_connection_manager_broadcast():
    # Create two mock WebSockets
    mock_websocket1 = AsyncMock(spec=WebSocket)
    mock_websocket2 = AsyncMock(spec=WebSocket)
    
    # Add the WebSockets to active connections
    manager.active_connections = [mock_websocket1, mock_websocket2]
    
    # Test message for broadcasting
    test_message = {
        "id": "test-id",
        "sender": "test-user",
        "content": "Hello, test!",
        "timestamp": 1625097600000
    }
    
    # Test the broadcast method
    await manager.broadcast(test_message)
    
    # Expected JSON string that should be sent
    expected_json = json.dumps(test_message)
    
    # Verify each WebSocket received the message
    mock_websocket1.send_text.assert_called_once_with(expected_json)
    mock_websocket2.send_text.assert_called_once_with(expected_json)
    
    # Clean up
    manager.active_connections = []
