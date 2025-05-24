// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
