import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Platform } from 'react-native'
import { setApiToken, clearApiToken } from './api'

const AuthContext = createContext(null)


export function AuthProvider({children}) {
  const [user, setUser] = useState(null)

  const API_HOST = 'https://simplyoverloadbackendjava-production.up.railway.app/api/v1/auth';

  useEffect(() => {
    const loadUserData = async () => {
      const userString = await AsyncStorage.getItem("user")
      if(userString) {
        const userData = JSON.parse(userString)
        setApiToken(userData.token)
        setUser(userData)
      }
    }
    loadUserData()
  }, [])


  const setUserFromResponse = async (response) => {
    console.log("Accessing SetUserFrom Response in Context/AuthContext")

    const userData = {
      token: response.data.token,
      userId: response.data.userId,
      email: response.data.email
    }


    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData)
    setApiToken(userData.token)

    console.log(`UserId: ${userData.userId}`)
    console.log(`email: ${userData.email}`)
    console.log(`Token: ${userData.token}`)
    return userData
  }

  const login = async (email, password) => {
      console.log("accessing login")
      console.log("Posting to:", `${API_HOST}/login`)
      console.log("Body:", { email, password })
      
      const response = await axios.post(`${API_HOST}/login`, {email, password})
      console.log("Response:", response.data)
      return setUserFromResponse(response)
  }

  const register = async (email, password) => {
    console.log("Accessing Register in Context/AuthContext")
    
    const response = await axios.post(`${API_HOST}/register`, {email, password})
    console.log(response.data)
    return setUserFromResponse(response)
  }

  const logout = async () =>{
    console.log("Accessing log out")
    clearApiToken()
    setUser(null)
    await AsyncStorage.removeItem("user")
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

