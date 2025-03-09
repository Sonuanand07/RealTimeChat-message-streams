
export type MessageType = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
};

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export interface WebSocketState {
  status: ConnectionStatus;
  messages: MessageType[];
  sendMessage: (content: string) => void;
}
