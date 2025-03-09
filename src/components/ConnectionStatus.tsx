
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
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium animate-fade-in",
        status === "connected" && "bg-green-100 text-green-800 border border-green-200",
        status === "disconnected" && "bg-red-100 text-red-800 border border-red-200",
        status === "connecting" && "bg-yellow-100 text-yellow-800 border border-yellow-200"
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
