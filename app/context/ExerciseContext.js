import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import api from "./api"
import { Platform } from 'react-native'
import DayContext from './DayContext'

const ExerciseContext = createContext(null)


export function ExerciseProvider({children}) {

  const { currentDay } = useContext(DayContext)

  const [currentExercise, setCurrentExercise] = useState(null)
  const [exerciseList, setExerciseList] = useState([])

useEffect(() => {
    const loadCurrentExerciseData = async () => {
        const exerciseString = await AsyncStorage.getItem("currentExercise")
        if(exerciseString) setCurrentExercise(JSON.parse(exerciseString))  // fix here
    }
    loadCurrentExerciseData()
}, [])

  const selectExercise = async (object) => {
    const exerciseData = {
      exerciseId: object.exerciseId,
      exerciseName: object.exerciseName
    }

    await AsyncStorage.setItem('currentExercise', JSON.stringify(exerciseData));
    setCurrentExercise(exerciseData)
    return exerciseData

  }

  const createExercise = async (exerciseName) => {
    const response = await api.post(`/exercises`, {dayId: currentDay.dayId, exerciseName})
    return selectExercise(response.data)
  }

  const getExercises = async () => {
    const response = await api.get(`/exercises/day/${currentDay.dayId}`)
    return setExerciseList(response.data)
  }

  const editExercise = async (exerciseName) => {
    const response = await api.put(`/exercises/${currentExercise.exerciseId}`, {
      dayId: currentDay.dayId,
      exerciseName
    })
    return getExercises()
  }

  const deleteExercise = async () => {
      await api.delete(`/exercises/${currentExercise.exerciseId}`);
      return getExercises();
    }

  
  return (
    <ExerciseContext.Provider value={{
      currentExercise,
      exerciseList,
      selectExercise,
      createExercise,
      getExercises,
      editExercise,
      deleteExercise

     }}>
        {children}
    </ExerciseContext.Provider>
  )
}

export default ExerciseContext
