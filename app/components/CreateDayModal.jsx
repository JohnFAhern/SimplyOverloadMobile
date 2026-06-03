import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const CreateDayModal = ({ visible, onClose, handleCreateDay, dayName, setDayName, error}) => {
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    if (!dayName.trim()) {
      setLocalError('Day name cannot be empty.')
      return
    }
    if (isSubmitting) return
    setLocalError('')
    setIsSubmitting(true)
    try {
      await handleCreateDay()
      onClose()
      setDayName("")
    } finally {
      setIsSubmitting(false)
    }
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
            <Text style={styles.headerItem}>Create Day</Text>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {localError ? <Text style={styles.errorText}>{localError}</Text> : (error ? <Text style={styles.errorText}>{error}</Text> : null)}
            <Text style={styles.labelItem}>Create Day:</Text>
            <TextInput
              style={styles.textInputItem}
              value={dayName}
              placeholder='Enter Day Name:'
              onChangeText={setDayName}
            />
          </View>
          <Pressable 
            style={[styles.defaultButton, isSubmitting && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.defaultButtonText}>{isSubmitting ? 'Creating...' : 'Create Day'}</Text>
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

export default CreateDayModal