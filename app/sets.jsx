import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateSetModal from './components/CreateSetModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [exercises, setExercises] = useState([])
  const[sets, setSets] = useState([])
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { currentDay, setCurrentDay, getExercises, createExercise, setCurrentExercise, currentExercise, getSets } = useContext(ExerciseContext)
  useEffect(() => {
      if (!currentUser || !currentExercise) return;  

      getSets(currentExercise.exercise_id)
          .then(res => {
              setSets(res.data.sets);
          })
          .catch(err => {
              setError(err ||"Couldn't load Sets");
          });

    }, [currentExercise]);

    const handleCreateSet = async () =>{
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
    const handleExerciseSelect = (exercise) => {
      setCurrentExercise(exercise)
      router.push("/sets")
    }

  return (
    <View style={styles.container}>
      <CreateSetModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        handleCreateSet={handleCreateSet}
        weight={weight}
        setWeight={setWeight}
        reps ={reps}
        setReps = {setReps}
        error={error}
      />
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>{currentExercise?.exercise_name || "Loading..."}</Text>
      </View>
      {sets == null ? (
        <Text>Loading</Text>
      ) : sets.length === 0 ? (
        <Text> You Dont Have Any Sets!</Text>
      ) : (
        <ScrollView 
          style={styles.boxContainer}
          contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
        >
          {exercises.map((set) => (
            <Pressable 
              style={styles.dayButtonContainer}
              key={exercise.exercise_id}
              onPress={() => handleExerciseSelect(exercise.exercise_id)}
            >
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Weight: {set.weight}
                Reps: {set.reps}
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