import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { setStyles as styles } from '../styles/setStyles'
import { Link, useRouter } from "expo-router"
import AuthContext from './context/AuthContext'
import ExerciseContext from './context/ExerciseContext'
import CreateSetModal from './components/CreateSetModal'
import UpdateSetModal from './components/updateSetModal'
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
  const [setToEdit, setSetToEdit] = useState(null)
  const [isPersonalBestVisible, setIsPersonalBestVisible] = useState(true)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  const router = useRouter()

  const { currentUser } = useContext(AuthContext)
  const { setCurrentExercise, currentExercise, getSets, createSets, updateSet } = useContext(ExerciseContext)

  const handleGetSets = async () => {
    
      try{
          const res = await getSets(currentExercise.exercise_id)
          console.log("Backend response:", res.data);
          console.log("todaysSession:", res.data.todaySession);
          setTodaysSession(res.data.todaySession)
          setLastSession(res.data.lastSession);
          setPreviousSessions(res.data.previousSessions);
          setAllTimeHigh(res.data.allTimeHigh)
          setLastSessionHigh(res.data.lastSessionHigh)
        
      }catch(err) {
          setError(err ||"Couldn't load Sets");
      };

  }

  useEffect(() => {
      if (!currentUser || !currentExercise) return;  

      handleGetSets()


    }, [currentExercise, setToEdit]);

    const handleCreateSet = async () =>{
        setError("")
        try{
            const res = await createSets(weight, reps);
            console.log("Create set response:", res.data);
          if (res.data.status === "success") {
            await getSets(currentExercise.exercise_id);
            //console.log("Refreshed sets:", newRes.data);
            setSets(newRes.data.sets || []);

            setWeight(0);
            setReps(0);
          }
        } catch(error){
            console.log("Create Set:", error)
            setError(error.response?.data?.message || "An error occurred during Create Set");
        }
    }
    const handleUpdateSet = async () =>{
        setError("")
        console.log("setToEdit:", setToEdit)
        console.log("setToEdit.set_entry_id:", setToEdit?.set_entry_id)
        if (!setToEdit?.set_entry_id) {
            setError("No set selected to update")
            return
        }
        try{
            const res = await updateSet(setToEdit.set_entry_id, weight, reps);
            console.log("Update set response:", res.data);
          if (res.data.status === "success") {
            await handleGetSets();

            setWeight(0);
            setReps(0);
            setIsEditModalVisible(false);
            setSetToEdit(null);
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
        setToEdit={setToEdit}
        setSetToEdit={setSetToEdit}
        setIsEditModalVisible={setIsEditModalVisible}
      />
      <UpdateSetModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        handleUpdateSet={handleUpdateSet}
        weight={weight}
        setWeight={setWeight}
        reps ={reps}
        setReps = {setReps}
        error={error}
        setToEdit={setToEdit}
        setSetToEdit={setSetToEdit}
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
          setToEdit={setToEdit}
          setSetToEdit={setSetToEdit}
          setIsEditModalVisible={setIsEditModalVisible}
          setWeight={setWeight}
          setReps={setReps}
        />
        <ShowSessionButton
          title="Last Session"
          sessionArray={lastSession}
          isVisible={isLastSessionVisible}
          setVisibility={setIsLastSessionVisible}
          setToEdit={setToEdit}
          setSetToEdit={setSetToEdit}
          setIsEditModalVisible={setIsEditModalVisible}
          setWeight={setWeight}
          setReps={setReps}
        />

        <ShowSessionButton
          title="Previous Sessions"
          sessionArray={previousSessions}
          isVisible={isPreviousSessionsVisible}
          setVisibility={setIsPreviousSessionsVisible}
          setToEdit={setToEdit}
          setSetToEdit={setSetToEdit}
          setIsEditModalVisible={setIsEditModalVisible}
          setWeight={setWeight}
          setReps={setReps}
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

/*
re-usable edit modal:

modal takes:
  a hashmap containing

  title = {
    objToEdit -- setToEdit

    [variable1 updateVariable1 --- weight: updateWeight
    variable2: updateVariable2 -- reps: updateReps] -- this should be an array of variables and their function

    vairable1 = [var1, updateVar1]
    vairable2 = [var2, updateVar2]

    variables =  [variable1, variable2]

    variables.map((var) => {
        <Text> input
      })

    submit: submitFunction ------ handleUpdateSets
  }



*/

