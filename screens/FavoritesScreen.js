import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import FastImage from 'expo-fast-image';
import ipconfig from "../config/ipconfig";
import ReelIcon from "../components/icons/reelIcon";
import ImageIcon from "../components/icons/ImageIcon";

const Post = ({ post }) => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 1) / 3;  

    if (!post.files?.length) return null;

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
                        style={[styles.media, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                        isLooping
                        useNativeControls={false}
                        cache={true}
                    />
                ) : (
                    <FastImage
                        source={{ uri: fileUri }}
                        style={[styles.media, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                        cache={true}
                    />
                )}
                <View style={styles.iconContainer}>
                    {isVideo ? 
                        <ReelIcon size={20} color="white" /> : 
                        <ImageIcon size={20} color="white" />
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
};

const FavoritesScreen = ({ posts }) => {
    const validPosts = posts?.filter(post => 
        post.id && post.id !== 0 && post.is_saved
    ) || [];

    if (validPosts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Saved Posts Yet</Text>
                <Text style={styles.emptyMessage}>
                    Posts you save will appear here for easy access
                </Text>
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
        padding: 1,
    },
    mediaContainer: {
        position: 'relative',
        aspectRatio: 1,
        margin: 0.25,
        height: 135,
    },
    media: {
        width: '100%',
        height: 135,
    },
    iconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#262626',
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default FavoritesScreen;