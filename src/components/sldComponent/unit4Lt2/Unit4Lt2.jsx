"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Unit4Lt2 = ({ roundedData }) => {
  const router = useRouter();
  console.log("this data is come from uit 4 lt 1==========>", roundedData);
  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 cursor-pointer bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>
      <div className="relative w-[1200px] h-full mx-auto">
        {/* Diagram Image */}
        <img
          src="../../../unit-4-lt2-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />
        {/* Buttons */}
        {/* Meter Readings */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[8px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[216px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[424px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[634px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[842px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[1050px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[361px] left-[113px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[355px] left-[322px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[355px] left-[529px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[355px] left-[738px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[355px] left-[946px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[562px] left-[10px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[563px] left-[226px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[563px] left-[434px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[563px] left-[643px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[563px] left-[848px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[563px] left-[1055.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[685px] left-[125px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[685px] left-[333px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[685px] left-[542px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center border-1 justify-around gap-[4px] z-40 top-[685px] left-[750px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[685px] left-[958px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_A}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_AB}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt2;
