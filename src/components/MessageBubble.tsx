
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
      <div className={isSelf ? "message-sent" : "message-received"}>
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
