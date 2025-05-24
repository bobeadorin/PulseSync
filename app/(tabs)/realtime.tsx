import React from "react";
import { View, Text } from "react-native";
import useWorkoutSessionData from "../../hooks/useWorkoutSessionData";

export default function realtime() {
  const { sessionData, wifi } = useWorkoutSessionData();
  return (
    <View>
      <Text>{sessionData?.doctorName}</Text>
      <Text>{sessionData?.patientName}</Text>
      <Text>{sessionData?.age}</Text>
      <Text>{sessionData?.workoutTime}</Text>
      <Text>{wifi?.ssid}</Text>
      <Text>{wifi?.password}</Text>
    </View>
  );
}
