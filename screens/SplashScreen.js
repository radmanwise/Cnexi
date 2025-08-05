import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const SplashScreenSimple = ({ navigation }) => {
  useEffect(() => {
    const checkLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));

      await SplashScreen.hideAsync(); 

      const token = await SecureStore.getItemAsync('token');
      if (token) {
        navigation.replace('MainApp');
      } else {
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

export default SplashScreenSimple;

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
