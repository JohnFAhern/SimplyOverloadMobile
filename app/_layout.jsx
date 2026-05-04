import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { DayProvider } from "./context/DayContext";
import { ExerciseProvider } from "./context/ExerciseContext";
import { SetEntryProvider } from "./context/SetEntryContext";
import AuthContext from "./context/AuthContext";
import { useContext, useEffect } from 'react';

function AuthGuard() {
  const { user } = useContext(AuthContext)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const isAuthRoute = segments[0] === 'login' || segments[0] === 'signup'
    
    setTimeout(() => {
      if (!user) {
        if (!isAuthRoute) router.replace('/login')
      } else {
        if (isAuthRoute || segments.length === 0) router.replace('/dashboard')
      }
    }, 0)
  }, [user, segments])

  return null
}

export default function RootLayout() {
  return(
    <AuthProvider>
      <DayProvider>
        <ExerciseProvider>
          <SetEntryProvider>
            <AuthGuard />
            <Stack />
          </SetEntryProvider>
        </ExerciseProvider>
      </DayProvider>
    </AuthProvider>
  ) 
}