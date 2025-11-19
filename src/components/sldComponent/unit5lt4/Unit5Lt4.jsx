"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
import Link from "next/link";
const lt1MeterData = [
  {
    link: "U1_GW03",
    title: "Ring 7-9",
    top: 194,
    left: 140,
  },
  {
    link: "U2_GW03",
    title: "conditioning Machine",
    top: 294,
    left: 226,
  },
  {
    link: "U3_GW03",
    title: "Colony",
    top: 194,
    left: 316,
  },
  {
    link: "U4_GW03",
    title: "Roving Transport System",
    top: 294,
    left: 400,
  },
  {
    link: "U5_GW03",
    title: "Ring 10-12",
    top: 194,
    left: 490,
  },
  {
    link: "U6_GW03",
    title: "Spare 2",
    top: 294,
    left: 587,
  },
  {
    link: "U7_GW03",
    title: "Spare 1",
    top: 195,
    left: 699,
  },
  // {
  //   link: "U8_GW03",
  //   title: "Spare 2",
  //   top: 292,
  //   left: 769,
  // },
  {
    link: "U9_GW03",
    title: "Ring 13-15",
    top: 294,
    left: 819,
  },
  {
    link: "U10_GW03",
    title: "Winding 10-18",
    top: 508,
    left: 140,
  },
  {
    link: "U11_GW03",
    title: "Bailing Press",
    top: 606,
    left: 225,
  },
  {
    link: "U12_GW03",
    title: "Ring 16-18",
    top: 508,
    left: 317,
  },
  {
    link: "U13_GW03",
    title: "B/Card+Comber Filter",
    top: 606,
    left: 400,
  },
  {
    link: "U14_GW03",
    title: "Lighting Internal",
    top: 508,
    left: 493,
  },
  {
    link: "U15_GW03",
    title: "Deep Valve Turbine",
    top: 606,
    left: 597,
  },
  {
    link: "U18_GW03",
    title: "PF Panel",
    top: 508,
    left: 698,
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
      top: 202,
      left: 147,
    },
    // yarn conditioning m/c
    {
      activePowerTotalTag: roundedData?.U2_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW03_Voltage_Avg,
      top: 302,
      left: 232,
    },
    // ml db 3 single room quarter
    {
      activePowerTotalTag: roundedData?.U3_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW03_Voltage_Avg,
      top: 202,
      left: 323,
    },
    // roving transport system
    {
      activePowerTotalTag: roundedData?.U4_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW03_Voltage_Avg,
      top: 302,
      left: 407,
    },
    // ring frame 10-12
    {
      activePowerTotalTag: roundedData?.U5_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW03_Voltage_Avg,
      top: 201,
      left: 497,
    },
    // comber mcs 1-14
    {
      activePowerTotalTag: roundedData?.U6_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW03_Voltage_Avg,
      top: 302,
      left: 594,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U7_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW03_Voltage_Avg,
      top: 202,
      left: 705,
    },
    // sapre 2
    // {
    //   activePowerTotalTag: roundedData?.U8_GW03_ActivePower_Total,
    //   activeCurrentAvgTag: roundedData?.U8_GW03_Current_Avg,
    //   activeVoltageAvgTag: roundedData?.U8_GW03_Voltage_Avg,
    //   top: 298.5,
    //   left: 777,
    // },
    // ring frame 13-15
    {
      activePowerTotalTag: roundedData?.U9_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW03_Voltage_Avg,
      top: 302,
      left: 825,
    },
    // auto con linker conner m/s 10-12
    {
      activePowerTotalTag: roundedData?.U10_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW03_Voltage_Avg,
      top: 515,
      left: 147,
    },
    // baling press
    {
      activePowerTotalTag: roundedData?.U11_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW03_Voltage_Avg,
      top: 613,
      left: 232,
    },
    // ring frame 16-18
    {
      activePowerTotalTag: roundedData?.U12_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW03_Voltage_Avg,
      top: 515,
      left: 324,
    },
    // fiber deposit plant
    {
      activePowerTotalTag: roundedData?.U13_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW03_Voltage_Avg,
      top: 613,
      left: 407,
    },
    // mldb ring con
    {
      activePowerTotalTag: roundedData?.U14_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW03_Voltage_Avg,
      top: 515,
      left: 499,
    },
    // deep valve turbine
    {
      activePowerTotalTag: roundedData?.U15_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW03_Voltage_Avg,
      top: 613,
      left: 604,
    },
    // PF Panel
    {
      activePowerTotalTag: roundedData?.U18_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW03_Voltage_Avg,
      top: 516,
      left: 704.5,
    },
  ];

  return (
    <div className="w-full">
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

      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {lt1MeterData.map((meter) => (
          <Link
            key={meter.link}
            href={`/meter?area=Unit_5&page-type=sld&LT_selections=LT_2&meter_id=${
              meter.link
            }&meter_name=${encodeURIComponent(meter.title)}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "68px",
              height: "65px",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          // src="./surajcotton-sld/unit5lt2.png"
          src="./surajcotton-sld/u5lt2updated.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {unit5Lt4MeterTags.map((meter, index) => (
          <div
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "42.5px",
              height: "50px",
            }}
            className={`absolute z-20 flex flex-col items-center`}
          >
            <span
              className="text-[11px] mt-[-0.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "0px" }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11px] mt-[-0.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "1px" }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11px] mt-[-0.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "0.3px" }}
            >
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit5Lt4;
