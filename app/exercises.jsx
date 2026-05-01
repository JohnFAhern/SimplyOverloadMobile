import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateExerciseModal from './components/CreateExerciseModal'
import UpdateModal from './components/updateModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [exercises, setExercises] = useState([])
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState(null)

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { currentDay, setCurrentDay, getExercises, createExercise, setCurrentExercise, updateExerciseName, deleteExercise } = useContext(ExerciseContext)
  useEffect(() => {
      if (!currentUser) return;  

      getExercises(currentDay.dayId)
          .then(res => {
              setExercises(res.data);
          })
          .catch(err => {
              setError(err ||"Couldn't load Exercises");
          });

    }, [currentDay]);

    const handleCreateExercise = async () =>{
        setError("")
        if (exercises.some((e) => e.exerciseName === newExerciseName)) {
            setError(`${newExerciseName} already exists!`);
            return;
        }
        try{
            const res = await createExercise(newExerciseName);
            console.log("Response from server:", res.data);
            await getExercises(currentDay.dayId).then((res) => {
                    setExercises(res.data);
                });
        }catch(error){
            console.log("Create Exercise:", error)
            setError(error.response?.data?.message || "An error occurred during Create Exercise");
        }
    }
    const handleExerciseSelect = async (exercise) => {
      setCurrentExercise(exercise)
      await AsyncStorage.setItem("currentExercise", JSON.stringify(exercise))
      router.push("/sets")
    }

    const handleUpdateExercise = async () =>{
      setError("")
      if (!exerciseToEdit?.exerciseId) {
          setError("No exercise selected to update")
          return
      }
      try{
          const res = await updateExerciseName(exerciseToEdit.exerciseId, newExerciseName);
          console.log("Update exercise response:", res.data);
          await getExercises(currentDay.dayId).then((res) => {
            setExercises(res.data);
          });
      } catch(error){
          console.log("Update Exercise: ", error)
          setError(error.response?.data?.message || "An error occurred during Update Exercise");
      }
    }

    const handleDeleteExercise = async () =>{
      setError("")
      if (!exerciseToEdit?.exerciseId) {
          setError("No exercise selected to delete")
          return
      }
      try{
          await deleteExercise(exerciseToEdit.exerciseId);
          await getExercises(currentDay.dayId).then((res) => {
            setExercises(res.data);
          });
      } catch(error){
          console.log("Delete Exercise: ", error)
          setError(error.response?.data?.message || "An error occurred during Delete Exercise");
      }
    }

  return (
    <View style={styles.container}>
      <CreateExerciseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        handleCreateExercise={handleCreateExercise}
        exerciseName={newExerciseName}
        setExerciseName={setNewExerciseName}
        error={error}
      />
      <UpdateModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false)
          setNewExerciseName("")
          setExerciseToEdit(null)
        }}
        title={"Update Exercise"}
        errors={error}
        updateFunction={handleUpdateExercise}
        deleteFunction={handleDeleteExercise}
        setErrors={setError}
        objToEdit={exerciseToEdit}
        setObjToEdit={setExerciseToEdit}
        variables={[
          ["Update Exercise Name:", "Enter Updated Name:", newExerciseName, setNewExerciseName]
        ]}
      />
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>{currentDay.dayName}</Text>
      </View>
      {exercises == null ? (
        <Text>Loading</Text>
      ) : exercises.length === 0 ? (
        <Text> You Dont Have Any Exercises!</Text>
      ) : (
        <ScrollView 
          style={styles.boxContainer}
          contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
        >
          {exercises.map((exercise) => (
            <Pressable 
              style={styles.dayButtonContainer}
              key={exercise.exerciseId}
              onPress={() => handleExerciseSelect(exercise)}
              onLongPress={() => {
                setExerciseToEdit(exercise)
                setNewExerciseName(exercise.exerciseName)
                setIsEditModalVisible(true)
              }}
            >
              <Text 
                style={styles.daysButtonText}
              >
                {exercise.exerciseName}
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
            console.log("Create Exercise pressed")
          }}
      >
          <Text style={styles.defaultButtonText}>Create Exercise</Text> 
      </Pressable>


    </View>
    
  )
}

export default Dashboard