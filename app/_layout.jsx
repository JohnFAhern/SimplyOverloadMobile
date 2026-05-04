import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { DayProvider } from "./context/DayContext";
import { ExerciseProvider } from "./context/ExerciseContext";
import { SetEntryProvider } from "./context/SetEntryContext";

export default function RootLayout() {
  return(
    <AuthProvider>
      <DayProvider>
        <ExerciseProvider>
          <SetEntryProvider>
            <Stack />
          </SetEntryProvider>
        </ExerciseProvider>
      </DayProvider>
    </AuthProvider>
  ) 
}