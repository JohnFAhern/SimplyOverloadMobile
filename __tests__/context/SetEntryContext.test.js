import React, { useContext } from 'react'
import { renderHook, act } from '@testing-library/react-native'
import { SetEntryProvider } from '../../app/context/SetEntryContext'
import SetEntryContext from '../../app/context/SetEntryContext'
import ExerciseContext from '../../app/context/ExerciseContext'
import api from '../../app/context/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('../../app/context/api')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const MOCK_EXERCISE = { exerciseId: 'ex1', exerciseName: 'Bench Press' }

// Inject currentExercise directly via ExerciseContext.Provider
const wrapper = ({ children }) => (
  <ExerciseContext.Provider value={{ currentExercise: MOCK_EXERCISE, exerciseList: [], selectExercise: jest.fn(), getExercises: jest.fn() }}>
    <SetEntryProvider>{children}</SetEntryProvider>
  </ExerciseContext.Provider>
)

const useSetEntry = () => useContext(SetEntryContext)

const GROUPED_SETS = {
  '2026-05-30': [
    { setEntryId: 's1', reps: 8, weight: 100, createdAt: '2026-05-30T10:00:00' },
    { setEntryId: 's2', reps: 6, weight: 105, createdAt: '2026-05-30T10:05:00' },
  ],
}

describe('SetEntryContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AsyncStorage.clear()
  })

  it('getSetEntries fetches, stores list, and returns data', async () => {
    api.get.mockResolvedValueOnce({ data: GROUPED_SETS })

    const { result } = renderHook(useSetEntry, { wrapper })

    let returned
    await act(async () => {
      returned = await result.current.getSetEntries()
    })

    expect(api.get).toHaveBeenCalledWith(`/sets/exercise/${MOCK_EXERCISE.exerciseId}`)
    expect(result.current.setEntryList).toEqual(GROUPED_SETS)
    expect(returned).toEqual(GROUPED_SETS)
  })

  it('createSetEntry posts with correct reps and weight order', async () => {
    const newSet = { setEntryId: 's3', reps: 10, weight: 90, createdAt: '2026-05-30T11:00:00' }
    api.post.mockResolvedValueOnce({ data: newSet })
    api.get.mockResolvedValueOnce({ data: GROUPED_SETS })

    const { result } = renderHook(useSetEntry, { wrapper })

    await act(async () => { await result.current.createSetEntry(10, 90) })

    expect(api.post).toHaveBeenCalledWith('/sets', {
      exerciseId: MOCK_EXERCISE.exerciseId,
      reps: 10,
      weight: 90,
    })
  })

  it('editSetEntry calls PUT with correct setEntryId, reps, weight', async () => {
    api.put.mockResolvedValueOnce({ data: {} })
    api.get.mockResolvedValueOnce({ data: GROUPED_SETS })

    const { result } = renderHook(useSetEntry, { wrapper })

    await act(async () => { await result.current.editSetEntry('s1', 5, 110) })

    expect(api.put).toHaveBeenCalledWith('/sets/s1', {
      exerciseId: MOCK_EXERCISE.exerciseId,
      reps: 5,
      weight: 110,
    })
  })

  it('deleteSetEntry calls DELETE with correct setEntryId', async () => {
    api.delete.mockResolvedValueOnce({})
    api.get.mockResolvedValueOnce({ data: GROUPED_SETS })

    const { result } = renderHook(useSetEntry, { wrapper })

    await act(async () => { await result.current.deleteSetEntry('s1') })

    expect(api.delete).toHaveBeenCalledWith('/sets/s1')
  })
})
