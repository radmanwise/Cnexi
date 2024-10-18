import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

const QFollowButton = ({ userId }) => {
  const [following, setFollowing] = useState(false);
  const { t } = useTranslation();
  
  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      try {
        const response = await axios.get(`https://nexsocial.ir/profile/${userId}/following-status/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching following status:', error);
      }
    };

    fetchFollowingStatus();
  }, [userId]);

  const toggleFollow = async () => {
    const token = await SecureStore.getItemAsync('token');

    try {
      if (following) {
        await axios.delete(`https://nexsocial.ir/profile/unfollow/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`https://nexsocial.ir/profile/follow/${userId}/`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const response = await axios.get(`https://nexsocial.ir/profile/${userId}/following-status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error.response ? error.response.data : error.message);
      
      // Set the error message for the modal
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(error.message);
      }
      setModalVisible(true); // Show modal
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleFollow}
        style={{
          flex: 1,
          right: -275,
          top: 3,
          width: 76,
          backgroundColor: '#e4e4e4',
          borderRadius: 12,
          height: 33
        }}
      >
        <Text style={{ color: '#000', fontSize: 13, textAlign: 'center', fontWeight: '500', top: 7 }}>
          {following ? t('Unfollow') : t('Follow')}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default QFollowButton;
