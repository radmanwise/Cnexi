import { useState, useEffect, useRef } from 'react';
import FollowButton from '../components/buttons/FollowButton';
import PostList from '../components/post/PostList';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import ipconfig from '../config/ipconfig';
import { Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Subtitle, Title, Body, Caption } from '../components/ui/Typography';
import MailIcon from '../components/icons/MailIcon';
import LocationIcon from '../components/icons/Location';
import LinkIcon from '../components/icons/LinkIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import SearchIcon from '../components/icons/SearchIcon'
import BagIcon from '../components/icons/BagIcon';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';


export default function OtherUserProfileScreen({ route }) {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState(null);
  const postsLoading = !profileData?.posts;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userId, setUserId] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [currentUserSlug, setCurrentUserSlug] = useState('');
  const profileImageRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const profileLoading = !profileData;
  const [loading, setLoading] = useState(true);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const BioSection = () => {
    const MAX_BIO_LENGTH = 60;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowFullBio(!showFullBio)}
        >
          <Body style={styles.biography} numberOfLines={showFullBio ? undefined : 3}>
            {showFullBio
              ? profileData?.bio
              : truncateText(profileData?.bio || '', MAX_BIO_LENGTH)}
          </Body>
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


  const Skeleton = ({ width, height, borderRadius = 6, style }) => (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
          marginVertical: 4,
        },
        style,
      ]}
    />
  );


  const imageUrl = profileData ? `${ipconfig.BASE_URL}/${profileData.picture}` : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.modalImage}
          />
        </TouchableOpacity>
      </Modal>

      <View style={styles.topMenuContainer}>
        <View style={styles.topMenuContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftButton}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <BagIcon size={24} color="#000000ff" />
            <Title style={styles.topMenuTitle}>
              painter
            </Title>
          </View>

          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => console.log('Search pressed')}
            >
              <SearchIcon name="magnify" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => console.log('More options pressed')}
            >
              <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
                <Image
                  ref={profileImageRef}
                  style={styles.profileImage}
                  source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                  onError={(e) =>
                    console.log('Image error:', e.nativeEvent.error)
                  }
                />
              </TouchableOpacity>

              <View style={styles.headerRight}>
                <Title style={styles.fullName}>{truncateText(profileData?.name || '', 12)}</Title>
              </View>

                <View style={styles.buttonStyle}>
                  {currentUserSlug && profileData?.username_i && currentUserSlug === profileData.username_i ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditProfile')}
                      style={{
                        borderRadius: 10,
                        padding: 5,
                        width: 100,
                        backgroundColor: '#e6e6e6ff',
                      }}
                    >
                      <Title
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          color: '#000',
                        }}
                      >
                        {t('Edit Profile')}
                      </Title>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.buttonMail}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('messageBtn')}
                        style={{
                          borderRadius: 50,
                          backgroundColor: '#e6e2e2b6',
                          padding: 8,
                        }}
                      ><MailIcon size={22} color="#000" /></TouchableOpacity>
                      {profileData && (
                        <FollowButton
                          userId={userId}
                          initialIsFollowing={!!profileData.is_following}
                          buttonStyle={{
                            borderRadius: 20,
                            borderColor: 'black',
                            width: 100,
                            backgroundColor: '#080808ff',
                            left: -15,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            height: 35,
                          }}
                          textStyle={{ fontSize: 12 }}
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
          </View>
          <View style={styles.profileInfo}>
            {profileLoading ? (
              <>
                <Skeleton width={120} height={14} style={{ marginTop: 8, left: 10 }} />
                <Skeleton width={220} height={14} style={{ marginTop: 8, left: 10 }} />
                <Skeleton width={180} height={14} style={{ marginTop: 8, left: 10 }} />
              </>
            ) : (
              <>
                <Body style={styles.username}>@{truncateText(profileData?.username_i || '', 20)}</Body>
                <BioSection />
                <View style={styles.Row}>
                  <LocationIcon size={20} color="#505050ff" />
                  <Body style={styles.location}>United States Of America</Body>
                </View>
                <View style={styles.Row}>
                  <LinkIcon size={20} color="#505050ff" />
                  <Body style={styles.link}>cnexisocailmedia.com</Body>
                </View>
                <View style={styles.Row}>
                  <CalendarIcon size={18} color="#505050ff" />
                  <Body style={styles.date}>Joined June 2023</Body>
                </View>
                <View style={styles.profileStatus}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FollowersScreen', { userId })}
                    style={styles.statusItem}
                  >
                    <Title style={styles.count}>{formattedFollowersCount}</Title>
                    <Body style={styles.label}>{t('Followers')}</Body>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('FollowingScreen', { userId })}
                    style={styles.statusItem}
                  >
                    <Title style={styles.count}>{formattedFollowingCount}</Title>
                    <Body style={styles.label}>{t('Following')}</Body>
                  </TouchableOpacity>
                    <Title style={styles.count}>{formattedPostCount}</Title>
                    <Body style={styles.label}>{t('posts')}</Body>
                </View>
              </>
            )}
          </View>
        </View>
        {postsLoading ? (
          <View style={{ padding: 10 }}>
            {[].map(i => (
              <Skeleton
                key={i}
                width="100%"
                height={150}
                style={{ marginBottom: 12 }}
              />
            ))}
          </View>
        ) : (
          <PostList posts={profileData?.posts || []} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
  },
  ProfileView: {
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 400,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 400,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerRight: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  fullName: {
    fontSize: 17,
    color: 'black',
  },
  buttonStyle: {
    gap: 10,
    marginTop: 8,
  },
  buttonMail: {
    flexDirection: 'row',
    gap: 20,
  },
  profileInfo: {
    alignItems: 'flex-start',
    left: 15,
    gap: 10,
  },
  username: {
    fontSize: 15,
    color: '#505050ff',
  },
  Row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#505050ff',
  },
  link: {
    fontSize: 14,
    color: '#016fffff',
  },
  date: {
    fontSize: 14,
    color: '#505050ff',
  },
  profileStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    paddingHorizontal: 1,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#505050ff',
  },
  biography: {
    fontSize: 15,
    color: 'black',
    lineHeight: 25,
    maxWidth: 300,
    overflow: 'hidden',
  },
  topMenuContainer: {
    backgroundColor: '#fff',
    paddingTop: 38,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  topMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButton: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5
  },
  topMenuTitle: {
    fontSize: 16,
    color: 'black',
    top: -2
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  moreButton: {
    padding: 5,
  },
});
