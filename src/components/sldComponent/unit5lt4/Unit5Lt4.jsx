"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U1_PLC",
    title: "Transport",
    top: 213,
    left: 167,
  },
  {
    link: "U3_PLC",
    title: "Lighting Outside",
    top: 213,
    left: 358,
  },
  {
    link: "U5_PLC",
    title: "Power House",
    top: 211,
    left: 548,
  },
  {
    link: "U7_PLC",
    title: "Spare",
    top: 211,
    left: 738,
  },
  {
    link: "U9_PLC",
    title: "Winding 1",
    top: 211,
    left: 928,
  },
  {
    link: "U2_PLC",
    title: "Unit 5 aux",
    top: 320,
    left: 260,
  },
  {
    link: "U4_PLC",
    title: "Lighting Inside",
    top: 320,
    left: 449,
  },
  {
    link: "U6_PLC",
    title: "Turbine",
    top: 320,
    left: 643,
  },
  {
    link: "U8_PLC",
    title: "Drawing 1",
    top: 320,
    left: 833,
  },
  {
    link: "U10_PLC",
    title: "Ring 1",
    top: 552,
    left: 172,
  },
  {
    link: "U12_PLC",
    title: "Ring 6",
    top: 552,
    left: 360,
  },
  {
    link: "U14_PLC",
    title: "Compressor",
    top: 552,
    left: 551,
  },
  {
    link: "U16_PLC",
    title: "Compressor 2",
    top: 552,
    left: 740,
  },
  {
    link: "U11_PLC",
    title: "Ring 5",
    top: 657,
    left: 260,
  },
  {
    link: "U13_PLC",
    title: "Comber 1",
    top: 657,
    left: 450,
  },
  {
    link: "U15_PLC",
    title: "Simplex 1",
    top: 657,
    left: 640,
  },
  {
    link: "U17_PLC",
    title: "Ring AC",
    top: 657,
    left: 829,
  },
];

const Unit5Lt4 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit5Lt4MeterTags = [
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 218,
      left: 172,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 218,
      left: 362,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 217,
      left: 552.5,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 217,
      left: 743,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 218,
      left: 932,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 326,
      left: 265,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 326,
      left: 455,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 326,
      left: 648,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 326,
      left: 838,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 558,
      left: 176.5,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 558,
      left: 365,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 558,
      left: 555.5,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 558,
      left: 745,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 663.5,
      left: 265.5,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 663.5,
      left: 454.5,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 663.5,
      left: 644,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 664,
      left: 834,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.back()}
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

      <div className="relative w-[1200px] h-full mx-auto">
        {lt1MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_4&lt_scheme=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "72px",
              height: "67px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={`border-1 border-red-500`}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="./unit-5-lt4-sld.png"
          className="w-full h-full"
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {unit5Lt4MeterTags.map((meter, index) => (
          <div
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute border-1 border-red-500 z-20 w-[48px] h-[56px] flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1 mt-[-2.4px]">
              {roundedData?.U1_GW01_ActivePower_Total || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1.2px]">
              {roundedData?.U1_GW01_Current_Avg || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-2.5px]">
              {roundedData?.U1_GW01_Voltage_Avg || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt4;
