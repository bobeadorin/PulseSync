import { ScrollView } from "react-native";
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
export default function Sessions() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <WorkoutGraph {...workoutData} key={index} />
        ))}
      <WorkoutGraph {...workoutData} />
    </ScrollView>
  );
}
