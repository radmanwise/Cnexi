import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTranslation } from 'react-i18next';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (password !== password2) {
      setErrorMessage("Passwords don't match");
      fadeInAndOut();
      return;
    }

    try {
      const response = await axios.post('https://nexsocial.ir/register/', {
        username,
        email,
        password,
        password2,
      });

      console.log('Registration response:', response.data);

      const token = response.data.token;
      if (token && typeof token === 'string') {
        await SecureStore.setItemAsync('token', token);
      } else {
        throw new Error('Invalid token received from the server');
      }

      setTimeout(() => {
        navigation.navigate('ProfileScreen');
      }, 1000);

    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);

      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage('Invalid input. Please check your details.');
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

  const fadeInAndOut = (displayDuration = 8000, fadeDuration = 500) => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: fadeDuration,
          useNativeDriver: true,
        }).start();
      }, displayDuration);
    });
  };

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
          placeholder={t('Username')}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder={t('Email')}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder={t('Password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder={t('Confirm password')}
          secureTextEntry
          value={password2}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, top: 10 }}>{t('Register')}</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>
          {t('Already have an account? Login')}
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
    marginBottom: 40,
    borderRadius: 15,
  },
  welcome: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
