import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const ExerciseContext = createContext(null)

export function ExerciseProvider({children}) {
  const [currentDay, setCurrentDay] = useState(null) 
  const [currentExercise, setCurrentExercise] = useState(null)
  

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
      currentDay: currentDay?.day_id,
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
  function createSets(weight, reps){
    return axios.post("https://simplyoverload.com/api/createSets.php", {
      exerciseID: currentExercise,
      reps,
      weight
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  function getSets(exerciseID) {
    return axios.get("https://simplyoverload.com/api/getSets.php", {
      params: { exerciseID }
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
      getSets,
      createSets,
     }}>
        {children}
    </ExerciseContext.Provider>
  )
}

export default ExerciseContext
