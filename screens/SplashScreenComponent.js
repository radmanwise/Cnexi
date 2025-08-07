import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const SplashScreenComponent = ({ navigation }) => {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

        setTimeout(() => {
          if (token) {
            navigation.replace('MainApp');
          } else {
            navigation.replace('LoginScreen');
          }
        }, 1500);
      } catch (error) {
        console.log('Error checking token:', error);
        navigation.replace('LoginScreen');
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/app/cnexi.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
