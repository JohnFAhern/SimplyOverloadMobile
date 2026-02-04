import { View, Text, Pressable, TextInput, Modal } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../../styles/dashboardStyles'

const UpdateModal = ({ visible, onClose, error, title, setErrors, objToEdit, setObjToEdit, variables, updateFunction }) => {
  /*
        visible={isEditModalVisible}
        title={"Update Day"}
        errors={errors}
        setErrors={setErrors}
        objToEdit={dayToEdit}
        setObjToEdit={setDayToEdit}
        variables = {[["Day", newDayName, setNewDayName]]}
  */
  
  const handleSubmit = async () => {
    console.log("handling submit")
    await updateFunction()
    onClose()
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
            <Text style={styles.headerItem}>{title}</Text>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.labelAndTextContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {variables.map((vars, index) => (
            <>
              <Text style={styles.labelItem}>{vars[0]}</Text>
              <TextInput
                style={styles.textInputItem}
                value={vars[2] || null}
                placeholder={vars[1]}
                onChangeText={(text) => vars[3](text)}
              />
            </>
            ))}

{    /* ["Update Day Name:", "Enter Updated Name:", newDayName, setNewDayName]
            <Text style={styles.labelItem}>currTitle:</Text>
            <TextInput
              style={styles.textInputItem}
              value={newDayName || ""}
              placeholder='Update Day Name :'
              onChangeText={(text) => setNewDayName(text)}
            />
*/}
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

export default UpdateModal