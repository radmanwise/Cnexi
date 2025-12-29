import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AlarmIcon from '../../components/icons/AlarmIcon';
import AddIcon from '../../components/icons/AddIcon';

const { width } = Dimensions.get('window');

export default function HomeNavigationBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.menuBar}>

        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AddPostScreen')}
          >
            <AddIcon size={24} color="#000000ff" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerLogo}>
          <Image
            source={require('../../assets/img/app/cnexi.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('NotificationsScreen')}
          >
            <AlarmIcon size={24} color="#000000ff" fill="#ffffffff" />
          </TouchableOpacity>
        </View>

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },

  menuBar: {
    height: 50,
    justifyContent: 'center',
  },

  leftSection: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightSection: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  logo: {
    width: 45,
    height: 45,
  },

  iconButton: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
