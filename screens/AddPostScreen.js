import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const AddPostScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  useFocusEffect(
    React.useCallback(() => {
      NavigationBar.setBackgroundColorAsync('black');
      StatusBar.setBarStyle('light-content'); // Set status bar style to light
      StatusBar.setBackgroundColor('black'); // Set status bar background color to black

      return () => {
        NavigationBar.setBackgroundColorAsync('white');
        StatusBar.setBarStyle('dark-content'); // Reset status bar style to dark
        StatusBar.setBackgroundColor('white'); // Reset status bar background color to white
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.button}>
      <FontAwesome6 name="times-circle" size={29} color="white" />
      </TouchableOpacity>
      <View style={styles.shutter}>
        <TouchableOpacity style={styles.shutterButton}>

        </TouchableOpacity>
      </View>
      <View style={styles.choiceGallery}>
        <FontAwesome name="image" size={40} color="white" />
      </View>
      <View style={styles.caption}>
        <MaterialCommunityIcons name="closed-caption" size={35} color="white" />
      </View>
      <View style={styles.share}>
        <FontAwesome name="share-square-o" size={32} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black'
  },
  shutter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    backgroundColor: 'red',
    width: 90,
    height: 90,
    borderRadius: 50,
    bottom: -8,
    position: 'absolute',
  },
  choiceGallery: {
    borderRadius: 13,
    bottom: -775,
    left: 300,
  },
  caption: {
    top: 333
  },
  share: {
    top: 373,
    left: 3
  },
  button: {
    top: 30
  }
});

export default AddPostScreen;
