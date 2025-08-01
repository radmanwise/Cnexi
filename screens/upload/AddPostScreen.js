import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Title, Subtitle } from '../../components/ui/Typography';
import PostTypeCard from './PostTypeCard';
import MediaPreview from './MediaPreview';
import LoadingScreen from './LoadingScreen';

function MediaSourceSelector({ onSelect }) {
  return (
    <View style={styles.sourceSelectorContainer}>
      <TouchableOpacity
        style={[styles.sourceButton, styles.galleryButton]}
        onPress={() => onSelect('gallery')}
        activeOpacity={0.8}
      >
        <Title style={styles.sourceButtonText}>Choose from Gallery</Title>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sourceButton, styles.cameraButton]}
        onPress={() => onSelect('camera')}
        activeOpacity={0.8}
      >
        <Title style={styles.sourceButtonText}>Take a Photo/Video</Title>
      </TouchableOpacity>
    </View>

  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const SPACING = 20;
const ITEM_SPACING = (width - CARD_WIDTH) / 2;

const POST_TYPES = [
  {
    key: 'photo',
    label: 'Photo',
    mediaType: ImagePicker.MediaTypeOptions.Images,
    image: require('../../assets/img/static/ImageCover.webp'),
    icon: 'image-outline',
  },
  {
    key: 'reels',
    label: 'Reels',
    mediaType: ImagePicker.MediaTypeOptions.Videos,
    image: require('../../assets/img/static/ImageCover.webp'),
    icon: 'film-outline',
  },
  {
    key: 'story',
    label: 'Story',
    mediaType: ImagePicker.MediaTypeOptions.Images,
    image: require('../../assets/img/static/ImageCoverStory.jpeg'),
    icon: 'time-outline',
    disabled: true,
  },
];

import { TouchableOpacity } from 'react-native';

export default function AddPostScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [waitingForSource, setWaitingForSource] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to take photos or videos');
      return false;
    }
    return true;
  };

  const pickMedia = async (type, fromCamera = false) => {
    try {
      const typeObj = POST_TYPES.find(t => t.key === type);
      if (!typeObj) return;

      const options = {
        mediaTypes: typeObj.mediaType,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: type === 'reels' ? 30 : 60,
      };


      let result;
      if (fromCamera) {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled) {
        setUploading(true);
        setSelectedMedia(result.assets[0]);
        setSelectedType(type);
        setUploading(false);
        setWaitingForSource(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick media');
      setUploading(false);
      setWaitingForSource(false);
    }
  };

  const onSelectPostType = (type) => {
    setSelectedType(type);
    setWaitingForSource(true);
  };

  const onSelectSource = (source) => {
    if (!selectedType) return;

    if (source === 'camera') {
      pickMedia(selectedType, true);
    } else {
      pickMedia(selectedType, false);
    }
  };

  if (uploading) return <LoadingScreen />;

  if (selectedMedia) {
    return (
      <MediaPreview
        media={selectedMedia}
        onBack={() => setSelectedMedia(null)}
        onNext={() =>
          navigation.navigate('CaptionScreen', {
            media: selectedMedia,
            mediaType: selectedMedia.type === 'video' ? 'video' : 'photo',
            postType: selectedType,
          })
        }
      />
    );
  }

  if (waitingForSource) {
    return <MediaSourceSelector onSelect={onSelectSource} />;
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create Something Awesome</Title>
      <Subtitle style={styles.subtitle}>Choose a post type to begin</Subtitle>

      <Animated.FlatList
        data={POST_TYPES}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          return (
            <PostTypeCard
              item={item}
              onPress={onSelectPostType}
              scale={scale}
              opacity={opacity}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  title: { fontSize: 30, color: '#008CFF', marginLeft: 20, marginBottom: 15, width: '100%' },
  subtitle: { fontSize: 14, color: '#444', marginLeft: 20, marginBottom: 26 },

  sourceSelectorContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
  },
  sourceButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  galleryButton: {
    backgroundColor: '#7d7d7dff',
    height: 20,
  },
  cameraButton: {
    backgroundColor: '#7d7d7dff',
    height: 20,
  },
  sourceButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
