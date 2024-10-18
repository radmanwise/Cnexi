import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeNavigationBar from '../navigationbar/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';
import DrawerMenu from '../navigationbar/DrawerMenu';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const userResponse = await axios.get(`https://nexsocial.ir/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const fetchedUsername = userResponse.data.username;

        const profileResponse = await axios.get(`https://nexsocial.ir/profile/${fetchedUsername}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const imageUrl = `https://nexsocial.ir${profileResponse.data.picture}`;
        setProfileImage(imageUrl);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    const checkFirstLogin = async () => {
      const firstLogin = await AsyncStorage.getItem('isFirstLogin');
      if (firstLogin === null) {
        setIsFirstLogin(true);
        setModalVisible(true);
        await AsyncStorage.setItem('isFirstLogin', 'false'); // Set the first login flag
      }
    };

    fetchProfileImage();
    checkFirstLogin(); // Call to check first login
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };


  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>


      <HomeNavigationBar />
      <View>
        <PostScreen />
      </View>
      <View style={styles.profileStatus}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Image
            style={styles.profileImage}
            source={profileImage ? { uri: profileImage } : require('../assets/nex.png')}
          />
        </TouchableOpacity>
      </View>
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileStatus: {
    marginTop: 40,
    flexDirection: 'row',
    marginRight: 350,
    left: 15,
    position: 'absolute'
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 100,
    borderColor: '#ffff',
    borderWidth: 1.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background for modal
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});





