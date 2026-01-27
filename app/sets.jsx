import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { setStyles as styles } from '../styles/setStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateSetModal from './components/CreateSetModal'
import ShowSessionButton from './components/showSessionButton'
import ShowPersonalBestButton from './components/showPersonalBestButton'

const Dashboard = () => {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [sets, setSets] = useState([])
  const [todaysSession, setTodaysSession] = useState(null)
  const [isTodaysSessionVisible, setIsTodaysSessionVisible] = useState(false)
  const [lastSession, setLastSession] = useState(null)
  const [isLastSessionVisible, setIsLastSessionVisible] = useState(true)
  const [isPreviousSessionsVisible, setIsPreviousSessionsVisible] = useState(false)
  const [previousSessions, setPreviousSessions] = useState(null)
  const [allTimeHigh, setAllTimeHigh] = useState(null)
  const [lastSessionHigh, setLastSessionHigh] = useState(null)
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)
  const [isPersonalBestVisible, setIsPersonalBestVisible] = useState(false)

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { setCurrentExercise, currentExercise, getSets, createSets } = useContext(ExerciseContext)
  useEffect(() => {
      if (!currentUser || !currentExercise) return;  

      getSets(currentExercise.exercise_id)
          .then(res => {
              console.log("Backend response:", res.data);
              console.log("todaysSession:", res.data.todaySession);
              setTodaysSession(res.data.todaySession)
              setLastSession(res.data.lastSession);
              setPreviousSessions(res.data.previousSessions);
              setAllTimeHigh(res.data.allTimeHigh)
              setLastSessionHigh(res.data.lastSessionHigh)
            
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

      
      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
      >
        <ShowPersonalBestButton
          title="Personal Best"
          allTimeHigh = {allTimeHigh}
          lastSessionHigh = {lastSessionHigh}
          isVisible={isPersonalBestVisible}
          setVisibility={setIsPersonalBestVisible}
        />
        <ShowSessionButton
          title="Todays Session"
          sessionArray={todaysSession}
          isVisible={isTodaysSessionVisible}
          setVisibility={setIsTodaysSessionVisible}
        />
        <ShowSessionButton
          title="Last Session"
          sessionArray={lastSession}
          isVisible={isLastSessionVisible}
          setVisibility={setIsLastSessionVisible}
        />

        <ShowSessionButton
          title="Previous Sessions"
          sessionArray={previousSessions}
          isVisible={isPreviousSessionsVisible}
          setVisibility={setIsPreviousSessionsVisible}
        />
      </ScrollView>

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

