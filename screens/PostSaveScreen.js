import React from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FastImage from 'expo-fast-image';
import ipconfig from "../config/ipconfig";

const Post = ({ post }) => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 1) / 3;  

    if (!post.files || post.files.length === 0) return null;

    const fileUri = `${ipconfig.BASE_URL}${post.files[0]}`;
    const isVideo = fileUri.endsWith('.mp4');

    return (
        <TouchableOpacity
            style={[styles.postContainer, { width: itemWidth }]}
            onPress={() => navigation.navigate('PostDetailScreen', { 
                postId: post.id, 
                postTitle: post.title, 
                postContent: post.content, 
                files: post.files 
            })}
        >
            <View style={[styles.mediaContainer, { width: itemWidth - 2 }]}>
                {isVideo ? (
                    <Video
                        source={{ uri: fileUri }}
                        style={[styles.video, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                        isLooping
                        useNativeControls={false}
                    />
                ) : (
                    <FastImage
                        source={{ uri: fileUri }}
                        style={[styles.postImage, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const PostSaveScreen = ({ posts }) => {
    const validPosts = posts?.filter(post => post.id && post.id !== 0 && post.is_saved === true) || [];

    if (validPosts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <MaterialCommunityIcons name="bookmark-outline" size={80} color="#DBDBDB" />
                    <Text style={styles.emptyTitle}>No Saved Posts</Text>
                    <Text style={styles.emptySubtitle}>
                        Posts you save will appear here
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={validPosts}
                renderItem={({ item }) => <Post post={item} />}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.flatListContainer}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListContainer: {
        paddingTop: 0.5,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
        gap: 0.1,
    },
    postContainer: {
        aspectRatio: 1,
        marginBottom: 0.9,
    },
    mediaContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: 0.25,
    },
    postImage: {
        flex: 1,
        aspectRatio: 1,
    },
    video: {
        flex: 1,
        aspectRatio: 1,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#262626',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default PostSaveScreen;