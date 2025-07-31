import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlayIcon = ({ size = 24, color = 'currentColor' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#ffff"
  >
    <Path
      d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlayIcon;
