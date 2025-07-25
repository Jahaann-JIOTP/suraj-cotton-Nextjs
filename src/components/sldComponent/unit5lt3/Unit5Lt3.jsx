"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U5_GW02",
    title: "PF Panel",
    top: 224,
    left: 172,
  },
  {
    link: "U7_GW02",
    title: "Ring 1-3",
    top: 330,
    left: 268,
  },
  {
    link: "U8_GW02",
    title: "A/C Plant spinning",
    top: 224,
    left: 363,
  },
  {
    link: "U9_GW02",
    title: "Blow Room L1",
    top: 330,
    left: 457,
  },
  {
    link: "U10_GW02",
    title: "Ring Frames 4-6",
    top: 224,
    left: 553,
  },
  {
    link: "U11_GW02",
    title: "A/C Plant Blowing",
    top: 330,
    left: 650,
  },
  {
    link: "U12_GW02",
    title: "MLDB1 Blow Room card",
    top: 224,
    left: 744,
  },
  {
    link: "U13_GW02",
    title: "Transformer 1 LT-1 ACB",
    top: 330,
    left: 842,
  },
  {
    link: "U14_GW02",
    title: "Spare",
    top: 224,
    left: 935,
  },
  {
    link: "U15_GW02",
    title: "AC Plant spinning",
    top: 543,
    left: 167,
  },
  {
    link: "U16_GW02",
    title: "Water Chiller",
    top: 657.5,
    left: 269.5,
  },
  {
    link: "U17_GW02",
    title: "Card M/C 8-14",
    top: 543,
    left: 358,
  },
  {
    link: "U18_GW02",
    title: "Auto Con-linker Conner 1-9",
    top: 657.5,
    left: 460,
  },
  {
    link: "U19_GW02",
    title: "Card M/C 1-7",
    top: 543,
    left: 555,
  },
  {
    link: "U20_GW02",
    title: "AC Plant Winding",
    top: 657.5,
    left: 650,
  },
  {
    link: "U21_GW02",
    title: "Simplex M/C S1-5",
    top: 543,
    left: 745,
  },
  {
    link: "U22_GW02",
    title: "Spare 2",
    top: 657.5,
    left: 841,
  },
  {
    link: "U23_GW02",
    title: "Draw Frame Finish",
    top: 543,
    left: 956,
  },
];

const Unit5Lt3 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unitl5Lt3MeterTags = [
    // pf panel
    {
      activePowerTotalTag: roundedData?.U5_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW02_Voltage_Avg,
      top: 231,
      left: 178,
    },
    // ring 1-3
    {
      activePowerTotalTag: roundedData?.U7_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW02_Voltage_Avg,
      top: 337,
      left: 273,
    },
    // Ac plant spining
    {
      activePowerTotalTag: roundedData?.U8_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW02_Voltage_Avg,
      top: 231,
      left: 368,
    },
    // blow room l1
    {
      activePowerTotalTag: roundedData?.U9_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW02_Voltage_Avg,
      top: 337,
      left: 462,
    },
    // ring frames 4-6
    {
      activePowerTotalTag: roundedData?.U10_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW02_Voltage_Avg,
      top: 231,
      left: 558,
    },
    // a/c plant blowing
    {
      activePowerTotalTag: roundedData?.U11_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW02_Voltage_Avg,
      top: 337,
      left: 656,
    },
    // mldb1 blower room card
    {
      activePowerTotalTag: roundedData?.U12_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW02_Voltage_Avg,
      top: 231,
      left: 750,
    },
    // transformer 1 lt-1 acb
    {
      activePowerTotalTag: roundedData?.U13_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW02_Voltage_Avg,
      top: 337,
      left: 847,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U14_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW02_Voltage_Avg,
      top: 231,
      left: 940,
    },
    // ac plant spinning
    {
      activePowerTotalTag: roundedData?.U15_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW02_Voltage_Avg,
      top: 549,
      left: 173,
    },
    // water chiller
    {
      activePowerTotalTag: roundedData?.U16_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW02_Voltage_Avg,
      top: 665,
      left: 275,
    },
    // card m/c 8-14
    {
      activePowerTotalTag: roundedData?.U17_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW02_Voltage_Avg,
      top: 549,
      left: 364,
    },
    // auto con-link corner 1-9
    {
      activePowerTotalTag: roundedData?.U18_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW02_Voltage_Avg,
      top: 665,
      left: 465,
    },
    // card mc 1-7
    {
      activePowerTotalTag: roundedData?.U19_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW02_Voltage_Avg,
      top: 549,
      left: 561,
    },
    // AC plant winding
    {
      activePowerTotalTag: roundedData?.U20_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW02_Voltage_Avg,
      top: 665,
      left: 656,
    },

    // simplex m/c s1-5
    {
      activePowerTotalTag: roundedData?.U21_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW02_Voltage_Avg,
      top: 549,
      left: 751,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U22_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW02_Voltage_Avg,
      top: 665,
      left: 847,
    },
    // draw frame finish
    {
      activePowerTotalTag: roundedData?.U23_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW02_Voltage_Avg,
      top: 549,
      left: 961.5,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld?unit=unit5")}
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
                `/meter?area=Unit_5&lt_scheme=LT_3&meter_id=${meter.link}&meter_name=${meter.title}`
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
          src="./unit-5-lt3-sld.png"
          className="w-full h-full"
          alt="unit 5 lt3 sld"
        />
        {/* Meter Readings */}
        {unitl5Lt3MeterTags.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center  w-[47px] h-[54px]"
            style={{
              left: meter.left,
              top: meter.top,
            }}
          >
            <span className="meterReadingUnit4Lt1 mt-[-1.5px]">
              {meter.activePowerTotalTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1px]">
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1px]">
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt3;
