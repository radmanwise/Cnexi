import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import Checkbox from 'expo-checkbox';

const PasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rememberMe, setRememberMe] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  const fadeInError = (msg) => {
    setErrorMessage(msg);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setErrorMessage(''));
      }, 3000);
    });
  };

  const handleNext = () => {
    if (!password) return fadeInError('Password is required');
    if (password.length < 6) return fadeInError('Password must be at least 6 characters');
    // مرحله بعدی بعد از ساخت پسورد
    navigation.navigate('HomeScreen');
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.title}>Create a password</Text>
          <Text style={styles.subtitle}>
            You'll use this to sign in to your account.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={true}
          />

          <View style={styles.rememberMeContainer}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? '#0e0e0f' : undefined}
            />
            <Text style={styles.rememberMeText}>Remember me on this device</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <Text style={styles.errorText}>{errorMessage}</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Manrope',
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Manrope',
    color: '#4e4e4e',
    marginBottom: 30,
    width: 280,
  },
  input: {
    height: 55,
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: 'Manrope',
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMeText: {
    fontSize: 13,
    marginLeft: 8,
    fontFamily: 'Manrope',
    color: '#333',
  },
  button: {
    backgroundColor: '#053af9',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Manrope',
    textAlign: 'center',
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#093adb',
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Manrope',
  },
});

export default PasswordScreen;
