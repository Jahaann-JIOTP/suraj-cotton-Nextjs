"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Unit4Lt2 = ({ roundedData }) => {
  const router = useRouter();
  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 z-30 cursor-pointer bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>
      <div className="relative w-[1200px] h-full mx-auto">
        {/* Diagram Image */}
        <img
          src="../../../Unit-4-lt2-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />
        {/* Buttons */}
        {/* Meter Readings */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[230px] left-[64px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[230px] left-[270px] w-[51px] h-[57px]">
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
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[230px] left-[465px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[230px] left-[665px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[230px] left-[880px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        {/* <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[1050px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div> */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[342px] left-[169px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[342px] left-[370px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[342px] left-[570px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[342px] left-[770px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[342px] left-[970px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[70px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[280px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[480px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[675px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[875px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[540px] left-[1070px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[660px] left-[185px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[660px] left-[380px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[660px] left-[580px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center border-1 justify-around gap-[4px] z-40 top-[660px] left-[782px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[660px] left-[985px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt2;
