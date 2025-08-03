import { useState, useEffect, useRef } from 'react';
import TopMenu from '../navigation/profile/TopMenu';
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
  Modal,
  Dimensions
} from 'react-native';
import ipconfig from '../config/ipconfig';
import * as Font from 'expo-font';
import { Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Easing } from 'react-native-reanimated';
import { Subtitle, Title } from '../components/ui/Typography';


export default function OtherUserProfileScreen({ route }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userId, setUserId] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [currentUserSlug, setCurrentUserSlug] = useState('');
  const [userFollowState, setUserFollowState] = useState(profileData?.is_following);
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
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: moveX,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: moveY,
          duration: 150,
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
        duration: 100,
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

  const handleFollowChange = (newFollowState) => {
    setUserFollowState(newFollowState);
  };


  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const BioSection = () => {
    const bioText = profileData?.bio || '';
    const MAX_BIO_LENGTH = 60;
    const shouldShowButton = bioText.length > MAX_BIO_LENGTH;

    return (
      <View style={styles.bioContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowFullBio(!showFullBio)}
              style={styles.bioContainer}
            >
              <Subtitle style={styles.biography}>
                {showFullBio ? profileData?.bio : truncateText(profileData?.bio || '', MAX_BIO_LENGTH)}
              </Subtitle>
              {!showFullBio && (profileData?.bio?.length || 0) > MAX_BIO_LENGTH && (
                <Text style={styles.seeMoreText}></Text>
              )}
            </TouchableOpacity>
      </View>
    );
  };


  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);
  const truncateText = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };


  const formatNumber = (number) => {
    return new Intl.NumberFormat(t.language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const followersCount = profileData?.followers_count || 0;
  const formattedFollowersCount = formatNumber(followersCount);

  const postCount = profileData?.post_count || 0;
  const formattedPostCount = formatNumber(postCount);

  const followingCount = profileData?.following_count || 0;
  const formattedFollowingCount = formatNumber(followingCount);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found');
        navigation.navigate('LoginScreen');
        return;
      }

      const { slug } = route.params;

      const currentUserResponse = await axios.get(`${ipconfig.BASE_URL}/api/v1/user/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      console.log('Current User Data:', currentUserResponse.data.user.username);
      setCurrentUserSlug(currentUserResponse.data.user.username);

      const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${slug}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      console.log('Profile Data:', profileResponse.data.username);
      setProfileData(profileResponse.data);
      setUserId(profileResponse.data.id);

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" animating={true} />
      </View>
    );
  }

  const imageUrl = `${ipconfig.BASE_URL}/${profileData.picture}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
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
              borderRadius: 100,
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
      <View style={styles.topMenuContainer}>
        <View style={styles.topMenuContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </TouchableOpacity>
          <Title style={styles.topMenuTitle}>
            {profileData?.name || 'Profile'}
          </Title>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => {
              console.log('More options pressed');
            }}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchProfileData}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.ProfileView}>
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
                style={styles.profileImage}
                source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                onLayout={(event) => {
                  const { x, y, width, height } = event.nativeEvent.layout;
                  setImageLayout({ x, y, width, height });
                }}
              />
            </TouchableOpacity>

            <Subtitle style={styles.username}>{truncateText(profileData?.username_i || 'username', 12)}</Subtitle>

            <View style={styles.buttonStyle}>
              {currentUserSlug && profileData?.username_i && currentUserSlug === profileData.username_i ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  style={{
                    borderRadius: 10,
                    borderBlockColor: 'black',
                    borderWidth: 1.5,
                    padding: 8,
                    width: 130,
                    marginLeft: -60,
                    fontWeight: 300,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Subtitle
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      textAlign: 'center',
                      color: '#000',
                    }}
                  >
                    {t('Edit Profile')}
                  </Subtitle>
                </TouchableOpacity>
              ) : (
                <View>
                  {profileData && (
                    <FollowButton
                      userId={userId}
                      initialIsFollowing={!!profileData.is_following}
                      buttonStyle={{
                        borderRadius: 10,
                        borderColor: 'black',
                        borderWidth: 0,
                        padding: 8,
                        width: 130,
                        backgroundColor: '#0048ffff',
                        left: -50
                      }}
                      textStyle={{ fontSize: 11 }}
                      borderColor="#000000ff"
                      followColor="#0073ffff"
                      unfollowTextColor="#ffffffff"
                      followTextColor="#ffffffff"
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          <View style={styles.profileStatus}>
            <View style={styles.profileInformation}>
              <Title style={styles.count}>{formattedPostCount}</Title>
              <Subtitle style={styles.label}>{t('posts')}</Subtitle>
            </View>
            <View style={styles.profileInformation}>
              <TouchableOpacity
                onPress={() => navigation.navigate('FollowersScreen', { userId })}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Title style={styles.count}>{formattedFollowersCount}</Title>
                <Subtitle style={styles.label}>{t('followers')}</Subtitle>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInformation}>
              <TouchableOpacity
                onPress={() => navigation.navigate('FollowingScreen', { userId })}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Title style={styles.count}>{formattedFollowingCount}</Title>
                <Subtitle style={styles.label}>{t('following')}</Subtitle>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <BioSection />
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
    backgroundColor: '#ffff',
  },
  ProfileView: {
    backgroundColor: '#ffffffff',
    width: '92%',
    marginTop: 5,
    borderRadius: 50,
    padding: 1,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 88,
    width: 88,
    borderRadius: 100,
    borderColor: '#ffff',
    borderWidth: 2,
    backgroundColor: '#e0e0e0',
  },
  username: {
    position: 'absolute',
    marginLeft: '25%',
    fontSize: 15,
    marginTop: '9%',
    color: 'black'
  },

  buttonStyle: {
    marginTop: 20,
    position: 'absolute',
    marginLeft: '75%',
    borderRadius: 13,
    padding: 5,
  },
  profileStatus: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-around',
    padding: 16,
  },
  profileInformation: {
    alignItems: 'center',
    padding: 27,
    marginTop: -40,
  },
  label: {
    fontSize: 12,
    color: '#3A3B3C',
  },
  count: {
    fontSize: 14,
    padding: 5,
    color: 'black'
  },
  bioContainer: {
    marginTop: -10,
    maxWidth: 350,
  },
  biography: {
    fontSize: 13,
    color: 'black',
    lineHeight: 18,
  },
  seeMoreButton: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    color: '#666',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.5 }]
  },
  topMenuContainer: {
    backgroundColor: '#fff',
    paddingTop: 38,
    paddingBottom: 10,
  },
  topMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  topMenuTitle: {
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
    color: 'black'
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
