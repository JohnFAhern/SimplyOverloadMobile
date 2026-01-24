import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const CreateSetModal = ({ visible, onClose, handleCreateSet, weight, setWeight, reps, setReps, error}) => {
  
  const handleSubmit = async () => {
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
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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