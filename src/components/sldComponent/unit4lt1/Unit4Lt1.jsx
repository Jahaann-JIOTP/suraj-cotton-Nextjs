"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U1_PLC",
    title: "Transport",
    top: 301,
    left: 106,
  },
  {
    link: "U2_PLC",
    title: "Unit 5 aux",
    top: 370,
    left: 196,
  },
  {
    link: "U3_PLC",
    title: "Lighting Outside",
    top: 296,
    left: 285,
  },
  {
    link: "U4_PLC",
    title: "Lighting Inside",
    top: 370,
    left: 374,
  },
  {
    link: "U5_PLC",
    title: "Power House",
    top: 296,
    left: 464,
  },
  {
    link: "U6_PLC",
    title: "Turbine",
    top: 370,
    left: 566,
  },
  {
    link: "U7_PLC",
    title: "Spare",
    top: 301,
    left: 652,
  },
  {
    link: "U8_PLC",
    title: "Drawing 1",
    top: 370,
    left: 740,
  },
  {
    link: "U9_PLC",
    title: "Winding 1",
    top: 301,
    left: 838,
  },
  {
    link: "U10_PLC",
    title: "Ring 1",
    top: 370,
    left: 963,
  },
  {
    link: "U11_PLC",
    title: "Ring 5",
    top: 655,
    left: 104,
  },
  {
    link: "U12_PLC",
    title: "Ring 6",
    top: 585,
    left: 195,
  },
  {
    link: "U13_PLC",
    title: "Comber 1",
    top: 656,
    left: 283,
  },
  {
    link: "U14_PLC",
    title: "Compressor",
    top: 586,
    left: 373,
  },
  {
    link: "U15_PLC",
    title: "Simplex 1",
    top: 656,
    left: 462,
  },
  {
    link: "U16_PLC",
    title: "Compressor 2",
    top: 585,
    left: 552,
  },
  {
    link: "U17_PLC",
    title: "Ring AC",
    top: 655,
    left: 641,
  },
  {
    link: "U18_PLC",
    title: "Ring AC (Byparss)",
    top: 585,
    left: 740,
  },
  {
    link: "U20_PLC",
    title: "Compressor (Bypass)",
    top: 656,
    left: 839.5,
  },
];

const Unit4Lt1 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit4Lt1MeterTags = [
    // Transport
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 309,
      left: 112.5,
    },
    // Unit 5 Aux
    {
      activePowerTotalTag: roundedData?.U2_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_PLC_Voltage_Avg,
      top: 379,
      left: 203,
    },
    // Lighting Outside
    {
      activePowerTotalTag: roundedData?.U3_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_PLC_Voltage_Avg,
      top: 304,
      left: 291,
    },
    // Lighting Inside
    {
      activePowerTotalTag: roundedData?.U4_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_PLC_Voltage_Avg,
      top: 379,
      left: 381,
    },
    // Power House
    {
      activePowerTotalTag: roundedData?.U5_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_PLC_Voltage_Avg,
      top: 304,
      left: 470.5,
    },
    // Turbine
    {
      activePowerTotalTag: roundedData?.U6_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_PLC_Voltage_Avg,
      top: 379,
      left: 573,
    },
    // Spare
    {
      activePowerTotalTag: roundedData?.U7_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_PLC_Voltage_Avg,
      top: 309,
      left: 659,
    },
    // Drawing 1
    {
      activePowerTotalTag: roundedData?.U8_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_PLC_Voltage_Avg,
      top: 379,
      left: 746,
    },
    // Winding 1
    {
      activePowerTotalTag: roundedData?.U9_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_PLC_Voltage_Avg,
      top: 309,
      left: 845,
    },

    // Ring 1
    {
      activePowerTotalTag: roundedData?.U10_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_PLC_Voltage_Avg,
      top: 379,
      left: 970,
    },
    // Ring 5
    {
      activePowerTotalTag: roundedData?.U11_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_PLC_Voltage_BC,
      top: 664,
      left: 111,
    },
    // Ring 6
    {
      activePowerTotalTag: roundedData?.U12_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_PLC_Voltage_Avg,
      top: 594,
      left: 202,
    },
    // Comber 1
    {
      activePowerTotalTag: roundedData?.U13_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_PLC_Voltage_Avg,
      top: 664,
      left: 290,
    },
    // Compressor
    {
      activePowerTotalTag: roundedData?.U14_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_PLC_Voltage_BC,
      top: 594,
      left: 379,
    },
    // Simplex 1
    {
      activePowerTotalTag: roundedData?.U15_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_PLC_Voltage_Avg,
      top: 664,
      left: 468.5,
    },
    // Compressor 2
    {
      activePowerTotalTag: roundedData?.U16_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_PLC_Voltage_Avg,
      top: 594,
      left: 558.5,
    },
    // Ring AC
    {
      activePowerTotalTag: roundedData?.U17_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_PLC_Voltage_Avg,
      top: 664,
      left: 647,
    },
    // Ring AC (Bypass)
    {
      activePowerTotalTag: roundedData?.U18_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_PLC_Voltage_BC,
      top: 594,
      left: 747,
    },
    // Compressor (Bypass)
    {
      activePowerTotalTag: roundedData?.U20_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_PLC_Voltage_Avg,
      top: 664,
      left: 846,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld?unit=unit4")}
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
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../Unit-4-lt1-sld.png"
          className="w-full h-full"
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {unit4Lt1MeterTags.map((meter, index) => (
          <div
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute z-20 w-[46px] h-[50px] border-1 border-transparent flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1 mt-[-2.5px]">
              {meter.activePowerTotalTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-3.5px]">
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-2px]">
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit4Lt1;
