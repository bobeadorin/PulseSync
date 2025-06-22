import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PacientSession } from "../../interfaces";
import useAuth from "../../hooks/useAuth";
import WorkoutGraph from "../../components/WorkoutGraph";
import { WorkoutGraphProps } from "../../types";
import { Ionicons } from "@expo/vector-icons";

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
  const { signOut, userData } = useAuth();
  const [queryData, setQueryData] = useState<PacientSession | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleStartSession = () => {
    router.push("/sessionStartFormPages/pacientDataForm");
  };

  return (
    <View style={styles.safeContainer}>
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={24} color="#4A90E2" />
          <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
            {userData?.email || "Guest"}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <WorkoutGraph {...workoutData} />
        </View>

        <TouchableOpacity onPress={handleStartSession} style={styles.startButton} activeOpacity={0.8}>
          <View style={styles.buttonContent}>
            <Ionicons name="fitness" size={24} color="white" />
            <Text style={styles.startButtonText}>Start New Workout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  userEmail: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    maxWidth: "80%",
  },
  signOutButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
