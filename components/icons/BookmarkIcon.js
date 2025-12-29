import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BookmarkIcon = ({ size = 19, color = 'currentColor' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 21L12 16.5L4 21V3H20V21Z" />
    </Svg>
  );
};

export default BookmarkIcon;
