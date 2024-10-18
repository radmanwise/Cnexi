import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
          console.log('Stored Token: ', token);
        }
        else{
          console.log('token not found');
        };
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    getToken();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          navigation.navigate('home');
        } else {
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.navigate('LoginScreen');
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      checkLoginStatus();
    }, 0);

    return () => clearTimeout(timer);
  }, [navigation]);


  return null;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  animation: {
    marginTop: -55,
    width: '70%', 
    height: '70%',
    transform: [{ rotate: '48deg' }], 
  },
});

export default SplashScreen;
