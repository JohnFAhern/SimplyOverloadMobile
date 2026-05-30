import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import api from "./api"
import { Platform } from 'react-native'
import AuthContext from './AuthContext'


const DayContext = createContext(null)

export function DayProvider({children}) {
  const { user } = useContext(AuthContext)

  const [currentDay, setCurrentDay] = useState(null)
  const [dayList, setDayList] = useState([])

  useEffect(() => {
    const loadCurrentDayData = async () => {
      const dayString = await AsyncStorage.getItem("currentDay")
      if(dayString) setCurrentDay(JSON.parse(dayString))
    }
    loadCurrentDayData()
  }, [])

  const selectDay = async (object) => {
    console.log("Accessing selectDay in context/DayContext")
    const dayData = {
      dayId: object.dayId,
      dayName: object.dayName
    }

    await AsyncStorage.setItem('currentDay', JSON.stringify(dayData));
    setCurrentDay(dayData)
    console.log()
    return dayData
  }

  const createDay = async (dayName) => {
      console.log("createDay URL:", api.defaults.baseURL + '/days')
      console.log("createDay body:", {userId: user.userId, dayName})
      const response = await api.post(`/days`, {userId: user.userId, dayName})
      return selectDay(response.data)
  }

  const getDays = async () => {
      console.log("user object:", JSON.stringify(user))
      console.log("Full URL:", `/days/user/${user.userId}`)
      const response = await api.get(`/days/users/${user.userId}`)
      return setDayList(response.data)
  }

  const editDay = async (dayId, dayName) => {
    const response = await api.put(`/days/${dayId}`, {
      userId: user.userId,
      dayName
    })
    return getDays()
  }

  const deleteDay = async (dayId) => {
    await api.delete(`/days/${dayId}`);
    return getDays();
  }

  
  return (
    <DayContext.Provider value={{
      currentDay,
      dayList,
      selectDay,
      createDay,
      getDays,
      editDay,
      deleteDay

     }}>
        {children}
    </DayContext.Provider>
  )
}

export default DayContext
