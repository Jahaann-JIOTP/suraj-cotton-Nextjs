import React from "react";

const CardHeader = ({ title = "", activePower = "", powerFactor = "" }) => {
  return (
    <>
      <span className="font-inter py-3 text-[16px] font-semibold">{title}</span>
      <div className="flex w-full items-center justify-around py-3">
        <div className="border border-[#D5AAFF] bg-[#F1E2FF]/40 dark:bg-[#F1E2FF]/10 text-[12px] py-[2px] text-[13px] text-black dark:text-white w-[32%] rounded flex items-center justify-center text-center">
          {Number(activePower).toFixed(2)} kW
        </div>
        <div className="border border-[#67B7DC] bg-[#C5E4F6]/40 dark:bg-[#C5E4F6]/10 text-[12px] py-[2px] text-[13px] text-black dark:text-white w-[32%] rounded flex items-center justify-center text-center">
          {Number(powerFactor).toFixed(2)} PF
        </div>
      </div>
    </>
  );
};

export default CardHeader;
// [#D5AAFF] pink text
// [#67B7DC] blue text
