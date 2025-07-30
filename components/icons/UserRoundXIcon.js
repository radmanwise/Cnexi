import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const UserRoundXIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 21a8 8 0 0 1 11.873-7" />
    <Circle cx="10" cy="8" r="5" />
    <Path d="M17 17l5 5" />
    <Path d="M22 17l-5 5" />
  </Svg>
);

export default UserRoundXIcon;
