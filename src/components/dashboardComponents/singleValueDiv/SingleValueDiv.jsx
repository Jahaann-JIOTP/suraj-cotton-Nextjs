import React from "react";

const SingleValueDiv = ({ title, value, unit, height, valueColor = "" }) => {
  return (
    // <div
    //   className={`flex flex-col items-center justify-center  py-3 h-[5rem] lg:h-[${
    //     height > 0 ? height : "4"
    //   }rem]   lg:py-3 w-full border-t-3 border-[#1A68B2] rounded-md bg-white shadow-md dark:bg-gray-700`}
    // >
    <div
      className={`flex flex-col items-center justify-center  py-3 h-[5rem] lg:h-[${height}]   lg:py-3 w-full border-t-3 border-[#1A68B2] rounded-md bg-white shadow-md dark:bg-gray-700`}
    >
      <span className="text-[#3978A8] text-[16.34px] font-raleway font-600">
        {title}
      </span>
      <div className="flex items-center">
        <span
          className={`font-inter text-[20.24px]  font-500  dark:text-white`}
          style={{ color: valueColor.length > 0 ? valueColor : "" }}
        >
          {value}
        </span>
        <span
          className={`font-inter text-[20.24px] font-500 dark:text-white `}
          style={{ color: valueColor.length > 0 ? valueColor : "" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
};

export default SingleValueDiv;
