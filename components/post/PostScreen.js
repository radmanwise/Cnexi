import { Video } from 'expo-av';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import FastImage from 'expo-fast-image';
import CommentButton from '../buttons/CommentButton';
import CaptionWithMore from './CaptionWithMore';
import LikeButton from '../buttons/LikeButton';
import SaveButton from '../buttons/SaveButton';
import PostMenu from './PostMenu';
import ipconfig from '../../config/ipconfig';
import * as Font from 'expo-font';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POST_HEIGHT = SCREEN_HEIGHT * 0.50;
const PROFILE_IMAGE_SIZE = 30;

const PostScreen = () => {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    refreshing: false,
    page: 1,
    hasNextPage: true,
    isPlaying: {},
    isModalVisible: false
  });




  const videoRefs = useRef([]);
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
        'ManropeSemiBold': require('../../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const fetchPosts = useCallback(async (pageToFetch = 1, shouldRefresh = false) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get(
        `${ipconfig.BASE_URL}/post/following/post-list/?page=${pageToFetch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      setState(prev => ({
        ...prev,
        posts: shouldRefresh ? response.data.results : [...prev.posts, ...response.data.results],
        hasNextPage: response.data.next !== null,
        page: pageToFetch,
        loading: false,
        refreshing: false
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setState(prev => ({ ...prev, loading: false, refreshing: false }));
    }
  }, []);


  const handlePostChange = useCallback((index) => {
    setState(prev => {
      const updatedPlayingState = {};
      prev.posts.forEach((_, i) => {
        updatedPlayingState[i] = false;
        videoRefs.current[i]?.pauseAsync();
      });
      return {
        ...prev,
        isPlaying: { ...updatedPlayingState, [index]: true }
      };
    });
    videoRefs.current[index]?.playAsync();
  }, []);

  const handleVideoPress = useCallback((index) => {
    setState(prev => {
      const newIsPlaying = !prev.isPlaying[index];
      videoRefs.current[index]?.[newIsPlaying ? 'playAsync' : 'pauseAsync']();
      return {
        ...prev,
        isPlaying: { ...prev.isPlaying, [index]: newIsPlaying }
      };
    });
  }, []);

  const onRefresh = useCallback(() => {
    setState(prev => ({ ...prev, refreshing: true }));
    fetchPosts(1, true);
  }, [fetchPosts]);

  const loadMorePosts = useCallback(() => {
    const { loading, hasNextPage, page } = state;
    if (!loading && hasNextPage) {
      fetchPosts(page + 1);
    }
  }, [state, fetchPosts]);

  const truncateText = useMemo(() => (str, maxLength) =>
    str?.length > maxLength ? `${str.substring(0, maxLength)}...` : str,
    []);




  const renderPostHeader = useCallback(({ item }) => (
    <View style={styles.header}>
      <View style={styles.profileStatus}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => {
            navigation.navigate('OtherUserProfile', { slug: item.username });
          }}
        >

          <FastImage
            source={{ uri: item.profile_image }}
            style={styles.profileImage}
            cacheKey={`profile-${item.username}`}
          />
          <Text style={styles.username}>{truncateText(item.username || 'username', 12)}</Text>
        </TouchableOpacity>
        <PostMenu style={{ left: 8 }} />
      </View>
    </View>
  ), [navigation, truncateText]);

  const [activeSlides, setActiveSlides] = useState({});


  const renderMediaContent = useCallback(({ item, index }) => {
    if (item.files && item.files.length > 1) {
      return (
        <View style={styles.mediaContainer}>
          <FlatList
            data={item.files}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(file, fileIndex) => `${item.id}-${fileIndex}`}
            onScroll={event => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveSlides(prev => ({
                ...prev,
                [item.id]: slideIndex
              }));
            }}
            scrollEventThrottle={16}
            renderItem={({ item: file }) => (
              <View style={styles.slideContainer}>
                {file.file.endsWith('.mp4') ? (
                  <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
                    <Video
                      ref={ref => videoRefs.current[index] = ref}
                      source={{ uri: file?.file ?? '' }}
                      style={styles.mediaContent}
                      resizeMode="contain"
                      isLooping
                      isMuted={!state.isPlaying[index]}
                      useNativeControls={false}
                      shouldPlay={state.isPlaying[index]}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <FastImage
                    style={styles.mediaContent}
                    source={{ uri: file.file }}
                    resizeMode={FastImage.resizeMode}
                    cache="web"
                  />
                )}
              </View>
            )}

          />
          <View style={styles.paginationDots}>
            {item.files.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  { backgroundColor: dotIndex === (activeSlides[item.id] || 0) ? '#fff' : '#ffffff80' }
                ]}
              />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer}>
        {item.files?.[0]?.file?.endsWith('.mp4') ? (
          <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
            <Video
              ref={ref => videoRefs.current[index] = ref}
              source={{ uri: item.files[0].file }}
              style={styles.mediaContent}
              resizeMode="contain"
              isLooping
              isMuted={!state.isPlaying[index]}
              useNativeControls={false}
              shouldPlay={state.isPlaying[index]}
              height="169%"
            />
          </TouchableWithoutFeedback>
        ) : (
          <FastImage
            style={styles.mediaContent}
            source={{ uri: item.files[0].file }}
            resizeMode={FastImage.resizeMode}
            cache="web"
          />
        )}
      </View>
    );
  }, [handleVideoPress, state.isPlaying, activeSlides]);

  const renderItem = useCallback(({ item, index }) => (
    <View style={styles.postContainer} onStartShouldSetResponder={() => true}>
      {renderPostHeader({ item })}
      {renderMediaContent({ item, index })}

      <View style={styles.actionsContainer}>
        <View style={styles.leftActions} onStartShouldSetResponder={() => true}>
          <LikeButton postId={item.id} initialLiked={item.is_liked} />
          {/* <ShareButton postId={item.id} /> */}
          <View onStartShouldSetResponder={() => true}>
            <CommentButton postId={item.id} />
          </View>
        </View>
        <View style={styles.rightActions}>
          <SaveButton postId={item.id} initialSaved={item.is_saved} />
        </View>
      </View>

      <View style={styles.captionContainer}>
        <CaptionWithMore description={item.description} />
      </View>

      <Text style={styles.date}>
        {item.files[0].created_at_humanized}
      </Text>
      <View style={{ marginTop: 14 }}>

      </View>
    </View>
  ), [renderPostHeader, renderMediaContent]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        videoRefs.current.forEach(videoRef => {
          if (videoRef) {
            videoRef.pauseAsync();
          }
        });
        setState(prev => ({
          ...prev,
          isPlaying: {}
        }));
      };
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }


  return (
    <FlatList
      data={state.posts}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      onMomentumScrollEnd={event => {
        const index = Math.floor(event.nativeEvent.contentOffset.y / 400);
        handlePostChange(index);
      }}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.5}
      refreshing={state.refreshing}
      onRefresh={onRefresh}
      scrollEventThrottle={16}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!state.isModalVisible}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: "SCREEN_WIDTH",
    marginBottom: 10,
    borderTopColor: '#ffff',
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
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
    fontFamily: 'ManropeSemiBold',
    fontWeight: '600',
    top: -2,
  },
  mediaContainer: {
    width: '95%',
    height: POST_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    left: 8,
    borderWidth: 0.3,
    borderColor: 'gray'
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: POST_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  mediaContent: {
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '50%',
    height: '100%',
    backgroundColor: '#ffff',
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: '#fff',
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
    right: 10,
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
    fontFamily: 'Manrope',
  },
  captionUsername: {
    fontSize: 13,
    marginRight: 8,
    fontFamily: 'Manrope',
  },
  date: {
    fontSize: 11,
    color: '#929292ff',
    paddingHorizontal: 15,
    paddingBottom: 7,
    fontFamily: 'Manrope',
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
    fontFamily: 'Manrope',
    fontSize: 14,
    color: '#262626',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: '#0095f6',
    fontWeight: '600',
  },

});



export default PostScreen;