import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import AntDesign from '@expo/vector-icons/AntDesign';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const BASE_URL = 'https://nexsocial.ir';
const EXPLORE_URL = `${BASE_URL}/post/explore/`;

const ReelsScreen = ({ post }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.postContainer}
            onPress={() => navigation.navigate('PostDetailScreen', { postId: post.id })}
        >
            {post.file.endsWith('.mp4') ? (
                <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: `${BASE_URL}/${post.file}` }} // تغییر به BASE_URL
                        style={styles.video}
                        resizeMode="cover"
                        isLooping
                        useNativeControls={false}
                    />
                    <MaterialIcons name="video-library" size={21} color="white" style={styles.videoIcon} />
                </View>
            ) : (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `${BASE_URL}/${post.file}` }} style={styles.postImage} />
                    <MaterialIcons name="image" size={21} color="white" style={styles.imageIcon} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);  // آدرس صفحه بعدی
    const [loadingMore, setLoadingMore] = useState(false);  // بارگذاری بیشتر

    const fetchPosts = async (url = `${BASE_URL}/post/`) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(prevPosts => [...prevPosts, ...data.results]);  // اضافه کردن پست‌های جدید به لیست قبلی
            setNextPageUrl(data.next);  // ذخیره آدرس صفحه بعدی
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);  // بارگذاری بیشتر به اتمام رسید
        }
    };

    useEffect(() => {
        fetchPosts();  // درخواست اولیه برای دریافت پست‌ها
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setPosts([]);  // پاک کردن پست‌های فعلی
        fetchPosts();  // رفرش کردن پست‌ها
    };

    const loadMorePosts = () => {
        if (nextPageUrl && !loadingMore) {  // اگر صفحه بعدی وجود داشت و بارگذاری در حال انجام نبود
            setLoadingMore(true);  // شروع به بارگذاری بیشتر
            fetchPosts(nextPageUrl);  // دریافت پست‌های صفحه بعد
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchButton}>
                <AntDesign name="search1" size={21} color="black" />
                <Text style={{ fontWeight: '500', color: 'gray' }}>Search post</Text>
            </View>
            <View style={{ marginTop: 10 }}></View>
            {posts.length === 0 ? (
                <Text style={styles.noPostsText}>No posts yet</Text>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <ReelsScreen post={item} />}
                    keyExtractor={item => item.id.toString()}
                    numColumns={3}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={loadMorePosts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="larg" color="gray" /> : null}
                    scrollEventThrottle={15}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={5}
                    removeClippedSubviews={true}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 56,
    },
    postContainer: {
        width: '33.55%',
        padding: 1.0,
        marginTop: -0.5,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
    video: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    noPostsText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    videoIcon: {
        position: 'absolute',
        left: 105,
        top: 9,
    },
    imageIcon: {
        position: 'absolute',
        left: 105,
        top: 9,
    },
    searchButton: {
        backgroundColor: '#e3e3e3',
        borderRadius: 12,
        padding: 9,
        width: '97%',
        flexDirection: 'row',
        gap: 8,
    }
});
