import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newDayName, setNewDayName] = useState("")

  const handleSubmit = () => {
    input = prompt("Enter day!")
  }

  return (
    <View style={styles.container}>
        <Modal
          visible = {isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType='slide'
          presentationStyle='formSheet'
        >
          <View style={styles.modalContainer}>
            

            <View style={styles.labelAndTextContainer}>
                <Text>{error}</Text>
                <Text style={styles.labelItem}> Create Day:</Text>
                <TextInput
                    style={styles.textInputItem}
                    value={newDayName}
                    placeholder='Enter Day Name:'
                    onChangeText={setNewDayName}
                />
            </View>
            <Pressable 
                style={styles.loginButton}
                onPress={() => {
                  setIsModalVisible(false)
                  console.log("Create day pressed")
                }}
            >
                <Text style={styles.loginButtonText}>Create Day</Text>
            </Pressable>

          </View>      
        </Modal>
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>Days</Text>
      </View>
      <ScrollView 
        style={styles.boxContainer}
        contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
      >
        <Pressable 
          style={styles.dayButtonContainer}
        >
          <Text 
            style={styles.daysButtonText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Push
          </Text>
        </Pressable>
      </ScrollView>
      <Pressable 
          style={styles.loginButton}
          onPress={() => {
            setIsModalVisible(true)
            console.log("Create day pressed")
          }}
      >
          <Text style={styles.loginButtonText}>Create Day</Text>
      </Pressable>


    </View>
    
  )
}

export default Dashboard