import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function CaptionScreen({ route, navigation }) {
  const { image, video } = route.params;
  const [caption, setCaption] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showCommentsLikes, setShowCommentsLikes] = useState(true); // Assume default for showing likes/comments

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append('file', {
          uri: image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      } else if (video) {
        formData.append('file', {
          uri: video,
          name: 'video.mp4',
          type: 'video/mp4',
        });
      }

      formData.append('description', caption);
      formData.append('isPrivate', isPrivate);
      formData.append('showCommentsLikes', showCommentsLikes);

      const response = await axios.post(
        'https://nexsocial.ir/post/upload/', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Post uploaded successfully!');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error uploading post: ' + response.data.message);
      }
    } catch (error) {
      Alert.alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
      {video && <Video source={{ uri: video }} style={{ width: 300, height: 300 }} />}
      
      <TextInput
        placeholder="Add a caption..."
        value={caption}
        onChangeText={setCaption}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, width: '80%' }}
      />
      
      <TouchableOpacity onPress={uploadPost} style={styles.uploadPostButton}>
        <Text style={{ color: 'white' }}>Upload Post</Text>
      </TouchableOpacity>
    </View>
  );
}
