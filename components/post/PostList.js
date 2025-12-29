import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import ipconfig from '../../config/ipconfig';
import ReelIcon from '../../components/icons/reelIcon';
import ImageIcon from '../../components/icons/ImageIcon';
import ImageOffIcon from '../../components/icons/ImageOffIcon';
import FastImage from 'expo-fast-image';
import { Title, Subtitle, Body } from '../../components/ui/Typography';
import MusicIcon from '../../components/icons/MusicIcon';
import { FlashList } from '@shopify/flash-list';
import PostScreen from '../post/PostScreen'

const screenWidth = Dimensions.get('window').width;

const Post = React.memo(({ post }) => {
  return (
    <View style={styles.postContainer}>
      <PostScreen post={post} />
    </View>
  );
}, (prev, next) => prev.post.id === next.post.id);

const PostList = ({ posts, fetchPosts }) => {
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const routes = [
    { key: 'all', title: 'Posts' },
    { key: 'reels', title: 'Reels' },
    { key: 'music', title: 'Music' },
  ];

  const validPosts = useMemo(() => posts?.filter(p => p.id) || [], [posts]);

  const filterPosts = useCallback(
    (type) => {
      return validPosts.filter(post => {
        const uri = post.files?.[0] || '';
        if (type === 'reels') return uri.endsWith('.mp4');
        if (type === 'music') return uri.endsWith('.mp3');
        return true;
      });
    },
    [validPosts]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => {
        const focused = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => setIndex(i)}
            activeOpacity={0.8}
          >
            <Title style={[styles.tabText, focused && styles.tabTextFocused]}>
              {route.title}
            </Title>
            {focused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const filteredPosts = filterPosts(routes[index].key);

  return (
    <View style={{ flex: 1 }}>
      {renderTabBar()}
      <FlashList
        data={filteredPosts}
        keyExtractor={item => `post-${item.id}`}
        renderItem={({ item }) => <Post post={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ImageOffIcon size={40} color="#424242" />
            <Title style={styles.emptyTitle}>No Posts Yet</Title>
            <Subtitle style={styles.emptySubTitle}>
              Start the conversation by sharing your first post!
            </Subtitle>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    top: -130,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e1e1',
  },
  tabItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    height: 3.5,
    backgroundColor: '#000000',
    borderRadius: 100,
    width: 80,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#020130',
  },
  tabTextFocused: {
    color: '#000000',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  emptySubTitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
    width: '80%',
  },
});

export default PostList;