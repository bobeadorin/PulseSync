import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Vibration, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SensorData } from "../../types";

interface SensorDataDisplayProps {
  data: SensorData[];
}

const LOW_PULSE_THRESHOLD = 60;
const HIGH_PULSE_THRESHOLD = 120;
const VIBRATION_PATTERN = [500, 500, 500];
const WARNING_DURATION = 3000;

export default function SensorDataDisplay({ data }: SensorDataDisplayProps) {
  const latestData = data.length > 0 ? data[data.length - 1] : null;
  const [dangerPulseActive, setDangerPulseActive] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    if (latestData?.pulse) {
      const pulse = latestData.pulse;
      const isDangerous = pulse < LOW_PULSE_THRESHOLD || pulse > HIGH_PULSE_THRESHOLD;

      if (isDangerous) {
        if (vibrationEnabled) {
          Vibration.vibrate(VIBRATION_PATTERN);
        }
        setDangerPulseActive(true);

        const timer = setTimeout(() => {
          setDangerPulseActive(false);
        }, WARNING_DURATION);

        return () => clearTimeout(timer);
      } else {
        setDangerPulseActive(false);
      }
    }
  }, [latestData, vibrationEnabled]);

  const isDangerousPulse = (pulseValue: number) => {
    return pulseValue < LOW_PULSE_THRESHOLD || pulseValue > HIGH_PULSE_THRESHOLD;
  };

  const toggleVibration = () => {
    setVibrationEnabled((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.vibrationToggle} onPress={toggleVibration}>
        <MaterialIcons
          name={vibrationEnabled ? "vibration" : "vibration"}
          size={24}
          color={vibrationEnabled ? "#34C759" : "#FF3B30"}
        />
        <Text style={styles.vibrationToggleText}>{vibrationEnabled ? "Vibration On" : "Vibration Off"}</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.currentDataContainer,
          dangerPulseActive && latestData && isDangerousPulse(latestData.pulse) && styles.dangerHighlight,
        ]}
      >
        <View style={styles.metricContainer}>
          <MaterialIcons name="favorite" size={32} color={dangerPulseActive ? "#FF0000" : "#FF3B30"} />
          <Text style={[styles.currentMetricValue, dangerPulseActive && styles.dangerText]}>{latestData?.pulse ?? "0"}</Text>
          <Text style={styles.currentMetricLabel}>bpm</Text>
        </View>

        <View style={styles.metricContainer}>
          <MaterialIcons name="directions-walk" size={32} color="#007AFF" />
          <Text style={styles.currentMetricValue}>{latestData?.steps ?? "0"}</Text>
          <Text style={styles.currentMetricLabel}>steps</Text>
        </View>
      </View>

      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Workout History</Text>
        {data.map((item, index) => {
          const isLatestDanger = index === 0 && dangerPulseActive;
          return (
            <View key={index} style={[styles.historyItem, isLatestDanger && styles.dangerHighlight]}>
              <View style={styles.historyMetric}>
                <MaterialIcons name="favorite" size={20} color={isLatestDanger ? "#FF0000" : "#FF3B30"} />
                <Text style={[styles.historyText, isLatestDanger && styles.dangerText]}>{item.pulse} bpm</Text>
              </View>
              <View style={styles.historyMetric}>
                <MaterialIcons name="directions-walk" size={20} color="#007AFF" />
                <Text style={styles.historyText}>{item.steps} steps</Text>
              </View>
              <Text style={styles.historyTime}>{item.timestamp.toLocaleTimeString()}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vibrationToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    alignSelf: "center",
  },
  vibrationToggleText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  currentDataContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  metricContainer: {
    alignItems: "center",
  },
  currentMetricValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  currentMetricLabel: {
    fontSize: 16,
    color: "#666",
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  historyMetric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
  historyTime: {
    fontSize: 14,
    color: "#888",
  },
  dangerHighlight: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderColor: "#FF0000",
    borderWidth: 1,
    borderRadius: 12,
  },
  dangerText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
});
