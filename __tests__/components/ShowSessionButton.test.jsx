import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ShowSessionButton from '../../app/components/showSessionButton'

const ARRAY_SESSION = [
  { setEntryId: 's1', reps: 8, weight: 100, createdAt: '2026-05-30T10:00:00' },
  { setEntryId: 's2', reps: 6, weight: 105, createdAt: '2026-05-30T10:05:00' },
]

const OBJECT_SESSION = {
  '2026-05-28': [
    { setEntryId: 's3', reps: 10, weight: 80, createdAt: '2026-05-28T09:00:00' },
  ],
}

const noop = () => {}

function renderBtn(props = {}) {
  return render(
    <ShowSessionButton
      title="Test Session"
      sessionArray={props.sessionArray ?? ARRAY_SESSION}
      isVisible={props.isVisible ?? true}
      setVisibility={props.setVisibility ?? noop}
      setToEdit={props.setToEdit ?? null}
      setSetToEdit={props.setSetToEdit ?? noop}
      setIsEditModalVisible={props.setIsEditModalVisible ?? noop}
      setWeight={props.setWeight ?? noop}
      setReps={props.setReps ?? noop}
    />
  )
}

describe('ShowSessionButton', () => {
  it('renders the section title', () => {
    const { getByText } = renderBtn()
    expect(getByText(/Test Session/)).toBeTruthy()
  })

  it('hides content when isVisible is false', () => {
    const { queryByText } = renderBtn({ isVisible: false })
    expect(queryByText('100')).toBeNull()
  })

  it('shows "No sets yet" for empty array', () => {
    const { getByText } = renderBtn({ sessionArray: [] })
    expect(getByText('No sets yet')).toBeTruthy()
  })

  it('shows "No sets yet" for empty object', () => {
    const { getByText } = renderBtn({ sessionArray: {} })
    expect(getByText('No sets yet')).toBeTruthy()
  })

  it('renders set weight and reps for array session', () => {
    const { getByText, getAllByText } = renderBtn({ sessionArray: ARRAY_SESSION })
    expect(getByText('100')).toBeTruthy()
    expect(getAllByText('lbs').length).toBeGreaterThan(0)
    expect(getByText('8')).toBeTruthy()
    expect(getByText('105')).toBeTruthy()
    expect(getByText('6')).toBeTruthy()
  })

  it('renders set numbers (#1, #2) for array session', () => {
    const { getByText } = renderBtn({ sessionArray: ARRAY_SESSION })
    expect(getByText('#1')).toBeTruthy()
    expect(getByText('#2')).toBeTruthy()
  })

  it('renders date header and sets for object session', () => {
    const { getByText } = renderBtn({ sessionArray: OBJECT_SESSION })
    expect(getByText('80')).toBeTruthy()
    expect(getByText('10')).toBeTruthy()
  })

  it('calls setSetToEdit and setIsEditModalVisible on long press', () => {
    const mockSetSetToEdit = jest.fn()
    const mockSetIsEditModalVisible = jest.fn()
    const mockSetWeight = jest.fn()
    const mockSetReps = jest.fn()

    const { getByText } = renderBtn({
      setSetToEdit: mockSetSetToEdit,
      setIsEditModalVisible: mockSetIsEditModalVisible,
      setWeight: mockSetWeight,
      setReps: mockSetReps,
    })

    fireEvent(getByText('100'), 'longPress')

    expect(mockSetSetToEdit).toHaveBeenCalledWith(ARRAY_SESSION[0])
    expect(mockSetWeight).toHaveBeenCalledWith(100)
    expect(mockSetReps).toHaveBeenCalledWith(8)
    expect(mockSetIsEditModalVisible).toHaveBeenCalledWith(true)
  })

  it('toggles visibility when the header button is pressed', () => {
    const mockSetVisibility = jest.fn()
    const { getByText } = renderBtn({ isVisible: true, setVisibility: mockSetVisibility })

    fireEvent.press(getByText(/Test Session/))

    expect(mockSetVisibility).toHaveBeenCalledWith(false)
  })
})
