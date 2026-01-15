import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F0E4",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    labelAndTextContainer: {
        justifyContent: "center",
        alignSelf: "center",
        width: "80%",
        gap: 10,
        padding: 10,
    },
    labelItem: {
        justifyContent: "center",
        textAlign: "center",
        fontSize: 30,
        color: "#3E3F29",
    },
    textInputItem: {
        height: 50,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: "#3E3F29",
        textAlign: "center",
        fontSize: 20,
    },
    boxContainer: {
        justifyContent: "center",
        alignSelf: "center",
        alignContent: "center",
        height: "95%",
        width: "95%",
        borderWidth: 2,
        borderColor: "#7D8D86",
        borderRadius: 50,
    },
    loginButton: {
        height: 70,
        width: "60%",
        backgroundColor: "#7D8D86",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#F3EEE2",
        justifyContent: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
    },
    headerContainer: {
        height: "15%",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#697565",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    headerItem: {
        textAlign: "center",
        fontSize: 40,
        color: "#3E3F29",
    },
    labelAndInputContainer: {
        height: "55%",
        justifyContent: "center",
        gap: 30,
    },
    signUpContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center"
    },
    signUpItemText: {
        padding: 10,
        textAlign: "center",
        fontSize: 15,
    },
    signUpItemLink: {
        padding: 10,
        textAlign: "center",
        fontSize: 15,
        color: "blue"
    }
});
