import jwtDecode from 'jwt-decode';
import { useState, useEffect } from 'react';
import TopMenu from '../navigationbar/TopMenu';
import FollowButton from '../components/buttons/FollowButton';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PostList from '../components/post/PostList';
import * as SecureStore from 'expo-secure-store';
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Button,
    TouchableOpacity,
} from 'react-native';

import { useRoute } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';

export default function OtherProfileScreen() {
    const route = useRoute(); 
    const { username } = route.params;
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

    console.log('Username:', username);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                console.log(token)
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const profileResponse = await axios.get(`https://nexsocial.ir/profile/${username}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setProfileData(profileResponse.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Function to truncate text
    const truncateText = (str, maxLength) => {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    };

    const imageUrl = profileData?.picture ? `https://nexsocial.ir${profileData.picture}` : require('../assets/user.jpg');

    const isCurrentUser = profileData?.username === username;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
            <TouchableOpacity style={{ zIndex: 0, top: -20 }}>
                <Entypo name="dots-three-horizontal" size={24} color="black" />
            </TouchableOpacity>
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
                            <TouchableOpacity style={{
                                borderRadius: 13,
                                borderBlockColor: 'black',
                                borderWidth: 1.5,
                                padding: 8,
                                width: 130,
                                marginLeft: -60,
                                backgroundColor: 'black',
                            }}>
                                <Text style={{ fontWeight: 600, fontSize: 15, textAlign: 'center', color: '#fff', }}>Edit profile</Text>
                            </TouchableOpacity>
                        ) : (
                            <FollowButton 
                            userId={profileData.id} 
                            isFollowing={profileData.isFollowing} 
                          />
                        )}
                    </View>
                </View>

                <View style={styles.profileStatus}>
                    <View style={styles.profileInformation}>
                        <Text style={styles.count}>{profileData?.post_count|| 0}</Text>
                        <Text style={styles.label}>{t('posts')}</Text>
                    </View>
                    <View style={styles.profileInformation}>
                        <Text style={styles.count}>{profileData?.followers_count || 0}</Text>
                        <Text style={styles.label}>{t('followers')}</Text>
                    </View>
                    <View style={styles.profileInformation}>
                        <Text style={styles.count}>{profileData?.following_count || 0}</Text>
                        <Text style={styles.label}>{t('following')}</Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.biography}>{profileData?.bio}</Text>
                </View>

                <View style={{ marginTop: 18, height: 0.8, backgroundColor: '#e1e1e1', width: '90%' }} />
            </View>
            <PostList posts={profileData.posts} />
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
        backgroundColor: '#efefef',
        width: '92%',
        marginTop: -5,
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
    FollowButton: {
        backgroundColor: 'black',
        borderRadius: 12,
        height: 39,
        width: 130,
        paddingLeft: 29,
        paddingTop: 8,
        marginTop: 24,
        marginLeft: -41,
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
        fontWeight: '500',
        color: '#3A3B3C',
    },
    count: {
        fontSize: 16,
        fontWeight: '600',
        padding: 5,
    },
    biography: {
        marginTop: -25,
        maxWidth: 300,
        fontSize: 14,
    },
});