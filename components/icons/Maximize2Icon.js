import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Maximize2Icon = ({ size = 24, color = 'black', ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M15 3h6v6" />
    <Path d="m21 3-7 7" />
    <Path d="m3 21 7-7" />
    <Path d="M9 21H3v-6" />
  </Svg>
);

export default Maximize2Icon;
