import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const ExerciseContext = createContext(null)

export function ExerciseProvider({children}) {
  const [currentDay, setCurrentDay] = useState(0) 
  const [currentExercise, setCurrentExercise] = useState(0)

  useEffect(() => {
    const loadUserData = async () => {
      const dayID = await AsyncStorage.getItem("dayID")
      if(dayID) setCurrentDay(parseInt(dayID))
    }
    loadUserData()
  }, [])
  
  const createDay = (currentUser, day_name) =>{
    return axios.post("https://simplyoverload.com/api/createDay.php", {
      currentUser,
      day_name
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getDays = (userID) => {
    return axios.get("https://simplyoverload.com/api/getDays.php", {
      params: { userID }
    });
  }

  const createExercise = (exercise_name) => {
    return axios.post("https://simplyoverload.com/api/createExercise.php", {
      currentDay,
      exercise_name
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getExercises = (dayID) => {
    return axios.get("https://simplyoverload.com/api/getExercises.php", {
      params: { dayID }
    });
  }


  return (
    <ExerciseContext.Provider value={{
      currentDay,
      currentExercise,
      setCurrentDay,
      setCurrentExercise,
      createDay,
      getDays,
      createExercise,
      getExercises,
     }}>
        {children}
    </ExerciseContext.Provider>
  )
}

export default ExerciseContext
