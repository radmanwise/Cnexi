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
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingMore = useRef(false);

  const initializeStates = useCallback((newVideos) => {
    const newLikes = {};
    const newFollowing = {};
    newVideos.forEach(video => {
      newLikes[video.id] = video.likes || 0;
      newFollowing[video.id] = false;
    });
    setLikes(prev => ({ ...prev, ...newLikes }));
    setIsFollowing(prev => ({ ...prev, ...newFollowing }));
  }, []);

  const fetchVideos = useCallback(async (url = `${ipconfig.BASE_URL}/post/reels/`, isPagination = false) => {
    if (isPagination && isFetchingMore.current) return;

    if (isPagination) {
      isFetchingMore.current = true;
    } else {
      setLoading(true);
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      setVideos(prev => isPagination ? [...prev, ...data.results] : data.results);
      initializeStates(data.results);

      setNextPageUrl(data.next);
      setHasMore(!!data.next);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingMore.current = false;
    }
  }, [initializeStates]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos();
  }, [fetchVideos]);

  const fetchMore = useCallback(() => {
    if (hasMore && nextPageUrl) {
      fetchVideos(nextPageUrl, true);
    }
  }, [hasMore, nextPageUrl, fetchVideos]);

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
    fetchMore, 
    hasMore,
  };
}
