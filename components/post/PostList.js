import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';

const BASE_URL = 'https://nexsocial.ir/';

const Post = ({ post }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.postContainer}
            onPress={() => navigation.navigate('PostDetailScreen', { postId: post.id })}
        >
            {post.file.endsWith('.mp4') ? (
                <Video
                    source={{ uri: `${BASE_URL}/${post.file}` }}
                    style={styles.video}
                    resizeMode="cover"
                    isLooping
                    useNativeControls={false}
                />
            ) : (
                <Image source={{ uri: `${BASE_URL}/${post.file}` }} style={styles.postImage} />
            )}
        </TouchableOpacity>
    );
};

const PostList = ({ posts, fetchPosts }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    // بررسی اینکه داده‌ها خالی نباشند و همه پست‌ها id معتبر داشته باشند
    const validPosts = posts?.filter(post => post.id && post.id !== 0) || [];

    if (validPosts.length === 0) {
        return (
            <View style={styles.empty}>
                <LottieView
                    source={require('../../assets/empty.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
                <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={validPosts}  // فقط پست‌هایی که id معتبر دارند را نمایش می‌دهد
                renderItem={({ item }) => <Post post={item} />}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                contentContainerStyle={{ alignItems: 'flex-start' }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    postContainer: {
        width: 138,
        padding: 1.1,
        marginTop: -0.6,
        left: -1,
        justifyContent: 'space-between',
        alignItems: 'flex-start'

    },
    postImage: {
        width: '100%',
        height: 135,
    },
    video: {
        width: '100%',
        height: 135,
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
        color: 'black',
        textAlign: 'center',
        fontWeight: '600'
    },
    empty: {
        top: 0
    }
});
export default PostList;







