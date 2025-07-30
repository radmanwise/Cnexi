import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import * as Font from 'expo-font';
import ipconfig from '../../config/ipconfig';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubmitScreen = ({ route, navigation }) => {
    const { username, email, password, password2 } = route.params;
    const [errorMessage, setErrorMessage] = useState([]);
    const [fadeAnim] = useState(new Animated.Value(0));
    const { t } = useTranslation();
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Manrope': require('../../assets/fonts/Manrope/Manrope-Regular.ttf'),
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

    const handleAgree = async () => {
        const userData = {
            username: username,
            email: email,
            password: password,
            password2: password2,
        };

        try {
            const registerResponse = await fetch(`${ipconfig.BASE_URL}/api/v1/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const registerData = await registerResponse.json();

            if (registerResponse.ok) {
                try {
                    const loginResponse = await axios.post(`${ipconfig.BASE_URL}/api/v1/token/token/`, {
                        username,
                        password,
                    });

                    if (loginResponse.data.access && loginResponse.data.refresh) {
                        await SecureStore.setItemAsync('token', loginResponse.data.access);
                        await SecureStore.setItemAsync('refreshToken', loginResponse.data.refresh);
                        
                        await AsyncStorage.setItem('@user', JSON.stringify(loginResponse.data.user || {}));
                        navigation.navigate('home');
                    } else {
                        setErrorMessage(['Unexpected response from server']);
                        fadeInAndOut();
                    }
                } catch (loginError) {
                    setErrorMessage(['Login failed after registration']);
                    fadeInAndOut();
                }
            } else {
                setErrorMessage(Object.values(registerData).flat());
                fadeInAndOut();
            }
        } catch (error) {
            setErrorMessage(['Network error, please try again!']);
            fadeInAndOut();
        }
    };

    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error("Failed to open URL: ", err));
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
            <LinearGradient
                colors={['#ff3b30', '#ffff']}
                style={styles.gradient}
            >
                <View style={styles.container}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, fontFamily: 'Manrope', bottom: 100 }}>
                            Welcome to nexvers
                        </Text>
                        <Text style={{ fontSize: 25, fontFamily: 'Manrope', bottom: 100, color: '#000', width: 220, textAlign: 'center' }}>
                            {username}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleAgree}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, top: 10, fontFamily: 'Manrope' }}>
                            {t('Done')}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ top: 320 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Manrope', fontSize: 14 }}>
                            By signing up, you confirm that you have read and agree to our{" "}
                            <TouchableOpacity onPress={() => openLink('https://www.yourwebsite.com/terms')}>
                                <Text style={styles.linkText}>Terms of Service</Text>
                            </TouchableOpacity>{" "}
                            and{" "}
                            <TouchableOpacity onPress={() => openLink('https://www.yourwebsite.com/privacy')}>
                                <Text style={styles.linkText}>Privacy Policy</Text>
                            </TouchableOpacity>.
                        </Text>
                    </View>

                    {errorMessage.length > 0 && (
                        <Animated.View style={{ ...styles.errorContainer, opacity: fadeAnim }}>
                            {errorMessage.map((msg, index) => (
                                <Text key={index} style={styles.error}>{msg}</Text>
                            ))}
                        </Animated.View>
                    )}
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
    loginButton: {
        backgroundColor: 'black',
        borderRadius: 15,
        height: 50,
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
    linkText: {
        color: '#1E90FF',
        textDecorationLine: 'underline',
    },
});

export default SubmitScreen;
