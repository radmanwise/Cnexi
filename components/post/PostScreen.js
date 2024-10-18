import { Video } from 'expo-av';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import CommentButton from '../buttons/CommentButton';
import CaptionWithMore from './CaptionWithMore';
import * as SecureStore from 'expo-secure-store';
import QFollowButton from '../buttons/QFollowButton';
import Entypo from '@expo/vector-icons/Entypo';
import LikeButton from '../buttons/LikeButton';
import ZoomableImage from './ZoomableImage';
import { useNavigation } from '@react-navigation/native';
import SaveButton from '../buttons/SaveButton';

const PostScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1); // صفحه فعلی
  const [hasNextPage, setHasNextPage] = useState(true); // آیا صفحه بعدی وجود دارد
  const videoRefs = useRef([]);
  const navigation = useNavigation();

  const fetchPosts = async (pageToFetch = 1, refreshing = false) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      console.log('Retrieved token:', token);

      const postsResponse = await axios.get(`https://nexsocial.ir/post/?page=${pageToFetch}`);
      if (refreshing) {
        setPosts(postsResponse.data.results);
      } else {
        setPosts(prevPosts => [...prevPosts, ...postsResponse.data.results]); // اضافه کردن پست‌های جدید به انتهای لیست
      }

      // بررسی آیا صفحه بعدی وجود دارد
      setHasNextPage(postsResponse.data.next !== null);
      setPage(pageToFetch);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // دریافت داده اولیه
  useEffect(() => {
    fetchPosts();
  }, []);

  // تابع رفرش کردن صفحه
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(1, true); // بارگیری از ابتدا در صورت رفرش
  };

  const handlePostChange = (index) => {
    const updatedPlayingState = {};
    posts.forEach((_, i) => {
      updatedPlayingState[i] = false;
      if (videoRefs.current[i]) {
        videoRefs.current[i].pauseAsync();
      }
    });
    setIsPlaying({ ...updatedPlayingState, [index]: true });
    if (videoRefs.current[index]) {
      videoRefs.current[index].playAsync();
    }
  };

  const handleVideoPress = (index) => {
    setIsPlaying(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (isPlaying[index]) {
      videoRefs.current[index].pauseAsync();
    } else {
      videoRefs.current[index].playAsync();
    }
  };

  // پیجینیشن خودکار با اسکرول
  const loadMorePosts = () => {
    if (!loading && hasNextPage) {
      fetchPosts(page + 1); // درخواست صفحه بعدی
    }
  };


  const truncateText = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <View style={styles.profileStatus}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('OtherUserProfile', { username: item.username })}>
                <Image source={{ uri: `https://nexsocial.ir/${item.profile_image}` }} style={styles.profileImage} />
                <Text style={styles.username}>{truncateText(item.username || 'username', 12)}</Text>
              </TouchableOpacity>
              <QFollowButton userId={item.user_id} />

              <View style={{ left: 342, top: 8 }}>
                <Entypo name="dots-three-vertical" size={17} color="black" />
              </View>
            </View>
          </View>
          {item.file.endsWith('.mp4') ? (

            <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
              <Video
                ref={ref => videoRefs.current[index] = ref}
                source={{ uri: `https://nexsocial.ir/${item.file}` }}
                style={styles.video}
                resizeMode="cover"
                isLooping
                isMuted={!isPlaying[index]}
                useNativeControls={false}
                shouldPlay={isPlaying[index]}
                onEnd={() => setIsPlaying(prev => ({ ...prev, [index]: false }))}
                onFullscreenUpdate={({ fullscreenUpdate }) => {
                  if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
                    setIsPlaying(prev => ({ ...prev, [index]: false }));
                  }
                }}
              />
            </TouchableWithoutFeedback>
          ) : (
            <ZoomableImage style={styles.image} imageUri={`https://nexsocial.ir/${item.file}`} />
          )}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row' }}>
              <LikeButton postId={item.id} initialLiked={item.is_liked} />
              <Text style={{ top: 10, left: -10, fontWeight: '700', fontSize: 14 }}>{item.like_count}</Text>
            </View>
            <View>
              <CommentButton postId={item.id} />
            </View>
            <View style={{ left: 223 }}>
              <SaveButton postId={item.id} initialSaved={item.is_saved} />
            </View>
          </View>
          <View style={{ marginRight: 310, flexDirection: 'row' }}>
            <Text style={{ fontWeight: '500', fontSize: 14, marginTop: 5, zIndex: 1 }}>{truncateText(item?.username || 'username', 7)}</Text>
            <CaptionWithMore description={item.description} />
          </View>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      )}
      onMomentumScrollEnd={(event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.y / 420);
        handlePostChange(index);
      }}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEventThrottle={15}
      initialNumToRender={15}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};


const styles = StyleSheet.create({
  postContainer: {
    marginBottom: -5,
    padding: 10,
  },
  image: {
    width: '108%',
    height: 300,
    marginBottom: 5,
    marginLeft: -20,
  },
  likeButton: {
    padding: 10,
    right: 6
  },
  likeText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
  profileStatus: {
    marginTop: -10,
    flexDirection: 'row',
    marginRight: 350,
  },
  date: {
    fontSize: 12,
    color: '#3f3f3f',
  },
  header: {
    padding: 10,
    marginLeft: -12,
  },
  username: {
    fontSize: 13.7,
    fontWeight: '500',
    padding: 5,
    color: 'black',
    marginLeft: 35,
    position: 'absolute',
  },
  profileImage: {
    height: 33,
    width: 33,
    borderRadius: 100,
  },
  video: {
    width: '108%',
    height: 420,
    marginLeft: -20,
    backgroundColor: '#ffff',
  },

});

export default PostScreen;