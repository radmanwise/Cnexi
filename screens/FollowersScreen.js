import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import ipconfig from '../config/ipconfig';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import FollowButton from '../components/buttons/FollowButton';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import * as Font from 'expo-font';

const MAX_BIO_LENGTH = 60;
const truncateText = (str, maxLength) =>
  str.length > maxLength ? str.substring(0, maxLength) + '...' : str;

const FollowerItem = ({ user, onFollow, onUnfollow, isFollowing }) => {
  const navigation = useNavigation();

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={styles.followerCard}
    >
      <TouchableOpacity
        style={styles.followerContent}
        onPress={() =>
          navigation.navigate('OtherUserProfile', { slug: user.username })
        }
      >
        <Image
          source={
            user.avatar
              ? { uri: user.picture }
              : require('../assets/img/static/user.jpg')
          }
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
        <View style={{ left: 0 }}>
          <FollowButton
            userId={user.id}
            initialIsFollowing={!!isFollowing}
            onFollow={() => onFollow(user.id)}
            onUnfollow={() => onUnfollow(user.id)}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const FollowersScreen = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const UserId = route.params?.userId;

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

  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      const response = await axios.get(`${ipconfig.BASE_URL}profile/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowers(response.data.followers || []);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching followers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!UserId) return;
    fetchFollowers();
  }, [UserId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFollowers();
    setRefreshing(false);
  }, [UserId]);

  const handleFollow = useCallback(async (userId) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(`${ipconfig.BASE_URL}follow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, isFollowing: true } : user
        )
      );
    } catch (error) {
      console.error('Follow failed:', error);
    }
  }, []);

  const handleUnfollow = useCallback(async (userId) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(`${ipconfig.BASE_URL}unfollow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, isFollowing: false } : user
        )
      );
    } catch (error) {
      console.error('Unfollow failed:', error);
    }
  }, []);

  const filteredFollowers = useMemo(
    () =>
      followers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.fullName &&
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [followers, searchQuery]
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#363636ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFollowers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="users" size={50} color="#ccc" />
      <Text style={styles.emptyTitle}>{t('No users found')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredFollowers}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<EmptyList />}
        renderItem={({ item }) => (
          <FollowerItem
            user={item}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            isFollowing={item.isFollowing}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#666"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  followerCard: {
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0ff',
    width: '115%',
    left: -25,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#ffffffff',
    left: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  followerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    left: -13,
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
    backgroundColor: '#212121ff',
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

export default FollowersScreen;
