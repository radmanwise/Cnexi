// screens/FeedScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 2;

const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await axios.get(`${ipconfig.BASE_URL}/posts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.files[0]?.file }} 
        style={styles.itemImage}
        resizeMode="cover"
      />
      {item.files.length > 1 && (
        <View style={styles.multipleIcon}>
          <Ionicons name="copy" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
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