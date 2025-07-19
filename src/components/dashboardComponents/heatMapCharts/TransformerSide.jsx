import React from "react";

const TransformerSide = ({
  transformerReading,
  nxtMaintenance,
  remainingHrs,
  traffoTemp,
  losses,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      <div className="w-[100px] relative">
        <div className="text-green-400 text-[11px] absolute w-[48px] h-[16px]  top-[45px] left-[25px] flex items-center justify-center">
          {transformerReading}
        </div>
        <img
          src="../../../heatmapTransformer.png"
          className="w-[110px]"
          alt=""
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-raleway font-500 text-center text-[11px]">
          Nxt. Maintenance Hrs
        </span>
        <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
          {nxtMaintenance}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-raleway font-500 text-[11px]">Remaining Hrs</span>
        <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
          {remainingHrs}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-raleway font-500 text-[11px]">Traffo Temp.</span>
        <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
          {traffoTemp} °C
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-raleway font-500 text-[11px]">% Losses</span>
        <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
          {losses} %
        </div>
      </div>
    </div>
  );
};

export default TransformerSide;
