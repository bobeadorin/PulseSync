// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";
import { SessionProvider } from "../providers/SessionProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </AuthProvider>
  );
}
