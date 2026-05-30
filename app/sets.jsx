import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useContext, useEffect } from 'react'
import { setStyles as styles } from '../styles/setStyles'
import { Link, useRouter } from "expo-router"
import ExerciseContext from './context/ExerciseContext'
import SetEntryContext from './context/SetEntryContext'
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

  const { currentExercise } = useContext(ExerciseContext)
  const { getSetEntries, createSetEntry, editSetEntry, deleteSetEntry } = useContext(SetEntryContext)

  const handleGetSets = async () => {
      try{
          const allData = await getSetEntries() || {}
          console.log("Backend response:", allData);
          const today = new Date().toISOString().split('T')[0]
          const sortedDates = Object.keys(allData).sort((a, b) => b.localeCompare(a))

          const todaySets = allData[today] || []
          const pastDates = sortedDates.filter(d => d !== today)
          const lastSessionSets = pastDates.length > 0 ? allData[pastDates[0]] : []
          const prevDates = pastDates.slice(1)
          const prevSessions = prevDates.length > 0
            ? Object.fromEntries(prevDates.map(d => [d, allData[d]]))
            : {}

          const allSets = Object.values(allData).flat()
          const allTimeHigh = allSets.reduce((max, s) => !max || s.weight > max.weight ? s : max, null)
          const lastSessionHigh = lastSessionSets.reduce((max, s) => !max || s.weight > max.weight ? s : max, null)

          setTodaysSession(todaySets)
          setLastSession(lastSessionSets)
          setPreviousSessions(prevSessions)
          setAllTimeHigh(allTimeHigh)
          setLastSessionHigh(lastSessionHigh)
      }catch(err) {
          setError(err || "Couldn't load Sets");
      };
  }

  useEffect(() => {
      if (!currentExercise) return;

      handleGetSets()

    }, [currentExercise, setToEdit]);

    const handleCreateSet = async () =>{
        setError("")
        try{
            await createSetEntry(reps, weight);
            await handleGetSets();
            setWeight(0);
            setReps(0);
        } catch(error){
            console.log("Create Set:", error)
            setError(error.response?.data?.message || "An error occurred during Create Set");
        }
    }
    const handleUpdateSet = async () =>{
        setError("")
        console.log("setToEdit:", setToEdit)
        console.log("setToEdit.setEntryId:", setToEdit?.setEntryId)
        if (!setToEdit?.setEntryId) {
            setError("No set selected to update")
            return
        }
        try{
            await editSetEntry(setToEdit.setEntryId, reps, weight);
            await handleGetSets();
            setWeight(0);
            setReps(0);
            setIsEditModalVisible(false);
            setSetToEdit(null);
        } catch(error){
            console.log("Create Set:", error)
            setError(error.response?.data?.message || "An error occurred during Create Set");
        }
    }

    const handleDeleteSet = async () =>{
        setError("")
        if (!setToEdit?.setEntryId) {
            setError("No set selected to delete")
            return
        }
        try{
            await deleteSetEntry(setToEdit.setEntryId);
            await handleGetSets();
            setIsEditModalVisible(false);
            setSetToEdit(null);
        } catch(error){
            console.log("Delete Set:", error)
            setError(error.response?.data?.message || "An error occurred during Delete Set");
        }
    }

    

  return (
    <SafeAreaView style={styles.container}>
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
        handleDeleteSet={handleDeleteSet}
        weight={weight}
        setWeight={setWeight}
        reps ={reps}
        setReps = {setReps}
        error={error}
        setToEdit={setToEdit}
        setSetToEdit={setSetToEdit}
      />
      <View style={[styles.headerContainer, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, color: '#3E3F29' }}>‹</Text>
          </Pressable>
          <Text style={[styles.headerItem, { flex: 2, textAlign: 'center', flexWrap: 'wrap' }]} numberOfLines={0}>
            {currentExercise?.exerciseName || "Loading..."}
          </Text>
          <View style={{ flex: 1 }} />
      </View>

      
      {allTimeHigh ? (
        <ScrollView 
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
        >
          <ShowPersonalBestButton
            title="Personal Best"
            allTimeHigh={allTimeHigh}
            lastSessionHigh={lastSessionHigh}
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
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#697565', fontSize: 18 }}>You have no sets</Text>
        </View>
      )}

      <Pressable 
          style={styles.defaultButton}
          onPress={() => {
            setIsModalVisible(true)
            console.log("Create Sets pressed")
          }}
      >
          <Text style={styles.defaultButtonText}>Enter Set</Text> 
      </Pressable>


    </SafeAreaView>
    
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

