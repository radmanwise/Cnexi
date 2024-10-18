import { NavigationContainer } from '@react-navigation/native';
import { View, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import './localization/i18n';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import {
  HomeScreen,
  ExploreScreen,
  ProfileScreen,
  AddPostScreen,
  SettingsScreen,
  LanguageSwitcher,
  PostDetailScreen,
  LoginScreen,
  SearchUserScreen,
  NotificationsScreen,
  SplashScreen,
  RegisterScreen,
  Account,
  OtherUserProfile,
  ReelsScreen,
  EditProfile,
  CreateProfile,
  CaptionScreen,
}
  from './screens';

import Entypo from '@expo/vector-icons/Entypo';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 54,
    backgroundColor: '#fff',
  }
}


const PostStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};


const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      gestureEnabled: false,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 250 } },
        close: { animation: 'timing', config: { duration: 200 } },
      },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
            opacity: current.progress,
          },
        };
      }
    }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
        title: '', headerShown: false,

      }} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen options={{ title: 'languages' }} name="LanguageSwitcher" component={LanguageSwitcher} />
      <Stack.Screen options={{ title: 'Posts' }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Account' }} name="Account" component={Account} />
      <Stack.Screen options={{ title: 'EditProfile' }} name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};


const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 300 } },
          close: { animation: 'timing', config: { duration: 150 } },
        },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress,
            },
          };
        },
      }}>
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen options={{ title: 'Login', headerShown: false, }} name="LoginScreen" component={LoginScreen} />
      <Stack.Screen options={{ title: 'CreateProfile', headerShown: false, }} name="CreateProfile" component={CreateProfile} />
      <Stack.Screen options={{ title: '', headerShown: false }} name="SplashScreen" component={SplashScreen} />
      <Stack.Screen options={{ title: '', }} name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen options={{ title: 'Search User', }} name="SearchUserScreen" component={SearchUserScreen} />
      <Stack.Screen options={{ title: 'Notifications', }} name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfile}
        options={({ route }) => ({
          title: route.params.username,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert('Menu clicked!')}
              style={{ marginRight: 32, top: 7 }}>
              <Entypo name="dots-three-horizontal" size={18} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen options={{ title: 'Add Post', headerShown: false, tabBarStyle: { display: 'none' }, }} name="AddPost" component={AddPostScreen} />
      <Stack.Screen options={{ title: 'CaptionScreen', headerShown: false, tabBarStyle: { display: 'none' }, }} name="CaptionScreen" component={CaptionScreen} />
    </Stack.Navigator>
  );
};

const AddPostStack = () => {
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{
      headerShown: true,
      gestureEnabled: true,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 300 } },
        close: { animation: 'timing', config: { duration: 150 } },
      },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
            opacity: current.progress,
          },
        };
      }
    }}>
      <Stack.Screen
        name="UploadPost"
        component={AddPostScreen}
        options={({ route }) => ({
          title: '',
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ marginRight: 15, top: -2, width: '100%' }}>
              <FontAwesome6 name="times-circle" size={25} color="gray" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};


export default function App() {
  const [showTabBar, setShowTabBar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        setShowTabBar(true);
      }, 5000);


      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);



  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: '',
            tabBarStyle: {
              display: isLoggedIn && showTabBar ? 'flex' : 'none',
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {focused ? (
                    <LottieView
                      source={require('./assets/home-tab.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  ) : (
                    <LottieView
                      source={require('./assets/home-hover.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  )}
                </View>
              )
            }
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            title: '',
            tabBarStyle: { backgroundColor: 'black', borderColor: 'black' },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {focused ? (
                    <LottieView
                      source={require('./assets/search-tab.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  ) : (
                    <LottieView
                      source={require('./assets/search-tab.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  )}
                </View>
              )
            }
          }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPostStack}
          options={{
            title: '',
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#e7e7e7',
                  borderWidth: 4.5,
                  borderRadius: 10,
                  padding: 3,
                  width: 60,
                  backgroundColor: '#e7e7e7'
                }}>
                  {focused ? (
                    <Feather name="search" size={24} color="black" />
                  ) : (
                    <FontAwesome6 name="add" size={22} color="black" />
                  )}
                </View>
              )
            }
          }}
        />
        <Tab.Screen
          name="Like"
          component={ReelsScreen}
          options={{
            title: '',
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {focused ? (
                    <LottieView
                      source={require('./assets/heart-solid.json')}
                      autoPlay
                      loop={false}
                      style={styles.animationLike}
                    />
                  ) : (
                    <LottieView
                      source={require('./assets/heart.json')}
                      autoPlay
                      loop={false}
                      style={styles.animationLike}
                    />
                  )}
                </View>
              )
            }
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            title: '',
            tabBarStyle: { backgroundColor: 'white' },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {focused ? (
                    <LottieView
                      source={require('./assets/user-tab.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  ) : (
                    <LottieView
                      source={require('./assets/user-hover.json')}
                      autoPlay
                      loop={false}
                      style={styles.animation}
                    />
                  )}
                </View>
              )
            }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  animation: {
    width: '70%',
    height: '70%',
    padding: 15,
  },
  animationLike: {
    width: '70%',
    height: '70%',
    padding: 17,
  }
});