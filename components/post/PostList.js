import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import ipconfig from '../../config/ipconfig';
import { Ionicons } from '@expo/vector-icons';
import ReelIcon from '../../components/icons/reelIcon';
import ImageIcon from '../../components/icons/ImageIcon';
import ImageOffIcon from '../../components/icons/ImageOffIcon';
import FastImage from 'expo-fast-image';
import { Title, Subtitle } from '../../components/ui/Typography';
import AllIcon from '../../components/icons/AllIcon';
import MusicIcon from '../../components/icons/MusicIcon';
import ReelsIcon from '../../components/icons/ReelsIcon';

const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / 3;

const FileTypeIcon = {
  video: <ReelIcon size={20} color="white" />,
  music: <Ionicons name="musical-notes" size={20} color="white" />,
  image: <ImageIcon size={26} color="white" />,
};


const Post = React.memo(({ post }) => {
  const navigation = useNavigation();
  const fileUri = `${ipconfig.BASE_URL}${post.files[0]}`;
  const fileType = fileUri.endsWith('.mp4')
    ? 'video'
    : fileUri.endsWith('.mp3')
      ? 'music'
      : 'image';

  return (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() =>
        navigation.navigate('PostDetailScreen', {
          postId: post.id,
          postTitle: post.title,
          postContent: post.content,
          files: post.files,
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.mediaContainer}>
        {fileType === 'video' ? (
          <Video
            source={{ uri: fileUri }}
            style={styles.video}
            resizeMode="cover"
            isLooping
            useNativeControls={false}
            shouldPlay={false}
            isMuted
          />
        ) : (
          <FastImage
            source={{ uri: fileUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.postType}>{FileTypeIcon[fileType]}</View>
      </View>
    </TouchableOpacity>
  );
});

const PostList = ({ posts, fetchPosts }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Posts', icon: <AllIcon size={25} color="gray" /> },
    { key: 'reels', title: 'Reels', icon: <ReelsIcon size={25} color="gray" /> },
    { key: 'music', title: 'Music', icon: <MusicIcon size={25} color="gray" /> },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const postsPerPage = 12;

  const validPosts = useMemo(() => posts?.filter(p => p.id) || [], [posts]);

  const filterPosts = useCallback(
    (type) => {
      if (type === 'all') return validPosts;
      return validPosts.filter(post => post.files?.[0]?.endsWith('.mp4'));
    },
    [validPosts]
  );

  const handleLoadMore = useCallback(
    (filteredPosts) => {
      if (loadingMore) return;
      if (filteredPosts.length > page * postsPerPage) {
        setLoadingMore(true);
        setPage(p => p + 1);
        setLoadingMore(false);
      }
    },
    [loadingMore, page]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setPage(1);
    setRefreshing(false);
  }, [fetchPosts]);

  const renderPosts = useCallback(
    (filteredPosts) => (
      <FlatList
        data={filteredPosts.slice(0, page * postsPerPage)}
        keyExtractor={item => `post-${item.id}`}
        numColumns={3}
        renderItem={({ item }) => <Post post={item} />}
        columnWrapperStyle={styles.columnWrapper}
        initialNumToRender={9}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        onEndReached={() => handleLoadMore(filteredPosts)}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.IconContent}>
              <ImageOffIcon size={40} color="#424242ff" />
            </View>
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySubTitle}>
              Start the conversation by sharing your first post!
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          loadingMore && <ActivityIndicator size="small" color="#008CFF" />
        }
        showsVerticalScrollIndicator={false}
      />
    ),
    [page, refreshing, loadingMore, onRefresh, handleLoadMore]
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => {
        const focused = index === i;
        const icon = React.cloneElement(route.icon, {
          color: focused ? '#282829ff' : '#a3a3a3ff',
        });

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => setIndex(i)}
            activeOpacity={0.7}
          >
            {icon}
            {focused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );


  return (
    <View style={{ flex: 1 }}>
      {renderTabBar()}
      {renderPosts(filterPosts(routes[index].key))}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: itemSize,
    height: itemSize,
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  postImage: {
    width: '99%',
    height: '99%',
  },
  video: {
    width: '99%',
    height: '99%',
  },
  postType: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emptySubTitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  IconContent: {
    backgroundColor: '#F1F1F1',
    borderRadius: 50,
    padding: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eeeeeece',
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#a3a3a3ff',
    fontSize: 14,
  },
  tabTextFocused: {
    color: '#202020ff',
    fontSize: 14,
  },
  indicator: {
    marginTop: 13,
    height: 2,
    width: '95%',
    backgroundColor: '#1c1c1cff',
    borderRadius: 15,
  },
});

export default PostList;