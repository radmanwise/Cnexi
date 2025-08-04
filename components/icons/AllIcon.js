import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const Grid3x3Icon = ({ size = 24, color = 'black' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect width="18" height="18" x="3" y="3" rx="2" />
    <Path d="M3 9h18" />
    <Path d="M3 15h18" />
    <Path d="M9 3v18" />
    <Path d="M15 3v18" />
  </Svg>
);

export default Grid3x3Icon;
