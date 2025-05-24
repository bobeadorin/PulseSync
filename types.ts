import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  userData: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
};

export type WorkoutData = { timestamp: string; pulse: number }[];

export type WorkoutGraphProps = {
  workoutData: WorkoutData;
  patientName?: string;
  patientAge?: number;
  workoutDate?: string;
  workoutTime?: string;
};

export type SessionData = {
  doctorName: string;
  patientName: string;
  age: number;
  workoutTime: number | null;
};

export type SessionContextType = {
  sessionData?: SessionData;
  isBluetoothConnected: boolean;
  userId?: string;
  wifi: WifiCredentials | null;
  setWifi: (wifiCredentials: WifiCredentials) => void;
  setSessionData: (sessionData: SessionData) => void;
  setIsBluetooth: (isConnected: boolean) => void;
};

export type WifiCredentials = {
  ssid: string;
  password: string;
};
