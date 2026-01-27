import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Platform } from 'react-native'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState(0) // UserId from user table

  useEffect(() => {
    const loadUserData = async () => {
      const userID = await AsyncStorage.getItem("userID")
      if(userID) setCurrentUser(parseInt(userID))
    }
    loadUserData()
  }, [])

  const setUser = async (userID) => {
    setCurrentUser(userID)
    await AsyncStorage.setItem("userID", userID.toString())
  }

  const API_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

  const login =(email, password) => {
    return axios.post(`${API_HOST}/users/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
  }

  const logout = async () =>{
    setCurrentUser(0)
    await AsyncStorage.removeItem("userID")
  }

 const register = (email, password) => {
    return axios.post(`${API_HOST}/users/register`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      setUser,
      login,
      logout,
      register,
     }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
