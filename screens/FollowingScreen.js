import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Easing,
  Animated,
} from 'react-native';
import { TabView, SceneMap, PagerPan } from 'react-native-tab-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';

import ipconfig from '../config/ipconfig';
import FollowButton from '../components/buttons/FollowButton';

const screenWidth = Dimensions.get('window').width;

const MAX_BIO_LENGTH = 60;
const truncateText = (str, maxLength) =>
  str.length > maxLength ? str.substring(0, maxLength) + '...' : str;

const FollowerItem = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.followerCard}>
      <TouchableOpacity
        style={styles.followerContent}
        onPress={() => navigation.navigate('OtherUserProfile', { slug: user.username })}
      >
        <Image
          source={user.avatar ? { uri: user.picture } : require('../assets/img/static/user.jpg')}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{user.username}</Text>
          {user.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {truncateText(user.bio, MAX_BIO_LENGTH)}
            </Text>
          )}
        </View>
        <FollowButton userId={user.id} initialIsFollowing={!!user.is_following} />
      </TouchableOpacity>
    </View>
  );
};

const EmptyList = ({ message }) => (
  <View style={styles.emptyContainer}>
    <Feather name="users" size={50} color="#ccc" />
    <Text style={styles.emptyTitle}>{message}</Text>
  </View>
);

const UserList = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const userId = route.params?.userId;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync('token');
      const res = await axios.get(`${ipconfig.BASE_URL}profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data[endpoint] || []);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );

  if (error)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <FollowerItem user={item} />}
      ListEmptyComponent={<EmptyList message={`No ${endpoint}`} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const CustomTabBar = (props) => {
  const inputRange = props.navigationState.routes.map((_, i) => i);

  const translateX = props.position.interpolate({
    inputRange,
    outputRange: inputRange.map(
      i => (screenWidth / props.navigationState.routes.length) * i
    ),
  });

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          justifyContent: 'space-around',
        }}
      >
        {props.navigationState.routes.map((route, i) => {
          const color = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 'black' : 'gray'
            ),
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => props.jumpTo(route.key)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center' }}
            >
              <Animated.Text
                style={{
                  fontSize: 14,
                  fontFamily: 'ManropeSemiBold',
                  color,
                }}
              >
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: screenWidth / props.navigationState.routes.length,
          backgroundColor: 'black',
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

const FollowingScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'following', title: 'Following' },
    { key: 'followers', title: 'Followers' },
  ]);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Manrope: require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
        ManropeSemiBold: require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const renderScene = SceneMap({
    following: () => <UserList endpoint="following" />,
    followers: () => <UserList endpoint="followers" />,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderPager={(props) => (
          <PagerPan
            {...props}
            transitionSpec={{
              timing: Animated.timing,
              duration: 400,
              easing: Easing.out(Easing.exp),
            }}
          />
        )}
        renderTabBar={(props) => <CustomTabBar {...props} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  followerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffffff',
    width: '115%',
    left: -25,
  },
  followerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    left: -13,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#fff',
    left: 12,
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  username: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: 'ManropeSemiBold',
  },
  bio: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#212121',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default FollowingScreen;
