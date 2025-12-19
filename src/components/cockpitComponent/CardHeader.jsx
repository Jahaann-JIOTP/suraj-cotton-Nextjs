import React from "react";

const CardHeader = ({
  title = "",
  activePower = "",
  powerFactor = 0,
  showPowerFactor = true,
  powerkWWidth = "32%",
  powerFactorWidth = "32%",
  totalPowerUnit = "kW",
}) => {
  return (
    <>
      <span className="font-inter py-3 text-[16px] font-semibold">{title}</span>

      <div className="flex w-full items-center justify-around py-3">
        <div
          className={`border border-[#D5AAFF] bg-[#F1E2FF]/40 dark:bg-[#F1E2FF]/10 text-[12px] py-[2px] text-[13px] text-black dark:text-white rounded flex items-center justify-center text-center`}
          style={{
            width: powerkWWidth,
          }}
        >
          {Number(activePower || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {totalPowerUnit}
        </div>
        {showPowerFactor && (
          <div
            className={`border border-[#67B7DC] bg-[#C5E4F6]/40 dark:bg-[#C5E4F6]/10 text-[12px] py-[2px] text-[13px] text-black dark:text-white  rounded flex items-center justify-center text-center`}
            style={{
              width: powerFactorWidth,
            }}
          >
            {Number(powerFactor || 0).toFixed(2)} PF
          </div>
        )}
      </div>
    </>
  );
};

export default CardHeader;
// [#D5AAFF] pink text
// [#67B7DC] blue text
