import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { useFonts } from 'expo-font';

const CaptionWithMore = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
  });

  const toggleText = useCallback(() => {
    const toValue = showFullText ? 0 : 1;
    setShowFullText(!showFullText);
    Animated.timing(animation, {
      toValue,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showFullText, animation]);

  if (!fontsLoaded || !description) return null;

  const animatedStyle = {
    maxHeight: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [45, 500],
      extrapolate: 'clamp',
    }),
  };

  return (
    <TouchableWithoutFeedback onPress={toggleText}>
      <View style={styles.container}>
        <Animated.Text
          style={[styles.caption, animatedStyle]}
          numberOfLines={showFullText ? undefined : 1}
          ellipsizeMode="tail"
        >
          {description}
        </Animated.Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: '100%',
    marginTop: -5,
    left: -15,
  },
  caption: {
    fontSize: 12.9,
    lineHeight: 20,
    color: '#262626',
    letterSpacing: 0.3,
    textAlign: 'left',
    fontFamily: 'Manrope',
  },
});

export default CaptionWithMore;
