import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import EllipsisVerticalIcon from '../../components/icons/EllipsisVerticalIcon';
import UserRoundXIcon from '../../components/icons/UserRoundXIcon';
import * as Font from 'expo-font';
import { BlurView } from 'expo-blur';
import { Easing } from 'react-native';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  useColorScheme,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PostMenu = ({
  isOwnPost,
  onDeletePost,
  onEditPost,
  onReportPost,
  onHidePost,
  onUnfollow,
  onAddToFavorites,
  style
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme();

  useEffect(() => {
    Font.loadAsync({
      'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: modalVisible ? 1 : 0,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }),
      Animated.timing(fadeAnim, {
        toValue: modalVisible ? 1 : 0,
        duration: modalVisible ? 200 : 150,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [modalVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const openModal = useCallback(() => setModalVisible(true), []);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400, 
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  }, []);



  const handleOptionPress = useCallback((callback) => {
    if (callback) callback();
    closeModal();
  }, [closeModal]);

  const renderOption = useCallback((label, callback, {
    icon,
    dangerous = false,
    textStyle = {},
    iconColor = '#262626'
  } = {}) => (
    <TouchableOpacity
      style={[styles.option, dangerous && styles.dangerousOption]}
      onPress={() => handleOptionPress(callback)}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.optionIconContainer}>{icon(iconColor)}</View>}
      <Text style={[
        styles.optionText,
        { color: dangerous ? '#FF3B30' : (theme === 'dark' ? '#F5F5F5' : '#262626') },
        textStyle
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [handleOptionPress, theme]);

  if (!fontsLoaded) return null;

  return (
    <>
      <TouchableOpacity
        style={[styles.menuButton, style]}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <EllipsisVerticalIcon size={21} color={theme === 'dark' ? '#CCC' : '#777'} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.overlayTouch}>
              <TouchableWithoutFeedback>
                <Animated.View style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateY }],
                    backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F9F9F9'
                  }
                ]}>
                  <View style={styles.header}>
                    <View style={styles.indicator} />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.optionGroup}>
                      {isOwnPost ? (
                        <>
                          {renderOption('Edit', onEditPost, { icon: (color) => <Feather name="edit" size={22} color={color} /> })}
                          {renderOption('Archive', () => { }, { icon: (color) => <MaterialCommunityIcons name="archive-outline" size={22} color={color} /> })}
                          {renderOption('Hide like count', () => { }, { icon: (color) => <Feather name="eye-off" size={22} color={color} /> })}
                          {renderOption('Turn off commenting', () => { }, { icon: (color) => <MaterialCommunityIcons name="comment-off-outline" size={22} color={color} /> })}
                        </>
                      ) : (
                        <>
                          {renderOption('Add to favorites', onAddToFavorites, { icon: (color) => <MaterialIcons name="stars" size={22} color={color} /> })}
                          {renderOption('Hide', onHidePost, { icon: (color) => <Feather name="eye-off" size={22} color={color} /> })}
                          {renderOption('Unfollow', onUnfollow, { icon: (color) => <UserRoundXIcon size={22} color={color} /> })}
                        </>
                      )}
                    </View>

                    <View style={styles.optionGroup}>
                      {renderOption('Share', () => { }, { icon: (color) => <Feather name="share" size={22} color={color} /> })}
                      {renderOption('Copy link', () => { }, { icon: (color) => <Feather name="link" size={22} color={color} /> })}
                    </View>

                    <View style={styles.optionGroup}>
                      {isOwnPost
                        ? renderOption('Delete', onDeletePost, {
                          dangerous: true,
                          icon: (color) => <MaterialCommunityIcons name="delete-outline" size={22} color={color} />,
                          textStyle: styles.boldText
                        })
                        : renderOption('Report', onReportPost, {
                          dangerous: true,
                          icon: () => <MaterialCommunityIcons name="alert-circle-outline" size={22} color="#FF3B30" />,
                          textStyle: styles.boldText
                        })}
                    </View>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 4, 4, 0.44)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.select({ ios: 44, android: 24 }),
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  indicator: {
    width: 36,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  closeIcon: {
    position: 'absolute',
    right: 16,
    top: 4,
  },
  content: {
    paddingTop: 8,
  },
  optionGroup: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.select({ ios: 16, android: 14 }),
    paddingHorizontal: 16,
  },
  optionIconContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Manrope',
  },
  dangerousOption: {
    backgroundColor: '#FFFFFF',
  },
  boldText: {
    fontWeight: '600',
  },
});

export default PostMenu;
