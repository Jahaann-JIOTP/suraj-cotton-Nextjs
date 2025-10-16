"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
const lt2MeterData = [
  {
    link: "U1_GW01",
    title: "A/C Back Process",
    top: 203,
    left: 67,
  },
  {
    link: "U2_GW01",
    title: "Weikel cond",
    top: 306,
    left: 161,
  },
  {
    link: "U3_GW01",
    title: "Winding AC",
    top: 203,
    left: 253,
  },
  {
    link: "U4_GW01",
    title: "Mills RES-CLNY & Workshop",
    top: 306,
    left: 348,
  },
  {
    link: "U5_GW01",
    title: "Card (1-4)(9-12)",
    top: 203,
    left: 440,
  },
  {
    link: "U18_GW01",
    title: "Colony",
    top: 306,
    left: 533,
  },
  {
    link: "U8_GW01",
    title: "Blow Room",
    top: 203,
    left: 626,
  },
  {
    link: "U9_GW01",
    title: "Comber (5-8)(13-14)",
    top: 306,
    left: 719,
  },
  {
    link: "U10_GW01",
    title: "Winding 1-6",
    top: 203,
    left: 812,
  },
  {
    link: "U7_GW01",
    title: "Power House 2nd Source (HFO)",
    top: 306,
    left: 905,
  },
  {
    link: "U12_GW01",
    title: "Card Filter (Bypass)",
    top: 492,
    left: 69,
  },
  {
    link: "U14_GW01",
    title: "B/R card Filter",
    top: 600,
    left: 172,
  },
  {
    link: "U15_GW01",
    title: "Ring 5-8",
    top: 492,
    left: 262,
  },
  {
    link: "U16_GW01",
    title: "Ring 13-16",
    top: 600,
    left: 358,
  },
  {
    link: "U17_GW01",
    title: "Ring 9-12",
    top: 492,
    left: 449,
  },
  {
    link: "U6_GW01",
    title: "Bale Press",
    top: 600,
    left: 543,
  },
  {
    link: "U19_GW01",
    title: "AC Lab",
    top: 492,
    left: 634,
  },
  {
    link: "U20_GW01",
    title: "Spare",
    top: 600,
    left: 729,
  },
  {
    link: "U21_GW01",
    title: "Spare 2",
    top: 492,
    left: 818,
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
      top: 210.5,
      left: 75,
    },
    // weikel cond
    {
      activePowerTotalTag: roundedData?.U2_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW01_Voltage_Avg,
      top: 313,
      left: 170,
    },
    // winding AC
    {
      activePowerTotalTag: roundedData?.U3_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW01_Voltage_Avg,
      top: 210.5,
      left: 261.5,
    },
    // mills res-clny & workshop
    {
      activePowerTotalTag: roundedData?.U4_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW01_Voltage_Avg,
      top: 313,
      left: 356,
    },
    // card 1
    {
      activePowerTotalTag: roundedData?.U5_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW01_Voltage_Avg,
      top: 210.5,
      left: 447.5,
    },
    // colony
    {
      activePowerTotalTag: roundedData?.U18_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW01_Voltage_Avg,
      top: 313,
      left: 542,
    },
    // blow room
    {
      activePowerTotalTag: roundedData?.U8_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW01_Voltage_Avg,
      top: 210.5,
      left: 635,
    },
    // card 2
    {
      activePowerTotalTag: roundedData?.U9_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW01_Voltage_Avg,
      top: 314,
      left: 728,
    },
    // winding 1
    {
      activePowerTotalTag: roundedData?.U10_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW01_Voltage_Avg,
      top: 210.5,
      left: 821,
    },
    // gas lt panel
    {
      activePowerTotalTag: roundedData?.U7_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW01_Voltage_Avg,
      top: 313,
      left: 914,
    },
    // card filter bypass
    {
      activePowerTotalTag: roundedData?.U12_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW01_Voltage_Avg,
      top: 500,
      left: 77,
    },
    // d/r card filter
    {
      activePowerTotalTag: roundedData?.U14_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW01_Voltage_Avg,
      top: 608,
      left: 180,
    },
    // ring 2
    {
      activePowerTotalTag: roundedData?.U15_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW01_Voltage_Avg,
      top: 500,
      left: 270,
    },
    // ring 4
    {
      activePowerTotalTag: roundedData?.U16_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW01_Voltage_Avg,
      top: 608,
      left: 367,
    },
    // ring 3
    {
      activePowerTotalTag: roundedData?.U17_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW01_Voltage_Avg,
      top: 500,
      left: 457.5,
    },
    // bale press
    {
      activePowerTotalTag: roundedData?.U6_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW01_Voltage_Avg,
      top: 608,
      left: 553,
    },
    // ac lab
    {
      activePowerTotalTag: roundedData?.U19_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW01_Voltage_Avg,
      top: 500,
      left: 643,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U20_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW01_Voltage_Avg,
      top: 608,
      left: 739,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U21_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW01_Voltage_Avg,
      top: 500,
      left: 826,
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
            href={`/meter?area=Unit_4&LT_selections=LT_2&page-type=sld&meter_id=${meter.link}&meter_name=${meter.title}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "73px",
              height: "68px",
              backgroundColor: "transparent",
              zIndex: 60,
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../sld/unit4lt2-new.png"
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
              width: "46px",
              height: "53px",
            }}
            className={`absolute z-20 flex flex-col items-center justify-between`}
          >
            <span
              className="text-[11.5px]  font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[11.5px]  font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[11.5px] mt-[1px] font-fira-mono"
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
