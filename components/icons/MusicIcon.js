import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AudioLinesIcon = ({ size = 24, color = 'currentColor' }) => {
  return (
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
      <Path d="M2 10v3" />
      <Path d="M6 6v11" />
      <Path d="M10 3v18" />
      <Path d="M14 8v7" />
      <Path d="M18 5v13" />
      <Path d="M22 10v3" />
    </Svg>
  );
};

export default AudioLinesIcon;
