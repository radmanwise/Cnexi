import React from "react";
import Svg, { Circle } from "react-native-svg";

const EllipsisVerticalIcon = ({ size = 24, color = "currentColor" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="1" />
      <Circle cx="12" cy="5" r="1" />
      <Circle cx="12" cy="19" r="1" />
    </Svg>
  );
};

export default EllipsisVerticalIcon;
