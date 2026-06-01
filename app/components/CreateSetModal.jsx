import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const CreateSetModal = ({ visible, onClose, handleCreateSet, weight, setWeight, reps, setReps, error}) => {
  const [localError, setLocalError] = useState('')
  
  const handleSubmit = async () => {
    if (weight === '' || weight === null || weight === undefined) {
      setLocalError('Weight cannot be empty.')
      return
    }
    if (reps === '' || reps === null || reps === undefined) {
      setLocalError('Reps cannot be empty.')
      return
    }
    setLocalError('')
    await handleCreateSet()
    onClose()
    setWeight(0)
    setReps(0)
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType='slide'
      presentationStyle='formSheet'
    >
      <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
              <Text style={styles.headerItem}>Enter Set</Text>
          </View>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {localError ? <Text style={styles.errorText}>{localError}</Text> : (error ? <Text style={styles.errorText}>{error}</Text> : null)}
            <Text style={styles.labelItem}>Enter Weight:</Text>
            <TextInput
              style={styles.textInputItem}
              value={weight}
              placeholder='Enter Weight:'
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.labelAndTextContainer}>
            <Text style={styles.labelItem}>Enter Reps:</Text>
            <TextInput
              style={styles.textInputItem}
              value={reps}
              placeholder='Enter Reps:'
              onChangeText={setReps}
              keyboardType="numeric"
            />
          </View>

          <Pressable 
            style={styles.defaultButton}
            onPress={handleSubmit}
          >
            <Text style={styles.defaultButtonText}>Enter Set</Text>
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

export default CreateSetModal