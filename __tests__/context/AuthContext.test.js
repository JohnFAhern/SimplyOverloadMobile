import React from 'react'
import { renderHook, act } from '@testing-library/react-native'
import { AuthProvider } from '../../app/context/AuthContext'
import AuthContext from '../../app/context/AuthContext'
import { useContext } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('axios')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

const useAuth = () => useContext(AuthContext)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AsyncStorage.clear()
  })

  it('initialises with null user', async () => {
    const { result } = renderHook(useAuth, { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('login stores user in state and AsyncStorage', async () => {
    const fakeResponse = {
      data: { token: 'tok123', userId: 'u1', email: 'a@b.com' },
    }
    axios.post.mockResolvedValueOnce(fakeResponse)

    const { result } = renderHook(useAuth, { wrapper })

    await act(async () => {
      await result.current.login('a@b.com', 'password')
    })

    expect(result.current.user).toEqual({ token: 'tok123', userId: 'u1', email: 'a@b.com' })
    const stored = JSON.parse(await AsyncStorage.getItem('user'))
    expect(stored.token).toBe('tok123')
  })

  it('register stores user in state and AsyncStorage', async () => {
    const fakeResponse = {
      data: { token: 'tok456', userId: 'u2', email: 'c@d.com' },
    }
    axios.post.mockResolvedValueOnce(fakeResponse)

    const { result } = renderHook(useAuth, { wrapper })

    await act(async () => {
      await result.current.register('c@d.com', 'password')
    })

    expect(result.current.user).toEqual({ token: 'tok456', userId: 'u2', email: 'c@d.com' })
  })

  it('logout clears user from state and AsyncStorage', async () => {
    // Seed a logged-in user first
    axios.post.mockResolvedValueOnce({
      data: { token: 'tok123', userId: 'u1', email: 'a@b.com' },
    })
    const { result } = renderHook(useAuth, { wrapper })

    await act(async () => {
      await result.current.login('a@b.com', 'password')
    })
    expect(result.current.user).not.toBeNull()

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(await AsyncStorage.getItem('user')).toBeNull()
  })

  it('login throws when the API returns an error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'))

    const { result } = renderHook(useAuth, { wrapper })

    await expect(
      act(async () => { await result.current.login('bad@email.com', 'wrong') })
    ).rejects.toThrow('Network Error')

    expect(result.current.user).toBeNull()
  })
})
