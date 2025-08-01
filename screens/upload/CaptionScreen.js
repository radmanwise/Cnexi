import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ipconfig from '../../config/ipconfig';
import * as SecureStore from 'expo-secure-store';
import * as ImageManipulator from 'expo-image-manipulator';
import { Title, Subtitle } from '../../components/ui/Typography';
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

export default function CaptionScreen({ route }) {
    const { media, mediaType } = route.params;
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [showLikes, setShowLikes] = useState(true);
    const [showStats, setShowStats] = useState(true);

    const navigation = useNavigation();
    const videoRef = useRef(null);

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
                name: `post_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`,
            });

            const fileUploadResponse = await fetch(`${ipconfig.BASE_URL}file/upload/posts/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: fileFormData,
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
                    Authorization: `Bearer ${token}`,
                },
                body: postFormData,
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
                        },
                    },
                ]);
            } else {
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={24} color="#222" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={handlePost} disabled={loading}>
                        <Title style={[styles.postText, loading && styles.disabled]}>Share</Title>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.mediaContainer}>
                        {media &&
                            (mediaType === 'video' ? (
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
                                <Image source={{ uri: media.uri }} style={styles.media} resizeMode="cover" />
                            ))}
                    </View>

                    <TextInput
                        style={styles.captionInput}
                        placeholder="Write a caption..."
                        placeholderTextColor="#999"
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                        maxLength={MAX_CAPTION_LENGTH}
                    />

                    <View style={styles.settingsContainer}>
                        <Title style={styles.settingsTitle}>Post Settings</Title>

                        <TouchableOpacity style={styles.settingRow} onPress={() => setAllowComments(!allowComments)}>
                            <Subtitle style={styles.settingText}>Turn off commenting</Subtitle>
                            <View style={[styles.switchTrack, allowComments && styles.switchTrackActive]}>
                                <View style={[styles.switchThumb, allowComments && styles.switchThumbActive]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingRow} onPress={() => setShowLikes(!showLikes)}>
                            <Subtitle style={styles.settingText}>Hide like count</Subtitle>
                            <View style={[styles.switchTrack, showLikes && styles.switchTrackActive]}>
                                <View style={[styles.switchThumb, showLikes && styles.switchThumbActive]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingRow} onPress={() => setShowStats(!showStats)}>
                            <Subtitle style={styles.settingText}>Hide view count</Subtitle>
                            <View style={[styles.switchTrack, showStats && styles.switchTrackActive]}>
                                <View style={[styles.switchThumb, showStats && styles.switchThumbActive]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Subtitle style={styles.uploadText}>Uploading...</Subtitle>
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
        top: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 0.3,
        borderBottomColor: '#d1d1d6',
        backgroundColor: '#ffffffff',
    },
    headerButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1c1c1e',
    },
    postText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    disabled: {
        opacity: 0.4,
    },
    content: {
        flex: 1,
    },
    mediaContainer: {
        aspectRatio: 1,
        backgroundColor: '#f2f2f7',
        borderRadius: 12,
        margin: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
    },
    media: {
        width: '100%',
        height: '100%',
    },
    captionInput: {
        fontSize: 14,
        color: '#1c1c1e',
        paddingHorizontal: 20,
        paddingVertical: 12,
        minHeight: 110,
        textAlignVertical: 'top',
        backgroundColor: '#f3f2f2ff',
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#d1d1d6',
    },
    settingsContainer: {
        marginTop: 24,
        marginHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 0.4,
        borderTopColor: '#d1d1d6',
    },
    settingsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1c1e',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    settingText: {
        fontSize: 15,
        color: '#3a3a3c',
    },
    switchTrack: {
        width: 40,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#e5e5ea',
        padding: 2,
    },
    switchTrackActive: {
        backgroundColor: '#007AFF',
    },
    switchThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#fff',
        transform: [{ translateX: 0 }],
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
    },
    switchThumbActive: {
        transform: [{ translateX: 18 }],
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(250, 250, 250, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        marginTop: 14,
        fontSize: 15,
        color: '#1c1c1e',
    },
});