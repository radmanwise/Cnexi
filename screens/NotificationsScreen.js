import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const initialNotifications = [
      {
        id: '1',
        userImage: 'https://via.placeholder.com/50',
        username: 'sarah_design',
        action: 'liked',
        target: 'your latest post',
        content: 'Great design work! Love the color scheme 🎨',
        time: '2m',
        read: false,
        type: 'like',
        engagement: '1.2K likes',
        thumbnail: 'https://via.placeholder.com/100',
      },
      {
        id: '2',
        userImage: 'https://via.placeholder.com/50',
        username: 'john_developer',
        action: 'commented',
        target: 'your photo',
        content: 'This is exactly what I was looking for! Could you share more details about the implementation?',
        time: '15m',
        read: false,
        type: 'comment',
        engagement: '24 replies',
        thumbnail: 'https://via.placeholder.com/100',
      },
      {
        id: '3',
        userImage: 'https://via.placeholder.com/50',
        username: 'tech_weekly',
        action: 'mentioned',
        target: 'you in a post',
        content: 'Check out @Mahdimoradiz\'s amazing contribution to our latest project!',
        time: '1h',
        read: true,
        type: 'mention',
        engagement: '3.4K views',
      },
      {
        id: '4',
        userImage: 'https://via.placeholder.com/50',
        username: 'design_community',
        action: 'featured',
        target: 'your work',
        content: 'Your design has been selected for our weekly showcase! 🏆',
        time: '2h',
        read: true,
        type: 'feature',
        engagement: '5.6K impressions',
        thumbnail: 'https://via.placeholder.com/100',
      },
    ];

    setNotifications(initialNotifications);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadNotifications();
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleNotificationPress = (notification) => {
    const updatedNotifications = notifications.map(item =>
      item.id === notification.id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'like': return '#FF3B30';
      case 'comment': return '#007AFF';
      case 'mention': return '#5856D6';
      case 'feature': return '#FF9500';
      default: return '#000000';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'like': return 'favorite';
      case 'comment': return 'chat-bubble';
      case 'mention': return 'alternate-email';
      case 'feature': return 'star';
      default: return 'notifications';
    }
  };

  const NotificationItem = React.memo(({ item }) => {
    const scaleAnim = new Animated.Value(0.95);

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[styles.notificationItem, !item.read && styles.unread]}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.notificationContent}>
            <View style={styles.userSection}>
              <Image source={{ uri: item.userImage }} style={styles.userImage} />
              <View style={[styles.actionIcon, { backgroundColor: getActionColor(item.type) }]}>
                <MaterialIcons name={getActionIcon(item.type)} size={12} color="#FFFFFF" />
              </View>
            </View>
            
            <View style={styles.textContent}>
              <View style={styles.headerRow}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              
              <Text style={styles.actionText}>
                <Text style={styles.action}>{item.action} </Text>
                {item.target}
              </Text>
              
              {item.content && (
                <Text style={styles.contentText} numberOfLines={2}>
                  {item.content}
                </Text>
              )}
              
              {item.engagement && (
                <Text style={styles.engagementText}>
                  {item.engagement}
                </Text>
              )}
            </View>

            {item.thumbnail && (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  return (
    <View style={styles.container}>
      
      <Animated.View style={[styles.headerBlur, { opacity: headerOpacity }]}>
        <BlurView intensity={90} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <View style={styles.header}>

      </View>

      <Animated.FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 60,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  headerButton: {
    padding: 8,
  },
  listContainer: {
    paddingTop: 8,
  },
  notificationItem: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unread: {
    backgroundColor: '#F8F9FF',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  userSection: {
    marginRight: 12,
    position: 'relative',
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
  },
  actionIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  time: {
    fontSize: 13,
    color: '#8E8E8E',
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  action: {
    fontWeight: '500',
    color: '#000000',
  },
  contentText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  engagementText: {
    fontSize: 13,
    color: '#8E8E8E',
    marginTop: 8,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
});

export default NotificationScreen;