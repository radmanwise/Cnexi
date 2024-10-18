import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import DrawerMenu from "./DrawerMenu";
import React, { useState } from 'react';

export default function HomeNavigationBar() {
    const navigation = useNavigation();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
      setDrawerOpen(!isDrawerOpen);
    };

    const truncateText = (str, maxLength) => {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    };

    return (
        <View style={styles.menuBar}>
            <View style={styles.buttonMenus}>
                <TouchableOpacity onPress={() => navigation.navigate('SearchUserScreen')} style={{
                    marginTop: 35,
                    padding: 5,
                    marginLeft: 300,
                }}>
                    <Feather name="search" size={27} color="#4f4f4f" />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    marginTop: 24,
                    padding: 15,
                    marginRight: 12,
                }} onPress={() => navigation.navigate('NotificationsScreen')}>
                    <MaterialIcons name="notifications-none" size={30} color="#4f4f4f" />
                </TouchableOpacity>
            </View>
            <View style={{marginTop: -200}}>
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    menuBar: {
        height: 93,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: '#ffff',
        borderBottomColor: '#ffff',
    },
    profileStatus: {
        marginTop: 30,
        flexDirection: 'row',
        marginRight: 350,
    },
    profileImage: {
        height: 35,
        width: 35,
        borderRadius: 100,
        borderColor: '#ffff',
        borderWidth: 1.5,
    },
    username: {
        fontSize: 14.2,
        fontWeight: '500',
        padding: 5.5,
        color: '#000',
        marginLeft: 34,
        position: 'absolute',
    },
    button: {
        marginTop: 19,
        padding: 10,
        marginLeft: 150,
    },
    buttonMenus: {
        flexDirection: 'row',
        position: 'absolute',
    },
})