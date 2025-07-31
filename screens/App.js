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
  OtpRegisterScreen,
  SplashScreen,
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

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangeThem" component={ChangeThem} options={{ headerShown: false }} />
      <Stack.Screen name="LanguageSwitcher" component={LanguageSwitcher} options={{ headerShown: false }} />
      <Stack.Screen name="Security" component={Security} options={{ headerShown: false }} />

      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ headerShown: false }} />

      <Stack.Screen name="FollowersScreen" component={FollowersScreen} options={{ title: 'Followers', headerShown: true }} />
      <Stack.Screen name="FollowingScreen" component={FollowingScreen} options={{ title: 'Following', headerShown: true }} />
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
                <Subtitle style={{ fontSize: 10 }}>Explore</Subtitle>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSide} onPress={() => navigation.navigate('Live')}>
                <Subtitle style={{ fontSize: 10 }}>Lives</Subtitle>
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
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} options={{ headerShown: false }} />
      <Stack.Screen options={{ title: 'caption screen', headerShown: false, tabBarStyle: { display: 'none' }, }} name="CaptionScreen" component={CaptionScreen} />
      <Stack.Screen options={{ title: 'Search User', headerShown: false }} name="SearchUserScreen" component={SearchUserScreen} />
      <Stack.Screen options={{ title: 'Notifications', }} name="NotificationsScreen" component={NotificationsScreen} />
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
  });


  if (!fontsLoaded) return null;
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
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
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
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

const MainTabNavigator = () => {
  const ACTIVE_COLOR = '#000000ff';
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
        options={{
          title: 'Home',
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowColor: 'transparent',
            borderTopWidth: 0.2,
            paddingVertical: 8,
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
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowColor: 'transparent',
            borderTopWidth: 0.2,
            paddingVertical: 8,
          },
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
  reelsTopButton: {
    flexDirection: 'row',
    gap: 15,
    paddingRight: 10
  }
});

