
import { formatDistanceToNow } from "date-fns";
import { MessageType } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: MessageType;
  showTimestamp?: boolean;
}

export const MessageBubble = ({ message, showTimestamp = true }: MessageBubbleProps) => {
  const { content, timestamp, isSelf } = message;
  
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    includeSeconds: true,
  });
  
  return (
    <div className={cn("flex flex-col mb-2", isSelf ? "items-end" : "items-start")}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-3 break-words",
        isSelf 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-muted rounded-tl-none"
      )}>
        {content}
      </div>
      {showTimestamp && (
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {formattedTime}
        </span>
      )}
    </div>
  );
};
