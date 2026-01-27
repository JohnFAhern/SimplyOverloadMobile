import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateDayModal from './components/CreateDayModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState(null)
  const [newDayName, setNewDayName] = useState("")
  const [days, setDays] = useState([])

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { getDays, createDay, currentDay, setCurrentDay, currentExercise } = useContext(ExerciseContext)

  useEffect(() => {
      if (!currentUser || currentUser === 0) return;  

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

    const handleDaySelect = (dayID) => {
      setCurrentDay(dayID)
      router.push("/exercises")
    }

  return (
    <View style={styles.container}>
      <CreateDayModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        handleCreateDay={handleCreateDay}
        dayName={newDayName}
        setDayName={setNewDayName}
        //error={error}
      />
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
              onPress={() => handleDaySelect(day)}
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
          style={styles.defaultButton}
          onPress={() => {
            setIsModalVisible(true)
            console.log("Create day pressed")
          }}
      >
          <Text style={styles.defaultButtonText}>Create Day</Text> 
      </Pressable>


    </View>
    
  )
}

export default Dashboard