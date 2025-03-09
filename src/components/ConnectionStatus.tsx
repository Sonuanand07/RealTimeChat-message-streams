
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
    
    // Only hide when connected after 10 seconds
    if (status === "connected") {
      timeout = setTimeout(() => {
        setVisible(false);
      }, 10000);
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
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium animate-fade-in shadow-sm",
        status === "connected" && "bg-green-100 text-green-800 border border-green-200",
        status === "disconnected" && "bg-red-100 text-red-800 border border-red-200",
        status === "connecting" && "bg-yellow-100 text-yellow-800 border border-yellow-200"
      )}
    >
      {status === "connected" && <Wifi className="w-4 h-4" />}
      {status === "disconnected" && <WifiOff className="w-4 h-4" />}
      {status === "connecting" && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>
        {status === "connected" && "Connected to chat"}
        {status === "disconnected" && "Disconnected from chat"}
        {status === "connecting" && "Connecting to chat..."}
      </span>
    </div>
  );
};
