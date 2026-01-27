import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { setStyles as styles } from '../../styles/setStyles'

const ShowPersonalBestButton = ({ title, allTimeHigh, lastSessionHigh, isVisible, setVisibility }) => {
  return (
    <View style={styles.testContainer}>
        <Pressable 
            style={styles.displaySessionsButton}
            onPress={() => setVisibility(!isVisible)}
        >
            <Text style={styles.defaultButtonText}>{title} {isVisible ? '-' : '+'}</Text> 
        </Pressable>
        {isVisible && (
          <View style={styles.PersonalBestContainer}>
            {allTimeHigh && (
              <>
                <Text style={styles.defaultButtonText}>All Time High:</Text>
                <Text style={styles.defaultButtonText}>{allTimeHigh.weight} lbs x {allTimeHigh.reps} reps</Text>
                {lastSessionHigh && (
                  <Text style={{ color: 'white', fontSize: 20, marginTop: -10, marginBottom: 8 }}>______________________________</Text>
                )}
              </>
            )}
            {lastSessionHigh && (
              <>
                <Text style={styles.defaultButtonText}>Last Session High:</Text>
                <Text style={styles.defaultButtonText}>{lastSessionHigh.weight} lbs x {lastSessionHigh.reps} reps</Text>
              </>
            )}
          </View>
        )}
    </View>
  )
}

export default ShowPersonalBestButton