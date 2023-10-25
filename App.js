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

  const fetchEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("email");
      setEmailStored(userEmail);
    }
    catch (err) {
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
    fetchEmail();
  }, []);

  useEffect(() => {
    if(emailStored !== ""){
      handleOnboarding();
    }
  }, [emailStored]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted ?
          <Stack.Screen name="Profile" component={Profile} options={{ headerTitle: () => <Image style={{height: 50, width: 200}} source={require("./assets/images/title.png")}/> }} initialParams={{ setEmailStored: setEmailStored }}/>
          :
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} initialParams={{ setEmailStored: setEmailStored }} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
