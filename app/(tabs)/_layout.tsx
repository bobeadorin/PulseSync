import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "react-native-url-polyfill/auto";
import { useWorkout } from "../../hooks/useWorkout";

export default function TabsLayout() {
  const { isWorkoutActive } = useWorkout();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#4285f4", headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",

          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="realtime"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={isWorkoutActive ? "green" : color} />,
        }}
      />
    </Tabs>
  );
}
