import { Video } from 'expo-av';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import CommentButton from '../components/buttons/CommentButton';
import CaptionWithMore from '../components/post/CaptionWithMore';
import QFollowButton from '../components/buttons/QFollowButton';
import LikeButton from '../components/buttons/LikeButton';
import ZoomableImage from '../components/post/ZoomableImage';
import SaveButton from '../components/buttons/SaveButton';
import * as SecureStore from 'expo-secure-store';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';


const PostDetail = ({ route }) => {
  const { post } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from SecureStore
        const token = await SecureStore.getItemAsync('token');
        console.log('Retrieved token:', token); // Log the retrieved token

        // Fetch posts
        const postsResponse = await axios.get('https://nexsocial.ir/post/');
        setPosts(postsResponse.data.results);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        videoRefs.current.forEach(video => {
          if (video) video.pauseAsync();
        });
      };
    }, [])
  );


  const truncateText = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const handlePostChange = (index) => {
    const updatedPlayingState = {};
    posts.forEach((_, i) => {
      updatedPlayingState[i] = false;
      if (videoRefs.current[i]) {
        videoRefs.current[i].pauseAsync();
      }
    });
    setIsPlaying(prev => ({ ...updatedPlayingState, [index]: true }));

    if (videoRefs.current[index]) {
      videoRefs.current[index].playAsync();
    }
  };

  const handleVideoPress = (index) => {
    setIsPlaying(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    if (isPlaying[index]) {
      videoRefs.current[index].pauseAsync();
    } else {
      videoRefs.current[index].playAsync();
    }
  };

  const handleProfilePress = (username) => {
    navigation.navigate('OtherUserProfile', { username });
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
              <QFollowButton />
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
              <Text style={{ top: 12, left: -10, fontWeight: '500' }}>{item.like_count}</Text>
            </View>
            <View>
              <CommentButton postId={item.id} />
              <Text style={{ left: 40, top: -36, fontWeight: '500' }}>{item.comment_count}</Text>
            </View>
            <View style={{ left: 223 }}>
              <SaveButton postId={item.id} initialSaved={item.is_saved} />
            </View>
          </View>
          <View style={{ marginRight: 310, flexDirection: 'row' }}>
            <Text style={{ fontWeight: '500', fontSize: 14, marginTop: 5, zIndex: 1 }}>{truncateText(profileData?.username || 'username', 7)}</Text>
            <CaptionWithMore description={item.description} />
          </View>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      )}
      onMomentumScrollEnd={(event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.y / 420);
        handlePostChange(index);
      }}
      scrollEventThrottle={15}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    marginTop: -10,
    left: 120
  },
  image: {
    width: '109%',
    height: 500,
  },
  caption: {
    padding: 10,
    fontSize: 14,
  },
  likeButton: {
    padding: 10,
  },
  likeText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
  profileStatus: {
    marginTop: 30,
    flexDirection: 'row',
    marginRight: 350,
  },
  date: {
    fontSize: 12,
  },
  postContainer: {
    overflow: 'hidden',
    shadowRadius: 4,
    width: '100%',
    marginTop: -28,
    left: 3,
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    padding: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    padding: 5,
    color: 'black',
    marginLeft: 35,
    position: 'absolute',
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 100,
  },
  video: {
    width: '108%',
    height: 350,
    marginLeft: -20,
    backgroundColor: 'gray'
  },
});

export default PostDetail;
