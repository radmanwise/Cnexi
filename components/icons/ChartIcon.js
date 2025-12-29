import React from 'react';
import Svg, { Path } from 'react-native-svg';

const VerticalLinesIcon = ({ width = 30, height = 20, stroke = '#737373ff', strokeWidth = 1.6}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={strokeWidth}
    >
      <Path
        d="M12 3L12 21"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 7L17 21"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10L7 21"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default VerticalLinesIcon;
