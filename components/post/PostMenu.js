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
import MenuDotIcon from '../../components/icons/MenuDotIcon';

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
        easing: Easing.out(Easing.poly(2)),
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

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

useEffect(() => {
  if (visible) {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 1,
        friction: 9, 
        tension: 60, 
        useNativeDriver: true,
        overshootClamping: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }
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
    iconColor = '#292828ff'
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
        style={[styles.menuButton]}
        onPress={open}
        activeOpacity={0.7}
      >
        <MenuDotIcon size={22} color={'#606060ff'} />
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
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
  },
  content: {
    gap: 18,
  },
  optionGroup: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    transition: 'background-color 0.2s',
  },
  dangerousOption: {
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
  },
  optionIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Manrope',
    marginLeft: 8,
    color: '#262626',
  },
  boldText: {
    fontWeight: '600',
  },
});

