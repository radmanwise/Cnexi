import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg'; // G باید import شده باشد

const SIconUser = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={props.width || 50} // مقدار پیش‌فرض عرض
    height={props.height || 50} // مقدار پیش‌فرض ارتفاع
    {...props} // برای اینکه بتوانید از props دیگر هم استفاده کنید
  >
    <G> {/* استفاده از G به عنوان کامپوننت */}
      <Circle cx="256" cy="128" r="128" fill={props.color || '#000'} /> {/* رنگ پیش‌فرض */}
      <Path
        d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333 
        c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z"
        fill={props.color || '#000'} // رنگ پیش‌فرض
      />
    </G>
  </Svg>
);

export default SIconUser;
