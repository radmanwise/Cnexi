import React, { useState, useRef, useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Share, 
  Modal, 
  View, 
  Text,
  Pressable,
  Clipboard,
  ToastAndroid,
  Platform,
  Animated
} from 'react-native';
import ShareIcon from '../../components/icons/ShareIcon';
import TelegramIcon from '../../components/icons/TelegramIcon';
import InstagramIcon from '../../components/icons/InstagramIcon';
import WhatsAppIcon from '../../components/icons/WhatsAppIcon';
import LinkIcon from '../../components/icons/LinkIcon';
import DownloadIcon from '../../components/icons/DownloadIcon';

const ShareButton = ({ postData, iconSize = 26, iconColor = '#737373ff' }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (modalVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const handleNativeShare = async () => {
    try {
      const shareContent = {
        title: postData.title || 'Check this out!',
        message: postData.description || 'I found something interesting!',
        url: postData.shareUrl || '',
      };
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing content:', error);
    }
    setModalVisible(false);
  };

  const copyToClipboard = () => {
    const shareUrl = postData.shareUrl || '';
    Clipboard.setString(shareUrl);
    showToast('Link copied to clipboard!');
    setModalVisible(false);
  };

  const shareOptions = [
    {
      id: 'download',
      title: 'Download',
      icon: <DownloadIcon size={25} />,
      onPress: handleNativeShare
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: <TelegramIcon size={25} />,
      onPress: handleNativeShare
    },
    {
      id: 'instagram',
      title: 'Instagram Stories',
      icon: <InstagramIcon size={25} />,
      onPress: handleNativeShare
    },
    {
      id: 'copy',
      title: 'Copy Link',
      icon: <LinkIcon size={25} />,
      onPress: copyToClipboard
    }
  ];

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={styles.button}
        disabled={isSharing}
      >
        <ShareIcon size={iconSize} color={iconColor} />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            }
          ]} 
          onPress={closeModal}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 400]
                  })
                }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.dragIndicator} />
            </View>
            
            <Text style={styles.modalTitle}>Share</Text>
            
            <View style={styles.optionsGrid}>
              {shareOptions.map((option) => (
                <Pressable 
                  key={option.id}
                  style={styles.gridItem} 
                  onPress={option.onPress}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{option.icon}</Text>
                  </View>
                  <Text style={styles.optionText}>{option.title}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable 
              style={styles.cancelButton} 
              onPress={closeModal}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
    letterSpacing: 0.5,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
  },
  cancelText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ShareButton;