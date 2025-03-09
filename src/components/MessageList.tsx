
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageType } from "@/pages/Index";

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center">
        <div className="text-4xl mb-2">👋</div>
        <h3 className="text-lg font-medium mb-1">Welcome to the Chat Room</h3>
        <p className="text-muted-foreground text-sm">
          Start the conversation by sending a message.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 messages-container w-full">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
