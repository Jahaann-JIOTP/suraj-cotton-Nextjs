"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
import Link from "next/link";
const lt1MeterData = [
  // {
  //   link: "U5_GW02",
  //   title: "PF Panel",
  //   top: 206,
  //   left: 95,
  // },
  {
    link: "U7_GW02",
    title: "Ring 1-3",
    top: 303,
    left: 139,
  },
  {
    link: "U8_GW02",
    title: "Ring A/C (Supply Fan)",
    top: 205,
    left: 227,
  },
  {
    link: "U9_GW02",
    title: "Blow Room",
    top: 303,
    left: 315,
  },
  {
    link: "U10_GW02",
    title: "Ring 4-6",
    top: 205,
    left: 403,
  },
  {
    link: "U11_GW02",
    title: "A/C Back Process",
    top: 303,
    left: 492,
  },
  {
    link: "U12_GW02",
    title: "Lighting Internal",
    top: 205,
    left: 604,
  },
  {
    link: "U14_GW02",
    title: "Comber 1-14 + Lap Former 1-3",
    top: 303,
    left: 725,
  },
  {
    link: "U15_GW02",
    title: "Ring A/C (Return Fans)",
    top: 205,
    left: 857,
  },
  {
    link: "U16_GW02",
    title: "Water Chiller",
    top: 501,
    left: 159,
  },
  {
    link: "U17_GW02",
    title: "Card 8-14",
    top: 605,
    left: 246,
  },
  {
    link: "U18_GW02",
    title: "Winding 1-9",
    top: 501,
    left: 334,
  },
  {
    link: "U19_GW02",
    title: "Card 1-7",
    top: 605,
    left: 423,
  },
  {
    link: "U20_GW02",
    title: "Winding A/C",
    top: 501,
    left: 510,
  },
  {
    link: "U21_GW02",
    title: "Simplex 1-5 + Breaker 1-6",
    top: 605,
    left: 598,
  },
  {
    link: "U22_GW02",
    title: "Ring Unit 4 (17-20)",
    top: 501,
    left: 687,
  },
  {
    link: "U23_GW02",
    title: "Drawing Finisher 1-8",
    top: 605,
    left: 775,
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
      top: 310,
      left: 145,
    },
    // Ac Supply fan
    {
      activePowerTotalTag: roundedData?.U8_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW02_Voltage_Avg,
      top: 213,
      left: 233,
    },
    // blow room l1
    {
      activePowerTotalTag: roundedData?.U9_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW02_Voltage_Avg,
      top: 310,
      left: 320,
    },
    // ring frames 4-6
    {
      activePowerTotalTag: roundedData?.U10_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW02_Voltage_Avg,
      top: 213,
      left: 408,
    },
    // a/c plant blowing
    {
      activePowerTotalTag: roundedData?.U11_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW02_Voltage_Avg,
      top: 310,
      left: 498,
    },
    // mldb1 blower room card
    {
      activePowerTotalTag: roundedData?.U12_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW02_Voltage_Avg,
      top: 213,
      left: 610.5,
    },
    // comber 1 to 14
    {
      activePowerTotalTag: roundedData?.U14_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW02_Voltage_Avg,
      top: 310.5,
      left: 732,
    },
    // ac plant spining
    {
      activePowerTotalTag: roundedData?.U15_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW02_Voltage_Avg,
      top: 213,
      left: 863,
    },
    // water chiller
    {
      activePowerTotalTag: roundedData?.U16_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW02_Voltage_Avg,
      top: 508.5,
      left: 164,
    },
    // card mc 8-14
    {
      activePowerTotalTag: roundedData?.U17_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW02_Voltage_Avg,
      top: 612.5,
      left: 252,
    },
    // card m/c 8-14
    {
      activePowerTotalTag: roundedData?.U18_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW02_Voltage_Avg,
      top: 507,
      left: 340,
    },
    // auto con-link corner 1-9
    {
      activePowerTotalTag: roundedData?.U19_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW02_Voltage_Avg,
      top: 612.5,
      left: 427.5,
    },
    // card mc 1-7
    {
      activePowerTotalTag: roundedData?.U20_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW02_Voltage_Avg,
      top: 507,
      left: 515,
    },
    // AC plant winding
    {
      activePowerTotalTag: roundedData?.U21_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW02_Voltage_Avg,
      top: 612.5,
      left: 605,
    },

    // simplex m/c s1-5
    {
      activePowerTotalTag: roundedData?.U22_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW02_Voltage_Avg,
      top: 507,
      left: 693,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U23_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW02_Voltage_Avg,
      top: 612.5,
      left: 781,
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
              width: "67px",
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
          src="./surajcotton-sld/unit5lt1.png"
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
              className="text-[11px] mt-[0px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11px] mt-[0px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11px] mt-[1px] font-fira-mono"
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
