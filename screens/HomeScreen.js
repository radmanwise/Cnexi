import React, { useState, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import HomeNavigationBar from '../navigation/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';

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

const MemoTabBar = memo(({ index, setIndex, routes }) => (
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
          <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
            {route.title}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [routes] = useState(tabRoutes);


  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'forYou':
        return <PostScreen filter="forYou" />;
      case 'followers':
        return <PostScreen filter="followers" />;
      default:
        return (
          <View style={styles.emptyTab}>
            <Text style={{ color: '#aaa', fontSize: 16 }}>
              No content for "{route.title}"
            </Text>
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
          <MemoTabBar index={index} setIndex={setIndex} routes={routes} />
        </SafeAreaView>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={() => null}
        lazy
        renderLazyPlaceholder={() => <View style={{ flex: 1, backgroundColor: '#fff' }} />}
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
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
  },
  tabItemActive: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
