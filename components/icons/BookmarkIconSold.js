import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BookmarkIcon = ({ size = 24, color = "black" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
    <Path 
      d="M4 6C4 3.79086 5.79086 2 8 2H16C18.2091 2 20 3.79086 20 6V20.4648C20 21.3127 19.3127 22 18.4648 22C18.1617 22 17.8654 21.9103 17.6133 21.7422L13.1094 18.7396C12.4376 18.2917 11.5624 18.2917 10.8906 18.7396L6.38675 21.7422C6.13457 21.9103 5.83827 22 5.53518 22C4.68733 22 4 21.3127 4 20.4648V6Z" 
      stroke={color}
      strokeWidth="2.0"
    />
    <Path 
      d="M9 7.5H15" 
      stroke={color}
      strokeWidth="0" 
      strokeLinecap="round"
    />
  </Svg>
);

export default BookmarkIcon;
