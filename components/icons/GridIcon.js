import React from "react";
import Svg, { Path } from "react-native-svg";

const GridIcon = ({ width = 32, height = 32, color = "#000" }) => {
  return (
    <Svg viewBox="0 0 21.00 21.00" xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" stroke={color} strokeWidth="1.323">
      <Path
        d="m9.5.5h4c.5522847 0 1 .44771525 1 1v4c0 .55228475-.4477153 1-1 1h-4c-.55228475 0-1-.44771525-1-1v-4c0-.55228475.44771525-1 1-1zm-8 0h4c.55228475 0 1 .44771525 1 1v4c0 .55228475-.44771525 1-1 1h-4c-.55228475 0-1-.44771525-1-1v-4c0-.55228475.44771525-1 1-1zm8 8h4c.5522847 0 1 .44771525 1 1v4c0 .5522847-.4477153 1-1 1h-4c-.55228475 0-1-.4477153-1-1v-4c0-.55228475.44771525-1 1-1zm-8 0h4c.55228475 0 1 .44771525 1 1v4c0 .5522847-.44771525 1-1 1h-4c-.55228475 0-1-.4477153-1-1v-4c0-.55228475.44771525-1 1-1z"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 3)"
      />
    </Svg>
  );
};

export default GridIcon;
