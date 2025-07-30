import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HouseIconSolid = ({ size = 24, color = '#000' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 2.75c-.41 0-.81.14-1.13.4l-7 6A1.75 1.75 0 0 0 3 10v9.25c0 .97.78 1.75 1.75 1.75h14.5c.97 0 1.75-.78 1.75-1.75V10a1.75 1.75 0 0 0-.87-1.51l-7-6a1.75 1.75 0 0 0-1.13-.4zM10 21v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6h-4z"
      fill={color}
    />
  </Svg>
);

export default HouseIconSolid;
