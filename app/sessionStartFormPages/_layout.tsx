import { Stack } from "expo-router";

export default function SessionStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerBackTitle: "Back", // For iOS
      }}
    >
      <Stack.Screen
        name="wifiForm"
        options={{
          title: "Wi-Fi Setup", // Custom title
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pacientDataForm"
        options={{
          title: "Wi-Fi Setup", // Custom title
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="initialization"
        options={{
          title: "Initialization", // Custom title
          headerShown: false,
        }}
      />
    </Stack>
  );
}
