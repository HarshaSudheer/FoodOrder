import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { validateEmail } from "../utils/validation";

const Onboarding = ({ navigation, route }) => {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [enableNext, setEnableNext] = useState(false);

    useEffect(() => {
        if (firstName !== "" && validateEmail(email) !== null) {
            setEnableNext(true);
        }
        else {
            setEnableNext(false);
        }
    }, [firstName, email]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require("../assets/images/logo.png")} />
                <Text style={styles.headerText}>LITTLE LEMON</Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={{ fontSize: 18 }}>Let us get to know you</Text>
                <View>
                    <Text style={styles.formLabel}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Text style={styles.formLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable disabled={!enableNext} style={enableNext ? styles.buttonEnable : styles.button} onPress={() => { route.params.saveEmail(email) }}>
                    <Text style={{ textAlign: "center" }}>Next</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#EDEFEE",
        padding: 35,
        paddingBottom: 10
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: "contain"
    },
    headerText: {
        // fontFamily: "Markazi Text",
        fontWeight: '500',
        fontSize: 30,
        color: "#F4CE14",
        lineHeight: 70
    },
    formContainer: {
        paddingVertical: 55,
        backgroundColor: "#C9C9C9",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    formLabel: {
        textAlign: "center",
        marginVertical: 10,
        fontSize: 18
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: "#333333",
        borderRadius: 8
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 20,
        backgroundColor: "#EDEFEE"
    },
    button: {
        backgroundColor: "#C9C9C9",
        padding: 10,
        width: 90,
        borderRadius: 8
    },
    buttonEnable: {
        backgroundColor: "#495E57",
        color: "white",
        padding: 10,
        width: 90,
        borderRadius: 8
    }
});

export default Onboarding;