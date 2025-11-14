"use client";
import React, { useState } from "react";

import { ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import Link from "next/link";
const unit4MeterData = [
  {
    link: "U6_GW02",
    title: "Solar 1185 kW",
    top: 323,
    left: 235,
    ltScheme: "LT_1",
  },
  {
    link: "U13_GW02",
    title: "T/F 1",
    top: 323,
    left: 390,
    ltScheme: "LT_1",
  },
  {
    link: "U16_GW03",
    title: "T/F 2",
    top: 323,
    left: 627,
    ltScheme: "LT_2",
  },
  {
    link: "U17_GW03",
    title: "Solar 1070 kW",
    top: 323,
    left: 781,
    ltScheme: "LT_2",
  },
];
const InitialSldUnit5 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit5InitialSldMeterTAgs = [
    // Solar
    {
      activePowerTotalTag: roundedData?.U6_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW02_Voltage_Avg,
      top: 332,
      left: 242,
    },
    // TF #1
    {
      activePowerTotalTag: roundedData?.U13_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW02_Voltage_Avg,
      top: 332,
      left: 397,
    },
    // TF #2
    {
      activePowerTotalTag: roundedData?.U16_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW03_Voltage_Avg,
      top: 332,
      left: 635,
    },
    // Solar 2
    {
      activePowerTotalTag: roundedData?.U17_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW03_Voltage_Avg,
      top: 332,
      left: 788,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld")}
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
      <div className="relative h-[600px] mx-auto" style={{ width: "1100px" }}>
        {unit4MeterData.map((meter) => (
          <Link
            key={meter.link}
            href={`/meter?area=Unit_5&page-type=sld&LT_selections=${
              meter.ltScheme
            }&meter_id=${meter.link}&meter_name=${encodeURIComponent(
              meter.title
            )}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "78px",
              height: "75px",
              zIndex: 100,
              borderRadius: "0.42rem", // rounded-md
              cursor: "pointer",
            }}
            className={`rounded-md`}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="./surajcotton-sld/unit5main.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <Link
          href={"/sld?area=Unit_5&LT_selections=LT_1"}
          className="absolute top-[548px] left-[193px] w-[301px] h-[44px] cursor-pointer"
          style={{
            left: "218px",
            top: "547px",
            height: "45px",
            width: "263px",
          }}
        ></Link>
        <Link
          href={"/sld?area=Unit_5&LT_selections=LT_2"}
          className="absolute cursor-pointer"
          style={{
            left: "613px",
            top: "547px",
            height: "43px",
            width: "263px",
          }}
        ></Link>

        {/* Meter Readings */}
        {unit5InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col justify-between items-center z-40"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "48.5px",
              height: "58px",
            }}
          >
            <span
              className="text-[12px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "1px" }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
              className="text-[12px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span
              className="text-[12px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeVoltageAvgTag || "00.00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InitialSldUnit5;
