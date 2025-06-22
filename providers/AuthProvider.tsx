// AuthProvider.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseConfig";
import { Session, User } from "@supabase/supabase-js";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleUserData = async () => {
      const res = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(res.data.session?.access_token);
    };

    if (session?.user) {
      handleUserData();

      setUserData(session.user);
    } else {
      setUserData(null);
    }
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserData(null);
  };

  const value: AuthContextType = {
    session,
    userData,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
