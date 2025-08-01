import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ipconfig from '../../config/ipconfig';
import * as SecureStore from 'expo-secure-store';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { Video } from 'expo-av';

const MAX_CAPTION_LENGTH = 2200;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function CaptionScreen({ route }) {
    const { media, mediaType } = route.params;
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [allowComments, setAllowComments] = useState(true);
    const [showLikes, setShowLikes] = useState(true);
    const [showStats, setShowStats] = useState(true);

    const navigation = useNavigation();
    const videoRef = useRef(null);

    const handleLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required for this feature.');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setIsLocationEnabled(true);
        } catch (error) {
            Alert.alert('Error', 'Could not access location');
        }
    };

    const compressMedia = async (uri) => {
        if (mediaType === 'video') return uri;

        try {
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1080 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            return result.uri;
        } catch (error) {
            throw new Error('Media compression failed');
        }
    };

    const handlePost = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');
            if (!token) throw new Error('Authentication required');
    
            const isVideo = mediaType === 'video';
            
            const fileFormData = new FormData();
            fileFormData.append('file', {
                uri: media.uri,
                type: isVideo ? 'video/mp4' : 'image/jpeg',
                name: `post_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`
            });
    
            const fileUploadResponse = await fetch(`${ipconfig.BASE_URL}file/upload/posts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: fileFormData
            });
    
            if (!fileUploadResponse.ok) {
                const errorText = await fileUploadResponse.text();
                console.error('Upload Error Response:', errorText);
                throw new Error(`File upload failed: ${errorText}`);
            }
    
            const fileData = await fileUploadResponse.json();
    
            const postFormData = new FormData();
            postFormData.append('files', fileData.id);
            postFormData.append('description', caption.trim());
            postFormData.append('post_type', isVideo ? 'reel' : 'post');
            const postResponse = await fetch(`${ipconfig.BASE_URL}post/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: postFormData
            });

            const postResponseText = await postResponse.text();

            if (postResponse.ok) {
                Alert.alert('Success', 'Post created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeScreen' }],
                            });
                        }
                    }
                ]);
            }
            else {
                throw new Error(`Post creation failed: ${postResponseText}`);
            }

        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Post</Text>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handlePost}
                        disabled={loading}
                    >
                        <Text style={[styles.postText, loading && styles.disabled]}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.mediaContainer}>
                        {media && (
                            mediaType === 'video' ? (
                                <Video
                                    ref={videoRef}
                                    source={{ uri: media.uri }}
                                    style={styles.media}
                                    resizeMode="cover"
                                    shouldPlay={false}
                                    isLooping
                                    useNativeControls
                                />
                            ) : (
                                <Image
                                    source={{ uri: media.uri }}
                                    style={styles.media}
                                    resizeMode="cover"
                                />
                            )
                        )}
                    </View>

                    <TextInput
                        style={styles.captionInput}
                        placeholder="Write a caption... (optional)"
                        placeholderTextColor="#666"
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                        maxLength={MAX_CAPTION_LENGTH}
                    />

                    <View style={styles.settingsContainer}>
                        <Text style={styles.settingsTitle}>Post Settings</Text>

                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => setAllowComments(!allowComments)}
                        >
                            <Text style={styles.settingText}>Turn off commenting</Text>
                            <View style={[styles.toggle, allowComments && styles.toggleActive]}>
                                <View style={[styles.toggleHandle, allowComments && styles.toggleHandleActive]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => setShowLikes(!showLikes)}
                        >
                            <Text style={styles.settingText}>Hide like count</Text>
                            <View style={[styles.toggle, showLikes && styles.toggleActive]}>
                                <View style={[styles.toggleHandle, showLikes && styles.toggleHandleActive]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => setShowStats(!showStats)}
                        >
                            <Text style={styles.settingText}>Hide view count</Text>
                            <View style={[styles.toggle, showStats && styles.toggleActive]}>
                                <View style={[styles.toggleHandle, showStats && styles.toggleHandleActive]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.locationButton}
                            onPress={handleLocation}
                        >
                            <Ionicons
                                name={isLocationEnabled ? "location" : "location-outline"}
                                size={24}
                                color={isLocationEnabled ? "#0095f6" : "#000"}
                            />
                            <Text style={styles.locationText}>
                                {isLocationEnabled ? "Location Added" : "Add Location"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#0095f6" />
                        <Text style={styles.uploadText}>
                            Uploading... {Math.round(uploadProgress)}%
                        </Text>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        top: 15,
    },
    headerButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    postText: {
        color: '#0095f6',
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
    mediaContainer: {
        aspectRatio: 1,
        backgroundColor: '#111',
        overflow: 'hidden',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    captionInput: {
        color: '#000',
        fontSize: 16,
        padding: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    locationText: {
        color: '#000',
        marginLeft: 12,
        fontSize: 16,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        color: '#000',
        marginTop: 16,
        fontSize: 16,
    },
    settingsContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    settingsTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingText: {
        color: '#000',
        fontSize: 16,
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e0e0e0',
        padding: 2,
    },
    toggleActive: {
        backgroundColor: '#0095f6',
    },
    toggleHandle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        transform: [{ translateX: 0 }],
    },
    toggleHandleActive: {
        transform: [{ translateX: 22 }],
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 12,
    },
    locationText: {
        color: '#000',
        marginLeft: 12,
        fontSize: 16,
    },
});