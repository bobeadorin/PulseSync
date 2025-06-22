// app/sessions.tsx
import { ScrollView } from "react-native";
import WorkoutGraph from "../../components/WorkoutGraph";
import { WorkoutGraphProps } from "../../types";
import { Link } from "expo-router";
import useAuth from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseConfig";
import { useEffect, useState } from "react";

export default function Sessions() {
  const { userData } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    getUserHistory();
  }, []);

  const getUserHistory = async () => {
    const { data, error } = await supabase
      .from("pacient_session")
      .select(
        `
        *,
        session_data (pulse, timestamp)
      `
      )
      .eq("user_id", userData?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    // Clean and transform timestamps
    const transformed = data.map((session) => ({
      ...session,
      session_data: session.session_data.map((d: any) => ({
        timestamp: new Date(d.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        pulse: d.pulse,
      })),
    }));

    setSessions(transformed);
    console.log(transformed[0].session_data, "aasdas");
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      {sessions?.map((session, index) => (
        <Link
          key={index}
          href={{
            pathname: "/sessionGraphPages/sessionPage",
            params: {
              workoutData: JSON.stringify({
                patientAge: session.pacient_age,
                patientName: session.pacient_name,
                workoutData: session.session_data,
                workoutDate: new Date(session.created_at).toLocaleString(),
              }),
            },
          }}
          asChild
        >
          <WorkoutGraph
            patientAge={session.pacient_age}
            patientName={session.pacient_name}
            workoutData={session.session_data}
            workoutDate={new Date(session.created_at).toLocaleString()}
          />
        </Link>
      ))}
    </ScrollView>
  );
}
