"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
const lt2MeterData = [
  {
    link: "U1_GW01",
    title: "Drying Simplex AC",
    top: 220,
    left: 86.5,
  },
  {
    link: "U3_GW01",
    title: "Winding AC",
    top: 220,
    left: 288,
  },
  {
    link: "U5_GW01",
    title: "Card 1",
    top: 220,
    left: 490,
  },
  {
    link: "U8_GW01",
    title: "Blow Room",
    top: 220,
    left: 693,
  },
  {
    link: "U10_GW01",
    title: "Winding 1",
    top: 220,
    left: 895,
  },
  {
    link: "U2_GW01",
    title: "Weikel cond",
    top: 333,
    left: 189,
  },
  {
    link: "U4_GW01",
    title: "Mills RES-CLNY & Workshop",
    top: 333,
    left: 390,
  },
  {
    link: "U6_GW01",
    title: "Colony",
    top: 333,
    left: 591,
  },
  {
    link: "U9_GW01",
    title: "Cart 2",
    top: 333,
    left: 794,
  },
  {
    link: "U11_GW01",
    title: "Gas LT Pannel",
    top: 333,
    left: 995,
  },
  {
    link: "U12_GW01",
    title: "Card Filter",
    top: 533,
    left: 89,
  },
  {
    link: "U15_GW01",
    title: "Ring 2",
    top: 533,
    left: 299,
  },
  {
    link: "U17_GW01",
    title: "Ring 3",
    top: 533,
    left: 500,
  },
  {
    link: "U19_GW01",
    title: "AC Lab",
    top: 533,
    left: 700,
  },
  {
    link: "U21_GW01",
    title: "Spare 2",
    top: 533,
    left: 899,
  },
  {
    link: "U14_GW01",
    title: "D/R card Filter",
    top: 651,
    left: 200,
  },
  {
    link: "U16_GW01",
    title: "Ring 4",
    top: 651,
    left: 402,
  },
  {
    link: "U18_GW01",
    title: "Bale Press",
    top: 651,
    left: 603,
  },
  {
    link: "U20_GW01",
    title: "Spare",
    top: 651,
    left: 804,
  },
];

const Unit4Lt2 = ({ roundedData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const unit4Lt2MeterTags = [
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 228,
      left: 93,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 228,
      left: 294,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 228,
      left: 496,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 228,
      left: 699,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 228,
      left: 900,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 340,
      left: 195,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 340,
      left: 398,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 340,
      left: 597,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 341,
      left: 800,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 340,
      left: 1001,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 542,
      left: 95,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 542,
      left: 305,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 542,
      left: 507,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 542,
      left: 707.5,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 542,
      left: 906,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 660,
      left: 206,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 660,
      left: 408,
    },

    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 660,
      left: 609.5,
    },
    {
      activePowerTotalTag: roundedData?.U1_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW01_Voltage_Avg,
      top: 660,
      left: 810.5,
    },
  ];
  return (
    <div className="w-full overflow-auto">
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
      <div className="relative w-[1200px] h-full mx-auto">
        {lt2MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_4&lt_scheme=LT_2&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "78px",
              height: "72px",
              backgroundColor: "transparent",
              zIndex: 60,
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
            className={`border-1 border-red-500`}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../unit-4-lt2-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Meter Readings */}
        {unit4Lt2MeterTags.map((meter, index) => (
          <div
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute border-1 border-red-500  z-20  w-[51px] h-[57px] flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1 mt-[-2.4px]">
              {roundedData?.U1_GW01_ActivePower_Total || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1.2px]">
              {roundedData?.U1_GW01_Current_Avg || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-1px]">
              {roundedData?.U1_GW01_Voltage_Avg || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit4Lt2;
