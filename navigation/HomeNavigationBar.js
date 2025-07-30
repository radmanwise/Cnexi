import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AlarmIcon from '../components/icons/AlarmIcon';
import SearchIcon2 from '../components/icons/SearchIcon2';
import AddIcon from '../components/icons/AddIcon';
import * as Font from 'expo-font';
export default function HomeNavigationBar() {
    const navigation = useNavigation();
  

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'ManropeBold': require('../assets/fonts/Manrope/Manrope-ExtraBold.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    return (
        <>
            {/* Stretched Search Button moved to rightButtons */}
            <View style={styles.container}>
                <View style={styles.menuBar}>
                    <View style={styles.rightButtons}>
                        <Image
                            source={require('../assets/img/app/CnexiBlue.png')}
                            style={styles.cnexiLogo}
                        />
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('AddPostScreen')}
                        >
                            <AddIcon size={24} color="#4e4e4eff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('NotificationsScreen')}
                        >
                            <AlarmIcon size={24} color="#4e4e4eff" fill="#ffffffff" />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    stretchedSearchContainer: {
        paddingHorizontal: 18,
        paddingTop: 18,
        backgroundColor: '#fff',
    },
    cnexiLogo: {
        flexDirection: 'row',
        width: 43,
        height: 43,
        left: -250,
    },
    placeholderTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 4,
        color: '#999',
    },
    placeholderBar: {
        height: 10,
        width: 60,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
    },
    container: {
        paddingTop: 35,
        backgroundColor: '#ffffff',
    },
    menuBar: {
        height: 50,
        backgroundColor: '#ffffffff',
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        gap: 0,
    },
    iconButton: {
        padding: 6,
        marginLeft: 12,
        borderRadius: 50,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});