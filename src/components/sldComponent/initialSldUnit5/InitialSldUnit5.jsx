"use client";
import React from "react";

import { ImArrowDown } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U19_PLC",
    title: "Diesel IC",
    top: 310,
    left: 209,
    ltScheme: "LT_1",
  },
  {
    link: "U21_PLC",
    title: "Wapda IC",
    top: 310,
    left: 386,
    ltScheme: "LT_1",
  },
  {
    link: "U7_GW01",
    title: "Power House",
    top: 310,
    left: 657,
    ltScheme: "LT_2",
  },
  {
    link: "U13_GW01",
    title: "Wapda IC",
    top: 310,
    left: 834,
    ltScheme: "LT_2",
  },
];
const InitialSldUnit5 = ({ roundedData }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld")}
        className="absolute top-0 left-0 z-30 cursor-pointer bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {unit4MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_4&lt_scheme=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "91px",
              height: "80px",
              // backgroundColor: "transparent",
              zIndex: 100,
              borderRadius: "0.4.2rem", // rounded-md
              cursor: "pointer",
            }}
            className={`border-1 border-red-500`}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="./unit-5-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit5&area=lt1")}
          className="absolute top-[497px] left-[319px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>
        <button
          onClick={() => router.push("/sld?unit=unit5&area=lt2")}
          className="absolute top-[497px] left-[769px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>

        {/* Meter Readings */}
        {/* LT1 Power House */}
        {/* ////////////// Diesel IC lt1 /////////////// */}
        <div className="absolute flex flex-col items-center justify-around  border-1 border-red-500 z-40 top-[320px] left-[217.3px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////// wapda IC lt1 /////////////// */}
        <div className="absolute flex flex-col items-center justify-around pb-4 z-40 border-1 border-red-500 top-[320px] left-[394.2px] w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2 mt-[-2px]">
            {roundedData?.U21_PLC_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-1px]">
            {roundedData?.U21_PLC_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-0.5px]">
            {roundedData?.U21_PLC_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////// power house lt2 /////////////// */}
        <div className="absolute flex flex-col items-center justify-around pb-4 z-40 border-1 border-red-500 top-[320px] left-[665.5px] w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2 mt-[-2px]">
            {roundedData?.U7_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-1px]">
            {roundedData?.U7_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-0.5px]">
            {roundedData?.U7_GW01_Voltage_Avg || "00.00"}
          </span>
          {/* ////////////// wapda IC lt2 /////////////// */}
        </div>
        <div className="absolute flex flex-col items-center justify-around pb-4 z-40 border-1 border-red-500 top-[320px] left-[842.2px]  w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2 mt-[-2px]">
            {roundedData?.U13_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-1px]">
            {roundedData?.U13_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2 mt-[-0.5px]">
            {roundedData?.U13_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InitialSldUnit5;
