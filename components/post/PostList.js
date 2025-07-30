import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import ipconfig from "../../config/ipconfig";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ReelIcon from "../../components/icons/reelIcon";
import ImageIcon from "../../components/icons/ImageIcon";
import FastImage from 'expo-fast-image';
import ImageOffIcon from '../../components/icons/ImageOffIcon';
import * as Font from 'expo-font';

const Post = React.memo(({ post }) => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 1) / 3;


    if (!post.files?.length) return null;
    const fileUri = `${ipconfig.BASE_URL}${post.files[0]}`;
    const fileType = fileUri.endsWith('.mp4') ? 'video' :
        fileUri.endsWith('.mp3') ? 'music' : 'image';

    const FileTypeIcon = {
        video: () => <ReelIcon size={20} color="white" />,
        music: () => <Ionicons name="musical-notes" size={20} color="white" />,
        image: () => <ImageIcon size={20} color="white" />
    };

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
                'ManropeBold': require('../../assets/fonts/Manrope/Manrope-Bold.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);


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
                {fileType === 'video' ? (
                    <Video
                        source={{ uri: fileUri }}
                        style={[styles.video, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                        isLooping
                        useNativeControls={false}
                        cache={true}
                    />
                ) : (
                    <FastImage
                        source={{ uri: fileUri }}
                        style={[styles.postImage, { width: itemWidth - 2 }]}
                        resizeMode="cover"
                        cache={true}
                    />
                )}
                <View style={styles.postType}>
                    {FileTypeIcon[fileType]()}
                </View>
            </View>
        </TouchableOpacity>
    );
});

const PostList = ({ posts, fetchPosts }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const postsPerPage = 12;


    const filters = [
        { id: 'all', icon: () => <Text style={styles.category}>Posts</Text> },
        { id: 'reels', icon: () => <Text style={styles.category}>Reels</Text> },
    ];

    const animatedValues = useRef(
        Object.fromEntries(filters.map(filter =>
            [filter.id, new Animated.Value(filter.id === 'all' ? 1 : 0)]
        ))
    ).current;

    const handleFilterPress = (filterId) => {
        Animated.timing(animatedValues[selectedFilter], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(animatedValues[filterId], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        setSelectedFilter(filterId);
    };
    const validPosts = React.useMemo(() =>
        posts?.filter(post => post.id && post.id !== 0) || [],
        [posts]
    );


    const filteredPosts = React.useMemo(() => {
        if (selectedFilter === 'all') return validPosts;

        return validPosts.filter(post => {
            if (!post.files?.[0]) return false;
            const fileUri = typeof post.files[0] === 'object'
                ? post.files[0].file
                : `${ipconfig.BASE_URL}/files/${post.files[0]}`;

            switch (selectedFilter) {
                case 'reels':
                    return fileUri.endsWith('.mp4');
                default:
                    return true;
            }
        });
    }, [validPosts, selectedFilter]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };



    const paginatedPosts = React.useMemo(() => {
        return filteredPosts.slice(0, page * postsPerPage);
    }, [filteredPosts, page, postsPerPage]);

    const loadMorePosts = React.useCallback(() => {
        if (!loading && paginatedPosts.length < filteredPosts.length) {
            setLoading(true);
            setPage(prev => prev + 1);
            setLoading(false);
        }
    }, [paginatedPosts.length, filteredPosts.length, loading]);



    const getItemLayout = React.useCallback((data, index) => ({
        length: Dimensions.get('window').width / 3,
        offset: (Dimensions.get('window').width / 3) * Math.floor(index / 3),
        index,
    }), []);

    const renderItem = React.useCallback(({ item }) => (
        <MemoizedPost post={item} key={item.id} />
    ), []);


    const keyExtractor = React.useCallback((item) => `post-${item.id}`, []);


    const MemoizedPost = React.memo(Post);



    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.filterContainer}>
                        {filters.map((filter) => (
                            <TouchableOpacity
                                key={filter.id}
                                style={styles.filterButton}
                                onPress={() => handleFilterPress(filter.id)}
                            >
                                <View style={styles.filterContent}>
                                    {filter.icon()}
                                    <Animated.View style={[
                                        styles.underline,
                                        {
                                            transform: [{
                                                scaleX: animatedValues[filter.id]
                                            }],
                                            opacity: animatedValues[filter.id]
                                        }
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                data={paginatedPosts}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                getItemLayout={getItemLayout}
                renderItem={renderItem}
                maxToRenderPerBatch={6}
                windowSize={5}
                initialNumToRender={12}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={true}
                onEndReachedThreshold={0.5}
                onEndReached={loadMorePosts}
                contentContainerStyle={styles.flatListContainer}
                columnWrapperStyle={styles.columnWrapper}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => loading && (
                    <View style={styles.loadingFooter}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                )}
                stickyHeaderIndices={[0]}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyContent}>
                            <View style={styles.IconContent}>
                                <ImageOffIcon size={40} color="#424242ff" />
                            </View>
                            <Text style={styles.emptyTitle}>No Posts Yet</Text>
                            <Text style={styles.emptySubTitle}>Start the conversation by sharing your first post!</Text>
                        </View>
                    </View>
                }
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

    mediaContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: 0.25,
    },
    postImage: {
        flex: 1,
        aspectRatio: 1,

    },
    postContainer: {
        width: '33%',
        padding: 0.1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        width: '100%',
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 4,
    },
    filterContent: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
        position: 'relative',
    },
    underline: {
        position: 'absolute',
        width: '40%',
        height: 3.5,
        backgroundColor: '#008CFF',
        borderRadius: 2,
        top: 30
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        top: 50,
    },
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 300,
        borderRadius: 8,
    },
    emptyTitle: {
        fontSize: 20,
        color: '#262626',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'ManropeBold',
    },
    emptySubTitle: {
        fontSize: 14,
        color: '#5c5c5cff',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'Manrope',
    },
    mediaContainer: {
        position: 'relative',
        width: '100%',
        height: 135,
    },
    postType: {
        position: 'absolute',
        top: 5,
        right: 18,
        padding: 5,
    },
    category: {
        fontFamily: 'Manrope',
        fontSize: 13,
    },
    IconContent: {
        backgroundColor: '#F1F1F1',
        borderRadius: 50,
        padding: 20
    }
});
export default PostList;