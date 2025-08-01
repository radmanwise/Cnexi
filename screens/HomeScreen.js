import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import HomeNavigationBar from '../navigation/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';
import { StatusBar } from 'react-native';

const initialLayout = { width: Dimensions.get('window').width };

const ForYouScreen = () => (
  <View style={styles.scene}>
    <PostScreen filter='forYou' />
  </View>
);

const FollowersScreen = () => (
  <View style={styles.scene}>
    <PostScreen filter='followers' />
  </View>
);

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'forYou', title: 'For you' },
    { key: 'followers', title: 'Following' },
  ]);

  const renderScene = SceneMap({
    forYou: ForYouScreen,
    followers: FollowersScreen,
  });

  const renderTabBar = props => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isFocused = index === i;
        return (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setIndex(i)}
            key={route.key}
          >
            <Text style={{ color: isFocused ? '#000' : 'gray' }}>{route.title}</Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent
      />
      <HomeNavigationBar />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    bottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ebeaeaff',
  },
  indicator: {
    backgroundColor: '#008CFF',
    height: 3.5,
    width: '80%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 122,
  },
});
