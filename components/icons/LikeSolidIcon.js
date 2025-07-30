import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ThumbsUpIconSolid = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10v12"
      fill={color}
    />
    <Path
      d="M15 5.88L14 10h5.83c1.3 0 2.2 1.25 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76c.73 0 1.39-.41 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
      fill={color}
    />
  </Svg>
);

export default ThumbsUpIconSolid;
