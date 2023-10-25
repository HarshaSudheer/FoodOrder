import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [emailStored, setEmailStored] = useState("");
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAndSaveEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("email");
      // await AsyncStorage.clear();
      setEmailStored(userEmail);
    }
    catch (err) {
      console.log(err);
    }
  }

  const saveEmail = async (userEmail) => {
    try {
      await AsyncStorage.setItem(
        'email',
        userEmail,
      );
      setEmailStored(userEmail);
    } catch (err) {
      console.log(err);
    }
  }

  const handleOnboarding = () => {
    if (emailStored !== null) {
      setIsOnboardingCompleted(true);
    }
    else {
      setIsOnboardingCompleted(false);
    }
    setIsLoading(false);

  }

  useEffect(() => {
    getAndSaveEmail();
  }, []);

  useEffect(() => {
    handleOnboarding();
  }, [emailStored]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding">
        {isOnboardingCompleted ?
          <Stack.Screen name="Profile" component={Profile} />
          :
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} initialParams={{ saveEmail: saveEmail }} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
