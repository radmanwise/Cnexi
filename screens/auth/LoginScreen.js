import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import ipconfig from '../../config/ipconfig';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View, Text, TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  useColorScheme
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { t } = useTranslation();
  const theme = useColorScheme();


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${ipconfig.BASE_URL}/api/v1/token/token/`, {
        username,
        password,
      });

      if (response.data.access && response.data.refresh) {
        await SecureStore.setItemAsync('token', response.data.access);
        await SecureStore.setItemAsync('refreshToken', response.data.refresh);

        await AsyncStorage.setItem('@user', JSON.stringify(response.data.user || {}));
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


  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView

      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={['#c3cdffff', '#ffffffff']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/img/app/cnexi.png')}
              style={styles.image}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder={t('Enter Username')}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('Password')}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={{ padding: 5, bottom: 1, color: 'blue', fontFamily: 'Manrope', fontSize: 13, }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, top: 10, fontFamily: 'Manrope' }}>
              {t('Login')}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.createAccount} onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.link}>{t('Create Account')}</Text>
          </TouchableOpacity>

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
  },
  input: {
    height: 60,
    borderColor: '#b2b2b2ff',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#fefefe',
    fontSize: 13,
    fontWeight: 'medium',
    paddingLeft: 15,
    fontFamily: 'Manrope',
    color: 'black',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  link: {
    color: 'blue',
    fontFamily: 'Manrope',
    textAlign: 'center',
    top: 12,
  },
  errorContainer: {
    marginTop: 70,
    padding: 10,
    backgroundColor: '#ffffffcf',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#053af9cf',
    borderRadius: 15,
    height: 50,
    top: 15,
    fontFamily: 'Manrope',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 110,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    top: 20,
  },
  createAccount: {
    borderRadius: 30,
    height: 50,
    top: 170,
  },
});

export default LoginScreen;
