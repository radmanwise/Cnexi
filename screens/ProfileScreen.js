import { useState, useEffect, useRef } from 'react';
import TopMenu from '../navigation/TopMenu';
import FollowButton from '../components/buttons/FollowButton';
import PostList from '../components/post/PostList';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Modal
} from 'react-native';
import ipconfig from '../config/ipconfig';
import * as Font from 'expo-font';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanResponder } from 'react-native';
import { Easing } from 'react-native-reanimated';


const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const profileImageRef = useRef(null);
  const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });


  const [isModalVisible, setIsModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  const centerX = width / 2;
  const centerY = height / 2;


  const showModal = () => {
    scaleAnim.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);

    setIsModalVisible(true);

    setTimeout(() => {
      const moveX = centerX - (imageLayout.x + imageLayout.width / 2);
      const moveY = centerY - (imageLayout.y + imageLayout.height / 2);

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 3,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: moveX,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: moveY,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 10);
  };


  const hideModal = () => {
    const moveX = centerX - (imageLayout.x + imageLayout.width / 2);
    const moveY = centerY - (imageLayout.y + imageLayout.height / 2);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();


    setTimeout(() => setIsModalVisible(false), 100);
  };



  const MAX_BIO_LENGTH = 60;

  const truncateText = (text, length) =>
    text.length > length ? text.substring(0, length) + '...' : text;

  const loadFonts = async () => {
    await Font.loadAsync({
      'Manrope': require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
      'ManropeBold': require('../assets/fonts/Manrope/Manrope-Bold.ttf'),
      'ManropeSemiBold': require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
    });
    setFontsLoaded(true);
  };

  const loadCachedProfile = async () => {
    const cached = await AsyncStorage.getItem('profileData');
    if (cached) {
      setProfileData(JSON.parse(cached));
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;

      const userResponse = await axios.get(`${ipconfig.BASE_URL}/api/v1/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userIdFetched = userResponse.data.user.id;
      const usernameFetched = userResponse.data.user.username;
      setUserId(userIdFetched);
      setUsername(usernameFetched);

      const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${usernameFetched}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(profileResponse.data);
      await AsyncStorage.setItem('profileData', JSON.stringify(profileResponse.data));
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFonts();
    loadCachedProfile();
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  if (loading && !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const imageUrl = `${ipconfig.BASE_URL}/${profileData?.picture}`;
  const isCurrentUser = profileData?.slug === username;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopMenu />
      <Modal visible={isModalVisible} transparent animationType="none">
        <TouchableOpacity
          activeOpacity={1}
          onPress={hideModal}
          style={styles.modalOverlay}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: imageLayout.x,
              top: imageLayout.y,
              width: imageLayout.width,
              height: imageLayout.height,
              transform: [
                { translateX: translateX },
                { translateY: translateY },
                { scale: scaleAnim },
              ],
              borderRadius: 100, // اگر می‌خواهی گرد باشه
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>


      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchProfileData} />}
      >
        <View style={styles.container}>
          <View style={styles.profileCard}>
            <TouchableOpacity
              onPress={() => {
                profileImageRef.current.measure((fx, fy, width, height, px, py) => {
                  setImageLayout({ x: px, y: py, width, height });
                  showModal();
                });
              }}
            >
              <Image
                ref={profileImageRef}
                source={{ uri: imageUrl }}
                style={styles.profileImage}
                onLayout={(event) => {
                  const { x, y, width, height } = event.nativeEvent.layout;
                  setImageLayout({ x, y, width, height });
                }}
              />

            </TouchableOpacity>


            <Text style={styles.username}>{truncateText(profileData?.username_i || '', 12)}</Text>
            <View style={styles.buttonStyle}>
              {isCurrentUser ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile', { username: profileData?.username_i })}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>{t('Edit Profile')}</Text>
                </TouchableOpacity>
              ) : (
                <FollowButton userId={userId} initialIsFollowing={profileData?.is_following} />
              )}
            </View>
          </View>

          <View style={styles.profileStatus}>
            {[{
              label: t('posts'),
              value: profileData?.post_count
            }, {
              label: t('followers'),
              value: profileData?.followers_count,
              navigateTo: 'FollowersScreen'
            }, {
              label: t('following'),
              value: profileData?.following_count,
              navigateTo: 'FollowingScreen'
            }].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.profileInformation}
                onPress={() => item.navigateTo && navigation.navigate(item.navigateTo, { userId })}
              >
                <Text style={styles.count}>{item.value || 0}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.biography}>
              {showFullBio ? profileData?.bio : truncateText(profileData?.bio || '', MAX_BIO_LENGTH)}
            </Text>
            {(profileData?.bio?.length || 0) > MAX_BIO_LENGTH && (
              <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)} style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>{showFullBio ? 'See Less' : 'See More'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <PostList posts={profileData?.posts || []} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileCard: {
    backgroundColor: '#f9f9f9',
    width: '92%',
    marginTop: 24,
    borderRadius: 50,
    padding: 1,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: 'black',
  },
  profileImage: {
    height: 88,
    width: 88,
    borderRadius: 100,
    borderColor: '#ffff',
    borderWidth: 2,
  },
  username: {
    position: 'absolute',
    marginLeft: '25%',
    fontSize: 15,
    fontWeight: '500',
    marginTop: '9%',
    fontFamily: 'ManropeSemiBold'
  },
  buttonStyle: {
    marginTop: 20,
    position: 'absolute',
    marginLeft: '60%',
    borderRadius: 13,
    padding: 0,
  },
  editButton: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1.5,
    padding: 8,
    width: 130,
    backgroundColor: '#f9f9f9',
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'ManropeSemiBold',
  },
  profileStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    width: '100%',
  },
  profileInformation: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3B3C',
    fontFamily: 'Manrope'
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    padding: 5,
    fontFamily: 'ManropeSemiBold'
  },
  bioContainer: {
    maxWidth: 360,
    padding: 16,
  },
  biography: {
    fontSize: 13,
    fontFamily: 'Manrope',
    lineHeight: 18,
  },
  seeMoreButton: {
    marginTop: 5,
  },
  seeMoreText: {
    color: '#666',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 200,
    resizeMode: 'cover',
  },
});
