import React, { useState, useFocusEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
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

const { width } = Dimensions.get('window');

const POST_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video',
  REELS: 'reels',
  STORY: 'story'
};

const AddPostScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [postType, setPostType] = useState(POST_TYPES.PHOTO);
  const [caption] = useState('');
  const [showLikes] = useState(true);
  const [showComments] = useState(true);
  const [location] = useState('');
  const navigation = useNavigation();
  const [aspectRatio, setAspectRatio] = useState('4:3');
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const pickMedia = async (type) => {
    try {
      let options = {
        mediaTypes: type === POST_TYPES.PHOTO
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
      Alert.alert("error", "error");
      setUploading(false);
    }
  };

  const renderPostTypeSelector = () => (
    <View style={styles.postTypeWrapper}>
      <Text style={styles.sectionTitle}>Choose Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.postTypeContainer}
      >
        {Object.values(POST_TYPES).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, postType === type && styles.selectedType]}
            onPress={() => pickMedia(type)}
          >
            <MaterialIcons
              name={type === POST_TYPES.PHOTO ? "photo-library" : "video-library"}
              size={20}
              color="#000"
            />
            <Text style={styles.typeText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );


  const renderEditOptions = () => {
    if (selectedMedia?.type === 'video') {
      return (
        <View style={styles.editOptionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="crop" size={24} color="#000" />
              <Text style={styles.editOptionText}>Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <Feather name="scissors" size={24} color="#000" />
              <Text style={styles.editOptionText}>Trim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialIcons name="filter" size={24} color="#000" />
              <Text style={styles.editOptionText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <FontAwesome name="music" size={24} color="#000" />
              <Text style={styles.editOptionText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="adjust" size={24} color="#000" />
              <Text style={styles.editOptionText}>Adjust</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="text" size={24} color="#000" />
              <Text style={styles.editOptionText}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="sticker-emoji" size={24} color="#000" />
              <Text style={styles.editOptionText}>Stickers</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.advancedOptions}>
            <TouchableOpacity
              style={styles.advancedOption}
              onPress={() => setAspectRatio(aspectRatio === '4:3' ? '1:1' : '4:3')}
            >
              <MaterialCommunityIcons
                name="aspect-ratio"
                size={20}
                color="#fff"
              />
              <Text style={styles.advancedOptionText}>{aspectRatio}</Text>
            </TouchableOpacity>

            {selectedMedia?.type === 'video' && (
              <TouchableOpacity style={styles.advancedOption}>
                <MaterialCommunityIcons
                  name="video-stabilization"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.advancedOptionText}>Stabilize</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.advancedOption}>
              <MaterialCommunityIcons
                name="image-filter-vintage"
                size={20}
                color="#fff"
              />
              <Text style={styles.advancedOptionText}>Effects</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Photo editing options
      return (
        <View style={styles.editOptionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="crop" size={24} color="#000" />
              <Text style={styles.editOptionText}>Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialIcons name="filter" size={24} color="#000" />
              <Text style={styles.editOptionText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="adjust" size={24} color="#000" />
              <Text style={styles.editOptionText}>Adjust</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="blur" size={24} color="#000" />
              <Text style={styles.editOptionText}>Blur</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="text" size={24} color="#000" />
              <Text style={styles.editOptionText}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editOption}>
              <MaterialCommunityIcons name="draw" size={24} color="#000" />
              <Text style={styles.editOptionText}>Draw</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.advancedOptions}>
            <TouchableOpacity style={styles.advancedOption}>
              <MaterialCommunityIcons name="tune" size={20} color="#000" />
              <Text style={styles.advancedOptionText}>Fine Tune</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.advancedOption}>
              <MaterialCommunityIcons name="palette" size={20} color="#000" />
              <Text style={styles.advancedOptionText}>Toning</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.advancedOption}>
              <MaterialCommunityIcons name="image-filter-hdr" size={20} color="#000" />
              <Text style={styles.advancedOptionText}>HDR</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const handleNext = () => {
    if (selectedMedia) {
      navigation.navigate("CaptionScreen", {
        media: selectedMedia,
        mediaType: selectedMedia.type === 'video' ? 'video' : 'photo',
        postType,
        showLikes,
        showComments,
        caption,
        location
      });
    }
  };
  
  if (uploading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../assets/icons/loading.json")}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!selectedMedia ? (
        <View style={styles.pickerContainer}>
          {renderPostTypeSelector()}
          <Animated.View style={[styles.uploadSection, animatedStyle]}>
            <LottieView
              source={require("../assets/icons/upload.json")}
              autoPlay
              loop
              style={styles.uploadAnimation}
            />
            <Text style={styles.uploadText}>Tap to upload media</Text>
            <Text style={styles.uploadSubText}>Share photos and videos</Text>
          </Animated.View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMedia(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>
              {postType === POST_TYPES.REELS ? 'New Reel' : 'New Post'}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.mediaContainer, animatedStyle]}>
            {selectedMedia.type === "video" ? (
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

          {renderEditOptions()}

        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  postTypeWrapper: {
    marginTop: 50,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  postTypeContainer: {
    flexDirection: 'row',
    maxHeight: 45,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
  },
  selectedType: {
    backgroundColor: '#0095f6',
  },
  typeText: {
    color: '#000',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginTop: 20,
    padding: 20,
  },
  uploadAnimation: {
    width: 120,
    height: 120,
  },
  uploadText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  uploadSubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    color: '#000',
    fontSize: 16,
    marginTop: 20,
  },
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginTop: 40,
  },
  backButton: {
    padding: 5,
  },
  previewTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
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
    flex: 1,
    width: width,
    height: undefined,
    borderRadius: 10,
  },
  previewOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  editOptionsContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
  },
  editOption: {
    alignItems: 'center',
    marginHorizontal: 15,
    opacity: 0.9,
  },
  editOptionText: {
    color: '#000',
    fontSize: 12,
    marginTop: 5,
  },
  advancedOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  advancedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  advancedOptionText: {
    color: '#000',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default AddPostScreen;