"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
const lt1MeterData = [
  {
    link: "U1_GW03",
    title: "Ring Frame 7-9",
    top: 194,
    left: 152,
  },
  {
    link: "U2_GW03",
    title: "Yarn conditioning M/C",
    top: 294,
    left: 238,
  },
  {
    link: "U3_GW03",
    title: "MLDB3 single room quarter",
    top: 194,
    left: 328,
  },
  {
    link: "U4_GW03",
    title: "Roving Transport System",
    top: 294,
    left: 413,
  },
  {
    link: "U5_GW03",
    title: "Ring Frame 10-12",
    top: 194,
    left: 503,
  },
  {
    link: "U6_GW03",
    title: "Spare 3",
    top: 290,
    left: 600,
  },
  {
    link: "U7_GW03",
    title: "Spare 1",
    top: 203,
    left: 698,
  },
  {
    link: "U8_GW03",
    title: "Spare 2",
    top: 292,
    left: 782,
  },
  {
    link: "U9_GW03",
    title: "Ring Frame 13-15",
    top: 199,
    left: 879,
  },
  {
    link: "U10_GW03",
    title: "Auto con-linker conner M/S 10-12",
    top: 508,
    left: 153,
  },
  {
    link: "U11_GW03",
    title: "Baling Press",
    top: 606,
    left: 238,
  },
  {
    link: "U12_GW03",
    title: "Ring Frame 16-18",
    top: 508,
    left: 330,
  },
  {
    link: "U13_GW03",
    title: "Fiber Deposit Plant",
    top: 606,
    left: 413,
  },
  {
    link: "U14_GW03",
    title: "MLDB2 Ring con",
    top: 508,
    left: 506,
  },
  {
    link: "U15_GW03",
    title: "Deep Valve Turbine",
    top: 606,
    left: 610,
  },
  {
    link: "U18_GW03",
    title: "PF Panel",
    top: 514,
    left: 710,
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
      left: 159,
    },
    // yarn conditioning m/c
    {
      activePowerTotalTag: roundedData?.U2_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW03_Voltage_Avg,
      top: 302,
      left: 245,
    },
    // ml db 3 single room quarter
    {
      activePowerTotalTag: roundedData?.U3_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW03_Voltage_Avg,
      top: 202,
      left: 335,
    },
    // roving transport system
    {
      activePowerTotalTag: roundedData?.U4_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW03_Voltage_Avg,
      top: 302,
      left: 419,
    },
    // ring frame 10-12
    {
      activePowerTotalTag: roundedData?.U5_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW03_Voltage_Avg,
      top: 201,
      left: 510,
    },
    // comber mcs 1-14
    {
      activePowerTotalTag: roundedData?.U6_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW03_Voltage_Avg,
      top: 298,
      left: 607,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U7_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW03_Voltage_Avg,
      top: 209,
      left: 705,
    },
    // sapre 2
    {
      activePowerTotalTag: roundedData?.U8_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW03_Voltage_Avg,
      top: 298.5,
      left: 789,
    },
    // ring frame 13-15
    {
      activePowerTotalTag: roundedData?.U9_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW03_Voltage_Avg,
      top: 206.5,
      left: 885,
    },
    // auto con linker conner m/s 10-12
    {
      activePowerTotalTag: roundedData?.U10_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW03_Voltage_Avg,
      top: 515,
      left: 160,
    },
    // baling press
    {
      activePowerTotalTag: roundedData?.U11_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW03_Voltage_Avg,
      top: 613,
      left: 245,
    },
    // ring frame 16-18
    {
      activePowerTotalTag: roundedData?.U12_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW03_Voltage_Avg,
      top: 515,
      left: 337,
    },
    // fiber deposit plant
    {
      activePowerTotalTag: roundedData?.U13_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW03_Voltage_Avg,
      top: 613,
      left: 419,
    },
    // mldb ring con
    {
      activePowerTotalTag: roundedData?.U14_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW03_Voltage_Avg,
      top: 515,
      left: 512,
    },
    // deep valve turbine
    {
      activePowerTotalTag: roundedData?.U15_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW03_Voltage_Avg,
      top: 613,
      left: 616,
    },
    // transformer 2 lt-2 acb
    {
      activePowerTotalTag: roundedData?.U16_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW03_Voltage_Avg,
      top: 522,
      left: 717,
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
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_5&page-type=sld&lt_scheme=LT_4&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
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
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="./sld/unit-5-lt2-sld.png"
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
              height: "51px",
            }}
            className={`absolute z-20 flex flex-col items-center`}
          >
            <span
              className="text-[11px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11px]"
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

export default Unit5Lt4;
