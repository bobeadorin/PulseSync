import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { WorkoutGraphProps } from "../types";

export default function WorkoutGraph({ workoutData, onPress, patientName, patientAge, workoutDate }: WorkoutGraphProps) {
  if (!Array.isArray(workoutData) || workoutData.length === 0) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.container}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patientName}</Text>
            <Text style={styles.patientDetails}>
              Age: {patientAge} | Date: {workoutDate}
            </Text>
            <Text style={styles.patientDetails}>No workout data available</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const labels = workoutData.map((data) => data.timestamp);
  const pulseValues = workoutData.map((data) => data.pulse);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patientName}</Text>
          <Text style={styles.patientDetails}>
            Age: {patientAge} | Date: {workoutDate}
          </Text>
          <Text style={styles.patientDetails}>Time: 10:00 AM - 10:30 AM</Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: pulseValues }],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            withInnerLines={false}
            withOuterLines={false}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#f8f8f8",
              backgroundGradientTo: "#f8f8f8",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ff3b30",
              },
            }}
            bezier
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  patientInfo: {
    marginBottom: 16,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  patientDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  chartContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
