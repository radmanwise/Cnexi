import React from "react";
import Svg, { Polyline, Path } from "react-native-svg";

const ForwardIcon = ({ size = 24, color = "black" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="15 17 20 12 15 7" />
      <Path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </Svg>
  );
};

export default ForwardIcon;
