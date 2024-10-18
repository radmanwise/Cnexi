import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Octicons from '@expo/vector-icons/Octicons';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


const SaveButton = ({ postId, initialSaved }) => {
  const [saved, setSaved] = useState(initialSaved);

  const handleSave = async () => {
    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      console.error('Token not found!');
      return;
    }

    try {
      if (!saved) {
        // Like the post
        await axios.post(
          'https://nexsocial.ir/post/save/',
          { post: postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSaved(true);
      } else {
        // Unlike the post
        await axios.delete('https://nexsocial.ir/post/save/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            post: postId,
          },
        });
        setSaved(false);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSave} style={{top: -3, padding: 12, left: 10}}>
      <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={30} color={saved ? 'black' : 'black'} />
    </TouchableOpacity>
  );
};

export default SaveButton;
