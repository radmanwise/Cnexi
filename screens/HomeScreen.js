import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeNavigationBar from '../navigation/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated, StatusBar, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import ipconfig from '../config/ipconfig';



const initialLayout = { width: Dimensions.get('window').width };
const ForYouScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
    <PostScreen filter='forYou' />
  </View>
);

const FollowersScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
    <PostScreen filter='followers' />
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const shimmerValue = new Animated.Value(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'forYou', title: 'For you' },
    { key: 'followers', title: 'Following' },
  ]);

  const renderScene = SceneMap({
    forYou: ForYouScreen,
    followers: FollowersScreen,
  });

  const renderTabBar = props => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isFocused = index === i;
        return (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setIndex(i)}
            key={route.key}
          >
            <Text style={{ color: isFocused ? '#000' : 'gray' }}>{route.title}</Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmerAnimation();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          fetchProfileImage();
          checkFirstLogin();
        } else {
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.navigate('LoginScreen');
      }
    };


    const fetchProfileImage = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const userResponse = await axios.get(`${ipconfig.BASE_URL}/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const fetchedUsername = userResponse.data.username;

        const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${fetchedUsername}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const imageUrl = `${ipconfig.BASE_URL}${profileResponse.data.picture}`;
        setProfileImage(imageUrl);

        setTimeout(() => {
          setIsLoading(false);
        }, 1500);

      } catch (error) {
        console.error('Error fetching profile image:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    const checkFirstLogin = async () => {
      const firstLogin = await AsyncStorage.getItem('isFirstLogin');
      if (firstLogin === null) {
        setIsFirstLogin(true);
        setModalVisible(true);
        await AsyncStorage.setItem('isFirstLogin', 'false');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const SkeletonLoader = () => {
    const translateX = shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 100],
    });

    return (
      <View style={styles.skeletonContainer}>
        {[1].map((item) => (
          <View key={item} style={styles.skeletonPost}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonTextContainer}>
                <View style={[styles.skeletonText, { width: '20%' }]} />
              </View>
            </View>
            <View style={styles.skeletonBody} />
            <View style={[styles.skeletonCaption, { width: '50%', top: 25 }]} />
            <View style={[styles.skeletonCaption, { width: '30%', top: 20 }]} />
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX }],
                },
              ]}
            />
          </View>
        ))}
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <HomeNavigationBar />
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 0,
  },
  skeletonPost: {
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
    width: '100%',
    left: -5,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  skeletonTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  skeletonText: {
    height: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    width: '100%',
    borderRadius: 10,
  },
  skeletonCaption: {
    height: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 18,
  },
  skeletonBody: {
    height: 400,
    backgroundColor: '#f5f5f5',
    width: '190%',
    left: -20,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ translateX: -100 }],
  },
  logoContainer: {
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    bottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ebeaeaff',
  },
  indicator: {
    backgroundColor: '#008CFF',
    height: 3.5,
    width: '80%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 122,
  },
});