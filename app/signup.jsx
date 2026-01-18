import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState, useContext } from 'react'
import { Link, useRouter } from "expo-router"
import { authStyles as styles } from '../styles/authStyles'
import AuthContext from './context/AuthContext'
// colors:
// #181C14
// #3C3D37
// #697565
// #ECDFCC

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()
    const { register, setUser } = useContext(AuthContext)

    const handleSubmit = async () =>{
        setError("")
        
        if (password !== confirmPassword){
            setError("Passwords Dont Match!")
            return
        }

        try{
            const res = await register(email, password);
            console.log("Response from server:", res.data);
            if (res.data.status === "success"){
                let userID = parseInt(res.data.user_id)
                console.log("Setting user ID to:", userID);
                setUser(userID)
                console.log("Navigating to dashboard...");
                router.push("/dashboard");
            } else {
                setError("Invalid email or password");
            }
        }catch(error){
            console.log("Login:", error)
            setError("An error occurred during login");
        }
    }

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
                <View style={styles.labelAndTextContainer}>
                    <Text style={styles.labelItem}> Confirm Password:</Text>
                    <TextInput
                        style={styles.textInputItem}
                        secureTextEntry={true}
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        onChangeText={setConfirmPassword}
                    />
                </View>
            </View>
            <Pressable 
              style={styles.loginButton}
              onPress={handleSubmit}>
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
