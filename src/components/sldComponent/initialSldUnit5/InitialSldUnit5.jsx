"use client";
import React, { useState } from "react";

import { ImArrowDown, ImArrowLeft2 } from "react-icons/im";
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
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit5InitialSldMeterTAgs = [
    // LT1 Power House
    {
      activePowerTotalTag: roundedData?.U19_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_PLC_Voltage_Avg,
      top: 320,
      left: 217.3,
    },
    // wapda IC lt1
    {
      activePowerTotalTag: roundedData?.U21_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_PLC_Voltage_Avg,
      top: 320,
      left: 394.4,
    },
    // power house lt2
    {
      activePowerTotalTag: roundedData?.U7_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_PLC_Voltage_Avg,
      top: 320,
      left: 665.5,
    },
    // wapda IC lt2
    {
      activePowerTotalTag: roundedData?.U13_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_PLC_Voltage_Avg,
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
        {unit5InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center border-1 border-red-500 z-40 w-[58px] h-[59px]"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
          >
            <span className="meterReadingUnit4Lt2 mt-[-2px]">
              {roundedData?.U19_PLC_ActivePower_Total || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2 mt-[-1.5px]">
              {roundedData?.U19_PLC_Current_Avg || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2 mt-[-1px]">
              {roundedData?.U19_PLC_Voltage_Avg || "00.00"}
            </span>
          </div>
        ))}
        {/* LT1 Power House */}
      </div>
    </div>
  );
};

export default InitialSldUnit5;
