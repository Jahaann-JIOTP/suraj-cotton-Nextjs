"use client";
import { useRouter } from "next/navigation";
import React from "react";
const lt2MeterData = [
  {
    link: "U1_GW01",
    top: 220,
    left: 63,
  },
  {
    link: "U3_GW01",
    top: 220,
    left: 264,
  },
  {
    link: "U5_GW01",
    top: 220,
    left: 463,
  },
  {
    link: "U8_GW01",
    top: 220,
    left: 666,
  },
  {
    link: "U10_GW01",
    top: 220,
    left: 867,
  },
  {
    link: "U2_GW01",
    top: 330,
    left: 165,
  },
  {
    link: "U4_GW01",
    top: 330,
    left: 365,
  },
  {
    link: "U6_GW01",
    top: 330,
    left: 565,
  },
  {
    link: "U9_GW01",
    top: 330,
    left: 766,
  },
  {
    link: "U11_GW01",
    top: 330,
    left: 966,
  },
  {
    link: "U12_GW01",
    top: 530,
    left: 65,
  },
  {
    link: "U5_GW01",
    top: 530,
    left: 274,
  },
  {
    link: "U17_GW01",
    top: 530,
    left: 475,
  },
  {
    link: "U19_GW01",
    top: 530,
    left: 675,
  },
  {
    link: "U21_GW01",
    top: 530,
    left: 872,
  },
  {
    link: "U23_GW01",
    top: 530,
    left: 1060,
  },
  {
    link: "U14_GW01",
    top: 647,
    left: 176,
  },
  {
    link: "U16_GW01",
    top: 647,
    left: 377,
  },
  {
    link: "U18_GW01",
    top: 647,
    left: 577,
  },
  {
    link: "U20_GW01",
    top: 647,
    left: 777,
  },
  {
    link: "U22_GW01",
    top: 647,
    left: 977,
  },
];

const Unit4Lt2 = ({ roundedData }) => {
  const router = useRouter();
  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 z-30 cursor-pointer bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>
      <div className="relative w-[1200px] h-full mx-auto">
        {lt2MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/sld/${meter.link}?area=unit4&lt_scheme=LT_2&meter_id=${meter.link}`
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
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../Unit-4-lt2-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />
        {/* Buttons */}
        {/* Meter Readings */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[230.5px] left-[69.5px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[230.5px] left-[270.5px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[231px] left-[470px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[230.5px] left-[672px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[231px] left-[872.5px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        {/* <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 top-[239.5px] left-[1050px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div> */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent z-40 top-[341.5px] left-[170.5px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[340.5px] left-[372px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[340.5px] left-[572px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[340.5px] left-[772px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[340.5px] left-[972px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[540px] left-[71px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[540.5px] left-[280px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent top-[540px] left-[480px] py-[1px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent py-[1px] top-[540px] left-[681.2px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] z-40 border-1 border-transparent py-[1px] top-[541.5px] left-[878px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[541px] left-[1067.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[657.5px] left-[182px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[657.5px] left-[384px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[657.8px] left-[583.2px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[658px] left-[783.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-around gap-[4px] border-1 border-transparent py-[1px] z-40 top-[658px] left-[983.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt2;
