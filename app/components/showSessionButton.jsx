import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { setStyles as styles } from '../../styles/setStyles'

const ShowSessionButton = ({ title, sessionArray, isVisible, setVisibility, setToEdit, setSetToEdit, setIsEditModalVisible, setWeight, setReps }) => {
  return (
    <View style={styles.testContainer}>
        <Pressable 
            style={styles.displaySessionsButton}
            onPress={() => setVisibility(!isVisible)}
            
        >
            <Text style={styles.defaultButtonText}>{title} {isVisible ? '-' : '+'}</Text> 
        </Pressable>
        {isVisible && (
          <View style={{ width: '100%' }}>
            {sessionArray == null || sessionArray === undefined ? (
              <Text style={{ textAlign: 'center', color: '#697565' }}>Loading</Text>
            ) : Object.keys(sessionArray).length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#697565', fontSize: 16, paddingVertical: 10 }}>No sets yet</Text>
            ) : Array.isArray(sessionArray) && sessionArray.length > 0 ? (
              <ScrollView
                style={[styles.boxContainer, { flex: 0, maxHeight: 350 }]}
                contentContainerStyle={{ gap: 10, paddingVertical: 12 }}
              >
                {sessionArray.map((set, index) => (
                  <Pressable
                    style={[styles.dayButtonContainer, { height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }]}
                    key={set.setEntryId || `set-${index}`}
                    onLongPress={() => {
                      setSetToEdit(set)
                      setWeight(set.weight)
                      setReps(set.reps)
                      setIsEditModalVisible(true)
                    }}
                  >
                    <Text style={[styles.daysButtonText, { fontSize: 16, opacity: 0.6, width: 28 }]}>
                      #{index + 1}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.daysButtonText, { fontSize: 28, fontWeight: 'bold' }]}>{set.weight}</Text>
                        <Text style={[styles.daysButtonText, { fontSize: 12, opacity: 0.75 }]}>lbs</Text>
                      </View>
                      <Text style={[styles.daysButtonText, { fontSize: 22, opacity: 0.6 }]}>×</Text>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.daysButtonText, { fontSize: 28, fontWeight: 'bold' }]}>{set.reps}</Text>
                        <Text style={[styles.daysButtonText, { fontSize: 12, opacity: 0.75 }]}>reps</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : typeof sessionArray === 'object' && Object.keys(sessionArray).length > 0 ? (
              <ScrollView
                style={[styles.boxContainer, { flex: 0, maxHeight: 1000 }]}
                contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
              >
                {Object.entries(sessionArray).map(([date, sets]) => (
                  <View key={date} style={{ gap: 8 }}>
                    <Text style={{ color: '#3E3F29', fontSize: 15, fontWeight: '600', textAlign: 'center', opacity: 0.8 }}>
                      {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    {sets.map((set, index) => (
                      <Pressable
                        style={[styles.dayButtonContainer, { height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }]}
                        key={set.setEntryId || `${date}-set-${index}`}
                        onLongPress={() => {
                          setSetToEdit(set)
                          setWeight(set.weight)
                          setReps(set.reps)
                          setIsEditModalVisible(true)
                        }}
                      >
                        <Text style={[styles.daysButtonText, { fontSize: 16, opacity: 0.6, width: 28 }]}>
                          #{index + 1}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                          <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.daysButtonText, { fontSize: 28, fontWeight: 'bold' }]}>{set.weight}</Text>
                            <Text style={[styles.daysButtonText, { fontSize: 12, opacity: 0.75 }]}>lbs</Text>
                          </View>
                          <Text style={[styles.daysButtonText, { fontSize: 22, opacity: 0.6 }]}>×</Text>
                          <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.daysButtonText, { fontSize: 28, fontWeight: 'bold' }]}>{set.reps}</Text>
                            <Text style={[styles.daysButtonText, { fontSize: 12, opacity: 0.75 }]}>reps</Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center', color: '#697565' }}>No data</Text>
            )}
          </View>
        )}
    </View>
  )
}

export default ShowSessionButton