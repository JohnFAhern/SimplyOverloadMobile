import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { ExerciseProvider } from "./context/ExerciseContext"
import AuthContext from "./context/AuthContext"
import { useContext, useEffect } from 'react'

function AuthGuard() {
  const { currentUser, isLoading } = useContext(AuthContext)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    const isAuthRoute = segments[0] === 'login' || segments[0] === 'signup'
    if (!currentUser) {
      if (!isAuthRoute) router.replace('/login')
    } else {
      if (isAuthRoute || segments.length === 0) router.replace('/dashboard')
    }
  }, [currentUser, isLoading, segments])

  return null
}

export default function RootLayout() {
  return(
    <AuthProvider>
      <ExerciseProvider>
        <AuthGuard />
        <Stack />
      </ExerciseProvider>
    </AuthProvider>
  ) 
}
