
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ConnectionIndicator } from "@/components/ConnectionStatus";
import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { MessageType, ConnectionStatus, setupWebSocket } from "@/utils/websocketUtils";

const ChatApp = () => {
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
      <div className="w-full max-w-lg flex flex-col">
        <div className="mb-3 self-center">
          <ConnectionIndicator status={status} />
        </div>
        
        <Card className="flex-1 flex flex-col shadow-lg border-slate-200/70 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-4 px-6">
            <h2 className="text-lg font-medium animate-fade-in">Chat Room</h2>
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
