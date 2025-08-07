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
          <Image
            source={require('../../assets/img/app/cnexi.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AddPostScreen')}
          >
            <AddIcon size={24} color="#000000ff" />
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
