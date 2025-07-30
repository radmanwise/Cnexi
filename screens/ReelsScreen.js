import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Video } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import ipconfig from '../config/ipconfig';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import LikeButton from '../components/buttons/LikeButton';
import CommentButton from '../components/buttons/CommentButton';
import ShareButton from '../components/buttons/ShareButton';
import SaveButton from '../components/buttons/SaveButton';
import FollowButton from '../components/buttons/FollowButton';
import { Title, Subtitle, Body, Caption } from '../components/ui/Typography';
import * as Font from 'expo-font';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';


const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const ANIMATION_SCALE = 1.3;
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 80
};


const ReelsScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [isFollowing, setIsFollowing] = useState({});
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const doubleTapRef = useRef(null);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const videoRefs = useRef({});
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const playIconAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const handleViewableItemsChanged = useCallback(({ changed }) => {
    changed.forEach(({ isViewable, index }) => {
      if (isViewable) {
        handleVideoPress(index);
      }
    });
  }, []);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
        'ManropeSemiBold': require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleVideoPress = useCallback(async (index) => {
    if (currentPlayingIndex === index) {
      if (videoRefs.current[index]) {
        await videoRefs.current[index].pauseAsync();
        setShowPlayIcon(true);
        Animated.sequence([
          Animated.spring(playIconAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
          }),
          Animated.timing(playIconAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            delay: 100000,
          }),
        ]).start(() => setShowPlayIcon(false));
      }
      setCurrentPlayingIndex(null);
    } else {
      if (currentPlayingIndex !== null && videoRefs.current[currentPlayingIndex]) {
        await videoRefs.current[currentPlayingIndex].pauseAsync();
      }

      if (videoRefs.current[index]) {
        await videoRefs.current[index].playAsync();
        setShowPlayIcon(true);
        Animated.sequence([
          Animated.spring(playIconAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
          }),
          Animated.timing(playIconAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            delay: 500,
          }),
        ]).start(() => setShowPlayIcon(false));
      }
      setCurrentPlayingIndex(index);
    }
  }, [currentPlayingIndex]);

  const Caption = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.caption}>
          {expanded ? description : `${description.substring(0, 30)}...`}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${ipconfig.BASE_URL}/post/reels/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setVideos(data.results);
      initializeStates(data.results);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDoubleTap = useCallback((videoId, x, y) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (doubleTapRef.current && (now - doubleTapRef.current) < DOUBLE_PRESS_DELAY) {
      if (!likes[videoId]) {
        handleLike(videoId);
      }
      setShowDoubleTapHeart(true);
      Animated.sequence([
        Animated.spring(heartAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
        }),
        Animated.timing(heartAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          delay: 500,
        }),
      ]).start(() => {
        setShowDoubleTapHeart(false);
        heartAnim.setValue(0);
      });
    }
    doubleTapRef.current = now;
  }, [likes, handleLike]);


  useFocusEffect(
    useCallback(() => {
      const setupNavigationBar = async () => {
        await NavigationBar.setBackgroundColorAsync('black');
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('black');
      };

      setupNavigationBar();

      return () => {
        const resetNavigationBar = async () => {
          await NavigationBar.setBackgroundColorAsync('white');
          StatusBar.setBarStyle('dark-content');
          StatusBar.setBackgroundColor('white');
          Object.values(videoRefs.current).forEach(video => {
            if (video) video.pauseAsync();
          });
        };

        resetNavigationBar();
      };
    }, [])
  );

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('Authentication token not found');

        const response = await fetch(`${ipconfig.BASE_URL}/post/reels/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setVideos(data.results);
        initializeStates(data.results);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const initializeStates = useCallback((videos) => {
    const initialLikes = {};
    const initialFollowing = {};

    videos.forEach(video => {
      initialLikes[video.id] = video.likes || 0;
      initialFollowing[video.id] = false;
    });

    setLikes(initialLikes);
    setIsFollowing(initialFollowing);
  }, []);

  const animateLike = useCallback(() => {
    Animated.sequence([
      Animated.spring(likeAnimation, {
        toValue: ANIMATION_SCALE,
        useNativeDriver: true,
      }),
      Animated.spring(likeAnimation, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  }, [likeAnimation]);

  const handleLike = useCallback((videoId) => {
    setLikes(prev => ({
      ...prev,
      [videoId]: prev[videoId] ? prev[videoId] - 1 : prev[videoId] + 1
    }));
    animateLike();
  }, [animateLike]);


  const renderItem = useCallback(({ item, index }) => (
    <View style={styles.videoContainer}>
      <TouchableWithoutFeedback
        onPress={() => handleVideoPress(index)}
        onPressIn={(event) => handleDoubleTap(item.id, event.nativeEvent.locationX, event.nativeEvent.locationY)}
      >
        <View style={styles.videoWrapper}>
          <Video
            ref={ref => videoRefs.current[index] = ref}
            source={{ uri: item.files[0].file }}
            rate={1.0}
            volume={1.0}
            isMuted={index !== currentPlayingIndex}
            resizeMode="cover"
            isLooping
            shouldPlay={index === currentPlayingIndex}
            style={styles.video}
            posterSource={{ uri: item.thumbnail }}
            usePoster={true}
            posterStyle={styles.posterImage}
            cache={true}
          />
          {showPlayIcon && (
            <Animated.View style={[styles.playIconContainer, {
              transform: [
                {
                  scale: playIconAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                },
              ],
              opacity: playIconAnim
            }]}>
              <FontAwesome5 name={currentPlayingIndex === index ? "" : "play"} size={50} color="rgba(227, 227, 227, 0.85)" />
            </Animated.View>
          )}

          {showDoubleTapHeart && (
            <Animated.View style={[styles.heartContainer, {
              transform: [
                {
                  scale: heartAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.5]
                  })
                },
              ],
              opacity: heartAnim
            }]}>
              <Ionicons name="heart" size={100} color="red" />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.sideBar}>
        <View
          style={styles.iconButton}
          onPress={() => handleLike(item.id)}
        >
          <LikeButton postId={item.id} initialLiked={likes[item.id] > 0} iconColor="white" iconSize={28} />
          {/* <Text ></Text> */}
          <Subtitle style={styles.iconText}>{likes[item.id] || "likes"}</Subtitle>
        </View>

        <View style={styles.iconButton}>
          <CommentButton postId={item.id} iconColor="white" iconSize={28} />
          <Subtitle style={styles.iconText}>{item.comments || "comments"}</Subtitle>
        </View>

        <View style={styles.iconButton}>
          <SaveButton postId={item.id} iconColor="white" iconSize={25} />
          <Subtitle style={styles.iconText}>{item.saved || "saved"}</Subtitle>
        </View>

        <View style={styles.iconButton}>
          <ShareButton postId={item.id} iconColor="white" iconSize={25} />
          <Subtitle style={styles.iconText}>{item.shares || "shares"}</Subtitle>
        </View>
      </View>

      <View style={styles.overlay}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity
            style={styles.userRowTouchable}
            onPress={() => {
              navigation.navigate('OtherUserProfile', { slug: item.username });
            }}
          >
            <Image
              source={{ uri: item.profile_image }}
              style={styles.profileImage}
              defaultSource={require('../assets/img/static/user.jpg')}
            />
            <View style={styles.usernameFollowRow}>
              <Text style={styles.username}>{item.username}</Text>
              {item && (
                <FollowButton
                  userId={item.user}
                  initialIsFollowing={!!item.is_following}
                  buttonStyle={{ marginLeft: 0 }}
                  textStyle={{ fontSize: 12 }}
                  borderColor="#ffffffff"
                  followColor="null"
                  unfollowTextColor="none"
                  followTextColor="#121212ff"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ top: 20, }}>
          <Caption description={item.description || ""} />
        </View>
      </View>
    </View>
  ), [currentPlayingIndex, handleVideoPress, showPlayIcon, showDoubleTapHeart]);

  useEffect(() => {
    if (currentPlayingIndex !== null) {
      setShowPlayIcon(true);
      Animated.sequence([
        Animated.spring(playIconAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
        }),
        Animated.timing(playIconAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          delay: 500,
        }),
      ]).start(() => setShowPlayIcon(false));
    }
  }, [currentPlayingIndex]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        snapToAlignment="start"
        snapToInterval={WINDOW_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
            progressBackgroundColor="#ffff"
            colors={['#000']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#008CFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    height: WINDOW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  posterImage: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizeMode: 'cover',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  username: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'ManropeSemiBold',
  },
  sideBar: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
    gap: 10,
  },
  videoWrapper: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 80,
    zIndex: 2,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  caption: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    bottom: 10,
    fontFamily: 'Manrope',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 15,
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  iconButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 45,
  },
  playIconContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top: 390
  },
  backButton: {
    position: 'absolute',
    top: -50,
    left: 15,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  userRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 50,
    left: -12
  },
  usernameFollowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  username: {
    fontSize: 15,
    marginRight: 25,
    color: '#fffffffd',
    fontFamily: 'ManropeSemiBold'
  },
});

export default ReelsScreen;