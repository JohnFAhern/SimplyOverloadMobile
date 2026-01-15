import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState, useContext } from 'react'
import { Link } from "expo-router"
import { authStyles as styles } from '../styles/authStyles'
import TalkContext from './context/TalkContext'
// colors:
// #181C14
// #3C3D37
// #697565
// #ECDFCC

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("Invalid Username or Password ⚠️")
    const { greet } = useContext(TalkContext)
  return (
    <View style={styles.container}>
        
        <View style={styles.boxContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerItem}>SimplyOverload💪</Text>
                
            </View>
            <View style={styles.labelAndInputContainer}>
                
                <View style={styles.labelAndTextContainer}>
                    <Text>{error}</Text>
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
            </View>
            <Pressable 
                style={styles.loginButton}
                onPress={() => greet("John")}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpItemText}>Dont Have an Account?</Text>
                <Link href='/signup' replace>
                    <Text style={styles.signUpItemLink}>SignUp</Text>
                </Link>
            </View>
            
        </View>
    </View>
  )
}

export default Login
