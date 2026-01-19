import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F0E4",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        gap: 10
        
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
        flex: 1,
        alignSelf: "center",
        width: "95%",
        borderWidth: 2,
        borderColor: "#7D8D86",
        borderRadius: 50,
        paddingVertical: 10,
    },
    defaultButton: {
        height: 70,
        width: "60%",
        backgroundColor: "#7D8D86",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#F3EEE2",
        justifyContent: "center",
        alignSelf: "center",
    },
    defaultButtonText: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
    },
    headerContainer: {
        height: "8%",
        justifyContent: "center",
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
    dayButtonContainer: {
        justifyContent: "center",
        alignSelf: "center",
        alignContent: "center",
        backgroundColor: "#697565",
        height: 135,
        width: "90%",
        borderWidth: 2,
        borderColor: "#F3EEE2",
        borderRadius: 40,
    },
    daysButtonText: {
        textAlign: "center",
        color: "white",
        fontSize: 45,
    },
    modalContainer: {
        width: "100%",
        flex: 1,
        alignSelf: "center",
        height: "100%",
        backgroundColor: "#F1F0E4",
        justifyContent: "center",
        gap: 30,
        justifyContent: "center",
        alignContent: "center",
        padding: 20,
    }
});
