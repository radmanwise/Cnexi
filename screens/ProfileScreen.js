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
  RefreshControl
} from 'react-native';
import ipconfig from '../config/ipconfig';
import * as Font from 'expo-font';
import { Animated } from 'react-native';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userId, setUserId] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);


  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const BioSection = () => {
    const bioText = profileData?.bio || '';
    const MAX_BIO_LENGTH = 60;
    const shouldShowButton = bioText.length > MAX_BIO_LENGTH;

    return (
      <View style={styles.bioContainer}>
        <Text style={styles.biography}>
          {showFullBio ? bioText : truncateText(bioText, MAX_BIO_LENGTH)}
        </Text>
        {shouldShowButton && (
          <TouchableOpacity onPress={toggleBio} style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>
              {showFullBio ? 'See Less' : 'See More'}
            </Text>
          </TouchableOpacity>
        )}
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

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../assets/fonts/Manrope/Manrope-Medium.ttf'),
        'ManropeBold': require('../assets/fonts/Manrope/Manrope-Bold.ttf'),
        'ManropeSemiBold': require('../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

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
        return;
      }

      const userResponse = await axios.get(`${ipconfig.BASE_URL}/api/v1/user/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const fetchedUserId = userResponse.data.user.id;
      setUserId(fetchedUserId);

      const username = userResponse.data.user.username;
      const profileResponse = await axios.get(`${ipconfig.BASE_URL}/profile/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setProfileData(profileResponse.data);
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

  const isCurrentUser = profileData?.slug === username;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
      <TopMenu />
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
            <Image
              style={styles.profileImage}
              source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
              onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
            />

            <Text style={styles.username}>{truncateText(profileData?.username_i || 'username', 12)}</Text>

            <View style={styles.buttonStyle}>
              {isCurrentUser ? (
                <FollowButton userId={userId} initialIsFollowing={profileData?.is_following} onFollowChange={handleFollowChange} />
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile', { username: profileData?.username_i })}
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
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 12,
                      textAlign: 'center',
                      color: '#000',
                      fontFamily: 'ManropeSemiBold',
                    }}
                  >
                    {t('Edit Profile')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.profileStatus}>
            <View style={styles.profileInformation}>
              <Text style={styles.count}>{formattedPostCount}</Text>
              <Text style={styles.label}>{t('posts')}</Text>
            </View>
            <View style={styles.profileInformation}>
              <TouchableOpacity
                onPress={() => navigation.navigate('FollowersScreen', { userId })}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.count}>{formattedFollowersCount}</Text>
                <Text style={styles.label}>{t('followers')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInformation}>
              <TouchableOpacity
                onPress={() => navigation.navigate('FollowingScreen', { userId })}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.count}>{formattedFollowingCount}</Text>
                <Text style={styles.label}>{t('following')}</Text>
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
    backgroundColor: '#f9f9f9',
    width: '92%',
    marginTop: 15,
    borderRadius: 50,
    padding: 1,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: 'black',
  },
  username: {
    position: 'absolute',
    marginLeft: '25%',
    fontSize: 15,
    fontWeight: '500',
    marginTop: '9%',
    fontFamily: 'ManropeSemiBold'
  },
  profileImage: {
    height: 88,
    width: 88,
    borderRadius: 100,
    borderColor: '#ffff',
    borderWidth: 2,

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
    marginTop: -25,
    maxWidth: 360,
  },
  biography: {
    fontSize: 13,
    fontFamily: 'Manrope',
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
  }
});
