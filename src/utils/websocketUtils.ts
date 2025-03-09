import { toast } from "sonner";

export type MessageType = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
};

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export interface WebSocketState {
  status: ConnectionStatus;
  messages: MessageType[];
  sendMessage: (content: string) => void;
}

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};

const userId = generateUserId();

export const setupWebSocket = (
  setStatus: (status: ConnectionStatus) => void,
  addMessage: (message: MessageType) => void
): WebSocketState => {
  const wsUrl = "ws://localhost:8000/ws";
  
  let socket: WebSocket | null = null;
  let reconnectTimer: number | null = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000; // 2 seconds
  
  const connect = () => {
    try {
      setStatus("connecting");
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        setStatus("connected");
        reconnectAttempts = 0;
        toast.success("Connected to chat room");
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const isSelf = data.sender === userId;
          
          const message: MessageType = {
            id: data.id || generateMessageId(),
            sender: data.sender,
            content: data.content,
            timestamp: data.timestamp || Date.now(),
            isSelf
          };
          
          addMessage(message);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
      
      socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setStatus("disconnected");
        attemptReconnect();
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("disconnected");
        socket?.close();
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      setStatus("disconnected");
      attemptReconnect();
    }
  };
  
  const attemptReconnect = () => {
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer);
    }
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      toast.info(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY);
    } else {
      toast.error("Failed to connect. Please refresh the page to try again.");
    }
  };
  
  const sendMessage = (content: string) => {
    if (!content.trim() || socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const message = {
      id: generateMessageId(),
      sender: userId,
      content: content.trim(),
      timestamp: Date.now()
    };
    
    try {
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };
  
  connect();
  
  return {
    status: "connecting",
    messages: [],
    sendMessage
  };
};
