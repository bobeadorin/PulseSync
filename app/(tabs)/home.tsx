import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabaseConfig";
import { PacientSession } from "../../interfaces";
import useAuth from "../../hooks/useAuth";
import WorkoutGraph from "../../components/WorkoutGraph";
import { WorkoutGraphProps } from "../../types";

const workoutData: WorkoutGraphProps = {
  workoutData: [
    { timestamp: "10:00", pulse: 72 },
    { timestamp: "10:05", pulse: 85 },
    { timestamp: "10:10", pulse: 90 },
    { timestamp: "10:15", pulse: 88 },
    { timestamp: "10:20", pulse: 82 },
    { timestamp: "10:30", pulse: 87 },
  ],
  patientAge: 32,
  patientName: "Joe Doe",
  workoutDate: Date(),
};

export default function HomeScreen() {
  const { signOut, userData } = useAuth(); // Assuming your useAuth hook provides signOut
  const [queryData, setQueryData] = useState<PacientSession | null>(null);

  const handleSignOut = async () => {
    await signOut();
    console.log("HandleSignout");
    router.replace("/(auth)/login");
  };

  const handleStartSession = () => {
    router.push("/sessionStartFormPages/wifiForm");
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>{userData !== null ? userData.email : "No user data"}!</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

      {/*<History-section> */}
      <View style={styles.container}>
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>History</Text>
          <WorkoutGraph {...workoutData} />
        </View>
        <View style={styles.container}></View>
      </View>
      {/*</History-section> */}

      {/*<StarWorkout-section> */}
      <View>
        <Button title="Start workout" onPress={handleStartSession} />
      </View>

      {/*</StarWorkout-section> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  historySection: {
    padding: 0,
  },
  historyTitle: {
    marginLeft: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
});
