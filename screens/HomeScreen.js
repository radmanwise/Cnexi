import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import HomeNavigationBar from '../navigation/home/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';
import { Subtitle, Body } from '../components/ui/Typography';

const SkeletonBox = ({ width, height, borderRadius = 8, style }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#e1e9ee',
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

// SkeletonTabBar (in loading state)
const SkeletonTabBar = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBarContainer}
      style={styles.tabBar}
    >
      {[1, 2, 3, 4].map((_, i) => (
        <SkeletonBox key={i} width={80} height={32} borderRadius={20} style={{ marginRight: 10 }} />
      ))}
    </ScrollView>
  );
};

// MemoTabBar
const MemoTabBar = memo(({ index, setIndex, routes, loading }) => {
  if (loading) return <SkeletonTabBar />;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBarContainer}
      style={styles.tabBar}
    >
      {routes.map((route, i) => {
        const isFocused = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            onPress={() => setIndex(i)}
            activeOpacity={0.8}
          >
            <Body style={[styles.tabText, isFocused && styles.tabTextActive]}>
              {route.title}
            </Body>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

const { width } = Dimensions.get('window');
const NAVBAR_HEIGHT = 60;
const TABBAR_HEIGHT = 48;

const tabRoutes = [
  { key: 'forYou', title: 'For you' },
  { key: 'followers', title: 'Following' },
  { key: 'news', title: 'News' },
  { key: 'music', title: 'Music' },
  { key: 'sports', title: 'Sports' },
];

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [routes] = useState(tabRoutes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderScene = ({ route }) => {
    if (loading) {
      return (
        <View style={styles.emptyTab}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50, marginLeft: -230 }}>
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <SkeletonBox width={100} height={12} borderRadius={6} style={{ marginLeft: 10 }} />
          </View>

          <SkeletonBox width="95%" height={350} borderRadius={9} style={{ marginTop: 10, alignSelf: 'center'}} />

          <SkeletonBox width="40%" height={12} borderRadius={6} style={{ marginTop: 25, alignSelf: 'center',marginLeft: -215  }} />
        </View>
      );
    }


    switch (route.key) {
      case 'forYou':
        return <PostScreen filter="forYou" />;
      case 'followers':
        return <PostScreen filter="followers" />;
      default:
        return (
          <View style={styles.emptyTab}>
            <Subtitle style={{ color: '#aaa', fontSize: 16 }}>
              No content for "{route.title}"
            </Subtitle>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.navbar}>
            <HomeNavigationBar />
          </View>
          <MemoTabBar index={index} setIndex={setIndex} routes={routes} loading={loading} />
        </SafeAreaView>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={() => null}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  navbar: {
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBar: {
    height: TABBAR_HEIGHT + 10,
    backgroundColor: '#fff',
    top: 10,
  },
  tabBarContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
  },
  tabItem: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: '#008CFF',
  },
  tabText: {
    fontSize: 12.5,
    color: '#000',
  },
  tabTextActive: {
    color: '#fff',
  },
  emptyTab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: '#fff',
  },
});
