import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Title, Subtitle } from '../components/ui/Typography';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="notifications-none" size={72} color="#aaa"  />
      <Title style={styles.title}>No Notifications</Title>
      <Subtitle style={styles.subtitle}>
        You're all caught up. Check back later for updates.
      </Subtitle>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    color: '#333',
    marginTop: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
});
