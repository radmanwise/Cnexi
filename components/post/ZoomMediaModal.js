import React, { useEffect, useRef, useState } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'expo-fast-image';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as NavigationBar from 'expo-navigation-bar';
import {
  Modal,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedGestureHandler,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
};

const ZoomMediaModal = ({ visible, onClose, media }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const closeWithAnimation = () => {
    isAnimating.value = true;
    opacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
    scale.value = withTiming(0.8, { duration: 250, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onClose)();
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 0;
      isAnimating.value = false;
    });
  };

  useEffect(() => {
    if (visible) {
      isAnimating.value = true;
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
      scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }, () => {
        isAnimating.value = false;
      });
    } else {
      closeWithAnimation();
    }
  }, [visible]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);
  const panGesture = useAnimatedGestureHandler({
    onStart: () => { isAnimating.value = true; },
    onActive: (event) => {
      translateY.value = event.translationY;
      scale.value = interpolate(Math.abs(event.translationY), [0, SCREEN_HEIGHT / 2], [1, 0.7], Extrapolate.CLAMP);
      opacity.value = interpolate(Math.abs(event.translationY), [0, SCREEN_HEIGHT / 2], [1, 0.3], Extrapolate.CLAMP);
    },
    onEnd: (event) => {
      if (Math.abs(event.translationY) > 150) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200, easing: Easing.out(Easing.cubic) });
        scale.value = withTiming(0.7, { duration: 200, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) }, () => {
          runOnJS(onClose)();
          translateY.value = 0;
          scale.value = 1;
          opacity.value = 0;
          isAnimating.value = false;
        });
      } else {
        translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
        scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }, () => {
          isAnimating.value = false;
        });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const onPlaybackStatusUpdate = (status) => {
    if (!isSeeking && status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const onSeekStart = () => {
    setIsSeeking(true);
  };

  const onSeekChange = (value) => {
    setPosition(value);
  };

  const onSeekComplete = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
    }
    setPosition(value);
    setIsSeeking(false);
  };

  if (!media) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
        translucent={false}
      />
      <View style={styles.modalBackground}>
        <PanGestureHandler onGestureEvent={panGesture} enabled={!isAnimating.value}>
          <Animated.View style={[styles.mediaContainer, animatedStyle]}>
            {media.type === 'video' ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: media.uri }}
                  style={styles.media}
                  resizeMode="contain"
                  shouldPlay={isPlaying}
                  isLooping
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                  useNativeControls={false} 
                />
                <View style={styles.controlsRow}>
                  <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>

                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    minimumTrackTintColor="#ffffffff" 
                    maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                    thumbTintColor="#ffffffff"
                    onSlidingStart={onSeekStart}
                    onValueChange={onSeekChange}
                    onSlidingComplete={onSeekComplete}
                    trackStyle={{ height: 10 }}
                  />

                  <Text style={styles.timeText}>
                    {formatTime(position)} / {formatTime(duration)}
                  </Text>
                </View>

              </>
            ) : (
              <FastImage
                source={{ uri: media.uri }}
                style={styles.media}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (!isAnimating.value) {
                  closeWithAnimation();
                }
              }}
            >
              <Ionicons name="close-circle" size={36} color="gray" />
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#00000080',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 12,
    paddingVertical: 6,
    position: 'absolute',
    bottom: 40,
    left: '2.5%',
  },
  playPauseBtn: {
    marginRight: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    width: 70,
    textAlign: 'right',
    fontWeight: '600',
  },
  thumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  timeText: {
    color: '#ffffffff',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Helvetica',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ZoomMediaModal;
