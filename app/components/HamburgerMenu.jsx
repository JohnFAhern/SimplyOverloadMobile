import { View, Text, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'

const HamburgerMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={{ padding: 8 }}
        hitSlop={10}
        testID="hamburger-btn"
      >
        <View style={{ gap: 5 }}>
          <View style={{ width: 24, height: 2.5, backgroundColor: '#3E3F29', borderRadius: 2 }} />
          <View style={{ width: 24, height: 2.5, backgroundColor: '#3E3F29', borderRadius: 2 }} />
          <View style={{ width: 24, height: 2.5, backgroundColor: '#3E3F29', borderRadius: 2 }} />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}
          onPress={() => setIsOpen(false)}
          testID="hamburger-overlay"
        >
          <Pressable
            onPress={() => {}}
            testID="hamburger-panel"
            style={{
              position: 'absolute',
              top: 70,
              right: 16,
              backgroundColor: '#F1F0E4',
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#697565',
              paddingVertical: 8,
              paddingHorizontal: 8,
              minWidth: 160,
              gap: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Pressable
              onPress={() => {
                setIsOpen(false)
                onLogout()
              }}
              testID="logout-btn"
              style={{
                paddingVertical: 14,
                paddingHorizontal: 20,
                backgroundColor: '#697565',
                borderRadius: 14,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontWeight: '500' }}>
                Logout
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

export default HamburgerMenu
