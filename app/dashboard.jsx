import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newDayName, setNewDayName] = useState("")
  const [days, setDays] = useState([])

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { getDays, createDay } = useContext(ExerciseContext)

  useEffect(() => {
      if (!currentUser) return;  

      getDays(currentUser)
          .then(res => {
              setDays(res.data.days);
          })
          .catch(err => {
              setError(err ||"Couldn't load days");
          });

    }, [currentUser]);

    const handleCreateDay = async () =>{
        setError("")
        if (days.some((d) => d.day_name === newDayName)) {
            setError(`${newDayName} already exists!`);
            return;
        }
        try{
            const res = await createDay(currentUser, newDayName);
            console.log("Response from server:", res.data);
            if (res.data.status === "success"){
                await getDays(currentUser).then((res) => {
                    setDays(res.data.days);
                });
            }
        }catch(error){
            console.log("Create Day:", error)
            setError(error.response?.data?.message || "An error occurred during Create Day");
        }
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
                onPress={async () => {
                  await handleCreateDay()
                  setIsModalVisible(false)
                  setNewDayName("")
                  console.log("Create day pressed")
                }}
            >
                <Text style={styles.loginButtonText}>Create Day</Text>
            </Pressable>
            <Pressable 
                style={styles.loginButton}
                onPress={() => setIsModalVisible(false)}
            >
                <Text style={styles.loginButtonText}>Cancel</Text>
            </Pressable> 

          </View> 
    
        </Modal>
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>Days</Text>
      </View>
      {days == null ? (
        <Text>Loading</Text>
      ) : days.length === 0 ? (
        <Text> You Dont Have Any Days!</Text>
      ) : (
        <ScrollView 
          style={styles.boxContainer}
          contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
        >
          {days.map((day) => (
            <Pressable 
              style={styles.dayButtonContainer}
              key={day.day_id}
            >
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {day.day_name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )
      }
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