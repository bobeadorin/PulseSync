import { useContext } from "react";
import { SessionContextType } from "../types";
import { SessionContext } from "../providers/SessionProvider";

export default function useWorkoutSessionData(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useWorkoutSessionData must be used within SessionProvider");
  return context;
}
