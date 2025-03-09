
import { useState, useCallback } from "react";
import { MessageType, ConnectionStatus } from "../utils/types";
import { setupWebSocket } from "../utils/websocketUtils";
import { ConnectionIndicator } from "../components/ConnectionStatus";
import { MessageInput } from "../components/MessageInput";
import { MessageList } from "../components/MessageList";
import { Toaster } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  
  // Add message to the list
  const addMessage = useCallback((message: MessageType) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // Setup WebSocket
  const { sendMessage } = setupWebSocket(setStatus, addMessage);
  
  // Handle sending a message
  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-lg flex flex-col">
        <div className="mb-3 self-center">
          <ConnectionIndicator status={status} />
        </div>
        
        <div className="flex-1 flex flex-col shadow-lg border border-slate-200/70 rounded-2xl overflow-hidden bg-white">
          <div className="border-b border-slate-100 py-4 px-6">
            <h2 className="text-lg font-medium animate-fade-in">Chat Room</h2>
          </div>
          
          <div className="flex-1 flex p-0 overflow-hidden">
            <MessageList messages={messages} />
          </div>
          
          <div className="border-t border-slate-100 p-4">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={status !== "connected"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
