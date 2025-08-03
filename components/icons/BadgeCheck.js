import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BadgeCheck = ({ size = 18, color = '#0c0c0cff', strokeWidth = 1.8 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path 
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" 
      stroke={color} 
      strokeWidth={strokeWidth}
      fill={color} 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    <Path 
      d="m9 12 2 2 4-4" 
      stroke="#ffffffff"  // رنگ تیک سفید
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BadgeCheck;