import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import CreateDayModal from './components/CreateDayModal'
import UpdateDayModal from './components/updateDayModal'
import UpdateModal from './components/updateModal'
import DayContext from './context/DayContext'
import HamburgerMenu from './components/HamburgerMenu'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState(null)
  const [newDayName, setNewDayName] = useState("")
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [dayToEdit, setDayToEdit] = useState(null)

  const router = useRouter()

  const { user, logout } = useContext(AuthContext)
  const { getDays, createDay, selectDay, editDay, deleteDay, dayList } = useContext(DayContext)

    useEffect(() => {
        getDays()
    }, []);

    const toTitleCase = (str) => {
      return str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }
    const handleCreateDay = async () => {
        setError("")

        const name = toTitleCase(newDayName)

        if (!name || !name.trim()) {
            setError("Day name cannot be empty.")
            return;
        }
        if (dayList.some((d) => d.dayName === name)) {
            setError(`${name} already exists!`);
            return;
        }
        try {
            await createDay(name);
            console.log("handling create day")
        } catch(error) {
            console.log("Create Day:", error)
            setError(error.response?.data?.message || "An error occurred during Create Day");
        }
    }


    const handleDaySelect = async (day) => {
      await selectDay(day)
      router.push("/exercises")
    }

    const handleUpdateDay = async () => {
        setError("")
        
        const name = toTitleCase(newDayName)

        if (!name || !name.trim()) {
            setError("Day name cannot be empty.")
            return
        }
        if (!dayToEdit?.dayId) {
            setError("No day selected to update")
            return
        }
        try {
            await editDay(dayToEdit.dayId, name);
        } catch(error) {
            console.log("Update Day:", error)
            setError(error.response?.data?.message || "An error occurred during Update Day");
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
      } catch(error){
          console.log("Delete Day: ", error)
          setError(error.response?.data?.message || "An error occurred during Delete Day");
      }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CreateDayModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        handleCreateDay={handleCreateDay}
        dayName={newDayName}
        setDayName={setNewDayName}
        error={error}
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


      <View style={[styles.headerContainer, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }]}>
          <View style={{ flex: 1 }} />
          <Text style={[styles.headerItem, { flex: 2, textAlign: 'center' }]}>Days</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <HamburgerMenu onLogout={logout} />
          </View>
      </View>
      {dayList == null ? (
        <Text>Loading</Text>
      ) : dayList.length === 0 ? (
        <Text> You Dont Have Any Days!</Text>
      ) : (
        <ScrollView 
          style={styles.boxContainer}
          contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
        >
          {dayList.map((day) => (
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


    </SafeAreaView>
    
  )
}

export default Dashboard