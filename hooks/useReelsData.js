import { useState, useEffect, useCallback, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import ipconfig from '../config/ipconfig';

export function useReelsData() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [isFollowing, setIsFollowing] = useState({});
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const initializeStates = useCallback((videos) => {
    const initialLikes = {};
    const initialFollowing = {};
    videos.forEach(video => {
      initialLikes[video.id] = video.likes || 0;
      initialFollowing[video.id] = false;
    });
    setLikes(initialLikes);
    setIsFollowing(initialFollowing);
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch(`${ipconfig.BASE_URL}/post/reels/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setVideos(data.results);
      initializeStates(data.results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initializeStates]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    likes,
    setLikes,
    isFollowing,
    setIsFollowing,
    error,
    refreshing,
    onRefresh,
  };
}
