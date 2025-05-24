import { createContext, useState, ReactNode } from "react";
import { SessionContextType, SessionData, WifiCredentials } from "../types";
import useAuth from "../hooks/useAuth";

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { userData } = useAuth();
  const [sessionData, setSessionData] = useState<SessionData>();
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [wifi, setWifi] = useState<WifiCredentials | null>(null);

  const setIsBluetooth = (isConnected: boolean) => {
    setIsBluetoothConnected(isConnected);
  };

  const value = {
    sessionData,
    userId: userData?.id,
    isBluetoothConnected,
    wifi,
    setWifi,
    setIsBluetooth,
    setSessionData,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
