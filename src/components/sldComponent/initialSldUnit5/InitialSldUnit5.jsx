"use client";
import React, { useState } from "react";

import { ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U6_GW02",
    title: "Solar 1236.39 Kw",
    top: 310,
    left: 226,
    ltScheme: "LT_3",
  },
  {
    link: "U13_GW02",
    title: "T/F 1",
    top: 310,
    left: 388,
    ltScheme: "LT_3",
  },
  {
    link: "U16_GW03",
    title: "T/F 2",
    top: 310,
    left: 637,
    ltScheme: "LT_4",
  },
  {
    link: "U17_GW03",
    title: "Solar 1017 Kw",
    top: 310,
    left: 798,
    ltScheme: "LT_4",
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
      top: 320,
      left: 233.5,
    },
    // TF #1
    {
      activePowerTotalTag: roundedData?.U13_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW02_Voltage_Avg,
      top: 320,
      left: 395,
    },
    // TF #2
    {
      activePowerTotalTag: roundedData?.U16_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW03_Voltage_Avg,
      top: 320,
      left: 644,
    },
    // Solar 2
    {
      activePowerTotalTag: roundedData?.U17_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW03_Voltage_Avg,
      top: 320,
      left: 806,
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
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_5&page-type=sld&LT_selections=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "81px",
              height: "79px",
              zIndex: 100,
              borderRadius: "0.4.2rem", // rounded-md
              cursor: "pointer",
            }}
            className={`rounded-md`}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="./sld/unit-5-sld.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?area=Unit_5&LT_selections=LT_3")}
          className="absolute top-[545px] left-[193px] w-[301px] h-[45px] cursor-pointer"
          style={{
            left: "210px",
            top: "545px",
            height: "45px",
            width: "276px",
          }}
        ></button>
        <button
          onClick={() => router.push("/sld?area=Unit_5&LT_selections=LT_4")}
          className="absolute cursor-pointer"
          style={{
            left: "620px",
            top: "545px",
            height: "45px",
            width: "276px",
          }}
        ></button>

        {/* Meter Readings */}
        {unit5InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col justify-between items-center z-40"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "51px",
              height: "59px",
            }}
          >
            <span
              className="text-[11px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span
              className="text-[11px]"
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
