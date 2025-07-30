import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const UserIcon = ({ size = 24, color = 'currentColor' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 20a6 6 0 0 0-12 0" />
    <Circle cx={12} cy={10} r={4} />
    <Circle cx={12} cy={12} r={10} />
  </Svg>
);

export default UserIcon;
