import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Feather from '@expo/vector-icons/Feather';

const TopMenu = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigation = useNavigation();
  const [username, setUsername] = useState('');  

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to truncate text
  const truncateText = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
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
        setUsername(fetchedUsername);  

        const profileResponse = await axios.get(`https://nexsocial.ir/profile/${fetchedUsername}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!profileData) {
    return <Text>No profile data available.</Text>;
  }
  
  return (
    <View style={styles.topMenu}>
      <TouchableOpacity onPress={handleBackPress} style={styles.button}>
        <Ionicons name="arrow-back" size={25} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{profileData?.name || profileData?.username}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')} >
        <Feather name="menu" size={26} color="black" />
      </TouchableOpacity>
    </View >
  );

};

const App = () => {
  return (
    <View style={styles.container}>
      <TopMenu />
    </View>
  );
};

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
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  title: {
    fontSize: 17,
    marginTop: 25,
    fontWeight: '500',
  },
});

export default App;
