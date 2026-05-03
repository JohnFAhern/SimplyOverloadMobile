import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import api from "/api"
import { Platform } from 'react-native'
import AuthContext from './AuthContext'


const DayContext = createContext(null)

export function DayProvider({children}) {
  const { user } = useContext(AuthContext)

  const [currentDay, setCurrentDay] = useState(null)
  const [dayList, setDayList] = useState([])

  const selectDay = async (object) => {
    const dayData = {
      dayId: object.dayId,
      dayName: object.dayName
    }

    await AsyncStorage.setItem('currentDay', JSON.stringify(dayData));
    setCurrentDay(dayData)
    return dayData

  }
  const createDay = async (dayName) => {
    const response = await api.post(`/days`, {userId: user.userId, dayName})
    return selectDay(response.data)
  }

  const getDays = async () => {
    const response = await api.get(`/days/user/${user.userId}`)
    return setDayList(response.data)
  }

  const editDay = async (dayName) => {
    const response = await api.put(`/days/${currentDay.dayId}`, {
      userId: user.userId,
      dayName
    })
    return getDays()
  }

  const deleteDay = async () => {
    await api.delete(`/days/${currentDay.dayId}`);
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
