import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const { t } = useTranslation();

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


    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };


    const handleNext = () => {
        if (!email || !validateEmail(email)) {
            setErrorMessage('Please enter a valid email');
            fadeInAndOut();
            return;
        }
        navigation.navigate('OtpRegisterScreen', { email });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
            <LinearGradient
                colors={['#ffffffff', '#d0d3fcff']}
                style={styles.gradient}
            >
                <View style={styles.container}>
                    <View>
                        <Text style={{ fontSize: 30, fontFamily: 'Manrope', bottom: 50, fontWeight: 700 }}>
                            Your contact email
                        </Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Manrope', bottom: 40, color: '#4e4e4eff', width: 300 }}>
                            Only you can see this. We’ll use it to verify your account and keep it safe
                        </Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder={t('Email')}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <Text style={{ fontSize: 13, fontFamily: 'Manrope', color: '#323232ff', padding: 10}}>
                        We'll send a confirmation code to this email.
                    </Text>
                    <TouchableOpacity style={styles.loginButton} onPress={handleNext}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, top: 10, fontFamily: 'Manrope' }}>
                            {t('Next')}
                        </Text>
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
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingTop: 60,
    },
    input: {
        height: 60,
        borderColor: '#979797ff',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        fontSize: 13,
        fontWeight: '500',
        paddingLeft: 15,
        fontFamily: 'Manrope',
    },
    errorContainer: {
        marginTop: 100,
        padding: 10,
        backgroundColor: '#5d5d5dcf',
        borderRadius: 25,
    },
    error: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Manrope',

    },
    loginButton: {
        backgroundColor: '#053af9cf',
        borderRadius: 15,
        height: 50,
        top: 5
    },
});

export default RegisterScreen;
