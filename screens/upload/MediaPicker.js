import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const POST_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video',
  REELS: 'reels',
  STORY: 'story',
};

const POST_OPTIONS = {
  photo: { label: 'Photo', icon: 'image' },
  video: { label: 'Video', icon: 'video' },
  reels: { label: 'Reel', icon: 'movie-open' },
  story: { label: 'Story', icon: 'history' },
};

const AddPostScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [postType, setPostType] = useState(POST_TYPES.PHOTO);
  const navigation = useNavigation();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pickMedia = async (type) => {
    try {
      const options = {
        mediaTypes:
          type === POST_TYPES.PHOTO
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: type === POST_TYPES.REELS ? [9, 16] : [4, 3],
        quality: 1,
        videoMaxDuration: type === POST_TYPES.REELS ? 30 : 60,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        setUploading(true);
        scale.value = withSpring(1.1);

        setTimeout(() => {
          setSelectedMedia(result.assets[0]);
          setPostType(type);
          scale.value = withSpring(1);
          setUploading(false);
        }, 1000);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media.');
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (!selectedMedia) return;

    navigation.navigate('CaptionScreen', {
      media: selectedMedia,
      mediaType: selectedMedia.type === 'video' ? 'video' : 'photo',
      postType,
      showLikes: true,
      showComments: true,
      caption: '',
      location: '',
    });
  };

  if (uploading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!selectedMedia ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Share your story with the world 🌍</Text>
            <Text style={styles.bannerSubtitle}>Pick a photo, reel, or story and inspire others.</Text>
          </View>

          <Image
            source={require('../../assets/img/app/cnexi.png')}
            style={styles.placeholderImage}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {Object.entries(POST_OPTIONS).map(([type, { label, icon }]) => {
              const isSelected = postType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, isSelected && styles.activeButton]}
                  onPress={() => pickMedia(type)}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={28}
                    color={isSelected ? '#fff' : '#333'}
                  />
                  <Text style={[styles.typeLabel, isSelected && styles.activeLabel]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.ctaButton} onPress={() => pickMedia(postType)}>
            <Text style={styles.ctaText}>Start Creating</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMedia(null)}
            >
              <Text style={{ fontSize: 16 }}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.previewTitle}>
              {postType === POST_TYPES.REELS ? 'New Reel' : 'New Post'}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.mediaContainer, animatedStyle]}>
            {selectedMedia.type === 'video' ? (
              <Video
                source={{ uri: selectedMedia.uri }}
                style={styles.previewMedia}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />
            ) : (
              <Image
                source={{ uri: selectedMedia.uri }}
                style={styles.previewMedia}
                resizeMode="cover"
              />
            )}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 25,
    opacity: 0.75,
  },
  scrollContainer: {
    marginVertical: 10,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    elevation: 1,
  },
  activeButton: {
    backgroundColor: '#0095f6',
    elevation: 3,
  },
  typeLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#fff',
  },
  ctaButton: {
    marginTop: 20,
    backgroundColor: '#0095f6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 2,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
  previewContainer: { flex: 1 },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginTop: 40,
  },
  backButton: { padding: 5 },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  mediaContainer: {
    flex: 1,
    marginTop: 10,
  },
  previewMedia: {
    width: width,
    height: undefined,
    flex: 1,
    borderRadius: 10,
  },
});

export default AddPostScreen;
