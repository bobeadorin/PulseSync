// app/sessionGraphPages/SessionPage.tsx
import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Stack, useLocalSearchParams } from "expo-router";
import { WorkoutGraphProps, WorkoutDataPoint } from "../../types";
import { WorkoutProvider } from "../../providers/WorkoutProvider";

export default function SessionLayout() {
  return (
    <WorkoutProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          name="sessionPage"
          options={{
            title: "SessionPage",
            headerShown: false,
          }}
        />
      </Stack>
    </WorkoutProvider>
  );
}
