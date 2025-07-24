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
    link: "U2_GW01",
    title: "Weikel cond",
    top: 333,
    left: 189,
  },
  {
    link: "U3_GW01",
    title: "Winding AC",
    top: 220,
    left: 288,
  },
  {
    link: "U4_GW01",
    title: "Mills RES-CLNY & Workshop",
    top: 333,
    left: 390,
  },
  {
    link: "U5_GW01",
    title: "Card 1",
    top: 220,
    left: 490,
  },
  {
    link: "U6_GW01",
    title: "Colony",
    top: 333,
    left: 591,
  },
  {
    link: "U8_GW01",
    title: "Blow Room",
    top: 220,
    left: 693,
  },
  {
    link: "U9_GW01",
    title: "Cart 2",
    top: 333,
    left: 794,
  },
  {
    link: "U10_GW01",
    title: "Winding 1",
    top: 220,
    left: 895,
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
    link: "U14_GW01",
    title: "D/R card Filter",
    top: 651,
    left: 200,
  },
  {
    link: "U15_GW01",
    title: "Ring 2",
    top: 533,
    left: 299,
  },
  {
    link: "U16_GW01",
    title: "Ring 4",
    top: 651,
    left: 402,
  },
  {
    link: "U17_GW01",
    title: "Ring 3",
    top: 533,
    left: 500,
  },
  {
    link: "U18_GW01",
    title: "Bale Press",
    top: 651,
    left: 603,
  },
  {
    link: "U19_GW01",
    title: "AC Lab",
    top: 533,
    left: 700,
  },
  {
    link: "U20_GW01",
    title: "Spare",
    top: 651,
    left: 804,
  },
  {
    link: "U21_GW01",
    title: "Spare 2",
    top: 533,
    left: 899,
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
      top: 228,
      left: 93,
    },
    // weikel cond
    {
      activePowerTotalTag: roundedData?.U2_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW01_Voltage_Avg,
      top: 340,
      left: 195,
    },
    // winding AC
    {
      activePowerTotalTag: roundedData?.U3_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW01_Voltage_Avg,
      top: 228,
      left: 294,
    },
    // mills res-clny & workshop
    {
      activePowerTotalTag: roundedData?.U4_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW01_Voltage_Avg,
      top: 340,
      left: 398,
    },
    // card 1
    {
      activePowerTotalTag: roundedData?.U5_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW01_Voltage_Avg,
      top: 228,
      left: 496,
    },
    // colony
    {
      activePowerTotalTag: roundedData?.U6_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U6_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U6_GW01_Voltage_Avg,
      top: 340,
      left: 597,
    },
    // blow room
    {
      activePowerTotalTag: roundedData?.U8_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U8_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U8_GW01_Voltage_Avg,
      top: 228,
      left: 699,
    },
    // card 2
    {
      activePowerTotalTag: roundedData?.U9_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW01_Voltage_Avg,
      top: 341,
      left: 800,
    },
    // winding 1
    {
      activePowerTotalTag: roundedData?.U10_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW01_Voltage_Avg,
      top: 228,
      left: 900,
    },
    // gas lt panel
    {
      activePowerTotalTag: roundedData?.U11_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U11_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U11_GW01_Voltage_Avg,
      top: 340,
      left: 1001,
    },
    // card filter bypass
    {
      activePowerTotalTag: roundedData?.U12_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_GW01_Voltage_Avg,
      top: 542,
      left: 95,
    },
    // d/r card filter
    {
      activePowerTotalTag: roundedData?.U14_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW01_Voltage_Avg,
      top: 660,
      left: 206,
    },
    // ring 2
    {
      activePowerTotalTag: roundedData?.U15_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW01_Voltage_Avg,
      top: 542,
      left: 305,
    },
    // ring 4
    {
      activePowerTotalTag: roundedData?.U16_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U16_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U16_GW01_Voltage_Avg,
      top: 660,
      left: 408,
    },
    // ring 3
    {
      activePowerTotalTag: roundedData?.U17_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW01_Voltage_Avg,
      top: 542,
      left: 507,
    },
    // bale press
    {
      activePowerTotalTag: roundedData?.U18_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW01_Voltage_Avg,
      top: 660,
      left: 609.5,
    },
    // ac lab
    {
      activePowerTotalTag: roundedData?.U19_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW01_Voltage_Avg,
      top: 542,
      left: 707.5,
    },
    // spare
    {
      activePowerTotalTag: roundedData?.U20_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW01_Voltage_Avg,
      top: 660,
      left: 810.5,
    },
    // spare 2
    {
      activePowerTotalTag: roundedData?.U21_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW01_Voltage_Avg,
      top: 542,
      left: 906,
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
            className={``}
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
            key={index}
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute z-20  w-[51px] h-[57px] flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1">
              {meter.activePowerTotalTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1">
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1">
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unit4Lt2;
