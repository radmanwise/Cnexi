import { Animated } from 'react-native';

const animValue = new Animated.Value(0);

Animated.sequence([
  Animated.spring(animValue, {
    toValue: 1,
    useNativeDriver: true,
  }),
  Animated.timing(animValue, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }),
]).start();
