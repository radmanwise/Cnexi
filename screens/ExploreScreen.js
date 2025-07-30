import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import ipconfig from "../config/ipconfig";
import * as SecureStore from 'expo-secure-store';
import {
    View,
    FlatList,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

const ExploreItem = ({ post, isLarge }) => {
    const navigation = useNavigation();
    if (!post) return null;
    return (
        <TouchableOpacity
            style={[styles.itemContainer, isLarge && styles.largeItem]}
            onPress={() => navigation.navigate('PostDetail', { postId: post?.id })}
        >
            <Image
                source={{ uri: post?.image ? `${ipconfig.BASE_URL}/${post.image}` : '' }}
                style={[styles.media, isLarge && styles.largeMedia]}
                defaultSource={require('../assets/img/static/user.jpg')}
                onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
        </TouchableOpacity>
    );
};

const ExploreScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.empty}>
  
                <Text style={styles.emptyText}>
                    This page is under construction. Coming soon with a cool Telegram-style animation!
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        width: '33.33%',
        padding: 1,
        top: 40
    },
    largeItem: {
        width: '66.66%',
    },
    media: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
    largeMedia: {
        height: 200,
    },
    infoBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    title: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    username: {
        color: '#fff',
        fontSize: 11,
        marginTop: 2,
    },
    searchButton: {
        backgroundColor: '#efefef',
        borderRadius: 12,
        padding: 12,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        top: 35
    },
    searchText: {
        fontWeight: '500',
        color: '#666',
        fontFamily: 'Manrope'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
});

export default ExploreScreen;