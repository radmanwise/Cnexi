import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const options = [
  { type: 'photo', label: 'Photo', icon: 'image' },
  { type: 'video', label: 'Video', icon: 'video' },
  { type: 'reels', label: 'Reel', icon: 'movie-open' },
  { type: 'story', label: 'Story', icon: 'clock-outline' },
];

export default function PostTypeSelector({ currentType, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {options.map(({ type, label, icon }) => (
        <TouchableOpacity
          key={type}
          onPress={() => onSelect(type)}
          style={[
            styles.option,
            currentType === type && styles.activeOption
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={currentType === type ? '#fff' : '#555'}
          />
          <Text style={[styles.label, currentType === type && styles.activeLabel]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#e6e6e6',
    marginHorizontal: 8,
    width: 80,
  },
  activeOption: {
    backgroundColor: '#0095f6',
  },
  label: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
