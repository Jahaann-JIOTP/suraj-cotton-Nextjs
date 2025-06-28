"use client";
import React from "react";

import { ImArrowDown } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U19_PLC",
    top: 187,
    left: 110,
    ltScheme: "LT_1",
  },
  {
    link: "U21_PLC",
    top: 187,
    left: 262,
    ltScheme: "LT_1",
  },
  {
    link: "U17_GW01",
    top: 187,
    left: 848,
    ltScheme: "LT_2",
  },
  {
    link: "U23_GW01",
    top: 187,
    left: 1000,
    ltScheme: "LT_2",
  },
];
const InitialSldUnit4 = ({ roundedData }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-auto">
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {unit4MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/sld/${meter.link}?area=unit4&lt_scheme=${meter.ltScheme}&meter_id=${meter.link}`
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
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../unit-4-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit4&area=lt1")}
          className="absolute top-[360px] left-[208px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>
        <button
          onClick={() => router.push("/sld?unit=unit4&area=lt2")}
          className="absolute top-[360px] left-[949px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>

        {/* Meter Readings */}
        {/* LT1 Power House */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[116px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_PLC_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[270px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_PLC_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[857px]   w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_Voltage_Avg}
          </span>
        </div>
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[200px] left-[1008px]  w-[58px] h-[59px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_Voltage_Avg}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InitialSldUnit4;
