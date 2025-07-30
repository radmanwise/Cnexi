
import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';

const ImageOffIcon = ({ size = 20, color = 'gray' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="13.5" y1="13.5" x2="6" y2="21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="18" y1="12" x2="21" y2="15" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 15V5a2 2 0 0 0-2-2H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default ImageOffIcon;
