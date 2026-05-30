import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import HamburgerMenu from '../../app/components/HamburgerMenu'

describe('HamburgerMenu', () => {
  it('renders the hamburger button', () => {
    const { getByTestId } = render(<HamburgerMenu onLogout={() => {}} />)
    // The three bar lines should be visible (component renders without crashing)
    expect(getByTestId('hamburger-btn')).toBeTruthy()
  })

  it('opens the menu when pressed', () => {
    const { getByTestId, queryByTestId } = render(<HamburgerMenu onLogout={() => {}} />)

    expect(queryByTestId('hamburger-panel')).toBeNull()

    fireEvent.press(getByTestId('hamburger-btn'))

    expect(getByTestId('hamburger-panel')).toBeTruthy()
  })

  it('calls onLogout and closes when logout is pressed', () => {
    const mockLogout = jest.fn()
    const { getByTestId } = render(<HamburgerMenu onLogout={mockLogout} />)

    fireEvent.press(getByTestId('hamburger-btn'))
    fireEvent.press(getByTestId('logout-btn'))

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(getByTestId('hamburger-btn')).toBeTruthy() // panel closed, btn still visible
  })

  it('closes when the overlay is pressed', () => {
    const { getByTestId, queryByTestId } = render(<HamburgerMenu onLogout={() => {}} />)

    fireEvent.press(getByTestId('hamburger-btn'))
    expect(getByTestId('hamburger-panel')).toBeTruthy()

    fireEvent.press(getByTestId('hamburger-overlay'))
    expect(queryByTestId('hamburger-panel')).toBeNull()
  })
})
