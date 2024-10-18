import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Account = ({ navigation }) => {
  const { t } = useTranslation();
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      
      navigation.navigate('LoginScreen');
      
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{left: 20, top:20}} >
        <Text style={{fontSize: 16, marginTop: 13}}>{t('Add another')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{left: 20, top:20}} >
        <Text style={{fontSize: 16, marginTop: 13}}>{t('Switch Account')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{left: 20, top:20}} 
        onPress={handleLogout}
      >
        <Text style={{fontSize: 16, marginTop: 13}}>{t('Logout')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{left: 20, top:20}} >
        <Text style={{fontSize: 16, color: 'red', marginTop: 13}}>{t('Delete account')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default Account;
