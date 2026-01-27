import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { setStyles as styles } from '../../styles/setStyles'

const ShowSessionButton = ({ title, sessionArray, isVisible, setVisibility }) => {
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
              <Text>Loading</Text>
            ) : Array.isArray(sessionArray) && sessionArray.length === 0 ? (
              <Text>You Don't Have Any Sets!</Text>
            ) : Array.isArray(sessionArray) && sessionArray.length > 0 ? (
              <ScrollView 
                style={[styles.boxContainer, { flex: 0, maxHeight: 300 }]}
                contentContainerStyle={{ gap: 20, paddingVertical: 15 }}
              >
                {sessionArray.map((set, index) => (
                  <Pressable 
                    style={styles.dayButtonContainer}
                    key={set.set_entry_id || `set-${index}`}
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
            ) : typeof sessionArray === 'object' && Object.keys(sessionArray).length > 0 ? (
              <ScrollView 
                style={[styles.boxContainer, { flex: 0, maxHeight: 1000 }]}
                contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
              >
                {Object.entries(sessionArray).map(([date, sets]) => (
                  <View key={date} style={{ gap: 10, marginBottom: 10 }}>
                    <Text style={[styles.daysButtonText, { color: '#3E3F29', fontSize: 18, fontWeight: 'bold' }]}>
                      {new Date(date).toLocaleDateString()}
                    </Text>
                    {sets.map((set, index) => (
                      <Pressable 
                        style={styles.dayButtonContainer}
                        key={set.set_entry_id || `${date}-set-${index}`}
                      >
                        <Text 
                          style={styles.daysButtonText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {set.weight} lbs x {set.reps} reps
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text>Invalid session data</Text>
            )}
          </View>
        )}
    </View>
  )
}

export default ShowSessionButton