import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Platform } from 'react-native'

const API_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

const ExerciseContext = createContext(null)

export function ExerciseProvider({children}) {
  const [currentDay, setCurrentDayState] = useState(null) 
  const [currentExercise, setCurrentExerciseState] = useState(null)
  

  useEffect(() => {
    const loadUserData = async () => {
      const storedDay = await AsyncStorage.getItem("currentDay")
      if(storedDay) setCurrentDayState(JSON.parse(storedDay))
      
      const storedExercise = await AsyncStorage.getItem("currentExercise")
      if(storedExercise) setCurrentExerciseState(JSON.parse(storedExercise))
    }
    loadUserData()
  }, [])

  const setCurrentDay = async (day) => {
    setCurrentDayState(day)
    await AsyncStorage.setItem("currentDay", JSON.stringify(day))
  }

  const setCurrentExercise = async (exercise) => {
    setCurrentExerciseState(exercise)
    await AsyncStorage.setItem("currentExercise", JSON.stringify(exercise))
  }
  
  const createDay = (userID, dayName) =>{
    return axios.post(`${API_HOST}/exercises/createDay`, {
      userID,
      dayName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getDays = (userID) => {
    return axios.get(`${API_HOST}/exercises/getDays`, {
      params: { userID }
    });
  }
  const updateDay = (dayID, newDayName) =>{
    return axios.post(`${API_HOST}/exercises/updateDayName`, {
      dayID,
      newDayName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const createExercise = (exerciseName) => {
    return axios.post(`${API_HOST}/exercises/createExercise`, {
      dayID: currentDay?.day_id,
      exerciseName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getExercises = (dayID) => {
    return axios.get(`${API_HOST}/exercises/getExercises`, {
      params: { dayID }
    });
  }

  const updateExerciseName = (exerciseID, newExerciseName) =>{
    return axios.post(`${API_HOST}/exercises/updateExerciseName`, {
      exerciseID,
      newExerciseName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }



  function createSets(weight, reps){
    return axios.post(`${API_HOST}/exercises/createSet`, {
      exerciseID: currentExercise?.exercise_id,
      reps,
      weight
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  function getSets(exerciseID) {
    console.log("getSets accessed")
    return axios.get(`${API_HOST}/exercises/getSets`, {
      params: { exerciseID }
      /*
      recieves:
        status - success // failed
        lastSession - last sessions details
      
      */
    });
  }
  const updateSet = (setID, weight, reps) =>{
    console.log(`${setID} - setID, ${weight} - weight, ${reps}`)
    const path = `${API_HOST}/exercises/updateSet`
    console.log(`Sending Request to: ${path}`)
    return axios.post(path, {
      setID,
      weight,
      reps
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }


  return (
    <ExerciseContext.Provider value={{
      currentDay,
      currentExercise,
      setCurrentDay,
      setCurrentExercise,
      createDay,
      getDays,
      updateDay,
      createExercise,
      getExercises,
      updateExerciseName,
      getSets,
      createSets,
      updateSet,
     }}>
        {children}
    </ExerciseContext.Provider>
  )
}

export default ExerciseContext
