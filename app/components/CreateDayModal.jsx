import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const CreateDayModal = ({ visible, onClose, handleCreateDay, dayName, setDayName, error}) => {
  
  const handleSubmit = async () => {
    await handleCreateDay()
    onClose()
    setDayName("")
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
            <Text style={styles.labelItem}>Create Day:</Text>
            <TextInput
              style={styles.textInputItem}
              value={dayName}
              placeholder='Enter Day Name:'
              onChangeText={setDayName}
            />
          </View>
          <Pressable 
            style={styles.defaultButton}
            onPress={handleSubmit}
          >
            <Text style={styles.defaultButtonText}>Create Day</Text>
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