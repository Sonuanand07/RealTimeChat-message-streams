
import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full" role="form">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          disabled && "opacity-70 cursor-not-allowed"
        )}
        placeholder={disabled ? "Connecting to chat..." : "Type a message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Message input"
      />
      <Button
        type="submit"
        size="icon"
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90",
          (disabled || !message.trim()) && "opacity-70 cursor-not-allowed bg-muted text-muted-foreground"
        )}
        disabled={disabled || !message.trim()}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
