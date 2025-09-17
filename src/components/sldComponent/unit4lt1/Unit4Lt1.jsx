"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowLeft2 } from "react-icons/im";
import Link from "next/link";
const lt1MeterData = [
  {
    link: "U1_PLC",
    title: "Transport",
    top: 278,
    left: 96,
  },
  {
    link: "U2_PLC",
    title: "Unit 5 Lightning",
    top: 342,
    left: 179,
  },
  {
    link: "U3_PLC",
    title: "Lightning Outside",
    top: 274,
    left: 261,
  },
  {
    link: "U4_PLC",
    title: "Lighting Inside",
    top: 342,
    left: 343,
  },
  {
    link: "U5_PLC",
    title: "Power House",
    top: 274,
    left: 427,
  },
  {
    link: "U6_PLC",
    title: "Turbine",
    top: 342,
    left: 520,
  },
  {
    link: "U7_PLC",
    title: "Main Meter",
    top: 278,
    left: 600,
  },
  {
    link: "U8_PLC",
    title: "Drawing 1~6+2 Breaker",
    top: 342,
    left: 680,
  },
  {
    link: "U9_PLC",
    title: "Winding 7~9",
    top: 278,
    left: 771,
  },
  {
    link: "U10_PLC",
    title: "Ring 1~4",
    top: 342,
    left: 887,
  },
  {
    link: "U11_PLC",
    title: "Ring 16~20",
    top: 605,
    left: 95,
  },
  {
    link: "U12_PLC",
    title: "Ring 21~24",
    top: 541,
    left: 178,
  },
  {
    link: "U13_PLC",
    title: "Comber 1-10 +Uni-Lap 1-2",
    top: 605,
    left: 260,
  },
  {
    link: "U14_PLC",
    title: "Compressor",
    top: 541,
    left: 342,
  },
  {
    link: "U15_PLC",
    title: "Simplex 1-6",
    top: 605,
    left: 424,
  },
  {
    link: "U16_PLC",
    title: "Compressor 2",
    top: 541,
    left: 507,
  },
  {
    link: "U17_PLC",
    title: "Ring AC",
    top: 605,
    left: 590,
  },
  {
    link: "U18_PLC",
    title: "Ring AC (Bypass)",
    top: 541,
    left: 680,
  },
  {
    link: "U20_PLC",
    title: "Compressor (Bypass)",
    top: 605,
    left: 773,
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
      top: 285,
      left: 102,
    },
    // Unit 5 Aux
    {
      activePowerTotalTag: roundedData?.U2_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_PLC_Voltage_Avg,
      top: 350,
      left: 185,
    },
    // Lighting Outside
    {
      activePowerTotalTag: roundedData?.U3_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_PLC_Voltage_Avg,
      top: 281,
      left: 267,
    },
    // Lighting Inside
    {
      activePowerTotalTag: roundedData?.U4_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_PLC_Voltage_Avg,
      top: 350,
      left: 349,
    },
    // Power House
    {
      activePowerTotalTag: roundedData?.U5_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_PLC_Voltage_Avg,
      top: 281,
      left: 433,
    },
    // Turbine
    {
      activePowerTotalTag: roundedData?.U6_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_PLC_Voltage_Avg,
      top: 350,
      left: 527,
    },
    // Spare
    {
      activePowerTotalTag: roundedData?.U7_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_PLC_Voltage_Avg,
      top: 285,
      left: 605,
    },
    // Drawing 1
    {
      activePowerTotalTag: roundedData?.U8_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_PLC_Voltage_Avg,
      top: 350,
      left: 687,
    },
    // Winding 1
    {
      activePowerTotalTag: roundedData?.U9_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_PLC_Voltage_Avg,
      top: 285,
      left: 777.5,
    },

    // Ring 1
    {
      activePowerTotalTag: roundedData?.U10_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_PLC_Voltage_Avg,
      top: 350,
      left: 893,
    },
    // Ring 5
    {
      activePowerTotalTag: roundedData?.U11_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_PLC_Voltage_BC,
      top: 612,
      left: 101,
    },
    // Ring 6
    {
      activePowerTotalTag: roundedData?.U12_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_PLC_Voltage_Avg,
      top: 548,
      left: 185,
    },
    // Comber 1
    {
      activePowerTotalTag: roundedData?.U13_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_PLC_Voltage_Avg,
      top: 612,
      left: 265.5,
    },
    // Compressor
    {
      activePowerTotalTag: roundedData?.U14_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_PLC_Voltage_BC,
      top: 548,
      left: 348,
    },
    // Simplex 1
    {
      activePowerTotalTag: roundedData?.U15_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_PLC_Voltage_Avg,
      top: 612,
      left: 430.5,
    },
    // Compressor 2
    {
      activePowerTotalTag: roundedData?.U16_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_PLC_Voltage_Avg,
      top: 548,
      left: 513,
    },
    // Ring AC
    {
      activePowerTotalTag: roundedData?.U17_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_PLC_Voltage_Avg,
      top: 612,
      left: 595,
    },
    // Ring AC (Bypass)
    {
      activePowerTotalTag: roundedData?.U18_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_PLC_Voltage_BC,
      top: 548,
      left: 687,
    },
    // Compressor (Bypass)
    {
      activePowerTotalTag: roundedData?.U20_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_PLC_Voltage_Avg,
      top: 612,
      left: 779,
    },
  ];

  return (
    <div className="w-full">
      <button
        onClick={() => router.push("/sld?area=Unit_4")}
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
            // onClick={() =>
            //   router.push(
            //     `/meter?area=Unit_4&page-type=sld&LT_selections=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`
            //   )
            // }
            href={`/meter?area=Unit_4&page-type=sld&LT_selections=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "64.5px",
              height: "61px",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../sld/Unit-4-lt1-sld.png"
          className=" h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {unit4Lt1MeterTags.map((meter, index) => (
          <div
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "40px",
              height: "47px",
            }}
            className={`absolute z-20 flex flex-col items-center`}
          >
            <span
              className="text-[11.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "-1.2px" }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "-1.2px" }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11.5px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "-0.5px" }}
            >
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit4Lt1;
