import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Easing,
  useColorScheme,
  Dimensions,
  StyleSheet
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRoundXIcon, EllipsisVerticalIcon } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PostMenu = ({
  isOwnPost,
  onDeletePost,
  onEditPost,
  onReportPost,
  onHidePost,
  onUnfollow,
  onAddToFavorites,
  style,
}) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme();

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: visible ? 250 : 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const handleOptionPress = (callback) => {
    if (callback) callback();
    close();
  };

  const renderOption = (label, callback, {
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
        { color: dangerous ? '#FF3B30' : (theme === 'dark' ? '#F5F5F5' : '#000000ff') },
        textStyle
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.menuButton, style]}
        onPress={open}
        activeOpacity={0.7}
      >
        <EllipsisVerticalIcon size={21} color={theme === 'dark' ? '#CCC' : '#777'} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={close}>
            <View style={styles.overlayTouch}>
              <TouchableWithoutFeedback>
                <Animated.View style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateY }],
                    backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F9F9F9',
                  }
                ]}>
                  <View style={styles.header}>
                    <View style={styles.indicator} />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.optionGroup}>
                      {isOwnPost ? (
                        <>
                          {renderOption('Edit', onEditPost, {
                            icon: (color) => <Feather name="edit" size={22} color={color} />,
                          })}
                          {renderOption('Delete', onDeletePost, {
                            dangerous: true,
                            icon: (color) => <MaterialCommunityIcons name="delete-outline" size={22} color={color} />,
                            textStyle: styles.boldText,
                          })}
                        </>
                      ) : (
                        <>
                          {renderOption('Add to favorites', onAddToFavorites, {
                            icon: (color) => <MaterialIcons name="stars" size={22} color={color} />,
                          })}
                          {renderOption('Hide', onHidePost, {
                            icon: (color) => <Feather name="eye-off" size={22} color={color} />,
                          })}
                          {renderOption('Unfollow', onUnfollow, {
                            icon: (color) => <UserRoundXIcon size={22} color={color} />,
                          })}
                        </>
                      )}
                    </View>

                    <View style={styles.optionGroup}>
                      {renderOption('Share', () => { }, {
                        icon: (color) => <Feather name="share" size={22} color={color} />,
                      })}
                      {renderOption('Copy link', () => { }, {
                        icon: (color) => <Feather name="link" size={22} color={color} />,
                      })}
                    </View>

                    {!isOwnPost && (
                      <View style={styles.optionGroup}>
                        {renderOption('Report', onReportPost, {
                          dangerous: true,
                          icon: () => <MaterialCommunityIcons name="alert-circle-outline" size={22} color="#FF3B30" />,
                          textStyle: styles.boldText,
                        })}
                      </View>
                    )}
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

export default PostMenu;

const styles = StyleSheet.create({
  menuButton: {
    padding: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#999',
    borderRadius: 3,
  },
  content: {
    gap: 16,
  },
  optionGroup: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  dangerousOption: {
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  optionIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Manrope', 
  },
  boldText: {
    fontWeight: '600',
  },
});
