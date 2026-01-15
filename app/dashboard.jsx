import { View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { dashboardStyles as styles } from '../styles/dashboardStyles'

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
          <Text style={styles.headerItem}>Days</Text>
      </View>
      <ScrollView 
        style={styles.boxContainer}
        contentContainerStyle={{ gap: 15, paddingVertical: 15 }}
      >
        <Pressable 
          style={styles.dayButtonContainer}
          //onPress={() => greet("John")}
        >
          <Text 
            style={styles.daysButtonText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Push
          </Text>
        </Pressable>
      </ScrollView>


    </View>
  )
}

export default Dashboard