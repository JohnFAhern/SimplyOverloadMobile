import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const UpdateDayModal = ({ visible, onClose, handleUpdateDay, dayToEdit, setDayToEdit, newDayName, setNewDayName, error}) => {
  
  const handleSubmit = async () => {
    if (!newDayName || !newDayName.trim()) {
      return
    }
    await handleUpdateDay()
    onClose()
    setNewDayName("")
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
            <Text style={styles.headerItem}>Update Day</Text>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {(!newDayName || !newDayName.trim()) ? <Text style={styles.errorText}>Day name cannot be empty.</Text> : (error ? <Text style={styles.errorText}>{error}</Text> : null)}
            <Text style={styles.labelItem}>Enter Day Name:</Text>
            <TextInput
              style={styles.textInputItem}
              value={newDayName || ""}
              placeholder='Update Day Name :'
              onChangeText={(text) => setNewDayName(text)}
            />
          </View>

          <Pressable 
            style={styles.defaultButton}
            onPress={handleSubmit}
          >
            <Text style={styles.defaultButtonText}>Update Day</Text>
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

export default UpdateDayModal