import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Caption from './Caption';
import SidebarIcons from './SidebarIcons';
import FollowButton from '../buttons/FollowButton';
import { Subtitle } from '../ui/Typography';
import styles from '../../theme/reels/styles';

const VideoItem = ({
  item,
  index,
  currentPlayingIndex,
  videoRefs,
  handleVideoPress,
  likes,
  onLike,
  showPlayIcon,
  playIconAnim,
  showDoubleTapHeart,
  heartAnim,
  navigation,
  scrollToIndex,
}) => {
  const [progress, setProgress] = useState(0);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (status.isLoaded && status.isPlaying) {
      const ratio = status.positionMillis / status.durationMillis;
      setProgress(ratio);
    }

    if (status.didJustFinish) {
      const nextIndex = index + 1;
      if (videoRefs.current[nextIndex]) {
        scrollToIndex(nextIndex);
      }
    }
  }, [index, videoRefs, scrollToIndex]);


  useEffect(() => {
    const video = videoRefs.current[index];
    if (video) {
      video.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    return () => {
      if (video) {
        video.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [currentPlayingIndex]);

  return (
    <View style={styles.videoContainer}>
      <TouchableWithoutFeedback onPress={() => handleVideoPress(index)}>
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
          />


          <View style={localStyles.progressBarContainer}>
            <Animated.View style={[localStyles.progressBar, { width: `${progress * 100}%` }]} />
          </View>

          {showPlayIcon && (
            <Animated.View style={[styles.playIconContainer, {
              transform: [{ scale: playIconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
              opacity: playIconAnim
            }]}>
              <FontAwesome5 name={currentPlayingIndex === index ? "" : "play"} size={50} color="rgba(227, 227, 227, 0.85)" />
            </Animated.View>
          )}

          {showDoubleTapHeart && (
            <Animated.View style={[styles.heartContainer, {
              transform: [{ scale: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.5] }) }],
              opacity: heartAnim
            }]}>
              <Ionicons name="heart" size={100} color="red" />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <SidebarIcons item={item} likes={likes} onLike={onLike} />

      <View style={styles.overlay}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity
            style={styles.userRowTouchable}
            onPress={() => navigation.navigate('OtherUserProfile', { slug: item.username })}
          >
            <Image
              source={{ uri: item.profile_image }}
              style={styles.profileImage}
              defaultSource={require('../../assets/img/static/user.jpg')}
            />
            <View style={styles.usernameFollowRow}>
              <Subtitle style={styles.username}>{item.username}</Subtitle>
              {item && (
                <FollowButton
                  userId={item.user}
                  initialIsFollowing={!!item.is_following}
                  buttonStyle={{ marginLeft: 0 }}
                  textStyle={{ fontSize: 12 }}
                  borderColor="#ffffffff"
                  followColor="null"
                  unfollowTextColor="#fcfcfcff"
                  followTextColor="#fcfcfcff"
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
  );
};

const localStyles = StyleSheet.create({
  progressBarContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#008CFF',
  },
});

export default React.memo(VideoItem);
