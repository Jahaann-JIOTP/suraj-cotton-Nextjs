"use client";
import React, { useState } from "react";

import { ImArrowDown, ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U19_PLC",
    title: "Diesel IC",
    top: 187,
    left: 110,
    ltScheme: "LT_1",
  },
  {
    link: "U21_PLC",
    title: "Wapda IC",
    top: 187,
    left: 262,
    ltScheme: "LT_1",
  },
  {
    link: "U7_GW01",
    title: "Power House",
    top: 187,
    left: 848,
    ltScheme: "LT_2",
  },
  {
    link: "U13_GW01",
    title: "Wapda IC",
    top: 187,
    left: 1000,
    ltScheme: "LT_2",
  },
];
const InitialSldUnit4 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit4InitialSldMeterTAgs = [
    // diesel IC
    {
      activePowerTotalTag: roundedData?.U19_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_PLC_Voltage_Avg,
      top: 196,
      left: 116,
    },
    // wapda IC
    {
      activePowerTotalTag: roundedData?.U21_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_PLC_Voltage_Avg,
      top: 196,
      left: 270,
    },
    // power house
    {
      activePowerTotalTag: roundedData?.U7_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_PLC_Voltage_Avg,
      top: 198,
      left: 857,
    },
    // wapda IC
    {
      activePowerTotalTag: roundedData?.U13_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_PLC_Voltage_Avg,
      top: 198,
      left: 1008,
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
        {/* lines */}
        <div className="absolute w-[2.2px] h-[138px] bg-black left-[230.4px] top-[277px]"></div>
        <div className="absolute w-[2.2px] h-[138px] bg-black left-[970.3px] top-[277px]"></div>
        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit4&area=lt1")}
          className="absolute top-[414px] left-[76px] w-[311px] h-[45px] cursor-pointer"
        ></button>
        <button
          onClick={() => router.push("/sld?unit=unit4&area=lt2")}
          className="absolute top-[414px] left-[818px] w-[310px] h-[45px] cursor-pointer"
        ></button>

        {/* Meter Readings */}
        {unit4InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center z-40 w-[58px] h-[61px]"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
          >
            <span className="meterReadingUnit4Lt2 mt-[-1px]">
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2">
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2">
              {meter.activeVoltageAvgTag || "00.00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InitialSldUnit4;
