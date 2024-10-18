import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Octicons from '@expo/vector-icons/Octicons';

const LikeButton = ({ postId, initialLiked }) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      console.error('Token not found!');
      return;
    }

    try {
      if (!liked) {
        // Like the post
        await axios.post(
          'https://nexsocial.ir/post/like/',
          { post: postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLiked(true);
      } else {
        // Unlike the post
        await axios.delete('https://nexsocial.ir/post/like/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            post: postId,
          },
        });
        setLiked(false);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLike} style={{ top: -3, padding: 12, left: -8 }}>
        <Octicons name={liked ? 'heart-fill' : 'heart'} size={25} color={liked ? 'red' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default LikeButton;
