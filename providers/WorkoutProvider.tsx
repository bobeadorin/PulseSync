import { createContext, useContext, useState } from "react";
import { SensorData, SessionData } from "../types";

interface WorkoutContextType {
  pulseSensorData: SensorData[];
  setPulseSensorData: React.Dispatch<React.SetStateAction<SensorData[]>>;
  isWorkoutActive: boolean;
  setIsWorkoutActive: React.Dispatch<React.SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setPacientData: React.Dispatch<React.SetStateAction<SessionData | null>>;
  paciendData: SessionData | null;
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  currentSessionId: string | null;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pulseSensorData, setPulseSensorData] = useState<SensorData[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [paciendData, setPacientData] = useState<SessionData | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return (
    <WorkoutContext.Provider
      value={{
        pulseSensorData,
        setPulseSensorData,
        isWorkoutActive,
        setIsWorkoutActive,
        isPaused,
        setIsPaused,
        paciendData,
        setPacientData,
        currentSessionId,
        setCurrentSessionId,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
