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
        name="initialization"
        options={{
          title: "Initialization", // Custom title
          headerShown: false,
        }}
      />
    </Stack>
  );
}
