import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { setStyles as styles } from '../styles/setStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateSetModal from './components/CreateSetModal'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const[sets, setSets] = useState([])
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { currentDay, setCurrentDay, getExercises, createExercise, setCurrentExercise, currentExercise, getSets, createSets } = useContext(ExerciseContext)
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
        try{
            const res = await createSets(weight, reps);
            console.log("Create set response:", res.data);
          if (res.data.status === "success") {
            const newRes = await getSets(currentExercise.exercise_id);
            console.log("Refreshed sets:", newRes.data);
            setSets(newRes.data.sets || []);

            setWeight(0);
            setReps(0);
          }
        } catch(error){
            console.log("Create Set:", error)
            setError(error.response?.data?.message || "An error occurred during Create Set");
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
          <Text style={[styles.headerItem, { flexWrap: 'wrap' }]} numberOfLines={0}>
            {currentExercise?.exercise_name || "Loading..."}
          </Text>
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
          {sets.map((set) => (
            <Pressable 
              style={styles.dayButtonContainer}
              key={set.set_entry_id}
            >
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Date: {new Date(set.created_at).toLocaleDateString()}
              </Text>
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Weight: {set.weight} lbs
              </Text>
              <Text 
                style={styles.daysButtonText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
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
            console.log("Create Sets pressed")
          }}
      >
          <Text style={styles.defaultButtonText}>Enter Set</Text> 
      </Pressable>


    </View>
    
  )
}

export default Dashboard

