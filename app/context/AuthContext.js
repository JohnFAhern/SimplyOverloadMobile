import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Platform } from 'react-native'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)

  const API_HOST = "http://localhost:8080/api/v1/auth"

  useEffect(() => {
    const loadUserData = async () => {
      const user = await AsyncStorage.getItem("userID")
      if(user) setUser(parseInt(user))
    }
    loadUserData()
  }, [])


  const setUserFromResponse = async (response) => {

    const userData = {
      token: response.data.token,
      userId: response.data.userId,
      email: response.data.email
    }

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData)
    return userData
  }

  const login = async (email, password) => {
    
    const response = await axios.post(`${API_HOST}/login`, {email, password})
    return setUserFromResponse(response)
  }

  const register = async (email, password) => {
    
    const response = await axios.post(`${API_HOST}/register`, {email, password})
    return setUserFromResponse(response)
  }

  const logout = async () =>{
    setUser(null)
    await AsyncStorage.removeItem("userData")
  }



  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
     }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
