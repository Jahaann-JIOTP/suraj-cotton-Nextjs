"use client";
import React, { useState } from "react";

import { ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import Link from "next/link";
const unit4MeterData = [
  {
    link: "U19_PLC",
    title: "Diesel+JGS Incomming",
    top: 252,
    left: 90,
    ltScheme: "LT_1",
  },
  {
    link: "U21_PLC",
    title: "Wapda+HFO+JMS Incomming",
    top: 252,
    left: 206,
    ltScheme: "LT_1",
  },
  {
    link: "U11_GW01",
    title: "Diesel+JGS Incomming",
    top: 252,
    left: 570,
    ltScheme: "LT_2",
  },
  {
    link: "U13_GW01",
    title: "WAPDA+HFO+JMS Inomming",
    top: 252,
    left: 679,
    ltScheme: "LT_2",
  },
  {
    link: "U24_GW01",
    title: "Solar 352.50 kW",
    top: 252,
    left: 810,
    ltScheme: "LT_2",
  },
  {
    link: "U28_PLC",
    title: "Solar 52.17 kW",
    top: 252,
    left: 944,
    ltScheme: "LT_2",
  },
];
const InitialSldUnit4 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit4InitialSldMeterTAgs = [
    // diesel IC
    {
      activePowerTotalTag: roundedData?.U19_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_PLC_Voltage_Avg,
      top: 259,
      left: 96,
    },
    // wapda IC
    {
      activePowerTotalTag: roundedData?.U21_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_PLC_Voltage_Avg,
      top: 259,
      left: 212,
    },
    // power house
    {
      activePowerTotalTag: roundedData?.U11_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW01_Voltage_Avg,
      top: 259,
      left: 576,
    },
    // Wapda + HFO+ JMS Incomming
    {
      activePowerTotalTag: roundedData?.U13_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW01_Voltage_Avg,
      top: 259,
      left: 685,
    },
    // Solar 352.50Kw
    {
      activePowerTotalTag: roundedData?.U24_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U24_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U24_GW01_Voltage_Avg,
      top: 259,
      left: 816,
    },
    //Solar 52Kw
    {
      activePowerTotalTag: roundedData?.U28_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U28_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U28_PLC_Voltage_Avg,
      top: 259,
      left: 950,
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
      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {unit4MeterData.map((meter) => (
          <Link
            key={meter.link}
            href={`/meter?area=Unit_4&page-type=sld&LT_selections=${
              meter.ltScheme
            }&meter_id=${meter.link}&meter_name=${encodeURIComponent(
              meter.title
            )}`}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "61px",
              height: "57px",
              zIndex: 100,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
          ></Link>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../surajcotton-sld/unit4main.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* Buttons */}
        <Link
          // onClick={() => router.replace("/sld?area=Unit_4&LT_selections=LT_1")}
          href={"/sld?area=Unit_4&LT_selections=LT_1"}
          className="absolute  cursor-pointer"
          style={{
            width: "205px",
            height: "33px",
            top: "418px",
            left: "85px",
          }}
        ></Link>
        <Link
          // onClick={() => router.push("/sld?area=Unit_4&LT_selections=LT_2")}
          href={"/sld?area=Unit_4&LT_selections=LT_2"}
          className="absolute cursor-pointer"
          style={{
            width: "205px",
            height: "33px",
            top: "418px",
            left: "700px",
          }}
        ></Link>

        {/* Meter Readings */}
        {unit4InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center z-40"
            style={{
              width: "38px",
              height: "45px",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
          >
            <span
              className="text-[10px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
              className="text-[10px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span
              className="text-[10px] font-fira-mono"
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

export default InitialSldUnit4;
