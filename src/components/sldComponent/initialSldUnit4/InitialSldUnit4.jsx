"use client";
import React from "react";
import Link from "next/link";

import { ImArrowDown } from "react-icons/im";
import { useRouter } from "next/navigation";

const InitialSldUnit4 = ({ roundedData }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-auto">
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {/* Diagram Image */}
        <img
          src="../../../unit-4-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit4&area=lt1")}
          className="absolute top-[362px] left-[188.5px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>
        <button
          onClick={() => router.push("/sld?unit=unit4&area=lt2")}
          className="absolute top-[362px] left-[954px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>

        {/* Meter Readings */}
        {/* LT1 Power House */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[116px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[270px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[857px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[1008px]  w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg}
          </span>
        </div>

        {/* <div className="meterReadingUnit4 absolute top-[190.5px] left-[1025.3px]">
          1228
        </div>
        <div className="meterReadingUnit4 absolute top-[211px] left-[1025.3px]">
          1398
        </div>
        <div className="meterReadingUnit4 absolute top-[233px] left-[1025.3px]">
          1572
        </div> */}
      </div>
    </div>
  );
};

export default InitialSldUnit4;
