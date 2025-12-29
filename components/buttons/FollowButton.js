import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import ipconfig from '../../config/ipconfig';
import { Title, Subtitle, Body, Caption } from '../ui/Typography';

const COLORS = {
  primary: '#008CFF',
  white: '#ffffffff',
};

const FollowButton = ({
  userId,
  initialIsFollowing = false,
  onFollowChange,
  textStyle = {},
  buttonStyle = {},
  borderColor = COLORS.primary,
  followColor = COLORS.primary,
  unfollowTextColor = COLORS.white,
  followTextColor = COLORS.primary,
  borderRadius = 15,
  paddingVertical = 8,
  paddingHorizontal = 16,
  fontSize = 11,


}) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const buttonAnimation = useMemo(() => {
    return Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]);
  }, [scaleAnim]);

  const toggleFollow = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      let response;
      if (following) {
        response = await axios.delete(`${ipconfig.BASE_URL}/profile/unfollow/${userId}/`, config);
      } else {
        response = await axios.post(`${ipconfig.BASE_URL}/profile/follow/${userId}/`, {}, config);
      }

      if ([200, 201].includes(response.status)) {
        const newFollowState = !following;
        setFollowing(newFollowState);
        onFollowChange?.(newFollowState);
        buttonAnimation.start();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, following, userId, onFollowChange, buttonAnimation]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={toggleFollow}
        disabled={isLoading}
        style={StyleSheet.flatten([
          {
            borderRadius,
            paddingVertical,
            paddingHorizontal,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: borderColor,
            backgroundColor: following ? 'transparent' : followColor,
          },
          buttonStyle,
        ])}
      >
        <Title
          style={StyleSheet.flatten([
            {
              fontSize,
              letterSpacing: 0.3,
              color: following ? followTextColor : unfollowTextColor,
            },
            textStyle,
          ])}
        >
          {following ? t('Unfollow') : t('Follow')}
        </Title>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});

export default React.memo(FollowButton);
