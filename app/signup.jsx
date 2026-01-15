import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Link } from "expo-router"
import { authStyles as styles } from './styles/authStyles'
// colors:
// #181C14
// #3C3D37
// #697565
// #ECDFCC

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
  return (
    <View style={styles.container}>
        
        <View style={styles.boxContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerItem}>SimplyOverload💪</Text>
            </View>
            <View style={styles.labelAndInputContainer}>
                <View style={styles.labelAndTextContainer}>
                    <Text style={styles.labelItem}> Enter Email:</Text>
                    <TextInput
                        style={styles.textInputItem}
                        value={email}
                        placeholder='Email'
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.labelAndTextContainer}>
                    <Text style={styles.labelItem}> Enter Password:</Text>
                    <TextInput
                        style={styles.textInputItem}
                        secureTextEntry={true}
                        value={password}
                        placeholder='Password'
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.labelAndTextContainer}>
                    <Text style={styles.labelItem}> Confirm Password:</Text>
                    <TextInput
                        style={styles.textInputItem}
                        secureTextEntry={true}
                        value={password}
                        placeholder='Confirm Password'
                        onChangeText={setConfirmPassword}
                    />
                </View>
            </View>
            <Pressable style={styles.loginButton}>
                <Text style={styles.loginButtonText}>SignUp</Text>
            </Pressable>
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpItemText}>Already have an account?</Text>
                <Link href='/login' replace>
                    <Text style={styles.signUpItemLink}>Login</Text>
                </Link>
            </View>
            
        </View>

    </View>
  )
}

export default SignUp
