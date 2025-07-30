import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useFonts } from 'expo-font';


const CaptionWithMore = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [textHeight] = useState(new Animated.Value(0));

  const [loaded] = useFonts({
    'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
  });


  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Manrope': require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);


  const handleToggleText = useCallback(() => {
    setShowFullText(prev => !prev);
    Animated.spring(textHeight, {
      toValue: showFullText ? 0 : 1,
      useNativeDriver: false,
      bounciness: 0,
      speed: 12,
    }).start();
  }, [showFullText, textHeight]);

  if (!loaded || !description) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.caption,
          {
            maxHeight: textHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [45, 500],
              extrapolate: 'clamp'
            })
          }
        ]}
        numberOfLines={showFullText ? undefined : 2}
        ellipsizeMode="tail"
      >
        {description}
      </Animated.Text>
      {description.length > 50 && (
        <TouchableOpacity
          onPress={handleToggleText}
          style={styles.moreButton}
          activeOpacity={0.7}
        >
          <Text style={styles.moreText}>
            {showFullText ? 'less' : 'more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
    fontSize: 13.5,
    lineHeight: 20,
    color: '#262626',
    letterSpacing: 0.3,
    textAlign: 'left',
    fontFamily: 'Manrope',
  },
  moreButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  moreText: {
    color: '#000',
    fontFamily: 'Manrope',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CaptionWithMore;