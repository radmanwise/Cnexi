import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const BlockedUserItem = ({ user, onUnblock, t }) => (
  <Animated.View
    entering={SlideInRight}
    exiting={SlideOutRight}
    style={styles.blockedUserCard}
  >
    <View style={styles.userInfo}>
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.statusDot} />
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.blockDate}>
          {t('Blocked on')} {user.blockedDate}
        </Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.unblockButton}
      onPress={() => onUnblock(user)}
    >
      <Text style={styles.unblockText}>{t('Unblock')}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const BlockScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: '1',
      username: 'john_doe',
      blockedDate: '2025-03-12',
      reason: 'Spam',
    },
    {
      id: '2',
      username: 'jane_smith',
      blockedDate: '2025-03-10',
      reason: 'Harassment',
    },
    // Add more blocked users as needed
  ]);

  const handleUnblock = (user) => {
    Alert.alert(
      t('Unblock User'),
      t('Are you sure you want to unblock {{username}}?', { username: user.username }),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Unblock'),
          style: 'destructive',
          onPress: () => {
            setBlockedUsers(current =>
              current.filter(item => item.id !== user.id)
            );
          },
        },
      ]
    );
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ListEmptyComponent = () => (
    <Animated.View
      entering={FadeIn}
      style={styles.emptyContainer}
    >
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={64}
        color="#ccc"
      />
      <Text style={styles.emptyTitle}>{t('No Blocked Users')}</Text>
      <Text style={styles.emptyText}>
        {t('When you block someone, they will appear here')}
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Blocked Users')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.searchContainer}
      >
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('Search blocked users')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </Animated.View>

      {/* Blocked Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BlockedUserItem
            user={item}
            onUnblock={handleUnblock}
            t={t}
          />
        )}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 35,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  blockedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  blockDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
  },
  unblockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BlockScreen;