// screens/FeedScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import PostList from '../components/post/PostList';
const fetchPosts = async (page = 1, pageSize = 6) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await axios.get(
      `${ipconfig.BASE_URL}/posts/?page=${page}&page_size=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.results; // یا response.data بسته به سرورت
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 2;

const FeedScreen = () => {
  const [initialPosts, setInitialPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialPosts = async () => {
      const posts = await fetchPosts(1); // فقط ۶ تا
      setInitialPosts(posts);
      setLoading(false);
    };
    loadInitialPosts();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!loading && (
        <PostList posts={initialPosts} fetchPosts={fetchPosts} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingTop: 1,
  },
  columnWrapper: {
    marginBottom: 2,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: 2,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  multipleIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default FeedScreen;