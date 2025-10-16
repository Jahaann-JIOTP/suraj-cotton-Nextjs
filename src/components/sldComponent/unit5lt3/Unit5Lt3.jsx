"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
import Link from "next/link";
const lt1MeterData = [
  {
    link: "U5_GW02",
    title: "PF Panel",
    top: 206,
    left: 95,
  },
  {
    link: "U7_GW02",
    title: "Ring 1-3",
    top: 303,
    left: 183,
  },
  {
    link: "U8_GW02",
    title: "A/C Plant spinning",
    top: 206,
    left: 270,
  },
  {
    link: "U9_GW02",
    title: "Blow Room L1",
    top: 303,
    left: 358,
  },
  {
    link: "U10_GW02",
    title: "Ring Frames 4-6",
    top: 206,
    left: 446,
  },
  {
    link: "U11_GW02",
    title: "A/C Plant Blowing",
    top: 303,
    left: 536,
  },
  {
    link: "U12_GW02",
    title: "MLDB1 Blow Room card",
    top: 206,
    left: 648,
  },
  {
    link: "U14_GW02",
    title: "Comber MCS 1-14",
    top: 310,
    left: 769,
  },
  {
    link: "U15_GW02",
    title: "AC Return Fan",
    top: 210,
    left: 901,
  },
  {
    link: "U16_GW02",
    title: "Water Chiller",
    top: 501,
    left: 95,
  },
  {
    link: "U17_GW02",
    title: "Card M/C 8-14",
    top: 606,
    left: 183,
  },
  {
    link: "U18_GW02",
    title: "Auto Con 1-9",
    top: 501,
    left: 270,
  },
  {
    link: "U19_GW02",
    title: "Card M/C 1-7",
    top: 606,
    left: 358,
  },
  {
    link: "U20_GW02",
    title: "AC Plant Winding",
    top: 501,
    left: 446,
  },
  {
    link: "U21_GW02",
    title: "Simplex M/C 1~6+1~5 Breaker Machines",
    top: 606,
    left: 536,
  },
  {
    link: "U22_GW02",
    title: "Spare 2",
    top: 501,
    left: 623,
  },
  {
    link: "U23_GW02",
    title: "Draw Frame Finish 1~8",
    top: 606,
    left: 712,
  },
];

const Unit5Lt3 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unitl5Lt3MeterTags = [
    // ring 1-3
    {
      activePowerTotalTag: roundedData?.U7_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW02_Voltage_Avg,
      top: 305,
      left: 151,
    },
    // Ac Supply fan
    {
      activePowerTotalTag: roundedData?.U8_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW02_Voltage_Avg,
      top: 209,
      left: 238,
    },
    // blow room l1
    {
      activePowerTotalTag: roundedData?.U9_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW02_Voltage_Avg,
      top: 305,
      left: 323,
    },
    // ring frames 4-6
    {
      activePowerTotalTag: roundedData?.U10_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW02_Voltage_Avg,
      top: 209,
      left: 410,
    },
    // a/c plant blowing
    {
      activePowerTotalTag: roundedData?.U11_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW02_Voltage_Avg,
      top: 305,
      left: 498,
    },
    // mldb1 blower room card
    {
      activePowerTotalTag: roundedData?.U12_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW02_Voltage_Avg,
      top: 209,
      left: 609,
    },
    // comber 1 to 14
    {
      activePowerTotalTag: roundedData?.U14_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW02_Voltage_Avg,
      top: 311,
      left: 728,
    },
    // ac plant spining
    {
      activePowerTotalTag: roundedData?.U15_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW02_Voltage_Avg,
      top: 214,
      left: 858,
    },
    // water chiller
    {
      activePowerTotalTag: roundedData?.U16_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW02_Voltage_Avg,
      top: 500,
      left: 169,
    },
    // card mc 8-14
    {
      activePowerTotalTag: roundedData?.U17_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW02_Voltage_Avg,
      top: 603,
      left: 256,
    },
    // card m/c 8-14
    {
      activePowerTotalTag: roundedData?.U18_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW02_Voltage_Avg,
      top: 499,
      left: 342,
    },
    // auto con-link corner 1-9
    {
      activePowerTotalTag: roundedData?.U19_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW02_Voltage_Avg,
      top: 603,
      left: 429,
    },
    // card mc 1-7
    {
      activePowerTotalTag: roundedData?.U20_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW02_Voltage_Avg,
      top: 499,
      left: 515,
    },
    // AC plant winding
    {
      activePowerTotalTag: roundedData?.U21_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW02_Voltage_Avg,
      top: 603,
      left: 604,
    },

    // simplex m/c s1-5
    {
      activePowerTotalTag: roundedData?.U22_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW02_Voltage_Avg,
      top: 499,
      left: 690,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U23_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW02_Voltage_Avg,
      top: 603,
      left: 777.5,
    },
  ];

  return (
    <div className="w-full">
      {/* back button */}
      <button
        onClick={() => router.push("/sld?area=Unit_5")}
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

      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {lt1MeterData.map((meter) => (
          <Link
            href={`/meter?area=Unit_5&page-type=sld&LT_selections=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`}
            key={meter.link}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "69px",
              height: "63px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="./sld/unit5lt1-new.png"
          className=" h-full"
          style={{ width: "1100px" }}
          alt="unit 5 lt3 sld"
        />
        {/* Meter Readings */}
        {unitl5Lt3MeterTags.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{
              left: meter.left,
              top: meter.top,
              height: "51px",
              width: "43px",
            }}
          >
            <span
              className="text-[11.5px] mt-[0px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11.5px] mt-[0px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11.5px] mt-[0px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt3;
