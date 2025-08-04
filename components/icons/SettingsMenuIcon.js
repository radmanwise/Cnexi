import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AlignRightIcon = ({ size = 24, color = 'black' }) => (
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
    <Path d="M21 12H9" />
    <Path d="M21 18H7" />
    <Path d="M21 6H3" />
  </Svg>
);

export default AlignRightIcon;
