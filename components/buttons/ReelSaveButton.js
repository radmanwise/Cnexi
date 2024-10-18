import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import Lottie from 'lottie-react-native'; // Import Lottie

const ReelSaveButton = ({ postId, initialSaved }) => {
  const [saved, setSaved] = useState(initialSaved);
  const [showAnimation, setShowAnimation] = useState(false); // State to control animation visibility
  const [animationSource, setAnimationSource] = useState(null); // State to control which animation to show

  const handleSave = async () => {
    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      console.error('Token not found!');
      return;
    }

    try {
      // Determine which animation to show
      if (!saved) {
        // Save the post
        setAnimationSource(require('../../assets/save.json')); // Animation for saving
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
        // Remove the saved post
        setAnimationSource(require('../../assets/unsave.json')); // Animation for unsaving
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
      
      // Show animation
      setShowAnimation(true);
      
    } catch (error) {
      console.error('Error saving/removing post:', error);
    } finally {
      // Start the timer to hide the animation after 1 second
      setTimeout(() => {
        setShowAnimation(false);
      }, 1000); 
    }
  };

  return (
    <TouchableOpacity onPress={handleSave}>
      <View style={{ position: 'relative' }}>
        <MaterialIcons 
          name={saved ? 'bookmark' : 'bookmark-border'} 
          size={33} 
          color={saved ? 'orange' : 'white'} 
        />
        {showAnimation && animationSource && (
          <Lottie
            source={animationSource} // Use the selected animation source
            autoPlay
            loop={false}
            style={{ position: 'absolute', top: -400, left: -280, width: 300, height: 200 }} // Positioning Lottie
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ReelSaveButton;
