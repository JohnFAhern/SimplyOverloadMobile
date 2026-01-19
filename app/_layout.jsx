import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { ExerciseProvider } from "./context/ExerciseContext"

export default function RootLayout() {
  return(
    <AuthProvider>
      <ExerciseProvider>
        <Stack />
      </ExerciseProvider>
    </AuthProvider>
  ) 
}
