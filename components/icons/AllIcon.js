import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Tally4Icon = ({ size = 24, color = 'currentColor' }) => {
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
      <Path d="M4 4v16" />
      <Path d="M9 4v16" />
      <Path d="M14 4v16" />
      <Path d="M19 4v16" />
    </Svg>
  );
};

export default Tally4Icon;
