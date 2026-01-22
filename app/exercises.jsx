import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateExerciseModal from './components/CreateExerciseModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [exercises, setExercises] = useState([])

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { currentDay, setCurrentDay, getExercises, createExercise, } = useContext(ExerciseContext)
  useEffect(() => {
      if (!currentUser) return;  

      getExercises(currentDay.day_id)
          .then(res => {
              setExercises(res.data.exercises);
          })
          .catch(err => {
              setError(err ||"Couldn't load Exercises");
          });

    }, [currentUser]);

    const handleCreateExercise = async () =>{
        setError("")
        if (exercises.some((e) => e.exercise_name === newExerciseName)) {
            setError(`${newExerciseName} already exists!`);
            return;
        }
        try{
            const res = await createExercise(newExerciseName);
            console.log("Response from server:", res.data);
            if (res.data.status === "success"){
                await getExercises(currentDay.day_id).then((res) => {
                    setExercises(res.data.exercises);
                });
            }
        }catch(error){
            console.log("Create Exercise:", error)
            setError(error.response?.data?.message || "An error occurred during Create Exercise");
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
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>{currentDay.day_name}</Text>
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
              key={exercise}
            >
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {exercise.exercise_name}
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