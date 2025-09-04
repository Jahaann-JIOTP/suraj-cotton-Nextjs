"use client";
import React, { useState } from "react";

import { ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
const unit4MeterData = [
  {
    link: "U19_PLC",
    title: "Diesel_JGS Incomming",
    top: 198,
    left: 103,
    ltScheme: "LT_1",
  },
  {
    link: "U21_PLC",
    title: "Wapda + HFO + JMS IC",
    top: 198,
    left: 219,
    ltScheme: "LT_1",
  },
  {
    link: "U7_GW01",
    title: "Diesel JGS Incomming",
    top: 200,
    left: 640,
    ltScheme: "LT_2",
  },
  {
    link: "U13_GW01",
    title: "WAPDA + HFO + JMS Inomming",
    top: 200,
    left: 766,
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
      top: 205,
      left: 109,
    },
    // wapda IC
    {
      activePowerTotalTag: roundedData?.U21_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_PLC_Voltage_Avg,
      top: 205,
      left: 226,
    },
    // power house
    {
      activePowerTotalTag: roundedData?.U7_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U7_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U7_GW01_Voltage_Avg,
      top: 207.5,
      left: 647,
    },
    // wapda IC
    {
      activePowerTotalTag: roundedData?.U13_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U13_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U13_GW01_Voltage_Avg,
      top: 207.5,
      left: 773,
    },
    //Solar 352.50kw
    {
      activePowerTotalTag: "--.--",
      activeCurrentAvgTag: "--.--",
      activeVoltageAvgTag: "--.--",
      top: 208.5,
      left: 944,
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
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_4&page-type=sld&LT_selections=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "70px",
              height: "65px",
              zIndex: 100,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../sld/unit-4-sld.png"
          className="h-full"
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?area=Unit_4&LT_selections=LT_1")}
          className="absolute  cursor-pointer"
          style={{
            width: "239px",
            height: "40px",
            top: "385px",
            left: "77px",
          }}
        ></button>
        <button
          onClick={() => router.push("/sld?area=Unit_4&LT_selections=LT_2")}
          className="absolute cursor-pointer"
          style={{
            width: "239px",
            height: "40px",
            top: "385px",
            left: "642px",
          }}
        ></button>

        {/* Meter Readings */}
        {unit4InitialSldMeterTAgs.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center z-40"
            style={{
              width: "44px",
              height: "52px",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
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
              style={{ color: "#05f805", fontWeight: 500, marginTop: "0.5px" }}
            >
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "#05f805", fontWeight: 500, marginTop: "1px" }}
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
