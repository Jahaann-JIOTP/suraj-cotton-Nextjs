import CustomLoader from "@/components/customLoader/CustomLoader";
import React from "react";

const SingleValueDiv = ({ title, value, unit, valueColor = "", loading }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center  py-3 h-[5rem] lg:h-[4.2rem] lg:py-2 w-full border-t-3 border-[#1A68B2] rounded-md bg-white shadow-md dark:bg-gray-700`}
    >
      <span className="text-[15px] text-[#1A68B2] .font-raleway font-600">
        {title}
      </span>
      {loading === true ? (
        <CustomLoader size="32px" />
      ) : (
        <div className="flex gap-1 items-center">
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
      )}
    </div>
  );
};

export default SingleValueDiv;
