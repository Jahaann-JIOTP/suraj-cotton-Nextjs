"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U1_GW03",
    title: "Ring Frame 7-9",
    top: 213,
    left: 167,
  },
  {
    link: "U2_GW03",
    title: "Yarn conditioning M/C",
    top: 320,
    left: 260,
  },
  {
    link: "U3_GW03",
    title: "MLDB3 single room quarter",
    top: 213,
    left: 358,
  },
  {
    link: "U4_GW03",
    title: "Roving Transport System",
    top: 320,
    left: 449,
  },
  {
    link: "U5_GW03",
    title: "Ring Frame 10-12",
    top: 211,
    left: 548,
  },
  {
    link: "U6_GW03",
    title: "Comber MCS 1-14",
    top: 320,
    left: 643,
  },
  {
    link: "U7_GW03",
    title: "Spare",
    top: 211,
    left: 738,
  },
  {
    link: "U8_GW03",
    title: "Spare 2",
    top: 320,
    left: 833,
  },
  {
    link: "U9_GW03",
    title: "Ring Frame 13-15",
    top: 211,
    left: 928,
  },
  {
    link: "U10_GW03",
    title: "Auto con-linker conner M/S 10-12",
    top: 552,
    left: 172,
  },
  {
    link: "U11_GW03",
    title: "Baling Press",
    top: 657,
    left: 260,
  },
  {
    link: "U12_GW03",
    title: "Ring Frame 16-18",
    top: 552,
    left: 360,
  },
  {
    link: "U13_GW03",
    title: "Fiber Deposit Plant",
    top: 657,
    left: 450,
  },
  {
    link: "U14_GW03",
    title: "MLDB2 Ring con",
    top: 552,
    left: 551,
  },
  {
    link: "U15_GW03",
    title: "Deep Valve Turbine",
    top: 657,
    left: 640,
  },
  {
    link: "U16_GW03",
    title: "Transformer 2 LT-2 ACB",
    top: 552,
    left: 740,
  },
  {
    link: "U18_GW03",
    title: "PF panel",
    top: 657,
    left: 829,
  },
];

const Unit5Lt4 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit5Lt4MeterTags = [
    // ring frame 7-9
    {
      activePowerTotalTag: roundedData?.U1_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW03_Voltage_Avg,
      top: 218,
      left: 172,
    },
    // yarn conditioning m/c
    {
      activePowerTotalTag: roundedData?.U2_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW03_Voltage_Avg,
      top: 326,
      left: 265,
    },
    // ml db 3 single room quarter
    {
      activePowerTotalTag: roundedData?.U3_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW03_Voltage_Avg,
      top: 218,
      left: 362,
    },
    // roving transport system
    {
      activePowerTotalTag: roundedData?.U4_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW03_Voltage_Avg,
      top: 326,
      left: 455,
    },
    // ring frame 10-12
    {
      activePowerTotalTag: roundedData?.U5_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW03_Voltage_Avg,
      top: 217,
      left: 552.5,
    },
    // comber mcs 1-14
    {
      activePowerTotalTag: roundedData?.U6_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW03_Voltage_Avg,
      top: 326,
      left: 648,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U7_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW03_Voltage_Avg,
      top: 217,
      left: 743,
    },
    // sapre 2
    {
      activePowerTotalTag: roundedData?.U8_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW03_Voltage_Avg,
      top: 326,
      left: 838,
    },
    // ring frame 13-15
    {
      activePowerTotalTag: roundedData?.U9_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW03_Voltage_Avg,
      top: 218,
      left: 932,
    },
    // auto con linker conner m/s 10-12
    {
      activePowerTotalTag: roundedData?.U10_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW03_Voltage_Avg,
      top: 558,
      left: 176.5,
    },
    // baling press
    {
      activePowerTotalTag: roundedData?.U11_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW03_Voltage_Avg,
      top: 663.5,
      left: 265.5,
    },
    // ring frame 16-18
    {
      activePowerTotalTag: roundedData?.U12_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW03_Voltage_Avg,
      top: 558,
      left: 365,
    },
    // fiber deposit plant
    {
      activePowerTotalTag: roundedData?.U13_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW03_Voltage_Avg,
      top: 663.5,
      left: 454.5,
    },
    // mldb ring con
    {
      activePowerTotalTag: roundedData?.U14_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW03_Voltage_Avg,
      top: 558,
      left: 555.5,
    },
    // deep valve turbine
    {
      activePowerTotalTag: roundedData?.U15_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW03_Voltage_Avg,
      top: 663.5,
      left: 644,
    },
    // transformer 2 lt-2 acb
    {
      activePowerTotalTag: roundedData?.U16_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW03_Voltage_Avg,
      top: 558,
      left: 745,
    },
    // pf panel
    {
      activePowerTotalTag: roundedData?.U18_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW03_Voltage_Avg,
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
                `/meter?area=Unit_5&lt_scheme=LT_4&meter_id=${meter.link}&meter_name=${meter.title}`
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
            className={``}
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
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute z-20 w-[48px] h-[56px] flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1 mt-[-1px]">
              {meter.activePowerTotalTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1px]">
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 ">
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt4;
