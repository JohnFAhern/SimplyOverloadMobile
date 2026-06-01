import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const CreateExerciseModal = ({ visible, onClose, handleCreateExercise, exerciseName, setExerciseName}) => {
  const [localError, setLocalError] = useState('')
  
  const handleSubmit = async () => {
    if (!exerciseName.trim()) {
      setLocalError('Exercise name cannot be empty.')
      return
    }
    setLocalError('')
    await handleCreateExercise()
    onClose()
    setExerciseName("")
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType='slide'
      presentationStyle='formSheet'
    >
      <View style={styles.modalContainer}>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
            <Text style={styles.labelItem}>Create Exercise:</Text>
            <TextInput
              style={styles.textInputItem}
              value={exerciseName}
              placeholder='Enter Exercise Name:'
              onChangeText={setExerciseName}
            />
          </View>
          <Pressable 
            style={styles.defaultButton}
            onPress={handleSubmit}
          >
            <Text style={styles.defaultButtonText}>Create Exercise</Text>
          </Pressable>
        </View>
        <Pressable 
          style={styles.defaultButton}
          onPress={onClose}
        >
          <Text style={styles.defaultButtonText}>Cancel</Text>
        </Pressable> 
      </View> 
    </Modal>
  )
}

export default CreateExerciseModal