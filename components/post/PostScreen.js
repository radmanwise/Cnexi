import { Video } from 'expo-av';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FastImage from 'expo-fast-image';
import CommentButton from '../buttons/CommentButton';
import CaptionWithMore from './caption/CaptionWithMore';
import LikeButton from '../buttons/LikeButton';
import SaveButton from '../buttons/SaveButton';
import PostMenu from './PostMenu';
import ipconfig from '../../config/ipconfig';
import BadgeCheck from '../icons/BadgeCheck';
import ZoomMediaModal from './ZoomMediaModal';
import Maximize2Icon from '../icons/Maximize2Icon';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Animated
} from 'react-native';
import ShareButton from '../buttons/ShareButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POST_HEIGHT = SCREEN_HEIGHT * 0.50;
const PROFILE_IMAGE_SIZE = 35;


const PostScreen = ({ filter, scrollY }) => {
  const videoRefs = useRef([]);
  const navigation = useNavigation();
  const [showZoomButtonIndex, setShowZoomButtonIndex] = useState(null);
  const zoomButtonOpacity = useRef(new Animated.Value(1)).current;
  const zoomButtonTimeout = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [activeSlides, setActiveSlides] = useState({});

  const [state, setState] = useState({
    posts: [],
    loading: true,
    refreshing: false,
    page: 1,
    hasNextPage: true,
    isPlaying: {},
    isModalVisible: false,
  });

  const clearZoomTimeout = () => {
    if (zoomButtonTimeout.current) {
      clearTimeout(zoomButtonTimeout.current);
      zoomButtonTimeout.current = null;
    }
  };

  const startHideZoomTimer = () => {
    clearZoomTimeout();
    zoomButtonTimeout.current = setTimeout(() => {
      Animated.timing(zoomButtonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowZoomButtonIndex(null));
    }, 50000);
  };

  const showZoomButton = (index) => {
    setShowZoomButtonIndex(index);
    Animated.timing(zoomButtonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    startHideZoomTimer();
  };

  const handleVideoPress = useCallback((index) => {
    setState((prev) => {
      const newIsPlaying = !prev.isPlaying[index];
      if (newIsPlaying) {
        showZoomButton(index);
        videoRefs.current[index]?.playAsync();
      } else {
        videoRefs.current[index]?.pauseAsync();
      }
      return {
        ...prev,
        isPlaying: { ...prev.isPlaying, [index]: newIsPlaying },
      };
    });
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
          {item.username === 'voss' && <BadgeCheck />}
        </TouchableOpacity>
        <PostMenu style={{ left: 8 }} />
      </View>
    </View>
  ), [navigation, truncateText]);



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
                  <TouchableWithoutFeedback onPress={() => {
                    setModalMedia({ type: 'video', uri: file.file });
                    setModalVisible(true);
                  }}>
                    <Video
                      ref={ref => videoRefs.current[index] = ref}
                      source={{ uri: file?.file ?? '' }}
                      style={styles.mediaContent}
                      resizeMode="cover"
                      isLooping
                      isMuted={!state.isPlaying[index]}
                      useNativeControls={false}
                      shouldPlay={state.isPlaying[index]}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={() => {
                    setModalMedia({ type: 'image', uri: file.file });
                    setModalVisible(true);
                  }}>
                    <FastImage
                      style={styles.mediaContent}
                      source={{ uri: file.file }}
                      cache="web"
                      resizeMode="cover"
                    />
                  </TouchableWithoutFeedback>
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
                  { backgroundColor: dotIndex === (activeSlides[item.id] || 0) ? '#000' : '#ffffffff' }
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
          <>
            <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
              <Video
                ref={(ref) => (videoRefs.current[index] = ref)}
                source={{ uri: item.files[0].file }}
                style={styles.mediaContent}
                resizeMode="cover"
                isLooping
                isMuted={!state.isPlaying[index]}
                useNativeControls={false}
                shouldPlay={state.isPlaying[index]}
              />
            </TouchableWithoutFeedback>

            {showZoomButtonIndex === index && (
              <Animated.View style={[styles.videoZoomButton, { opacity: zoomButtonOpacity }]}>
                <TouchableOpacity
                  onPress={() => {
                    setModalMedia({ type: 'video', uri: item.files[0].file });
                    setModalVisible(true);
                  }}
                >
                  <Maximize2Icon size={17} color="white" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              setModalMedia({ type: 'image', uri: item.files[0].file });
              setModalVisible(true);
            }}
          >
            <FastImage
              style={styles.mediaContent}
              source={{ uri: item.files[0].file }}
              resizeMode={FastImage.resizeMode}
              cache="web"
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  },
    [handleVideoPress, state.isPlaying, showZoomButtonIndex, zoomButtonOpacity]
  );

  const renderItem = useCallback(({ item, index }) => (
    <View style={styles.postContainer} onStartShouldSetResponder={() => true}>
      {renderPostHeader({ item })}
      {renderMediaContent({ item, index })}

      <View style={styles.actionsContainer}>
        <View style={styles.leftActions} onStartShouldSetResponder={() => true}>

          <TouchableOpacity style={styles.iconWrapper}>
            <LikeButton postId={item.id} initialLiked={item.is_liked} iconSize={27} />
          </TouchableOpacity>

          <View onStartShouldSetResponder={() => true}>

            <TouchableOpacity style={styles.iconWrapper}>
              <CommentButton postId={item.id} iconSize={28} />
            </TouchableOpacity>

          </View>

          {/* <TouchableOpacity style={styles.iconWrapper}>
            <ShareButton postId={item.id} iconColor="black" iconSize={23} />
          </TouchableOpacity> */}
        </View>
        <View style={styles.rightActions}>

          <TouchableOpacity style={styles.iconWrapper}>
            <SaveButton postId={item.id} initialSaved={item.is_saved} iconSize={24.3} />
          </TouchableOpacity>
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

  useEffect(() => {
    if (modalVisible) {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef && videoRef.pauseAsync) {
          videoRef.pauseAsync();
        }
      });
      setState((prev) => ({
        ...prev,
        isPlaying: {},
      }));
    }
  }, [modalVisible]);


  const onScrollHandler = useCallback(
    (event) => {
      if (showZoomButtonIndex !== null) {
        showZoomButton(showZoomButtonIndex);
      }

      if (scrollY) {
        scrollY.setValue(event.nativeEvent.contentOffset.y);
      }
    },
    [showZoomButtonIndex, scrollY]
  );

  return (
    <>
      <Animated.FlatList
        data={state.posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onMomentumScrollEnd={event => {
          const index = Math.floor(event.nativeEvent.contentOffset.y / 400);
          handlePostChange(index);
        }}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={onRefresh}
            progressViewOffset={150}
            colors={['#000000ff']}
            tintColor="#000000ff"
            progressBackgroundColor="#ffffffff"
          />
        }
        scrollEventThrottle={16}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!state.isModalVisible}
        contentContainerStyle={{ paddingTop: 140, zIndex: 1 }}
        onScroll={
          scrollY
            ? Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )
            : null
        }
      />
      <ZoomMediaModal
        visible={modalVisible}
        media={modalMedia}
        onClose={() => setModalVisible(false)}
      />
    </>
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
    gap: 5
  },
  profileImage: {
    height: PROFILE_IMAGE_SIZE,
    width: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  username: {
    fontSize: 13,
    marginLeft: 0,
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
  },
  mediaContent: {
    width: '120%',
    height: '100%',
    aspectRatio: 4 / 4,
    borderRadius: 12,
    backgroundColor: '#e2e2e2e8',
    alignSelf: 'center',
  },
  videoZoomButton: {
    position: 'absolute',
    bottom: 15,
    right: 345,
    backgroundColor: '#00000088',
    borderRadius: 50,
    padding: 7,
  },



  // mediaContent: {
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: '#ffff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 12
  // },
  // videoZoomButton: {
  //   position: 'absolute',
  //   bottom: 15,
  //   right: 345,
  //   backgroundColor: '#00000088',
  //   borderRadius: 50,
  //   padding: 7,
  // },
  // slideContainer: {
  //   width: SCREEN_WIDTH,
  //   height: POST_HEIGHT,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#ffff',
  //   borderWidth: 0.3,
  //   borderColor: 'gray'
  // },


  iconWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },


  slideContainer: {
    width: SCREEN_WIDTH * 0.95, // بهتره کمی کمتر از عرض کل باشه
    height: POST_HEIGHT,
    overflow: 'hidden', // 👈 جلوگیری از بیرون زدن تصویر
    borderRadius: 12,
    backgroundColor: '#000', // کمک به تمیزی لبه‌ها
    alignSelf: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    borderRadius: 20,
    right: 15,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    borderRadius: 20,
    left: 110,
  },
  captionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontFamily: 'Manrope',
  },
  date: {
    fontSize: 11,
    color: '#929292ff',
    paddingHorizontal: 15,
    paddingBottom: 7,
    fontFamily: 'Manrope',
  },
});

export default PostScreen;