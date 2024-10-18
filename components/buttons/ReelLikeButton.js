import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Octicons from '@expo/vector-icons/Octicons';
import Lottie from 'lottie-react-native';
import heartAnimation from '../../assets/newlike.json'; 

const ReelLikeButton = ({ postId, initialLiked }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleLike = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      console.error('Token not found!');
      return;
    }

    setLoading(true);
    setShowAnimation(true); 

    try {
      if (!liked) {
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
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowAnimation(false);
      }, 1400); 
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {showAnimation && (
        <Lottie 
          source={heartAnimation} 
          autoPlay 
          loop={false} 
          style={{ position: 'absolute', zIndex: 1, width: 200, height: 200, left: -185, top: -100 }} 
        />
      )}
      <TouchableOpacity onPress={handleLike}>
        <Octicons
          name={liked ? 'heart-fill' : 'heart'}
          size={28}
          color={liked ? 'red' : 'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReelLikeButton;
