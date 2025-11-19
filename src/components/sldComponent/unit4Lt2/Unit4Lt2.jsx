"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
const lt2MeterData = [
  {
    link: "U1_GW01",
    title: "Back Process A/C",
    top: 217,
    left: 92,
  },
  {
    link: "U2_GW01",
    title: "Conditioning Machine",
    top: 316,
    left: 181,
  },
  {
    link: "U3_GW01",
    title: "Winding A/C",
    top: 217,
    left: 267,
  },
  {
    link: "U4_GW01",
    title: "Mills Residential Colony & Workshop",
    top: 316,
    left: 357,
  },
  {
    link: "U5_GW01",
    title: "Card 1-4 + 9-12",
    top: 217,
    left: 444,
  },
  {
    link: "U18_GW01",
    title: "Colony",
    top: 316,
    left: 534,
  },
  {
    link: "U8_GW01",
    title: "Blow Room",
    top: 217,
    left: 621,
  },
  {
    link: "U9_GW01",
    title: "Card 5-8 + 13-14 + Breaker 5-6",
    top: 316,
    left: 710,
  },
  {
    link: "U10_GW01",
    title: "Winding 1-6",
    top: 217,
    left: 798,
  },
  {
    link: "U7_GW01",
    title: "Gas Plant Aux (2nd Source)",
    top: 316,
    left: 886,
  },
  {
    link: "U14_GW01",
    title: "B/Card Filter + Comber Filter",
    top: 492,
    left: 92,
  },
  {
    link: "U12_GW01",
    title: "B/Card + Comber Filter Bypass",
    top: 593,
    left: 191,
  },
  {
    link: "U15_GW01",
    title: "Ring 5-8",
    top: 492,
    left: 276,
  },
  {
    link: "U16_GW01",
    title: "Ring 13-16",
    top: 593,
    left: 367,
  },
  {
    link: "U17_GW01",
    title: "Ring 9-12",
    top: 492,
    left: 453,
  },
  {
    link: "U20_GW01",
    title: "Bailing Press",
    top: 593,
    left: 543,
  },
  {
    link: "U19_GW01",
    title: "Lab A/C",
    top: 492,
    left: 629,
  },
  {
    link: "U6_GW01",
    title: "Spare",
    top: 593,
    left: 720,
  },
  {
    link: "U21_GW01",
    title: "Spare 2",
    top: 492,
    left: 803,
  },
];

const Unit4Lt2 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit4Lt2MeterTags = [
    // drying simplex ac
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 225,
      left: 99,
    },
    // weikel cond
    {
      activePowerTotalTag: roundedData?.U2_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW01_Voltage_Avg,
      top: 323,
      left: 189,
    },
    // winding AC
    {
      activePowerTotalTag: roundedData?.U3_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW01_Voltage_Avg,
      top: 225,
      left: 275,
    },
    // mills res-clny & workshop
    {
      activePowerTotalTag: roundedData?.U4_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW01_Voltage_Avg,
      top: 323,
      left: 364.5,
    },
    // card 1
    {
      activePowerTotalTag: roundedData?.U5_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW01_Voltage_Avg,
      top: 225,
      left: 451.5,
    },
    // colony
    {
      activePowerTotalTag: roundedData?.U18_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW01_Voltage_Avg,
      top: 323,
      left: 540,
    },
    // blow room
    {
      activePowerTotalTag: roundedData?.U8_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW01_Voltage_Avg,
      top: 225,
      left: 629,
    },
    // card 2
    {
      activePowerTotalTag: roundedData?.U9_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW01_Voltage_Avg,
      top: 323,
      left: 717,
    },
    // winding 1
    {
      activePowerTotalTag: roundedData?.U10_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW01_Voltage_Avg,
      top: 225,
      left: 805,
    },
    // gas lt panel
    {
      activePowerTotalTag: roundedData?.U7_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW01_Voltage_Avg,
      top: 323,
      left: 893,
    },
    // card filter bypass
    {
      activePowerTotalTag: roundedData?.U14_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW01_Voltage_Avg,
      top: 498.5,
      left: 101,
    },
    // d/r card filter
    {
      activePowerTotalTag: roundedData?.U12_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW01_Voltage_Avg,
      top: 601,
      left: 198,
    },
    // ring 2
    {
      activePowerTotalTag: roundedData?.U15_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW01_Voltage_Avg,
      top: 498.5,
      left: 284,
    },
    // ring 4
    {
      activePowerTotalTag: roundedData?.U16_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW01_Voltage_Avg,
      top: 601,
      left: 375,
    },
    // ring 3
    {
      activePowerTotalTag: roundedData?.U17_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW01_Voltage_Avg,
      top: 498.5,
      left: 461,
    },
    // bale press
    {
      activePowerTotalTag: roundedData?.U20_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW01_Voltage_Avg,
      top: 601,
      left: 550,
    },
    // ac lab
    {
      activePowerTotalTag: roundedData?.U19_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW01_Voltage_Avg,
      top: 498.5,
      left: 636,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U6_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW01_Voltage_Avg,
      top: 601,
      left: 727,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U21_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW01_Voltage_Avg,
      top: 498.5,
      left: 810,
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
        {lt2MeterData.map((meter) => (
          <Link
            key={meter.link}
            href={`/meter?area=Unit_4&LT_selections=LT_2&page-type=sld&meter_id=${
              meter.link
            }&meter_name=${encodeURIComponent(meter.title)}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "70px",
              height: "66px",
              backgroundColor: "transparent",
              zIndex: 60,
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../surajcotton-sld/u4lt2updated.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />

        {/* Meter Readings */}
        {unit4Lt2MeterTags.map((meter, index) => (
          <div
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "43px",
              height: "50px",
            }}
            className={`absolute z-20 flex flex-col items-center justify-between`}
          >
            <span
              className="text-[11px]  font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11px]  font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "1px" }}
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

export default Unit4Lt2;
