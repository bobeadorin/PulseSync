import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const InitializationScreen = () => {
  // State for each initialization step
  const [initializationSteps, setInitializationSteps] = useState([
    { id: "bluetooth", name: "Bluetooth Connection", status: "pending", device: "Sensor Module" },
    { id: "wifi-config", name: "WiFi Configuration", status: "pending", device: "Sensor Module" },
    { id: "sensor-data", name: "Sensor Data Stream", status: "pending", device: "Sensor Module" },
    { id: "robot-connection", name: "Robot Connection", status: "pending", device: "Robot Module" },
    { id: "api-connection", name: "API Connection", status: "pending", device: "Cloud" },
  ]);

  // Simulate initialization process
  useEffect(() => {
    const initializeDevices = async () => {
      // Bluetooth connection to Sensor Module
      await updateStepStatus("bluetooth", "in-progress");
      await simulateConnection(1500);
      await updateStepStatus("bluetooth", "success");

      // WiFi configuration
      await updateStepStatus("wifi-config", "in-progress");
      await simulateConnection(2000);
      await updateStepStatus("wifi-config", "success");

      // Sensor data stream
      await updateStepStatus("sensor-data", "in-progress");
      await simulateConnection(1000);
      await updateStepStatus("sensor-data", "success");

      // Robot Module connection
      await updateStepStatus("robot-connection", "in-progress");
      await simulateConnection(2500);
      await updateStepStatus("robot-connection", "success");

      // API/Cloud connection
      await updateStepStatus("api-connection", "in-progress");
      await simulateConnection(1800);
      await updateStepStatus("api-connection", "success");

      // All initialized, navigate to main screen
      setTimeout(() => router.replace("/(tabs)/realtime"), 1000);
    };

    initializeDevices();
  }, []);

  const updateStepStatus = (id: string, status: string) => {
    setInitializationSteps((prevSteps) => prevSteps.map((step) => (step.id === id ? { ...step, status } : step)));
  };

  const simulateConnection = (duration: number) => {
    return new Promise((resolve) => setTimeout(resolve, duration));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
      case "in-progress":
        return <ActivityIndicator size="small" color="#4285f4" />;
      case "failed":
        return <Ionicons name="close-circle" size={24} color="#F44336" />;
      default:
        return <Ionicons name="ellipse-outline" size={24} color="#9E9E9E" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>System Initialization</Text>
        <Text style={styles.subtitle}>Connecting to devices and services...</Text>

        <View style={styles.stepsContainer}>
          {initializationSteps.map((step) => (
            <View key={step.id} style={styles.step}>
              <View style={styles.stepLeft}>
                {getStatusIcon(step.status)}
                <Text style={styles.stepName}>{step.name}</Text>
              </View>
              <Text style={styles.stepDevice}>{step.device}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {initializationSteps.filter((s) => s.status === "success").length} / {initializationSteps.length} completed
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 20,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  stepsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  step: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stepLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepName: {
    fontSize: 16,
    color: "#333",
  },
  stepDevice: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  progressContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: "#4285f4",
  },
});

export default InitializationScreen;
