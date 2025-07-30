import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import EllipsisVerticalIcon from '../../components/icons/EllipsisVerticalIcon';
import * as Font from 'expo-font';
import UserRoundXIcon  from '../../components/icons/UserRoundXIcon';

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
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
          velocity: 0.1
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [modalVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0]
  });

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderOption = (text, onPress, { icon, textStyle = {}, dangerous = false, iconColor = '#262626' } = {}) => (
    <TouchableOpacity 
      style={[
        styles.option,
        dangerous && styles.dangerousOption
      ]} 
      onPress={() => {
        if (onPress) {
          onPress();
        }
        handleClose();
      }}
      activeOpacity={0.6}
    >
      {icon && (
        <View style={styles.optionIconContainer}>
          {icon(iconColor)}
        </View>
      )}
      <Text style={[
        styles.optionText,
        dangerous && styles.dangerousText,
        textStyle
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );


  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  return (
    <>
      <TouchableOpacity 
        style={[styles.menuButton, style]} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <EllipsisVerticalIcon name="dots-vertical" size={21} color="#777777ff" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Animated.View 
          style={[
            styles.overlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.overlayTouch}>
              <TouchableWithoutFeedback>
                <Animated.View 
                  style={[
                    styles.modalContainer,
                    { transform: [{ translateY }] }
                  ]}
                >
                  <View style={styles.header}>
                    <View style={styles.indicator} />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.optionGroup}>
                      {isOwnPost ? (
                        <>
                          {renderOption('Edit', onEditPost, {
                            icon: (color) => <Feather name="edit" size={24} color={color} />
                          })}
                          {renderOption('Archive', () => {}, {
                            icon: (color) => <MaterialCommunityIcons name="archive-outline" size={24} color={color} />
                          })}
                          {renderOption('Hide like count', () => {}, {
                            icon: (color) => <Feather name="eye-off" size={24} color={color} />
                          })}
                          {renderOption('Turn off commenting', () => {}, {
                            icon: (color) => <MaterialCommunityIcons name="comment-off-outline" size={24} color={color} />
                          })}
                        </>
                      ) : (
                        <>
                          {renderOption('Add to favorites', onAddToFavorites, {
                            icon: (color) => <MaterialIcons name="stars" size={24} color={color} />
                          })}
                          {renderOption('Hide', onHidePost, {
                            icon: (color) => <Feather name="eye-off" size={24} color={color} />
                          })}
                          {renderOption('Unfollow', onUnfollow, {
                            icon: (color) => <UserRoundXIcon size={24} color={color} />
                          })}
                        </>
                      )}
                    </View>

                    <View style={styles.optionGroup}>
                      {renderOption('Share', () => {}, {
                        icon: (color) => <Feather name="share" size={24} color={color} />
                      })}
                      {renderOption('Copy link', () => {}, {
                        icon: (color) => <Feather name="link" size={24} color={color} />
                      })}
                    </View>

                    {isOwnPost ? (
                      <View style={styles.optionGroup}>
                        {renderOption('Delete', onDeletePost, { 
                          dangerous: true,
                          icon: (color) => <MaterialCommunityIcons name="delete-outline" size={24} color={color} />,
                          textStyle: styles.boldText 
                        })}
                      </View>
                    ) : (
                      <View style={styles.optionGroup}>
                        {renderOption('Report', onReportPost, { 
                          dangerous: true,
                          icon: (color) => <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF3B30" />,
                          textStyle: styles.boldText 
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

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Platform.select({
      ios: '#F3F3F3',
      android: '#FFFFFF'
    }),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.select({
      ios: 44,
      android: 24
    }),
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  indicator: {
    width: 36,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
  },
  content: {
    paddingTop: 8,
  },
  optionGroup: {
    marginBottom: 8,
    backgroundColor: Platform.select({
      ios: '#FFFFFF',
      android: '#FFFFFF'
    }),
    borderRadius: 14,
    marginHorizontal: 8,
    overflow: 'hidden',
    fontFamily: 'Manrope',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.select({
      ios: 16,
      android: 14
    }),
    paddingHorizontal: 16,
    backgroundColor: Platform.select({
      ios: '#FFFFFF',
      android: '#FFFFFF'
    }),
    fontFamily: 'Manrope',

  },
  optionIconContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  dangerousOption: {
    backgroundColor: Platform.select({
      ios: '#FFFFFF',
      android: '#FFFFFF'
    }),
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    color: '#262626',
    fontFamily: 'Manrope',
  },
  dangerousText: {
    color: '#FF3B30',
  },
  boldText: {
    fontWeight: '600',
  },
});

export default PostMenu;