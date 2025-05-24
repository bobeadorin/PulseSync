import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { AuthContextType } from "../types";

export default function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
