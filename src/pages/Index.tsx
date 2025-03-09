
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ConnectionIndicator } from "@/components/ConnectionStatus";
import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { toast } from "sonner";

export type MessageType = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
};

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

const ChatApp = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userId] = useState(() => Math.random().toString(36).substring(2, 10));
  
  // Connect to WebSocket
  useEffect(() => {
    // The WebSocket URL should be configurable through an environment variable,
    // but we'll hardcode it for simplicity here
    const wsUrl = "ws://localhost:8000/ws";
    let reconnectTimer: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 2000;
    
    const connect = () => {
      try {
        setStatus("connecting");
        console.log("Attempting to connect to:", wsUrl);
        const newSocket = new WebSocket(wsUrl);
        
        newSocket.onopen = () => {
          console.log("WebSocket connected successfully");
          setStatus("connected");
          reconnectAttempts = 0;
          toast.success("Connected to chat room");
        };
        
        newSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            
            // Check if this is an error message from the server
            if (data.error) {
              toast.error(data.error);
              return;
            }
            
            // Determine if this message is from the current user
            const isSelf = data.sender === userId;
            
            const message: MessageType = {
              id: data.id || generateMessageId(),
              sender: data.sender,
              content: data.content,
              timestamp: data.timestamp || Date.now(),
              isSelf
            };
            
            setMessages(prev => [...prev, message]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        };
        
        newSocket.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          setStatus("disconnected");
          setSocket(null);
          
          // Attempt reconnection
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            toast.info(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
          } else {
            toast.error("Failed to connect. Please refresh the page to try again.");
          }
        };
        
        newSocket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setStatus("disconnected");
          // We don't call close here as the onclose handler will be triggered automatically
        };
        
        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to connect:", error);
        setStatus("disconnected");
        
        // Attempt reconnection
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          toast.info(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
        } else {
          toast.error("Failed to connect. Please refresh the page to try again.");
        }
      }
    };
    
    connect();
    
    // Cleanup on unmount
    return () => {
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.close();
      }
    };
  }, [userId]);
  
  // Generate message ID
  const generateMessageId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  };
  
  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        toast.error("Not connected to chat room");
      }
      return;
    }
    
    const message = {
      id: generateMessageId(),
      sender: userId,
      content: content.trim(),
      timestamp: Date.now()
    };
    
    try {
      console.log("Sending message:", message);
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md flex flex-col">
        <div className="mb-3 self-center">
          <ConnectionIndicator status={status} />
        </div>
        
        <Card className="flex-1 flex flex-col shadow-lg border-slate-200/70 rounded-2xl overflow-hidden h-[80vh]">
          <CardHeader className="border-b border-slate-100 py-4 px-6">
            <h2 className="text-lg font-medium animate-fade-in">Chat Room</h2>
            <p className="text-sm text-muted-foreground">Your ID: {userId.substring(0, 6)}</p>
          </CardHeader>
          
          <CardContent className="flex-1 flex p-0 overflow-hidden">
            <MessageList messages={messages} />
          </CardContent>
          
          <CardFooter className="border-t border-slate-100 p-4">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={status !== "connected"} 
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatApp;
