import { View, FlatList, Text, RefreshControl, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeNavigationBar from '../navigationbar/HomeNavigationBar';
import PostScreen from '../components/post/PostScreen';
import DrawerMenu from '../navigationbar/DrawerMenu';

export default function HomeScreen() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <HomeNavigationBar />
      <PostScreen />
      <View style={styles.profileStatus}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Image style={styles.profileImage} source={require('../assets/nex.png')} />
        </TouchableOpacity>
      </View>
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileStatus: {
    marginTop: 40,
    flexDirection: 'row',
    marginRight: 350,
    left: 15,
    position: 'absolute'
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 100,
    borderColor: '#ffff',
    borderWidth: 1.5,
  },
})