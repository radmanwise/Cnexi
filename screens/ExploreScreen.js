import React, { useState, useRef, useEffect } from 'react';
import { Video } from 'expo-av';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import ExploreTopMenu from '../navigationbar/ExploreTopMenu';
import CaptionWithMoreExplore from '../components/post/CaptionWithMoreExplore';
import ReelSaveButton from '../components/buttons/ReelSaveButton';
import QFollowButton from '../components/buttons/QFollowButton';
import ReelCommentButton from '../components/buttons/ReelCommentButton';
import ReelLikeButton from '../components/buttons/ReelLikeButton';
import ReelShareButton from '../components/buttons/ReelShareButton';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from 'expo-navigation-bar';


const ExploreScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      NavigationBar.setBackgroundColorAsync('black');
      StatusBar.setBarStyle('light-content'); // Set status bar style to light
      StatusBar.setBackgroundColor('black'); // Set status bar background color to black

      return () => {
        NavigationBar.setBackgroundColorAsync('white');
        StatusBar.setBarStyle('dark-content'); // Reset status bar style to dark
        StatusBar.setBackgroundColor('white'); // Reset status bar background color to white
        videoRefs.current.forEach(video => {
          if (video) video.pauseAsync();
        });
      };
    }, [])
  );

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://nexsocial.ir/post/reel/');
        const data = await response.json();
        setVideos(data.results);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);



  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }



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



  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
        <Video
          ref={ref => videoRefs.current[index] = ref}
          source={{ uri: `https://nexsocial.ir${item.file}` }}
          rate={1.0}
          volume={1.0}
          isMuted={!isPlaying[index]}
          resizeMode="cover"
          isLooping
          shouldPlay={isPlaying[index]}
          style={styles.video}
          onEnd={() => setIsPlaying(prev => ({ ...prev, [index]: false }))}
        />
      </TouchableWithoutFeedback>
      <ExploreTopMenu />

      <View style={styles.overlay}>
        <Icon
          name={isPlaying[index] ? 'stop-circle' : 'play-circle'}
          size={30}
          color="white"
          onPress={() => handleVideoPress(index)}
          style={styles.stopIcon}
        />
        <Text style={styles.usernameProfile}>@{item.username}</Text>
        <View style={{ position: 'absolute', left: -130, top: 54 }}>
          <QFollowButton userId={item.user_id} />
        </View>
        <Image source={{ uri: `https://nexsocial.ir/${item.profile_image}` }} style={styles.profileImage} />
        <CaptionWithMoreExplore description={item.description} />
        <View style={{ left: 333, position: 'absolute', top: -180, padding: 5, borderRadius: 13, opacity: 0.9 }}>
          <View style={{ left: 0, opacity: 5, gap: 45, justifyContent: 'center', alignItems: 'center' }}>
            <ReelLikeButton postId={item.id} initialLiked={item.is_liked} />
            <Text style={{ textAlign: 'center', color: 'white', margin: -37, fontWeight: '500' }}>{item.like_count}</Text>
            <ReelCommentButton postId={item.id} />
            <Text style={{ textAlign: 'center', color: 'white', margin: -37, fontWeight: '500' }}>{item.comment_count}</Text>
            <ReelSaveButton postId={item.id} initialSaved={item.is_saved} />
            <Text style={{ textAlign: 'center', color: 'white', margin: -37, fontWeight: '500' }}>{item.save_count}</Text>
            <ReelShareButton />
          </View >
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        snapToAlignment="start"
        snapToInterval={Dimensions.get('window').height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.y / Dimensions.get('window').height);
          handleVideoPress(index); // Play the video when the user scrolls to it
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',  // پس‌زمینه مشکی
  },
  videoContainer: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10
  },
  video: {
    width: '100%',
    height: 800,
    top: 80
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    left: -5,
  },
  usernameProfile: {
    color: 'white',
    left: 38,
    fontSize: 15,
    bottom: -30,
    fontWeight: '500'
  },
  stopIcon: {
    left: -5
  }
});

export default ExploreScreen;
