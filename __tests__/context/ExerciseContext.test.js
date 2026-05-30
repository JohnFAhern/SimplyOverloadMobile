import React, { useContext } from 'react'
import { renderHook, act } from '@testing-library/react-native'
import { ExerciseProvider } from '../../app/context/ExerciseContext'
import ExerciseContext from '../../app/context/ExerciseContext'
import DayContext from '../../app/context/DayContext'
import api from '../../app/context/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('../../app/context/api')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const MOCK_DAY = { dayId: 'd1', dayName: 'Push' }

// Inject currentDay directly via DayContext.Provider
const wrapper = ({ children }) => (
  <DayContext.Provider value={{ currentDay: MOCK_DAY, dayList: [], selectDay: jest.fn(), getDays: jest.fn() }}>
    <ExerciseProvider>{children}</ExerciseProvider>
  </DayContext.Provider>
)

const useExercise = () => useContext(ExerciseContext)

describe('ExerciseContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AsyncStorage.clear()
  })

  it('getExercises fetches and stores exercise list', async () => {
    const exercises = [{ exerciseId: 'e1', exerciseName: 'Bench Press' }]
    api.get.mockResolvedValueOnce({ data: exercises })

    const { result } = renderHook(useExercise, { wrapper })

    await act(async () => { await result.current.getExercises() })

    expect(api.get).toHaveBeenCalledWith(`/exercises/day/${MOCK_DAY.dayId}`)
    expect(result.current.exerciseList).toEqual(exercises)
  })

  it('createExercise posts and sets currentExercise', async () => {
    const newEx = { exerciseId: 'e2', exerciseName: 'Squat' }
    api.post.mockResolvedValueOnce({ data: newEx })

    const { result } = renderHook(useExercise, { wrapper })

    await act(async () => { await result.current.createExercise('Squat') })

    expect(api.post).toHaveBeenCalledWith('/exercises', {
      dayId: MOCK_DAY.dayId,
      exerciseName: 'Squat',
    })
    expect(result.current.currentExercise).toMatchObject({ exerciseId: 'e2' })
  })

  it('editExercise calls PUT with correct exerciseId', async () => {
    api.put.mockResolvedValueOnce({ data: {} })
    api.get.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(useExercise, { wrapper })

    await act(async () => { await result.current.editExercise('e1', 'Incline Bench') })

    expect(api.put).toHaveBeenCalledWith('/exercises/e1', {
      dayId: MOCK_DAY.dayId,
      exerciseName: 'Incline Bench',
    })
  })

  it('deleteExercise calls DELETE with correct exerciseId', async () => {
    api.delete.mockResolvedValueOnce({})
    api.get.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(useExercise, { wrapper })

    await act(async () => { await result.current.deleteExercise('e1') })

    expect(api.delete).toHaveBeenCalledWith('/exercises/e1')
  })
})
