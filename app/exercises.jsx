import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import DayContext from './context/DayContext'
import ExerciseContext from './context/ExerciseContext'
import CreateExerciseModal from './components/CreateExerciseModal'
import UpdateModal from './components/updateModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState(null)

  const router = useRouter()

  const { currentDay } = useContext(DayContext)
  const { exerciseList, selectExercise, createExercise, getExercises, editExercise, deleteExercise } = useContext(ExerciseContext)

  useEffect(() => {
      if (!currentDay) return;

      getExercises().catch(err => setError("Couldn't load Exercises"));

    }, [currentDay]);

    const handleExerciseSelect = async (exercise) => {
      await selectExercise(exercise)
      router.push("/sets")
    }

    const toTitleCase = (str) => {
      return str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }

    const handleCreateExercise = async () => {
        setError("")
        
        const name = toTitleCase(newExerciseName)

        if (!name || !name.trim()) {
            setError("Exercise name cannot be empty.")
            return
        }
        if (exerciseList.some((e) => e.exerciseName === name)) {
            setError(`${name} already exists!`);
            return;
        }
        try {
            await createExercise(name);
            await getExercises();
        } catch(error) {
            console.log("Create Exercise:", error)
            setError(error.response?.data?.message || "An error occurred during Create Exercise");
        }
    }

    const handleUpdateExercise = async () => {
        setError("")

        const name = toTitleCase(newExerciseName)

        if (!name || !name.trim()) {
            setError("Exercise name cannot be empty.")
            return
        }
        if (!exerciseToEdit?.exerciseId) {
            setError("No exercise selected to update")
            return
        }
        try {
            await editExercise(exerciseToEdit.exerciseId, name);
        } catch(error) {
            console.log("Update Exercise:", error)
            setError(error.response?.data?.message || "An error occurred during Update Exercise");
        }
    }

    const handleDeleteExercise = async () => {
        setError("")
        if (!exerciseToEdit?.exerciseId) {
            setError("No exercise selected to delete")
            return
        }
        try {
            await deleteExercise(exerciseToEdit.exerciseId);
        } catch(error) {
            console.log("Delete Exercise:", error)
            setError(error.response?.data?.message || "An error occurred during Delete Exercise");
        }
    }

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={[styles.headerContainer, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, color: '#3E3F29' }}>‹</Text>
          </Pressable>
          <Text style={[styles.headerItem, { flex: 2, textAlign: 'center' }]}>{currentDay.dayName}</Text>
          <View style={{ flex: 1 }} />
      </View>
      {exerciseList == null ? (
        <Text>Loading</Text>
      ) : exerciseList.length === 0 ? (
        <Text> You Dont Have Any Exercises!</Text>
      ) : (
        <ScrollView 
          style={styles.boxContainer}
          contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
        >
          {exerciseList.map((exercise) => (
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


    </SafeAreaView>
    
  )
}

export default Dashboard