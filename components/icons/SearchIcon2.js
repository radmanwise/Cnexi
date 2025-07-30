import React from "react";
import Svg, { Path } from "react-native-svg";

const SearchIcon2 = ({ size = 24, color = "black" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      fill="none"
      width={size}
      height={size}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </Svg>
  );
};

export default SearchIcon2;
