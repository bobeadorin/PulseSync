import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { WorkoutGraphProps } from "../types";

// Sample workout data (timestamps and pulse values)

export default function WorkoutGraph(workout: WorkoutGraphProps) {
  // Extract labels (timestamps) and pulse values
  const labels = workout.workoutData.map((data) => data.timestamp);
  const pulseValues = workout.workoutData.map((data) => data.pulse);

  return (
    <View style={styles.container}>
      {/* Patient Info Section */}
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{workout.patientName}</Text>
        <Text style={styles.patientDetails}>
          Age: {workout.patientAge} | Date: {workout.workoutDate}
        </Text>
        <Text style={styles.patientDetails}>Time: 10:00 AM - 10:30 AM</Text>
      </View>

      {/* Graph Section with fixed overflow */}
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
            color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`, // Red line
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
    overflow: "hidden", // Prevents children from overflowing
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
    overflow: "hidden", // Ensures chart stays within bounds
  },
});
