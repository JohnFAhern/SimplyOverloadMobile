import { View, Text, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from "expo-router"
import { authStyles as styles } from '../styles/authStyles'
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from "expo-router"
import AuthContext from './context/AuthContext'



const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()
    const { login } = useContext(AuthContext)


    const handleSubmit = async () => {
        setError("")
        try {
            console.log("handle submitpressed")
            await login(email, password);
            router.replace('/dashboard');
        } catch(error) {
            console.log("Login:", error)
            setError("An error occurred during login");
        }
    }


  return (
    <SafeAreaView style={styles.container}>
        
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
                onPress={handleSubmit}
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
    </SafeAreaView>
  )
}

export default Login
