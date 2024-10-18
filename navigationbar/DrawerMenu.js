import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions, StyleSheet, Image, PanResponder, ActivityIndicator } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const DrawerMenu = ({ isOpen, onClose }) => {
  const drawerAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [animationsActive, setAnimationsActive] = useState(false);
  const { t } = useTranslation();

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
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUsername = userResponse.data.username;
        setUsername(fetchedUsername);

        const profileResponse = await axios.get(`https://nexsocial.ir/profile/${fetchedUsername}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    if (isOpen) {
      openDrawer();
      setAnimationsActive(true); 
    } else {
      closeDrawer();
      setAnimationsActive(false);
    }
  }, [isOpen]);

  const openDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -width * 0.75,
      duration: 150,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx < -5;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          drawerAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > width * 0.05) {
          closeDrawer();
        } else {
          openDrawer();
        }
      },
    })
  ).current;

  const imageUrl = profileData?.picture
    ? `https://nexsocial.ir${profileData.picture}`
    : require('../assets/user.jpg');

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      {isOpen && <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />}
      <Animated.View {...panResponder.panHandlers} style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
        <View style={{ top: -230 }}>
          <Image
            style={{ width: 70, height: 70, borderRadius: 50, top: 40 }}
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
            onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
          />
          <Text style={{ fontSize: 18, fontWeight: '600', top: 50, left: 3 }}>{profileData?.name}</Text>
          <Text style={{ fontSize: 15, fontWeight: '400', top: 53, left: 3 }}>@{profileData?.username_i}</Text>
        </View>
        <View style={{ left: -13, top: -130 }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfileStack')}>
            {animationsActive && ( // نمایش انیمیشن‌ها فقط زمانی که منو باز است
              <LottieView
                source={require('../assets/user.json')}
                autoPlay
                loop={false}
                style={styles.animation}
              />
            )}
            <Text style={styles.ButtonText}>{t("Profile")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            {animationsActive && (
              <LottieView
                source={require('../assets/wifi.json')}
                autoPlay
                loop={false}
                style={styles.animation}
              />
            )}
            <Text style={styles.ButtonText}>{t('Live')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            {animationsActive && (
              <LottieView
                source={require('../assets/bookmark.json')}
                autoPlay
                loop={false}
                style={styles.animation}
              />
            )}
            <Text style={styles.ButtonText}>{t('Saves')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
            {animationsActive && (
              <LottieView
                source={require('../assets/settings.json')}
                autoPlay
                loop={false}
                style={styles.animation}
              />
            )}
            <Text style={styles.ButtonText}>{t('Settings')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};


const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    zIndex: 100,
  },
  ButtonText: {
    marginLeft: -130,
    fontSize: 15,
    fontWeight: '500',
    top: 3
  },
  button: {
    padding: 15,
    flexDirection: 'row',

  },
  animation: {
    width: '70%',
    height: '70%',
    padding: 15,
    left: -72
  },
});

export default DrawerMenu;
