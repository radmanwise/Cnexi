import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import SearchIcon from '../components/icons/SearchIcon';
import { ThemeProvider } from '../screens/settings/ThemeContext';
import HomeIcon2 from '../components/icons/HomeIcon2';
import HomeSolidIcon from '../components/icons/HomeSolidIcon';
import UserIcon from '../components/icons/UserIcon';
import SearchSolidIcon from '../components/icons/SearchSolidIcon';
import UserSolidIcon from '../components/icons/UserSolidIcon';
import { Subtitle, Title } from '../components/ui/Typography';

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
  RegisterScreen,
  Account,
  OtherUserProfileScreen,
  ReelsScreen,
  EditProfile,
  PasswordScreen,
  SubmitScreen,
  CaptionScreen,
  ChangeThem,
  AccountStatus,
  FollowingScreen,
  FollowersScreen,
  FollowSuggestions,
  ReportBug,
  DataUsage,
  Security,
  About,
  Block,
  PostSaveScreen,
  FavoritesScreen,
  OtpRegisterScreen,
  SplashScreen,
}
  from '../screens';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


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
        open: { animation: 'timing', config: { duration: 150 } },
        close: { animation: 'timing', config: { duration: 100 } },
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
        title: 'Profile', headerShown: false,

      }} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen options={{ title: 'languages', headerShown: false }} name="LanguageSwitcher" component={LanguageSwitcher} />
      <Stack.Screen options={{ title: 'Posts', headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Account', headerShown: false }} name="Account" component={Account} />
      <Stack.Screen options={{ title: 'Edit Profile', headerShown: false }} name="EditProfile" component={EditProfile} />
      <Stack.Screen options={{ title: 'Change Them', headerShown: false }} name="ChangeThem" component={ChangeThem} />
      <Stack.Screen options={{ title: 'AccountStatus', headerShown: false }} name="AccountStatus" component={AccountStatus} />
      <Stack.Screen options={{ title: 'ReportBug', headerShown: false }} name="ReportBug" component={ReportBug} />
      <Stack.Screen options={{ title: 'DataUsage', headerShown: false }} name="DataUsage" component={DataUsage} />
      <Stack.Screen options={{ title: 'Security', headerShown: false }} name="Security" component={Security} />
      <Stack.Screen options={{ title: 'About', }} name="About" component={About} />
      <Stack.Screen options={{ title: 'Block', headerShown: false }} name="Block" component={Block} />
      <Stack.Screen options={{ title: 'Following', headerShown: true }} name="FollowingScreen" component={FollowingScreen} />
      <Stack.Screen options={{ title: 'Followers', headerShown: true }} name="FollowersScreen" component={FollowersScreen} />
      <Stack.Screen options={{ title: 'Login', headerShown: false, }} name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={({ route }) => ({
          title: route.params?.username || 'Profile',
          headerShown: false
        })}
      />
    </Stack.Navigator>
  );
};


const ReelsStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      gestureEnabled: false,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 150 } },
        close: { animation: 'timing', config: { duration: 100 } },
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
        name="Profile"
        component={ReelsScreen}
        options={({ navigation }) => ({
          title: '',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 15, paddingRight: 10 }}>
              <TouchableOpacity style={styles.buttonSide} onPress={() => navigation.navigate('ExploreScreen')}>
                <Title style={{ color: '#ffffffff', fontSize: 10 }}>Explore</Title>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonSide} onPress={() => navigation.navigate('Live')}>
                <Title style={{ color: '#ffffffff', fontSize: 10 }}>Lives</Title>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen options={{ title: 'languages', headerShown: false }} name="LanguageSwitcher" component={LanguageSwitcher} />
      <Stack.Screen options={{ title: 'Posts', headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Change Them', headerShown: false }} name="ChangeThem" component={ChangeThem} />
      <Stack.Screen options={{ title: 'Block', headerShown: false }} name="Block" component={Block} />
      <Stack.Screen options={{ title: 'Following', headerShown: true }} name="FollowingScreen" component={FollowingScreen} />
      <Stack.Screen options={{ title: 'Followers', headerShown: true }} name="FollowersScreen" component={FollowersScreen} />
      <Stack.Screen options={{ title: 'Login', headerShown: false, }} name="LoginScreen" component={LoginScreen} />
      <Stack.Screen options={{ title: 'ExploreScreen', headerShown: false, }} name="ExploreScreen" component={ExploreScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={({ route }) => ({
          title: route.params?.username || 'Profile',
          headerShown: false
        })}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      // initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        tabBarPressColor: 'transparent',
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 100 } },
          close: { animation: 'timing', config: { duration: 80 } },
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
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} options={{ headerShown: false }} />
      <Stack.Screen options={{ title: 'caption screen', headerShown: false, tabBarStyle: { display: 'none' }, }} name="CaptionScreen" component={CaptionScreen} />
      <Stack.Screen options={{ title: 'Login', headerShown: false, }} name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: '',
          headerShown: true,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: '#fff',
          },
        }}
      />
      <Stack.Screen
        name="OtpRegisterScreen"
        component={OtpRegisterScreen}
        options={{
          title: '',
          headerShown: true,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: '#fff',
          },
        }}
      />

      <Stack.Screen options={{ title: '', headerShown: false }} name="SubmitScreen" component={SubmitScreen} />
      <Stack.Screen options={{
        title: '',
        headerShown: true,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#fff',
        },
      }} name="PasswordScreen" component={PasswordScreen} />
      <Stack.Screen options={{ title: 'Search User', headerShown: false }} name="SearchUserScreen" component={SearchUserScreen} />
      <Stack.Screen options={{ title: 'Notifications', }} name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen options={{ title: 'FollowSuggestions', headerShown: false }} name="FollowSuggestions" component={FollowSuggestions} />
      <Stack.Screen options={{ title: 'Following', headerShown: true }} name="FollowingScreen" component={FollowingScreen} />
      <Stack.Screen options={{ title: 'Posts', headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Followers', headerShown: true }} name="FollowersScreen" component={FollowersScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen options={{ title: 'PostSaveScreen', headerShown: false }} name="PostSaveScreen" component={PostSaveScreen} />
      <Stack.Screen options={{ title: 'FavoritesScreen', headerShown: false }} name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={({ route }) => ({
          title: route.params?.username || 'Profile',
          headerShown: false
        })}
      />
      <Stack.Screen options={{ title: 'Add Post', headerShown: false, tabBarStyle: { display: 'none' }, }} name="AddPost" component={AddPostScreen} />
    </Stack.Navigator>
  );
};

const AddPostStack = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      gestureEnabled: true,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 150 } },
        close: { animation: 'timing', config: { duration: 50 } },
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
        options={{
          title: '',
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ marginRight: 15, marginBottom: 5 }}>
              <FontAwesome6 name="times-circle" size={25} color="gray" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen options={{ title: 'caption screen', headerShown: false, tabBarStyle: { display: 'none' }, }} name="CaptionScreen" component={CaptionScreen} />

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
      }, 1);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainApp"
            component={MainTabNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

// Create a separate component for the main tab navigator
const MainTabNavigator = () => {
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
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const ACTIVE_COLOR = '#000000ff';
  const INACTIVE_COLOR = '#888';

  const screenOptions = {
    tabBarShowLabel: true,
    headerShown: false,
    tabBarActiveTintColor: ACTIVE_COLOR,
    tabBarInactiveTintColor: INACTIVE_COLOR,
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: 49,
    },
  };

  const CustomTabBarButton = (props) => (
    <TouchableOpacity activeOpacity={1} {...props} />
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarStyle: {
            display: isLoggedIn && showTabBar ? 'flex' : 'none',
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {focused ? (
                <HomeSolidIcon size={31} color={ACTIVE_COLOR} />
              ) : (
                <HomeIcon2 size={28} color={INACTIVE_COLOR} />
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Subtitle style={{ color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, fontSize: 9 }}>Home</Subtitle>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ReelsStack}
        options={{
          title: 'Explore',
          tabBarStyle: {
            backgroundColor: 'black',
          },
          tabBarIcon: ({ focused }) => (
      <View>
        {focused ? (
          <SearchSolidIcon size={27} color="#ffffff" />  
        ) : (
          <SearchIcon size={27} color={INACTIVE_COLOR} />
        )}
      </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Subtitle style={{ color: focused ? "#ffffff" : INACTIVE_COLOR, fontSize: 9 }}>Explore</Subtitle>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: 'You',
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {focused ? (
                <UserSolidIcon size={32} color={ACTIVE_COLOR} />
              ) : (
                <UserIcon size={29} color={INACTIVE_COLOR} />
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Subtitle style={{ color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, fontSize: 9 }}>You</Subtitle>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: '70%',
    height: '70%',
    padding: 15,
  },
  buttonSide: {
    backgroundColor: '#000000ff',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#fdfdfdff'
  },
});

