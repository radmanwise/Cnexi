import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
import VideoItem from '../components/reels/VideoItem';
import { useReelsData } from '../hooks/useReelsData';
import { animateScale } from '../utils/animations';
import { Animated, Dimensions, Text } from 'react-native';
import styles from '../theme/reels/styles';

const ReelsScreen = () => {
  const navigation = useNavigation();
  const {
    videos,
    loading,
    likes,
    setLikes,
    error,
    refreshing,
    onRefresh,
  } = useReelsData();

  const videoRefs = useRef({});  // برای نگهداری رفرنس ویدیوها
  const flatListRef = useRef(null);  // رفرنس برای FlatList خود کامپوننت

  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const doubleTapRef = useRef(null);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const playIconAnim = useRef(new Animated.Value(0)).current;

  // Load fonts
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

  // useFocusEffect(
  //   useCallback(() => {
  //     const setupNavigationBar = async () => {
  //       // غیر فعال کردن edge-to-edge
  //       await NavigationBar.setPositionAsync('relative');
  //       // رنگ مشکی مثل YouTube
  //       await NavigationBar.setBackgroundColorAsync('#000000');
  //       StatusBar.setBarStyle('light-content');
  //       StatusBar.setBackgroundColor('black');
  //     };

  //     setupNavigationBar();

  //     return () => {
  //       const resetNavigationBar = async () => {
  //         await NavigationBar.setPositionAsync('relative');
  //         await NavigationBar.setBackgroundColorAsync('#ffffff');
  //         StatusBar.setBarStyle('dark-content');
  //         StatusBar.setBackgroundColor('white');

  //         Object.values(videoRefs.current).forEach(video => {
  //           if (video) video.pauseAsync();
  //         });
  //       };
  //       resetNavigationBar();
  //     };
  //   }, [])
  // );
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
  }, [currentPlayingIndex, playIconAnim]);

  const handleLike = useCallback((videoId) => {
    setLikes(prev => ({
      ...prev,
      [videoId]: prev[videoId] ? prev[videoId] - 1 : prev[videoId] + 1,
    }));
    animateScale(likeAnimation, ANIMATION_SCALE).start();
  }, [setLikes, likeAnimation]);

  const handleDoubleTap = useCallback((videoId) => {
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
  }, [likes, handleLike, heartAnim]);

  const handleViewableItemsChanged = useCallback(({ changed }) => {
    changed.forEach(({ isViewable, index }) => {
      if (isViewable) {
        handleVideoPress(index);
      }
    });
  }, [handleVideoPress]);

  if (!fontsLoaded) {
    return null;
  }

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
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
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
        data={videos}
        ref={flatListRef}  // رفرنس صحیح به FlatList
        renderItem={({ item, index }) => (
          <VideoItem
            item={item}
            index={index}
            currentPlayingIndex={currentPlayingIndex}
            videoRefs={videoRefs}  // رفرنس ویدیوها به VideoItem می‌رود
            handleVideoPress={handleVideoPress}
            likes={likes}
            onLike={handleLike}
            showPlayIcon={showPlayIcon && currentPlayingIndex === index}
            playIconAnim={playIconAnim}
            showDoubleTapHeart={showDoubleTapHeart}
            heartAnim={heartAnim}
            navigation={navigation}
            onDoubleTap={() => handleDoubleTap(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        snapToAlignment="start"
        snapToInterval={Dimensions.get('window').height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
            progressBackgroundColor="#fff"
            colors={['#000']}
          />
        }
      />
    </View>
  );
};


export default ReelsScreen;