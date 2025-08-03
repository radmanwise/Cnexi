


import React from 'react';
import Svg, { Circle, Path } from "react-native-svg";

const MenuDotIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.6 }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Circle cx="12" cy="12" r="1" />
        <Circle  cx="19" cy="12" r="1" />
        <Circle cx="5" cy="12" r="1" />
    </Svg>
);

export default MenuDotIcon;
