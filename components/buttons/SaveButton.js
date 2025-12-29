import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import BookmarkIcon from '../../components/icons/BookmarkIcon';
import BookmarkIconSold from '../../components/icons/BookmarkIconSold';
import ipconfig from '../../config/ipconfig';

const SaveButton = ({ postId, initialSaved, onSaveError, iconSize = 19, iconColor = '#737373ff' }) => {
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSavedStatus = async () => {
      const storedStatus = await SecureStore.getItemAsync(`post_${postId}_saved`);
      if (storedStatus !== null) {
        setSaved(JSON.parse(storedStatus));
      }
    };
    loadSavedStatus();
  }, [postId]);

  const handleSave = useCallback(async () => {
    if (isLoading) return;
  
    setIsLoading(true);
    const token = await SecureStore.getItemAsync('token');
  
    if (!token) {
      onSaveError?.('Please login to your account');
      setIsLoading(false);
      return;
    }
  
    try {
      const url = `${ipconfig.BASE_URL}/post/${postId}/save/`;
  
      if (!saved) {
        await axios.post(
          url, 
          { post: postId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSaved(true);
  
        await axios.put(
          `${ipconfig.BASE_URL}/user/status/`,
          { postId, saved: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
          data: { post: postId },
        });
        setSaved(false);
  
        await axios.put(
          `${ipconfig.BASE_URL}/user/status/`,
          { postId, saved: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      onSaveError?.('An error occurred while saving/unsaving the post');
    } finally {
      setIsLoading(false);
    }
  }, [postId, saved, isLoading, onSaveError]);
  
  return (
    //     <TouchableOpacity 
    //   onPress={handleSave} 
    //   style={styles.button}
    //   disabled={isLoading}
    // >
    //   {saved ? (
    //     <BookmarkIconSold size={iconSize} color="#000000ff" />
    //   ) : (
    //     <BookmarkIcon size={iconSize} color={iconColor} />
    //   )}
    // </TouchableOpacity>
    <TouchableOpacity 
      onPress={handleSave} 
      style={styles.button}
      disabled={isLoading}
    >
      {saved ? (
       <BookmarkIconSold size={iconSize} color="#737373ff" />
     ) : (
       <BookmarkIcon size={iconSize} color="#737373ff" />
     )} 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  }
});

export default SaveButton;
