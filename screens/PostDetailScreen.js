import { Video } from 'expo-av';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import CaptionWithMore from '../components/post/CaptionWithMore';
import ipconfig from '../config/ipconfig';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import ShareButton from '../components/buttons/ShareButton';
import LikeButton from '../components/buttons/LikeButton';
import SaveButton from '../components/buttons/SaveButton';
import PostMenu from '../components/post/PostMenu';
import CommentButton from '../components/buttons/CommentButton';
import { Ionicons } from '@expo/vector-icons';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POST_HEIGHT = SCREEN_HEIGHT * 0.45;
const PROFILE_IMAGE_SIZE = 28;

const PostDetailScreen = ({ route }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Manrope': require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
    'ManropeBold': require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
  });

  const fetchPost = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const postId = route.params.postId;

      const response = await axios.get(
        `${ipconfig.BASE_URL}/post/${postId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      console.log("Post Data:", JSON.stringify(response.data, null, 2));
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  }, [route.params.postId]);

  const handleVideoPress = useCallback(() => {
    setIsPlaying(prev => {
      if (prev) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const renderMediaContent = () => {
    if (post.files && post.files.length > 1) {
      return (
        <View style={styles.mediaContainer}>
          <FlatList
            data={post.files}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(file, fileIndex) => `${post.id}-${fileIndex}`}
            renderItem={({ item: file }) => (
              <View style={styles.slideContainer}>
                {file.file.endsWith('.mp4') ? (
                  <TouchableWithoutFeedback onPress={handleVideoPress}>
                    <Video
                      ref={videoRef}
                      source={{ uri: file.file }}
                      style={styles.mediaContent}
                      resizeMode="contain"
                      isLooping
                      isMuted={!isPlaying}
                      useNativeControls={false}
                      shouldPlay={isPlaying}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <Image
                    style={styles.mediaContent}
                    source={{ uri: file.file }}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}
          />
        </View>
      );
    }



    return (
      <View style={styles.mediaContainer}>
        {post.files?.[0]?.file?.endsWith('.mp4') ? (
          <TouchableWithoutFeedback onPress={handleVideoPress}>
            <Video
              ref={videoRef}
              source={{ uri: post.files[0].file }}
              style={styles.mediaContent}
              resizeMode="contain"
              isLooping
              isMuted={!isPlaying}
              useNativeControls={false}
              shouldPlay={isPlaying}
            />
          </TouchableWithoutFeedback>
        ) : (
          <Image
            style={styles.mediaContent}
            source={{ uri: post.files[0].file }}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  if (!fontsLoaded || loading || !post) {
    return null;
  }

  console.log("Current post state:", JSON.stringify(post, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>post</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView>
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <View style={styles.profileStatus}>
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => {
                  navigation.navigate('OtherUserProfile', { slug: post.username });
                }}
              >
                <Image
                  source={{ uri: post.profile_image }}
                  style={styles.profileImage}
                  // cacheKey={`profile-${post.username}`}
                />
                <Text style={styles.username}>
                  {post.username}
                </Text>
              </TouchableOpacity>
              <PostMenu style={{ left: 8 }} />
            </View>
          </View>

          <View style={styles.mediaContainer}>
            {renderMediaContent()}
          </View>

          <View style={styles.actionsContainer}>
            <View style={styles.leftActions}>
              <LikeButton postId={post.id} initialLiked={post.is_liked} />
              <CommentButton postId={post.id} />
            </View>
            <View style={styles.rightActions}>
              <SaveButton postId={post.id} initialSaved={post.is_saved} />
            </View>
          </View>

          <View style={styles.captionContainer}>
            <CaptionWithMore description={post.description} />
          </View>

          <Text style={styles.date}>
            {post.files[0].created_at_humanized}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    width: SCREEN_WIDTH,
    height: POST_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: 0,
  },
  postContainer: {
    width: SCREEN_WIDTH,
    marginBottom: 10,
    top: 150,
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: PROFILE_IMAGE_SIZE,
    width: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  username: {
    fontSize: 13,
    marginLeft: 8,
    color: 'black',
    fontFamily: 'MontserratBold',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: POST_HEIGHT,
    backgroundColor: '#f0f0f0',
    position: 'relative',
    overflow: 'hidden',
  },
  mediaContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    borderRadius: 20,
    padding: 2,
    height: 35,
    right: 10
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingLeft: 10,
  },
  captionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  captionUsername: {
    fontSize: 13,
    marginRight: 8,
    fontFamily: 'MontserratBold',
  },
  date: {
    fontSize: 12,
    color: 'gray',
    paddingHorizontal: 15,
    paddingBottom: 5,
    fontFamily: 'Montserrat',
  },
  suggestionBox: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#dbdbdb',
  },
  suggestionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  suggestionTitle: {
    fontFamily: 'MontserratBold',
    fontSize: 14,
    color: '#262626',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#0095f6',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  headerBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ffffffff',
    paddingHorizontal: 16,
    top: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'MontserratBold',
  },
  headerRight: {
    width: 40,
  },
});

export default PostDetailScreen;