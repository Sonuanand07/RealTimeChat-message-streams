
import { setupWebSocket } from '../utils/websocketUtils';
import { ConnectionStatus, MessageType } from '../utils/types';

// Mock WebSocket
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: { code: number; reason: string }) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  readyState = WebSocket.OPEN;
  
  constructor(public url: string) {}
  
  send = jest.fn();
  close = jest.fn();
}

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

// Save the original WebSocket
const OriginalWebSocket = global.WebSocket;

describe('setupWebSocket', () => {
  let mockSetStatus: jest.Mock;
  let mockAddMessage: jest.Mock;
  let mockWebSocket: MockWebSocket;
  
  beforeEach(() => {
    // Reset mocks
    mockSetStatus = jest.fn();
    mockAddMessage = jest.fn();
    
    // Mock WebSocket
    mockWebSocket = new MockWebSocket('ws://localhost:8000/ws');
    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    
    // Mock clearTimeout
    jest.spyOn(window, 'clearTimeout').mockImplementation(() => {});
    jest.spyOn(window, 'setTimeout').mockImplementation(() => 1);
  });
  
  afterEach(() => {
    // Restore WebSocket
    global.WebSocket = OriginalWebSocket;
  });
  
  it('initializes WebSocket with correct URL', () => {
    setupWebSocket(mockSetStatus, mockAddMessage);
    
    expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:8000/ws');
    expect(mockSetStatus).toHaveBeenCalledWith('connecting');
  });
  
  it('handles successful connection', () => {
    setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Simulate WebSocket connection
    if (mockWebSocket.onopen) mockWebSocket.onopen();
    
    expect(mockSetStatus).toHaveBeenCalledWith('connected');
  });
  
  it('handles incoming messages', () => {
    setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Prepare mock message
    const mockMessage = {
      id: '123',
      sender: 'test-user',
      content: 'Hello, World!',
      timestamp: Date.now()
    };
    
    // Simulate WebSocket message
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) });
    }
    
    expect(mockAddMessage).toHaveBeenCalledWith(expect.objectContaining({
      id: mockMessage.id,
      sender: mockMessage.sender,
      content: mockMessage.content,
      timestamp: mockMessage.timestamp
    }));
  });
  
  it('sends messages correctly', () => {
    const { sendMessage } = setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Send a message
    sendMessage('Hello, World!');
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('Hello, World!'));
  });
  
  it('does not send empty messages', () => {
    const { sendMessage } = setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Send an empty message
    sendMessage('');
    
    expect(mockWebSocket.send).not.toHaveBeenCalled();
  });
  
  it('handles connection closure', () => {
    setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Simulate WebSocket closure
    if (mockWebSocket.onclose) {
      mockWebSocket.onclose({ code: 1000, reason: 'Normal closure' });
    }
    
    expect(mockSetStatus).toHaveBeenCalledWith('disconnected');
    expect(window.setTimeout).toHaveBeenCalled();
  });
  
  it('handles connection errors', () => {
    setupWebSocket(mockSetStatus, mockAddMessage);
    
    // Simulate WebSocket error
    if (mockWebSocket.onerror) {
      mockWebSocket.onerror(new Error('Connection error'));
    }
    
    expect(mockSetStatus).toHaveBeenCalledWith('disconnected');
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
