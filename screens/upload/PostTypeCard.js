import React from 'react';
import { TouchableOpacity, ImageBackground, View, StyleSheet, Animated, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Title, Subtitle } from '../../components/ui/Typography';

export default function PostTypeCard({ item, onPress, scale, opacity }) {
  const isVideo = item.key === 'video' || item.key === 'reels';

  return (
    <Animated.View
      style={{
        width: 280,
        marginRight: 20,
        transform: [{ scale }],
        opacity,
      }}
    >
      <TouchableOpacity
        activeOpacity={item.disabled ? 1 : 0.9}
        style={[styles.card, item.disabled && { opacity: 0.5 }]}
        onPress={() => {
          if (item.disabled) {
            alert('Coming Soon');
            return;
          }
          onPress(item.key);
        }}
      >
        {isVideo ? (
          <Video
            source={require('../../assets/videos/VideoCover.mp4')}
            style={styles.card}
            resizeMode="cover"
            shouldPlay
            isMuted
            isLooping
          />
        ) : (
          <ImageBackground
            source={item.image}
            style={styles.card}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.cardOverlay}>
              <Ionicons name={item.icon} size={40} color="#fff" style={{ marginBottom: 10 }} />
              <Title style={styles.cardLabel}>{item.label}</Title>
              {item.disabled && (
                <Subtitle style={{ color: '#fff', marginTop: 6, fontSize: 13 }}>Coming Soon</Subtitle>
              )}
            </View>
          </ImageBackground>
        )}

        {isVideo && (
          <View style={[styles.cardOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
            <Ionicons name={item.icon} size={40} color="#fff" style={{ marginBottom: 10 }} />
            <Title style={styles.cardLabel}>{item.label}</Title>
            {item.disabled && (
              <Subtitle style={{ color: '#fff', marginTop: 6, fontSize: 13 }}>Coming Soon</Subtitle>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 500,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 22,
  },
});
