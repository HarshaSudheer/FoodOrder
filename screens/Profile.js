import { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from 'expo-checkbox';

import { validatePhNumber } from "../utils/validation";

const Profile = ({ navigation, route }) => {
    const [initials, setInitials] = useState("HS");

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phNumber, setPhNumber] = useState("");

    const [isOrderStatusesSelected, setIsOrderStatusesSelected] = useState(false);
    const [isPasswordChangesSelected, setIsPasswordChangesSelected] = useState(false);
    const [isSpecialOffersSelected, setIsSpecialOffersSelected] = useState(false);
    const [isNewsletterSelected, setIsNewsletterSelected] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <View style={styles.profileHeaderContainer}><Text style={{ color: "white" }}>{initials}</Text></View>
        });
    });

    const fetchDetails = async () => {
        try {
            const detailsArr = await AsyncStorage.multiGet(["firstName", "lastName", "email", "phNumber", "isOrderStatusesSelected", "isPasswordChangesSelected", "isSpecialOffersSelected", "isNewsletterSelected"]);
            const detailsObject = detailsArr.reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
            setFirstName(detailsObject.firstName);
            setLastName(detailsObject.lastName);
            setEmail(detailsObject.email);
            setPhNumber(detailsObject.phNumber);
            setIsOrderStatusesSelected(JSON.parse(detailsObject.isOrderStatusesSelected));
            setIsPasswordChangesSelected(JSON.parse(detailsObject.isPasswordChangesSelected));
            setIsSpecialOffersSelected(JSON.parse(detailsObject.isSpecialOffersSelected));
            setIsNewsletterSelected(JSON.parse(detailsObject.isNewsletterSelected));
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchInitials = async () => {
        try {
            const nameArr = await AsyncStorage.multiGet(["firstName", "lastName"]);
            const nameObj = nameArr.reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
            let userIntitals = "";
            if (nameObj.firstName !== null) {
                userIntitals = nameObj.firstName[0];
                setInitials(userIntitals);
            }
            if (nameObj.lastName !== null) {
                userIntitals += nameObj.lastName[0]
                setInitials(userIntitals);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchDetails();
        fetchInitials();
    }, []);

    const saveNotifications = async () => {
        try {
            await AsyncStorage.multiSet([["isOrderStatusesSelected", JSON.stringify(isOrderStatusesSelected)], ["isPasswordChangesSelected", JSON.stringify(isPasswordChangesSelected)], ["isSpecialOffersSelected", JSON.stringify(isSpecialOffersSelected)], ["isNewsletterSelected", JSON.stringify(isNewsletterSelected)]]);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSave = async () => {
        try {
            await AsyncStorage.multiSet([["email", email], ["firstName", firstName]]);
            if(lastName !== null){
                await AsyncStorage.setItem("lastName", lastName);
            }
            if(phNumber !== null && validatePhNumber(phNumber)){
                await AsyncStorage.setItem("phNumber", phNumber);
            }
            saveNotifications();
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = async () => {
        try{
            await AsyncStorage.clear();
            route.params.setEmailStored(null);
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>Personal Information</Text>
                <Text style={styles.profileText}>Avatar</Text>
                <View style={styles.avatarContainer}>
                    <View style={styles.profileContainer}><Text style={{ color: "white" }}>{initials}</Text></View>
                    <Pressable style={[styles.focusButton, { marginLeft: 20 }]}>
                        <Text style={styles.focusButtonText}>Change</Text>
                    </Pressable>
                    <Pressable style={[styles.button, { marginLeft: 20 }]}>
                        <Text>Remove</Text>
                    </Pressable>
                </View>
                <View>
                    <Text style={styles.formText}>First name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder='First name'
                    />
                    <Text style={styles.formText}>Last name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder='Last name'
                    />
                    <Text style={styles.formText}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder='Email'
                    />
                    <Text style={styles.formText}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        value={phNumber}
                        onChangeText={setPhNumber}
                        keyboardType="phone-pad"
                        placeholder='Phone number'
                    />
                </View>
                <View>
                    <Text style={styles.heading}>Email notifications</Text>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isOrderStatusesSelected}
                            onValueChange={setIsOrderStatusesSelected}
                            color="#495E57"
                            style={styles.checkbox}
                        />
                        <Text>Order statuses</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isPasswordChangesSelected}
                            onValueChange={setIsPasswordChangesSelected}
                            color="#495E57"
                            style={styles.checkbox}
                        />
                        <Text>Password changes</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isSpecialOffersSelected}
                            onValueChange={setIsSpecialOffersSelected}
                            color="#495E57"
                            style={styles.checkbox}
                        />
                        <Text>Special offers</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isNewsletterSelected}
                            onValueChange={setIsNewsletterSelected}
                            color="#495E57"
                            style={styles.checkbox}
                        />
                        <Text>Newsletter</Text>
                    </View>
                </View>
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={{ fontWeight: "500" }}>Log out</Text>
                </Pressable>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button}>
                        <Text>Discard changes</Text>
                    </Pressable>
                    <Pressable style={styles.focusButton} onPress={handleSave}>
                        <Text style={styles.focusButtonText}>Save changes</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeaderContainer: {
        backgroundColor: "#495E57",
        height: 40,
        width: 40,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    heading: {
        fontWeight: '500',
        fontSize: 18,
        marginTop: 20
    },
    profileText: {
        fontSize: 12,
        color: "#4D4D4D",
        fontWeight: "400"
    },
    avatarContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginVertical: 10
    },
    profileContainer: {
        backgroundColor: "#495E57",
        height: 80,
        width: 80,
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    focusButton: {
        backgroundColor: "#495E57",
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    focusButtonText: {
        color: "white"
    },
    button: {
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1
    },
    formText: {
        fontSize: 12,
        color: "#4D4D4D",
        fontWeight: "500",
        marginBottom: 5
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: "#BCBEBD",
        borderRadius: 8,
        marginBottom: 30
    },
    checkboxContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 25
    },
    checkbox: {
        marginRight: 10
    },
    logoutButton: {
        backgroundColor: "#F4CE14",
        marginTop: 35,
        height: 40,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20,
        marginHorizontal: 20
    },
});

export default Profile;