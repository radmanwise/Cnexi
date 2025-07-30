import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const CircleUserRoundSolid = ({ size = 24, color = '#000', faceColor = '#fff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    {/* Outer Circle */}
    <Path
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10
         10-4.477 10-10S17.523 2 12 2z"
      fill={color}
    />

    {/* Head */}
    <Path
      d="M12 7c-1.656 0-3 1.343-3 3s1.344 3 3 3
         3-1.343 3-3-1.344-3-3-3z"
      fill={faceColor}
    />

    {/* Body */}
    <Path
      d="M6.5 18.5c.5-2.5 2.8-4.5 5.5-4.5s5 2 5.5 4.5c.1.6-.3 1.1-.9 1.1H7.4c-.6 0-1-.5-.9-1.1z"
      fill={faceColor}
    />

    {/* Bottom white fill to cover curved gap */}
    <Rect x="2" y="19.5" width="20" height="3" fill={faceColor} />
  </Svg>
);

export default CircleUserRoundSolid;
