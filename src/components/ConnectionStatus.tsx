
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/pages/Index";

interface ConnectionStatusProps {
  status: ConnectionStatus;
}

export const ConnectionIndicator = ({ status }: ConnectionStatusProps) => {
  const [visible, setVisible] = useState(true);
  
  // Auto-hide the connected status after a delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Only hide when connected after 5 seconds
    if (status === "connected") {
      timeout = setTimeout(() => {
        setVisible(false);
      }, 5000);
    } else {
      setVisible(true);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [status]);
  
  // Return an early null if we want to hide it
  if (!visible) return null;
  
  return (
    <div
      className={cn(
        "connection-indicator animate-fade-in",
        status === "connected" && "connection-connected",
        status === "disconnected" && "connection-disconnected",
        status === "connecting" && "connection-connecting"
      )}
    >
      {status === "connected" && <Wifi className="w-3.5 h-3.5" />}
      {status === "disconnected" && <WifiOff className="w-3.5 h-3.5" />}
      {status === "connecting" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      <span>
        {status === "connected" && "Connected"}
        {status === "disconnected" && "Disconnected"}
        {status === "connecting" && "Connecting..."}
      </span>
    </div>
  );
};
