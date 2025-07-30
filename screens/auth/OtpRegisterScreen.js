import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';

const OtpRegisterScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const fadeInAndOut = (displayDuration = 3000, fadeDuration = 500) => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
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

  const handleNext = () => {
    const code = otp.join('');
    if (code.length !== 6 || otp.includes('')) {
      setErrorMessage('Please enter the full 6-digit code');
      fadeInAndOut();
      return;
    }
    navigation.navigate('PasswordScreen', { code });
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    // TODO: implement resend functionality
    console.log('Resend code');
    setErrorMessage('Code sent again to your email');
    fadeInAndOut();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={['#ffffffff', '#ffffffff']} style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            Only you can see this. We’ll use it to verify your account and keep it safe.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
              />
            ))}
          </View>

          <Text style={styles.infoText}>We'll send a confirmation code to this email.</Text>

          <TouchableOpacity style={styles.loginButton} onPress={handleNext}>
            <Text style={styles.buttonText}>{t('Next')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Didn't get the code? Send again</Text>
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
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 30,
    fontFamily: 'Manrope',
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Manrope',
    color: '#4e4e4eff',
    width: 300,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#979797ff',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Manrope',
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Manrope',
    color: '#323232ff',
    paddingBottom: 10,
    paddingTop: 5,
  },
  loginButton: {
    backgroundColor: '#053af9cf',
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Manrope',
  },
  resendText: {
    color: '#053af9',
    fontSize: 13,
    marginTop: 15,
    fontFamily: 'Manrope',
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#093adbcf',
    borderRadius: 5,
  },
  error: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Manrope',
  },
});

export default OtpRegisterScreen;
