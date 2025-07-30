import React, { useRef, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from '@expo/vector-icons';

const VideoPreview = ({ selectedMedia, onConfirm, onRemove }) => {
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            <Video
                ref={videoRef}
                source={{ uri: selectedMedia.uri }}
                style={styles.video}
                resizeMode="contain"
                isLooping
                shouldPlay={false}
                isMuted={isMuted}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                onPlaybackStatusUpdate={setStatus}
            />

            <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={status.durationMillis || 1}
                value={status.positionMillis || 0}
                onSlidingComplete={(value) => videoRef.current.seekAsync(value)}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#555"
                thumbTintColor="#fff"
            />


            <View style={styles.controls}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        status.isPlaying
                            ? videoRef.current.pauseAsync()
                            : videoRef.current.playAsync()
                    }
                >
                    <Icon name={status.isPlaying ? "pause" : "play"} color="#fff" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsMuted(!isMuted)}
                >
                    <Icon name={isMuted ? "volume-mute" : "volume-high"} color="#fff" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => videoRef.current.presentFullscreenPlayer()}
                >
                    <Icon name="fullscreen" color="#fff" size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
                    <MaterialIcons name="crop" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
                    <MaterialIcons name="edit" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
                    <MaterialIcons name="filter" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.delete]} onPress={onRemove}>
                    <Icon name="delete" color="#fff" size={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#000",
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        top: 200
    },
    video: {
        width: "100%",
        aspectRatio: 20 / 25,
        borderRadius: 10,
        backgroundColor: "#000",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    progressBar: {
        width: "100%",
        height: 30,
        marginTop: 10,
    },
    controls: {
        flexDirection: "row",
        marginTop: 12,
        gap: 12,
    },
    button: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#444",
    },
    delete: {
        backgroundColor: "#e63946",
    },
    confirm: {
        backgroundColor: "#444",
    },
});

export default VideoPreview;
