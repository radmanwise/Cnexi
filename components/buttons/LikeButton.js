import React, { useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LikeIcon from '../../components/icons/LikeIcon';
import LikeSolidIcon from '../../components/icons/LikeSolidIcon';
import ipconfig from '../../config/ipconfig';

const LikeButton = ({ postId, initialLiked, onLikeError, iconColor = "#000", iconSize = 27 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      onLikeError?.('Please login to your account');
      setIsLoading(false);
      return;
    }

    try {
      const url = `${ipconfig.BASE_URL}/post/${postId}/like/`;

      if (!liked) {
        await axios.post(
          url, 
          { post: postId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLiked(true);
      } else {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
          data: { post: postId },
        });
        setLiked(false);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      onLikeError?.('An error occurred while liking/unliking the post');
    } finally {
      setIsLoading(false);
    }
  }, [postId, liked, isLoading, onLikeError]);

  return (
    <TouchableOpacity 
      onPress={handleLike} 
      style={styles.button}
      disabled={isLoading}
    >
      {liked ? (
        <LikeSolidIcon size={iconSize} color="#ff0000ff" />
      ) : (
        <LikeIcon size={iconSize} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
  }
});

export default LikeButton;
