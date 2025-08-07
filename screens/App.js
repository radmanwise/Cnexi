import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import SearchIcon from '../components/icons/SearchIcon';
import { ThemeProvider } from '../screens/settings/ThemeContext';
import HomeIcon2 from '../components/icons/HomeIcon2';
import HomeSolidIcon from '../components/icons/HomeSolidIcon';
import UserIcon from '../components/icons/UserIcon';
import SearchSolidIcon from '../components/icons/SearchSolidIcon';
import UserSolidIcon from '../components/icons/UserSolidIcon';
import { Subtitle, Title } from '../components/ui/Typography';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LiveIcon from '../components/icons/LiveIcon';
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
  ReportBug,
  DataUsage,
  Security,
  About,
  Block,
  OtpRegisterScreen,
  SplashScreenComponent,
}
  from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 150 } },
          close: { animation: 'timing', config: { duration: 100 } },
        },
        cardStyleInterpolator: ({ current, layouts }) => ({
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
        }),
      }}
    >

      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="AccountStatus" component={AccountStatus} options={{ headerShown: false }} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} options={({ route }) => ({
        title: route.params?.username || 'Profile',
        headerShown: false
      })} />

      <Stack.Screen name="Settings" component={SettingsScreen} options={({ navigation }) => ({
        title: '',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#efefefff',
        },

        headerTitle: () => (
          <Title style={{ color: 'black', fontSize: 20, top: -2 }}>
            Settings
          </Title>
        ),

      })} />
      <Stack.Screen name="ChangeThem" component={ChangeThem} options={{ headerShown: false }} />
      <Stack.Screen name="LanguageSwitcher" component={LanguageSwitcher} options={{ headerShown: false }} />
      <Stack.Screen name="Security" component={Security} options={{ headerShown: false }} />

      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ headerShown: false }} />

      <Stack.Screen name="FollowersScreen" component={FollowersScreen} options={({ navigation }) => ({
        title: '',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#ffffffff',
        },

        headerTitle: () => (
          <Title style={{ color: 'black', fontSize: 20, top: -2 }}>
            Followers
          </Title>
        ),

      })} />
      <Stack.Screen name="FollowingScreen" component={FollowingScreen} options={({ navigation }) => ({
        title: '',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#ffffffff',
        },

        headerTitle: () => (
          <Title style={{ color: 'black', fontSize: 20, top: -2 }}>
            Following
          </Title>
        ),

      })} />
      <Stack.Screen name="Block" component={Block} options={{ headerShown: false }} />

      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />

      <Stack.Screen name="ReportBug" component={ReportBug} options={{ headerShown: false }} />
      <Stack.Screen name="DataUsage" component={DataUsage} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} />

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
            <View style={styles.reelsTopButton}>
              <TouchableOpacity style={styles.buttonSide} onPress={() => navigation.navigate('ExploreScreen')}>
                <LiveIcon color='#fff'/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSide} onPress={() => navigation.navigate('Live')}>
                <SearchIcon color='#fff'/>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen options={{ title: 'Posts', headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Following', headerShown: true }} name="FollowingScreen" component={FollowingScreen} />
      <Stack.Screen options={{ title: 'Followers', headerShown: true }} name="FollowersScreen" component={FollowersScreen} />
      <Stack.Screen options={{ title: 'ExploreScreen', headerShown: false, }} name="ExploreScreen" component={ExploreScreen} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} options={({ route }) => ({ title: route.params?.username || 'Profile', headerShown: false })}
      />
    </Stack.Navigator>
  );
};


const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
        },
        cardOverlayEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} options={({ navigation }) => ({
        title: '',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#ffffffff',
        },

        headerTitle: () => (
          <Title style={{ color: 'black', fontSize: 20, top: -2 }}>
            New Post
          </Title>
        ),

      })} />
      <Stack.Screen options={{ title: 'caption screen', headerShown: false, tabBarStyle: { display: 'none' }, }} name="CaptionScreen" component={CaptionScreen} />
      <Stack.Screen options={{ title: 'Search User', headerShown: false }} name="SearchUserScreen" component={SearchUserScreen} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={({ navigation }) => ({
          title: '',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },

          headerTitle: () => (
            <Title style={{ color: 'black', fontSize: 20, top: -2 }}>
              Notifications
            </Title>
          ),

        })}
      />

      <Stack.Screen options={{ title: 'Following', headerShown: true }} name="FollowingScreen" component={FollowingScreen} />
      <Stack.Screen options={{ title: 'Posts', headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen options={{ title: 'Followers', headerShown: true }} name="FollowersScreen" component={FollowersScreen} />
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


export default function App() {
  const [fontsLoaded] = Font.useFonts({
    ManropeBold: require('../assets/fonts/Manrope/Manrope-Bold.ttf'),
    ManropeMedium: require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
    ManropeRegular: require('../assets/fonts/Manrope/Manrope-Regular.ttf'),
    ManropeSemiRegular: require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider theme={{}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreenComponent} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: true,
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                backgroundColor: '#fff',
              },
              title: '',
            }}
          />
          <Stack.Screen
            name="OtpRegisterScreen"
            component={OtpRegisterScreen}
            options={{
              headerShown: true,
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                backgroundColor: '#fff',
              },
              title: '',
            }}
          />
          <Stack.Screen name="SubmitScreen" component={SubmitScreen} />
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const MainTabNavigator = () => {
  const getTabBarStyle = (route, defaultStyle) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const hiddenRoutes = [
      'OtherUserProfile',
      'Settings',
      'FollowersScreen',
      'FollowingScreen',
      'PostDetailScreen',
      'EditProfile',
      'Account',
      'AccountStatus',
      'SearchUserScreen',
      'AddPostScreen',
      'CaptionScreen',
      'ChangeThem',
      'LanguageSwitcher',
      'Security',
      'ReportBug',
      'DataUsage',
      'About',
      'LoginSreen',
      'NotificationsScreen',
    ];

    if (hiddenRoutes.includes(routeName)) {
      return { display: 'none' };
    }

    if (routeName === 'Explore') {
      return {
        backgroundColor: 'black',
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: 'transparent',
      };
    }

    return defaultStyle;
  };



  const ACTIVE_COLOR = '#008CFF';
  const INACTIVE_COLOR = '#888';
  const screenOptions = {
    tabBarShowLabel: true,
    headerShown: false,
    tabBarActiveTintColor: ACTIVE_COLOR,
    tabBarInactiveTintColor: INACTIVE_COLOR,
  };
  const CustomTabBarButton = (props) => (
    <TouchableOpacity activeOpacity={1} {...props} />
  );
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={({ route }) => ({
          title: 'Home',
          tabBarStyle: getTabBarStyle(route),
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
        })}
      />
      <Tab.Screen
        name="Explore"
        component={ReelsStack}
        options={({ route }) => ({
          title: 'Explore',
          tabBarStyle: getTabBarStyle(route, {
            backgroundColor: '#000000ff',
            elevation: 0,
            shadowColor: 'transparent',
            borderTopWidth: 0.2,
            paddingVertical: 8,
          }),
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
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => ({
          title: 'You',
          tabBarStyle: getTabBarStyle(route),
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
        })}
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
  },
  reelsTopButton: {
    flexDirection: 'row',
    gap: 15,
    paddingRight: 10
  }
});

