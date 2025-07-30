import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Image,
} from 'react-native';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const textSlideUp = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {


        // Complex animation sequence
        const animationSequence = async () => {
            // Step 1: Logo appears with fade and scale
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

            // Step 2: Logo rotation
            await new Promise(resolve => {
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start(resolve);
            });

            // Step 3: Text slides up
            await new Promise(resolve => {
                Animated.timing(textSlideUp, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(resolve);
            });

            // Step 4: Continuous pulse animation
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

        animationSequence();

        // Navigate to main app after 4 seconds
        const timer = setTimeout(() => {
            navigation.replace('MainApp');
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [navigation]);


    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Manrope': require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);


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
                        source={require('../assets/img/app/cnexi.png')}
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
        backgroundColor: '#ffff',
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
    logoVers: {
        color: '#ffffff',
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
        letterSpacing: 3,
    },
    tagline: {
        fontSize: 16,
        color: '#cccccc',
        textAlign: 'center',
        letterSpacing: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
    },

    loadingContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 120,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4a90e2',
        marginHorizontal: 4,
    },
});

export default SplashScreen;