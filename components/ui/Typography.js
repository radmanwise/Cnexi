
import { Text } from 'react-native';
import React from 'react';

export const Title = ({ children, style, ...props }) => (
  <Text style={[{ fontFamily: 'ManropeBold', fontSize: 20, color: 'white' }, style]} {...props}>
    {children}
  </Text>
);

export const Subtitle = ({ children, style, ...props }) => (
  <Text style={[{ fontFamily: 'ManropeMedium', fontSize: 16, color: 'white' }, style]} {...props}>
    {children}
  </Text>
);

export const Body = ({ children, style, ...props }) => (
  <Text style={[{ fontFamily: 'ManropeRegular', fontSize: 14, color: 'white' }, style]} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, style, ...props }) => (
  <Text style={[{ fontFamily: 'ManropeRegular', fontSize: 12, color: 'gray' }, style]} {...props}>
    {children}
  </Text>
);
