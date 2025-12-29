import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';

const CaptionWithMore = ({ description }) => {

  const [fontsLoaded] = useFonts({
    'Manrope': require('../../../assets/fonts/Manrope/Manrope-Medium.ttf'),
  });


  if (!fontsLoaded || !description) return null;

  return (
      <View style={styles.container}>
        <Text style={styles.caption}>
          {description}
        </Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: '100%',
    marginTop: -5,
    left: -33,
  },
  caption: {
    fontSize: 13.3,
    lineHeight: 20,
    color: '#000000ff',
    letterSpacing: 0.3,
    textAlign: 'left',
    fontFamily: 'Manrope',
  },
});

export default CaptionWithMore;
