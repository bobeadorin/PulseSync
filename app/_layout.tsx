// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";
import { WorkoutProvider } from "../providers/WorkoutProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Slot />
      </WorkoutProvider>
    </AuthProvider>
  );
}
