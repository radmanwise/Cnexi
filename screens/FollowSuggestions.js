import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FollowSuggestions = () => {
  const suggestions = [
    {
      id: '1',
      name: 'Emma Watson',
      username: '@emma',
      avatar: require('../assets/img/app/cnexi.jpg'),
      verified: true,
      followers: '28.9M'
    },
    {
      id: '2',
      name: 'Tom Holland',
      username: '@tomh',
      avatar: require('../assets/img/app/cnexi.jpg'),
      verified: true,
      followers: '19.2M'
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Image
        source={item.avatar}
        style={styles.avatarImage}
      />
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" style={styles.verifiedBadge} />
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userHandle}>{item.username}</Text>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.followers}>{item.followers} followers</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suggested for you</Text>
      </View>
      <FlatList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#14171A',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF3F4',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#657786',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#657786',
    marginHorizontal: 4,
  },
  followers: {
    fontSize: 14,
    color: '#657786',
  },
  followButton: {
    backgroundColor: '#14171A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  }
});

export default FollowSuggestions;