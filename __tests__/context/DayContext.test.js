import React, { useContext } from 'react'
import { renderHook, act } from '@testing-library/react-native'
import { DayProvider } from '../../app/context/DayContext'
import DayContext from '../../app/context/DayContext'
import AuthContext from '../../app/context/AuthContext'
import api from '../../app/context/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('../../app/context/api')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const MOCK_USER = { token: 'tok', userId: 'u1', email: 'a@b.com' }

// Inject user directly via AuthContext.Provider so no async useEffect is needed
const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: MOCK_USER, login: jest.fn(), logout: jest.fn(), register: jest.fn() }}>
    <DayProvider>{children}</DayProvider>
  </AuthContext.Provider>
)

const useDay = () => useContext(DayContext)

describe('DayContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AsyncStorage.clear()
  })

  it('getDays fetches and stores day list', async () => {
    const days = [{ dayId: 'd1', dayName: 'Push' }, { dayId: 'd2', dayName: 'Pull' }]
    api.get.mockResolvedValueOnce({ data: days })

    const { result } = renderHook(useDay, { wrapper })

    await act(async () => { await result.current.getDays() })

    expect(api.get).toHaveBeenCalledWith(`/days/users/${MOCK_USER.userId}`)
    expect(result.current.dayList).toEqual(days)
  })

  it('createDay posts to API and sets currentDay', async () => {
    const newDay = { dayId: 'd3', dayName: 'Legs' }
    api.post.mockResolvedValueOnce({ data: newDay })

    const { result } = renderHook(useDay, { wrapper })

    await act(async () => { await result.current.createDay('Legs') })

    expect(api.post).toHaveBeenCalledWith('/days', { userId: MOCK_USER.userId, dayName: 'Legs' })
    expect(result.current.currentDay).toMatchObject({ dayId: 'd3', dayName: 'Legs' })
  })

  it('selectDay saves day to AsyncStorage and state', async () => {
    const day = { dayId: 'd1', dayName: 'Push' }
    const { result } = renderHook(useDay, { wrapper })

    await act(async () => { await result.current.selectDay(day) })

    expect(result.current.currentDay).toMatchObject(day)
    const stored = JSON.parse(await AsyncStorage.getItem('currentDay'))
    expect(stored.dayId).toBe('d1')
  })

  it('editDay calls PUT with correct dayId and dayName', async () => {
    api.put.mockResolvedValueOnce({ data: {} })
    api.get.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(useDay, { wrapper })

    await act(async () => { await result.current.editDay('d1', 'Push Day') })

    expect(api.put).toHaveBeenCalledWith('/days/d1', {
      userId: MOCK_USER.userId,
      dayName: 'Push Day',
    })
  })

  it('deleteDay calls DELETE with correct dayId', async () => {
    api.delete.mockResolvedValueOnce({})
    api.get.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(useDay, { wrapper })

    await act(async () => { await result.current.deleteDay('d1') })

    expect(api.delete).toHaveBeenCalledWith('/days/d1')
  })
})
