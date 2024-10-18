import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

const FollowButton = ({ userId }) => {
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

      // بعد از انجام عمل، وضعیت را دوباره بررسی می‌کنیم
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
          borderRadius: 13,
          borderColor: 'black',
          borderWidth: 1.5,
          padding: 7,
          width: 120,
          marginLeft: -52,
          backgroundColor: 'black',
          top: 2,
        }}
      >
        <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center', color: '#fff' }}>
          {following ? t('Unfollow') : t('Follow')}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying errors */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  modalButtonText: {
    color: 'white', 
    fontWeight: '600',
  },
});

export default FollowButton;
