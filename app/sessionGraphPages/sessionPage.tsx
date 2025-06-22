import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from "expo-router";
import { WorkoutGraphProps } from "../../types";

function downsample<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data;

  const interval = data.length / maxPoints;
  const result: T[] = [];
  for (let i = 0; i < maxPoints; i++) {
    const index = Math.floor(i * interval);
    result.push(data[index]);
  }
  return result;
}

export default function SessionLayout() {
  const params = useLocalSearchParams();
  const workoutData = JSON.parse(params.workoutData as string) as WorkoutGraphProps;

  const filteredData = downsample(workoutData.workoutData, 9);

  const labels = filteredData.map((data) => data.timestamp);
  const pulseValues = filteredData.map((data) => data.pulse);

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Session Details</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.patientName}>{workoutData.patientName}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Age: {workoutData.patientAge}</Text>
            <Text style={styles.detailText}>Date: {workoutData.workoutDate}</Text>
          </View>
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.cardTitle}>Heart Rate During Workout</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: labels,
                datasets: [{ data: pulseValues }],
              }}
              width={screenWidth * 0.9}
              height={300}
              fromZero
              withVerticalLabels
              withHorizontalLabels
              verticalLabelRotation={-45}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "#f8f8f8",
                backgroundGradientTo: "#f8f8f8",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ff3b30",
                },
                propsForLabels: {
                  fontSize: 12,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.dataCard}>
          <Text style={styles.cardTitle}>Detailed Measurements</Text>
          <ScrollView style={styles.dataList} nestedScrollEnabled={true}>
            {workoutData.workoutData.map((data, index) => (
              <View key={index} style={styles.dataRow}>
                <Text style={styles.dataTime}>{data.timestamp}</Text>
                <Text style={styles.dataPulse}>{data.pulse} bpm</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataList: {
    maxHeight: 300,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 35,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 16,
    color: "#666",
  },
  graphContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  dataCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dataTime: {
    fontSize: 16,
    color: "#333",
  },
  dataPulse: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3b30",
  },
});
