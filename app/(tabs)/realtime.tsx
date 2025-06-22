import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useBLE from "../../hooks/useBle";
import SensorDataDisplay from "../../components/RealtimeComponents/SensorDataDisplay";
import { parseSensorData } from "../../helpers/bleHelpers";
import { useWorkout } from "../../hooks/useWorkout";
import { router } from "expo-router";
import { supabase } from "../../lib/supabaseConfig";
import useAuth from "../../hooks/useAuth";

export default function RealtimeWorkout() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
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
  } = useWorkout();

  const {
    scanForTargetPeripherals,
    requestPermissions,
    stopScanning,
    connectToDevice,
    sendStartWorkoutCommand,
    disconnectFromDevice,
    endWorkoutCommand,
    pauseWorkoutCommnad,
    pulseSensorDevice,
    robotSensorDevice,
    isPulseSensorConnected,
    isRobotSensorConnected,
    isScanning,
    response,
  } = useBLE();

  const { userData } = useAuth();

  useEffect(() => {
    if (!paciendData && !isWorkoutActive) {
      router.navigate("/sessionStartFormPages/pacientDataForm");
    }

    const handlePermissions = async () => {
      setIsLoading(true);
      const granted = await requestPermissions();
      setIsLoading(false);
      if (granted) setHasPermission(true);
    };
    handlePermissions();
  }, []);

  useEffect(() => {
    if (!isRobotSensorConnected && !isPulseSensorConnected && !isScanning && !isWorkoutActive) {
      setIsLoading(true);
      scanForTargetPeripherals();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPulseSensorConnected && !isRobotSensorConnected) {
      setPulseSensorData([]);
      setIsWorkoutActive(false);
      return;
    }

    if (response) {
      if (response.includes("WORKOUT_DONE") || response.includes("WORKOUT_STOPPED")) {
        router.navigate({
          pathname: "/workoutSummary",
          params: {
            workoutData: JSON.stringify(pulseSensorData),
            patientData: JSON.stringify(paciendData),
          },
        });
        setPulseSensorData([]);
        setIsWorkoutActive(false);
        setCurrentSessionId(null);

        return;
      }

      const sensorData = parseSensorData(response);
      if (sensorData) {
        setPulseSensorData((prev) => {
          const updated = [...prev, sensorData];

          if (updated.length % 4 === 0 && currentSessionId) {
            const rows = updated.slice(updated.length - 4).map((item) => ({
              pulse: item.pulse,
              steps: item.steps,
              timestamp: item.timestamp,
              session_id: currentSessionId,
            }));
            supabase
              .from("session_data")
              .insert(rows)
              .then(({ error }) => {
                if (error) console.error("Error inserting session_data:", error);
              });
          }
          return updated;
        });
      }
    }
  }, [response, isPulseSensorConnected, isRobotSensorConnected]);

  const handleDbWorkoutInit = async () => {
    const { data, error } = await supabase
      .from("pacient_session")
      .insert({
        user_id: userData?.id,
        pacient_name: paciendData?.patientName,
        doctor_name: paciendData?.doctorName,
        pacient_age: paciendData?.age,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating pacient_session:", error);
      return;
    }

    setCurrentSessionId(data.id);
  };

  const handleEndWorkout = async () => {
    if (!pulseSensorDevice || !robotSensorDevice) return;
    await endWorkoutCommand(pulseSensorDevice);
    await endWorkoutCommand(robotSensorDevice);
    disconnectFromDevice(pulseSensorDevice);
    disconnectFromDevice(robotSensorDevice);

    setIsWorkoutActive(false);

    router.navigate({
      pathname: "/workoutSummary",
      params: {
        workoutData: JSON.stringify(pulseSensorData),
        patientData: JSON.stringify(paciendData),
      },
    });

    setPulseSensorData([]);
  };

  const handlePauseWorkout = () => {
    if (pulseSensorDevice && robotSensorDevice) {
      setIsPaused((prevIsPaused) => {
        const newIsPaused = !prevIsPaused;
        pauseWorkoutCommnad(pulseSensorDevice, newIsPaused);
        pauseWorkoutCommnad(robotSensorDevice, newIsPaused);
        return newIsPaused;
      });
    }
  };
  const handleStartWorkout = async (startWorkout: boolean, isPaused: boolean) => {
    const workoutDurationOrDefault = paciendData?.workoutTime?.toString() ?? "10000";

    await handleDbWorkoutInit();
    if (!robotSensorDevice || !pulseSensorDevice) {
      scanForTargetPeripherals();
    }
    if (
      !isPulseSensorConnected &&
      !isScanning &&
      pulseSensorDevice &&
      !isRobotSensorConnected &&
      !isScanning &&
      robotSensorDevice
    ) {
      const pulseDevice = await connectToDevice(pulseSensorDevice);
      const robotDevice = await connectToDevice(robotSensorDevice);
      if (pulseDevice) {
        await sendStartWorkoutCommand(pulseSensorDevice, startWorkout, workoutDurationOrDefault, isPaused);
      }
      if (robotDevice) {
        await sendStartWorkoutCommand(robotSensorDevice, startWorkout, workoutDurationOrDefault, isPaused);
      }
      setIsWorkoutActive(true);
      setIsLoading(false);
    } else {
      if (!pulseSensorDevice || !robotSensorDevice) return;
      await sendStartWorkoutCommand(pulseSensorDevice, startWorkout, workoutDurationOrDefault, isPaused);
      await sendStartWorkoutCommand(robotSensorDevice, startWorkout, workoutDurationOrDefault, isPaused);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{isScanning ? "Scanning for devices..." : "Connecting to device..."}</Text>
        </View>
      ) : (
        <>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, isWorkoutActive ? { backgroundColor: "#FF3B30" } : { backgroundColor: "#34C759" }]}
              onPress={async () => (isWorkoutActive ? await handleEndWorkout() : await handleStartWorkout(true, false))}
            >
              <MaterialIcons name={isWorkoutActive ? "stop" : "play-arrow"} size={24} color="white" />
              <Text style={styles.buttonText}>{isWorkoutActive ? "End Workout" : "Start Workout"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isPaused ? "#34C759" : "#FF9500" }]}
              onPress={handlePauseWorkout}
            >
              <MaterialIcons name={isPaused ? "play-arrow" : "pause"} size={24} color="white" />
              <Text style={styles.buttonText}>{isPaused ? "Resume" : "Pause"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dataContainer}>
            <SensorDataDisplay data={pulseSensorData} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 140,
    elevation: 2,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dataContainer: {
    flex: 1,
    padding: 16,
  },
});
