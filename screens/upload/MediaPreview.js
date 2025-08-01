import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Title } from '../../components/ui/Typography';

export default function MediaPreview({ media, onBack, onNext }) {
  return (
    <SafeAreaView style={styles.container}>
      {media.type === 'video' ? (
        <Video
          source={{ uri: media.uri }}
          style={styles.media}
          resizeMode="cover"
          shouldPlay
          isLooping
          isMuted
        />
      ) : (
        <Image
          source={{ uri: media.uri }}
          style={styles.media}
          resizeMode="cover"
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={onBack} style={styles.barButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          <Title style={styles.barText}>Back</Title>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNext} style={styles.barButton}>
          <Title style={styles.barText}>Next</Title>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', bottom: 80 },
  media: {
    width: '90%',
    aspectRatio: 3 / 4,
    borderRadius: 9,
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(68, 68, 68, 0.6)',
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  barButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
