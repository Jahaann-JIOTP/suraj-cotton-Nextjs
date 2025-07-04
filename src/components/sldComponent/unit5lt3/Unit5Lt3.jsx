"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U1_GW02",
    title: "Transport",
    top: 224,
    left: 172,
  },
  {
    link: "U3_GW02",
    title: "Lighting Outside",
    top: 224,
    left: 363,
  },
  {
    link: "U5_GW02",
    title: "Power House",
    top: 224,
    left: 553,
  },
  {
    link: "U7_GW02",
    title: "Spare",
    top: 224,
    left: 744,
  },
  {
    link: "U9_GW02",
    title: "Winding 1",
    top: 224,
    left: 935,
  },
  {
    link: "U2_GW02",
    title: "Unit 5 aux",
    top: 330,
    left: 268,
  },
  {
    link: "U4_GW02",
    title: "Lighting Inside",
    top: 330,
    left: 457,
  },
  {
    link: "U6_GW02",
    title: "Turbine",
    top: 330,
    left: 650,
  },
  {
    link: "U8_GW02",
    title: "Drawing 1",
    top: 330,
    left: 842,
  },
  {
    link: "U12_GW02",
    title: "Ring 6",
    top: 543,
    left: 167,
  },
  {
    link: "U14_GW02",
    title: "Compressor",
    top: 543,
    left: 358,
  },
  {
    link: "U16_GW02",
    title: "Compressor 2",
    top: 543,
    left: 555,
  },
  {
    link: "U18_GW02",
    title: "Ring AC (Byparss)",
    top: 543,
    left: 745,
  },
  {
    link: "U11_GW02",
    title: "Ring 5",
    top: 543,
    left: 956,
  },
  {
    link: "U13_GW02",
    title: "Comber 1",
    top: 657.5,
    left: 269.5,
  },
  {
    link: "U15_GW02",
    title: "Simplex 1",
    top: 657.5,
    left: 460,
  },
  {
    link: "U17_GW02",
    title: "Ring AC",
    top: 657.5,
    left: 650,
  },
  {
    link: "U20_GW02",
    title: "Compressor (Bypass)",
    top: 657.5,
    left: 841,
  },
];

const Unit5Lt3 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unitl5Lt3MeterTags = [
    {
      activePowerTotalTag: roundedData?.U5_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW02_Voltage_Avg,
      top: 231,
      left: 178,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 231,
      left: 368,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 231,
      left: 558,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 231,
      left: 750,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 231,
      left: 940,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 337,
      left: 273,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 337,
      left: 462,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 337,
      left: 656,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 337,
      left: 847,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 549,
      left: 173,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 549,
      left: 364,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 549,
      left: 561,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 549,
      left: 751,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 549,
      left: 961.5,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 665,
      left: 275,
    },
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 665,
      left: 465,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 665,
      left: 656,
    },

    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 665,
      left: 847,
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
                `/meter?area=Unit_5&lt_scheme=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`
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
            className={`border-1 border-red-400`}
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
            className="absolute flex flex-col items-center border-1 border-red-500  w-[47px] h-[54px]"
            style={{
              left: meter.left,
              top: meter.top,
            }}
          >
            <span className="meterReadingUnit4Lt1 mt-[-3px]">
              {roundedData?.U1_PLC_ActivePower_Total || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-2px]">
              {roundedData?.U1_PLC_Current_Avg || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-3px]">
              {roundedData?.U1_PLC_Voltage_Avg || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt3;
