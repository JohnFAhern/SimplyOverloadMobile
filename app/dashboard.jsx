import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateDayModal from './components/CreateDayModal'
import UpdateDayModal from './components/updateDayModal'
import UpdateModal from './components/updateModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState(null)
  const [newDayName, setNewDayName] = useState("")
  const [days, setDays] = useState([])
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [dayToEdit, setDayToEdit] = useState(null)

  const router = useRouter()

  const { currentUser, logout } = useContext(AuthContext)
  const { getDays, createDay, currentDay, setCurrentDay, currentExercise, updateDay, deleteDay } = useContext(ExerciseContext)

  useEffect(() => {
      if (!currentUser) return;  

      getDays(currentUser)
          .then(res => {
              setDays(res.data);
          })
          .catch(err => {
              setError(err ||"Couldn't load days");
          });

    }, [currentUser, dayToEdit]);

    const handleCreateDay = async () =>{
        setError("")
        if (days.some((d) => d.dayName === newDayName)) {
            setError(`${newDayName} already exists!`);
            return;
        }
        try{
            const res = await createDay(currentUser, newDayName);
            console.log("Response from server:", res.data);
            await getDays(currentUser).then((res) => {
                setDays(res.data);
            });
        }catch(error){
            console.log("Create Day:", error)
            setError(error.response?.data?.message || "An error occurred during Create Day");
        }
    }

    const handleDaySelect = (dayID) => {
      setCurrentDay(dayID)
      router.push("/exercises")
    }

    const handleUpdateDay = async () =>{
      console.log("accessing updateDay")
      setError("")
      if (!dayToEdit?.dayId) {
        console.log("if statement!")
          setError("No day selected to update")
          return
      }
      try{
        console.log("trying update day!")
          const res = await updateDay(dayToEdit.dayId, newDayName, currentUser);
          console.log("Update set response:", res.data);
          await getDays(currentUser).then((res) => {
            setDays(res.data);
          });
      } catch(error){
          console.log("Update Day: ", error)
          setError(error.response?.data?.message || "An error occurred during Create Set");
      }
  }

  const handleDeleteDay = async () =>{
      setError("")
      if (!dayToEdit?.dayId) {
          setError("No day selected to delete")
          return
      }
      try{
          await deleteDay(dayToEdit.dayId);
          await getDays(currentUser).then((res) => {
            setDays(res.data);
          });
      } catch(error){
          console.log("Delete Day: ", error)
          setError(error.response?.data?.message || "An error occurred during Delete Day");
      }
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

{    /*
      <UpdateDayModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false)
          setNewDayName("")
          setDayToEdit(null)
        }}
        handleUpdateDay={handleUpdateDay}
        newDayName={newDayName}
        setNewDayName={setNewDayName}
        error={error}
        dayToEdit={dayToEdit}
        setDayToEdit={setDayToEdit}
      />
*/
      <UpdateModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false)
          setNewDayName("")
          setDayToEdit(null)
        }}
        title={"Update Day"}
        errors={error}
        updateFunction={handleUpdateDay}
        deleteFunction={handleDeleteDay}
        setErrors={setError}
        objToEdit={dayToEdit}
        setObjToEdit={setDayToEdit}
        variables = {[
          ["Update Day Name:", "Enter Updated Name:", newDayName, setNewDayName]
        ]}
      
      />
        
}


      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>Days</Text>
          <Pressable onPress={logout}>
            <Text style={{ color: '#8B3A3A', textAlign: 'center', fontSize: 16 }}>Logout</Text>
          </Pressable>
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
              key={day.dayId}
              onPress={() => handleDaySelect(day)}
              onLongPress={() => {
                console.log("long")
                setDayToEdit(day)
                setNewDayName(day.dayName)
                setIsEditModalVisible(true)
              }}
              
              
            >
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {day.dayName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )
      }
      <Pressable 
          style={styles.defaultButton}
          onPress={() => {
            setNewDayName("")
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