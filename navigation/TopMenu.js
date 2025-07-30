import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ipconfig from '../config/ipconfig';

const TopMenu = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const userResponse = await axios.get(`${ipconfig.BASE_URL}/api/v1/user/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const username = userResponse.data.user.username;

        const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${username}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setProfileData(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.topMenu}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Ionicons name="arrow-back" size={25} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>
        {profileData?.name && profileData.name.length > 18
          ? `${profileData.name.substring(0, 18)}...`
          : profileData?.name || 'User'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Feather name="menu" size={26} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const App = () => (
  <View style={styles.container}>
    <TopMenu />
  </View>
);

const styles = StyleSheet.create({
  topMenu: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingHorizontal: 16,
  },
  button: {
    padding: 10,
    marginTop: 19,
  },
  title: {
    fontSize: 17,
    marginTop: 25,
    fontWeight: '500',
    fontFamily: 'Manrope',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;