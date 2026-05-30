import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import api from "./api"
import { Platform } from 'react-native'
import ExerciseContext from './ExerciseContext'


const SetEntryContext = createContext(null)


export function SetEntryProvider({children}) {

  const { currentExercise } = useContext(ExerciseContext)

  const [currentSet, setCurrentSet] = useState(null)
  const [setEntryList, setSetEntryList] = useState([])


  const selectSetEntry = async (object) => {
    const setEntryData = {
      setEntryId: object.setEntryId,
      reps: object.reps,
      weight: object.weight
    }

    await AsyncStorage.setItem('currentSetEntry', JSON.stringify(setEntryData));
    setCurrentSet(setEntryData)
    return setEntryData
  }

  const getSetEntries = async () => {
    const response = await api.get(`/sets/exercise/${currentExercise.exerciseId}`)
    setSetEntryList(response.data)
    return response.data
  }

  const createSetEntry = async (reps, weight) => {
      const response = await api.post(`/sets`, {exerciseId: currentExercise.exerciseId, reps, weight})
      selectSetEntry(response.data)
      return getSetEntries()
  }

  const editSetEntry = async (setEntryId, reps, weight) => {
    const response = await api.put(`/sets/${setEntryId}`, {
      exerciseId: currentExercise.exerciseId,
      reps,
      weight
    })
    return getSetEntries()
  }

  const deleteSetEntry = async (setEntryId) => {
      await api.delete(`/sets/${setEntryId}`);
      return getSetEntries();
    }

  
  return (
    <SetEntryContext.Provider value={{
      currentSet,
      setEntryList,
      selectSetEntry,
      getSetEntries,
      createSetEntry,
      editSetEntry,
      deleteSetEntry

     }}>
        {children}
    </SetEntryContext.Provider>
  )
}

export default SetEntryContext
