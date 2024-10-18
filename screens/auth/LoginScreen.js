import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation state for error message
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://nexsocial.ir/login/', {
        username,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.token && response.data.user) {
        await SecureStore.setItemAsync('token', response.data.token);
        console.log('Token stored:', response.data.token);

        const storedToken = await SecureStore.getItemAsync('token');
        console.log('Retrieved token:', storedToken);

        await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
        console.log('User data stored:', response.data.user);
        navigation.navigate('home');
      } else {
        setErrorMessage('Unexpected response from server');
      }

    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid username or password');
        } else if (error.response.status === 403) {
          setErrorMessage('Your account has been locked. Please contact support.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else if (error.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }

      fadeInAndOut();
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     StatusBar.setBarStyle('dark-content'); 
  //     StatusBar.setBackgroundColor('#ffd7d5');

  //     return () => {
  //       StatusBar.setBarStyle('dark-content'); 
  //       StatusBar.setBackgroundColor('white'); 
  //     };
  //   }, [])
  // );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <LinearGradient
        // Gradient background colors
        colors={['#ff3b30', '#ffff']} 
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/nex-logo.jpg')}
              style={styles.image}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder={t('Username or email')}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Password')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, top: 10 }}>{t('Login')}</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('RegisterScreen')}>
            {t('Dont have an account? Register')}
          </Text>

          {errorMessage ? (
            <Animated.View style={{ ...styles.errorContainer, opacity: fadeAnim }}>
              <Text style={styles.error}>{errorMessage}</Text>
            </Animated.View>
          ) : null}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    paddingTop: 30,
  },
  input: {
    height: 60,
    borderColor: '#98bdd78f',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 15,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 70,
    padding: 10,
    backgroundColor: '#030071cf',
    borderRadius: 5,
  },
  error: {
    color: 'white',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'black',
    borderRadius: 30,
    height: 50,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 80,
    borderRadius: 15,
  },
});

export default LoginScreen;
