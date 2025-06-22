import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SensorData } from "../../types";

const LOW_PULSE_THRESHOLD = 60;
const HIGH_PULSE_THRESHOLD = 120;

export default function WorkoutSummary() {
  // Get data from navigation params
  const workoutData: SensorData[] = JSON.parse(router.params?.workoutData || "[]");
  const patientData = JSON.parse(router.params?.patientData || "{}");

  const isDangerousPulse = (pulse: number) => {
    return pulse < LOW_PULSE_THRESHOLD || pulse > HIGH_PULSE_THRESHOLD;
  };

  const workoutDuration =
    workoutData.length > 0
      ? Math.floor(Number(workoutData[workoutData.length - 1].timestamp) - Number(workoutData[0].timestamp)) / 1000
      : 0;

  const averagePulse =
    workoutData.length > 0 ? Math.round(Number(workoutData.reduce((sum, data) => sum + data.pulse, 0))) / workoutData.length : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="check-circle" size={48} color="#34C759" />
        <Text style={styles.headerTitle}>Workout Complete!</Text>
        <Text style={styles.headerSubtitle}>Great session with {patientData?.name || "patient"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutDuration}s</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, isDangerousPulse(averagePulse) && styles.dangerText]}>{averagePulse}</Text>
          <Text style={styles.statLabel}>Avg Pulse</Text>
        </View>
      </View>

      <ScrollView style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Workout Data</Text>
        {workoutData.map((data, index) => (
          <View key={index} style={[styles.dataRow, isDangerousPulse(data.pulse) && styles.dangerRow]}>
            <Text style={styles.dataTime}>{new Date(data.timestamp).toLocaleTimeString()}</Text>
            <Text style={[styles.dataPulse, isDangerousPulse(data.pulse) && styles.dangerText]}>{data.pulse} bpm</Text>
            <Text style={styles.dataSteps}>{data.steps} steps</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.newWorkoutButton]}
          onPress={() => router.navigate("/sessionStartFormPages/pacientDataForm")}
        >
          <MaterialIcons name="replay" size={24} color="white" />
          <Text style={styles.buttonText}>New Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => router.navigate("/(tabs)/sessions")}>
          <MaterialIcons name="assessment" size={24} color="white" />
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "45%",
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dataContainer: {
    flex: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dangerRow: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderColor: "#FF0000",
    borderWidth: 1,
  },
  dataTime: {
    flex: 1,
  },
  dataPulse: {
    flex: 1,
    textAlign: "center",
  },
  dataSteps: {
    flex: 1,
    textAlign: "right",
  },
  dangerText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 8,
  },
  newWorkoutButton: {
    backgroundColor: "#007AFF",
  },
  reportButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});
