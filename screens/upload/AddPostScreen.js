import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Title, Subtitle } from '../../components/ui/Typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const SPACING = 20;
const ITEM_SPACING = (width - CARD_WIDTH) / 2;

const POST_TYPES = [
  { key: 'photo', label: 'Photo', mediaType: ImagePicker.MediaTypeOptions.Images },
  { key: 'video', label: 'Video', mediaType: ImagePicker.MediaTypeOptions.Videos },
  { key: 'reels', label: 'Reels', mediaType: ImagePicker.MediaTypeOptions.Videos },
  { key: 'story', label: 'Story', mediaType: ImagePicker.MediaTypeOptions.Images },
];

export default function AddPostScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickMedia = async (type) => {
    try {
      const typeObj = POST_TYPES.find(t => t.key === type);
      if (!typeObj) return;

      const options = {
        mediaTypes: typeObj.mediaType,
        allowsEditing: true,
        aspect: type === 'reels' ? [9, 16] : [4, 3],
        quality: 1,
        videoMaxDuration: type === 'reels' ? 30 : 60,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        setUploading(true);
        setSelectedMedia(result.assets[0]);
        setSelectedType(type);
        setUploading(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick media');
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  if (selectedMedia) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={() => setSelectedMedia(null)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>{selectedType === 'reels' ? 'New Reel' : 'New Post'}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CaptionScreen', {
                media: selectedMedia,
                mediaType: selectedMedia.type === 'video' ? 'video' : 'photo',
                postType: selectedType,
              });
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

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
      </SafeAreaView>
    );
  }

  // صفحه انتخاب نوع پست
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
            <Animated.View
              style={{
                width: CARD_WIDTH,
                marginRight: SPACING,
                transform: [{ scale }],
                opacity,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => pickMedia(item.key)}
              >
                <ImageBackground
                  source={require('../../assets/img/static/ImageCover.webp')}
                  style={styles.card}
                  imageStyle={{ borderRadius: 24 }}
                >
                  <View style={styles.cardOverlay}>
                    <Title style={styles.cardLabel}>{item.label}</Title>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 30, color: '#008CFF', marginLeft: 20, marginBottom: 6, width: '100%' },
  subtitle: { fontSize: 14, color: '#444', marginLeft: 20, marginBottom: 26 },
  card: {
    height: 500,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 22,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#000' },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 40,
  },
  previewTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  nextButtonText: { color: '#0095f6', fontWeight: '600' },
  previewMedia: { width, height: '80%', borderRadius: 10, alignSelf: 'center' },
});
