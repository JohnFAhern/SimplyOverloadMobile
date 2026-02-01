import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const UpdateSetModal = ({ visible, onClose, handleUpdateSet, weight, setWeight, reps, setReps, error, set}) => {
  
  const handleSubmit = async () => {
    await handleUpdateSet()
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
            <Text style={styles.headerItem}>Update Set</Text>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.labelItem}>Enter Weight:</Text>
            <TextInput
              style={styles.textInputItem}
              value={weight?.toString() || ''}
              placeholder='Enter Weight:'
              onChangeText={(text) => setWeight(Number(text) || 0)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.labelAndTextContainer}>
            <Text style={styles.labelItem}>Enter Reps:</Text>
            <TextInput
              style={styles.textInputItem}
              value={reps?.toString() || ''}
              placeholder='Enter Reps:'
              onChangeText={(text) => setReps(Number(text) || 0)}
              keyboardType="numeric"
            />
          </View>

          <Pressable 
            style={styles.defaultButton}
            onPress={handleSubmit}
          >
            <Text style={styles.defaultButtonText}>Update Set</Text>
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

export default UpdateSetModal