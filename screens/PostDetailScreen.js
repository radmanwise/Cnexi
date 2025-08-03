import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from '../components/buttons/LikeButton';
import SaveButton from '../components/buttons/SaveButton';
import CommentButton from '../components/buttons/CommentButton';
import PostMenu from '../components/post/PostMenu';
import CaptionWithMore from '../components/post/caption/CaptionWithMore';
import ipconfig from '../config/ipconfig';
import Subtitle from '../components/ui/Typography';

const { width, height } = Dimensions.get('window');
const POST_HEIGHT = height * 0.45;
const PROFILE_IMAGE_SIZE = 28;

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [fontsLoaded] = useFonts({
    Manrope: require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
    ManropeSemiBold: require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
  });

  const fetchPost = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const postId = route.params.postId;
      const response = await axios.get(`${ipconfig.BASE_URL}/post/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      setPost(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [route.params.postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const toggleVideoPlayback = useCallback(() => {
    setIsPlaying(prev => {
      if (prev) videoRef.current?.pauseAsync();
      else videoRef.current?.playAsync();
      return !prev;
    });
  }, []);

  const renderMediaContent = () => {
    if (!post?.files?.length) return null;

    const renderItem = ({ item }) => (
      <View style={styles.slideContainer}>
        {item.file.endsWith('.mp4') ? (
          <TouchableWithoutFeedback onPress={toggleVideoPlayback}>
            <Video
              ref={videoRef}
              source={{ uri: item.file }}
              style={styles.mediaContent}
              resizeMode="contain"
              isLooping
              isMuted={!isPlaying}
              shouldPlay={isPlaying}
              useNativeControls={false}
            />
          </TouchableWithoutFeedback>
        ) : (
          <Image source={{ uri: item.file }} style={styles.mediaContent} resizeMode="cover" />
        )}
      </View>
    );

    return (
      <FlatList
        data={post.files}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${post.id}-${idx}`}
        renderItem={renderItem}
        style={styles.mediaContainer}
      />
    );
  };

  if (!fontsLoaded || loading || !post) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{post.username}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>  
          <View style={styles.profileStatus}>
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => navigation.navigate('OtherUserProfile', { slug: post.username })}>
              <Image source={{ uri: post.profile_image }} style={styles.profileImage} />
              <Text style={styles.username}>{post.username}</Text>
            </TouchableOpacity>
            <PostMenu />
          </View>
        </View>

        {renderMediaContent()}

        <View style={styles.actionsContainer}>
          <View style={styles.leftActions}>
            <LikeButton postId={post.id} initialLiked={post.is_liked} />
            <CommentButton postId={post.id} />
          </View>
          <SaveButton postId={post.id} initialSaved={post.is_saved} />
        </View>

        <View style={styles.captionContainer}>
          <CaptionWithMore description={post.description} />
        </View>

        <Text style={styles.date}>{post.files[0]?.created_at_humanized}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 20 },
  headerBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginTop: 40,
  },
  backButton: { width: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'ManropeSemiBold',
    color: 'black',
  },
  headerRight: { width: 40 },
  header: {
    padding: 10,
  },
  profileStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  username: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: 'ManropeSemiBold',
    color: 'black',
  },
  mediaContainer: {
    height: POST_HEIGHT,
    width: '100%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slideContainer: {
    width: '100%',
    height: POST_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContent: {
    width: '95%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 9,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  captionContainer: {
    paddingHorizontal: 15,
  },
  date: {
    paddingHorizontal: 15,
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Manrope',
    padding: 13,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
  },
});

export default PostDetailScreen;