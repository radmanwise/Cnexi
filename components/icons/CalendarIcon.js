import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CalendarIcon = ({ size = 24, color = '#000', ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M3 9H21
         M7 3V5
         M17 3V5
         M6 13H8
         M6 17H8
         M11 13H13
         M11 17H13
         M16 13H18
         M16 17H18
         M6.2 21H17.8
         C18.9201 21 19.4802 21 19.908 20.782
         C20.2843 20.5903 20.5903 20.2843 20.782 19.908
         C21 19.4802 21 18.9201 21 17.8
         V8.2
         C21 7.07989 21 6.51984 20.782 6.09202
         C20.5903 5.71569 20.2843 5.40973 19.908 5.21799
         C19.4802 5 18.9201 5 17.8 5
         H6.2
         C5.0799 5 4.51984 5 4.09202 5.21799
         C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202
         C3 6.51984 3 7.07989 3 8.2
         V17.8
         C3 18.9201 3 19.4802 3.21799 19.908
         C3.40973 20.2843 3.71569 20.5903 4.09202 20.782
         C4.51984 21 5.07989 21 6.2 21Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CalendarIcon;
