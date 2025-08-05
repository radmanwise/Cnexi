import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

const CastIcon = ({ size = 24, color = 'currentColor' }) => (
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
    <Path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
    <Path d="M2 12a9 9 0 0 1 8 8" />
    <Path d="M2 16a5 5 0 0 1 4 4" />
    <Line x1="2" y1="20" x2="2.01" y2="20" />
  </Svg>
);

export default CastIcon;
