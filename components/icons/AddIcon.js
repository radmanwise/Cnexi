import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const CirclePlusIcon = ({ size = 24, color = '#000', plusColor = '#4e4e4eff', strokeWidth = 1.7 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth='1.7'
  >
    <Circle cx={12} cy={12} r={10} fill='#ffffffff' />

    <Path d="M8 12h8" stroke={plusColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M12 8v8" stroke={plusColor} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export default CirclePlusIcon;
