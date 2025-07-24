"use client";
import React, { useState } from "react";

import { ImArrowDown, ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U6_GW02",
    title: "Solar",
    top: 310,
    left: 209,
    ltScheme: "LT_3",
  },
  {
    link: "U20_GW03",
    title: "T/F 3",
    top: 310,
    left: 386,
    ltScheme: "LT_4",
  },
  {
    link: "U19_GW03",
    title: "T/F 4",
    top: 310,
    left: 657,
    ltScheme: "LT_4",
  },
  {
    link: "U17_GW03",
    title: "Solar 2",
    top: 310,
    left: 834,
    ltScheme: "LT_4",
  },
];
const InitialSldUnit5 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit5InitialSldMeterTAgs = [
    // Solar
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 320,
      left: 217.3,
    },
    // TF #3
    {
      activePowerTotalTag: roundedData?.U20_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW03_Voltage_Avg,
      top: 320,
      left: 394.4,
    },
    // TF #4
    {
      activePowerTotalTag: roundedData?.U19_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW03_Voltage_Avg,
      top: 320,
      left: 665.5,
    },
    // Solar 2
    {
      activePowerTotalTag: roundedData?.U17_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW03_Voltage_Avg,
      top: 320,
      left: 842.2,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`absolute top-0 right-0 z-30 flex items-center ${
          isHovered ? "justify-center" : "justify-start"
        } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
          isHovered ? "w-[90px]" : "w-[40px]"
        }`}
        style={{
          borderRadius: isHovered ? "8px" : "50%",
        }}
      >
        <ImArrowLeft2 className="text-white shrink-0" />
        <span
          className={`whitespace-nowrap transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          Back
        </span>
      </button>
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {unit4MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_5&lt_scheme=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`
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
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="./unit-5-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* lines */}
        <div className="absolute w-[2px] h-[125px] bg-black left-[790px] top-[420px]"></div>
        <div className="absolute w-[2px] h-[125px] bg-[#181818] left-[340.2px] top-[420px]"></div>
        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit5&area=lt1")}
          className="absolute top-[545px] left-[193px] w-[301px] h-[45px] cursor-pointer"
        ></button>
        <button
          onClick={() => router.push("/sld?unit=unit5&area=lt2")}
          className="absolute top-[545px] left-[642px] w-[300px] h-[45px] cursor-pointer"
        ></button>

        {/* Meter Readings */}
        {unit5InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center z-40 w-[58px] h-[59px]"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
          >
            <span className="meterReadingUnit4Lt2 mt-[-1px]">
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2 mt-[-1px]">
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2">
              {meter.activeVoltageAvgTag || "00.00"}
            </span>
          </div>
        ))}
        {/* LT1 Power House */}
      </div>
    </div>
  );
};

export default InitialSldUnit5;
