import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
    Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const textSlideUp = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animationSequence = async () => {
            await new Promise(resolve => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]).start(resolve);
            });

            await new Promise(resolve => {
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start(resolve);
            });

            await new Promise(resolve => {
                Animated.timing(textSlideUp, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(resolve);
            });

            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        const checkLoginStatus = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    navigation.replace('MainApp');
                } else {
                    navigation.replace('LoginScreen');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                navigation.replace('LoginScreen');
            }
        };

        animationSequence();

        const timer = setTimeout(() => {
            checkLoginStatus();
        }, 1000);

        return () => clearTimeout(timer);
    }, [navigation]);

    const logoRotation = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { rotate: logoRotation },
                        ],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.logoPlaceholder,
                        {
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                >
                    <Image
                        source={require('../assets/img/app/CnexiBlue.png')}
                        style={styles.image}
                    />
                </Animated.View>
            </Animated.View>

            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: textSlideUp }],
                    },
                ]}
            >
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    image: {
        width: 180,
        height: 180,
    },
    textContainer: {
        alignItems: 'center',
    },
});

export default SplashScreen;
