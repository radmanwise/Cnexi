import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ipconfig from '../config/ipconfig';
import AddIcon from '../components/icons/AddIcon';

const { width } = Dimensions.get('window');

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const username = userResponse.data.user.username;

        const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#555" style={styles.title} />
        ) : (
          <Text style={styles.title}>
            {profileData?.name?.length > 18
              ? profileData.name.slice(0, 18) + '...'
              : profileData?.name || '...'}
          </Text>
        )}

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('AddPostScreen')} style={styles.iconButton}>
            <AddIcon size={24} color="#1e1e1eff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Feather name="menu" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    top: 15
  },
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 70,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    padding: 8,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: width * 0.045,
    fontFamily: 'Manrope',
    color: '#000',
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    marginLeft: 8,
  },
});

export default TopMenu;
