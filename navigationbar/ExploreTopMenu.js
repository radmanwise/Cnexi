import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

const ExploreTopMenu = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.topMenu}>
            <TouchableOpacity onPress={handleBackPress} style={styles.button}>
                <View style={{ justifyContent: 'center', alignItems: 'center', top: 12 }}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBackPress} style={styles.buttonDot}>
                <View style={{ justifyContent: 'center', alignItems: 'center', top: 10 }}>
                    <Entypo name="dots-three-vertical" size={20} color="white" />
                </View>
            </TouchableOpacity>
        </View >
    );

};


const App = () => {
    return (
        <View style={styles.container}>
            <ExploreTopMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 45,
        width: 45,
    },
    topMenu: {
        left: -175,
    },
    container: {
        top: -775,
    },
    buttonDot: {
        left: 350,
        top: -40
    }
});

export default App;
