import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from '../components/buttons/LikeButton';
import SaveButton from '../components/buttons/SaveButton';
import CommentButton from '../components/buttons/CommentButton';
import PostMenu from '../components/post/PostMenu';
import CaptionWithMore from '../components/post/caption/CaptionWithMore';
import ipconfig from '../config/ipconfig';
import { Subtitle, Title } from '../components/ui/Typography';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const POST_HEIGHT = height * 0.45;
const PROFILE_IMAGE_SIZE = 35;

const SkeletonBox = ({ width, height, style, borderRadius = 8 }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#e1e9ee',
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [post, setPost] = useState(route.params?.postData || null);
  const [loading, setLoading] = useState(!route.params?.postData);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (!post) fetchPost();
  }, [fetchPost]);

  const toggleVideoPlayback = useCallback(() => {
    setIsPlaying(prev => {
      if (prev) videoRef.current?.pauseAsync();
      else videoRef.current?.playAsync();
      return !prev;
    });
  }, []);

  const renderMediaContent = useMemo(() => {
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
              shouldPlay={isPlaying}
              isMuted={!isPlaying}
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
  }, [post, isPlaying]);

  if (loading) {
    return (
      <ScrollView style={styles.skeletonContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50, marginLeft: 10 }}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <SkeletonBox width={100} height={12} borderRadius={6} style={{ marginLeft: 10 }} />
        </View>

        <SkeletonBox width="95%" height={350} borderRadius={9} style={{ marginTop: 10, alignSelf: 'center' }} />

        <SkeletonBox width="40%" height={12} borderRadius={6} style={{ marginTop: 25, alignSelf: 'center', marginLeft: -215 }} />

      </ScrollView>
    );
  }

  if (!post) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>{post.username}</Title>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.profileStatus}>
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => navigation.navigate('OtherUserProfile', { slug: post.username })}
            >
              <Image source={{ uri: post.profile_image }} style={styles.profileImage} />
              <Title style={styles.username}>{post.username}</Title>
            </TouchableOpacity>
            <PostMenu />
          </View>
        </View>

        {renderMediaContent}

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

        <Subtitle style={styles.date}>{post.files[0]?.created_at_humanized}</Subtitle>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  skeletonContainer: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { paddingBottom: 20 },
  headerBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
  },
  backButton: { width: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: 'black' },
  headerRight: { width: 40 },
  header: { padding: 10 },
  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 0,
  },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  username: { marginLeft: 8, fontSize: 13, color: 'black' },
  mediaContainer: {
    height: POST_HEIGHT,
    width: '100%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slideContainer: {
    width: width,
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
    padding: 13,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
});

export default PostDetailScreen;
