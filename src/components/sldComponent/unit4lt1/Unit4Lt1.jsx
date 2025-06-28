"use client";
import React from "react";
import { useRouter } from "next/navigation";
const lt1MeterData = [
  {
    link: "U1_PLC",
    top: 308,
    left: 89,
  },
  {
    link: "U3_PLC",
    top: 303,
    left: 272,
  },
  {
    link: "U5_PLC",
    top: 303,
    left: 455.5,
  },
  {
    link: "U7_PLC",
    top: 307,
    left: 648,
  },
  {
    link: "U9_PLC",
    top: 307,
    left: 838,
  },
  {
    link: "U2_PLC",
    top: 380,
    left: 180,
  },
  {
    link: "U4_PLC",
    top: 380,
    left: 363,
  },
  {
    link: "U6_PLC",
    top: 380,
    left: 560,
  },
  {
    link: "U8_PLC",
    top: 380,
    left: 738,
  },
  {
    link: "U10_PLC",
    top: 380,
    left: 966,
  },
  {
    link: "U12_PLC",
    top: 583,
    left: 317,
  },
  {
    link: "U14_PLC",
    top: 583,
    left: 500,
  },
  {
    link: "U16_PLC",
    top: 583,
    left: 683,
  },
  {
    link: "U18_PLC",
    top: 583,
    left: 876,
  },
  {
    link: "U11_PLC",
    top: 657,
    left: 225,
  },
  {
    link: "U413_PLC",
    top: 656,
    left: 409,
  },
  {
    link: "U15_PLC",
    top: 656,
    left: 591,
  },
  {
    link: "U17_PLC",
    top: 657,
    left: 774,
  },
  {
    link: "U20_PLC",
    top: 657,
    left: 967,
  },
];

const Unit4Lt1 = ({ roundedData }) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => router.push("/sld")}
        className="absolute top-0 left-0 z-30 cursor-pointer bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>

      <div className="relative w-[1200px] h-full mx-auto">
        {lt1MeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/sld/${meter.link}?area=Unit_4&lt_scheme=LT_1&meter_id=${meter.link}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "72px",
              height: "67px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={``}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../Unit-4-lt1-sld.png"
          className="w-full h-full"
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center border-1 border-transparent py-[1px]  gap-[4px] z-20 top-[319px] left-[95.7px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U8_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {/* {roundedData?.U8_PLC_Current_A} */}
            {roundedData?.U8_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U8_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[314px] left-[278px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U15_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U15_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U15_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[314px] left-[462px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U12_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U12_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U12_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[319px] left-[654px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_Voltage_Avg}
          </span>
        </div>
        {/* {replica by yousaf shah saying the same code for each meter reading} */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[319px] left-[845px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U14_PLC_Voltage_Avg}
          </span>
        </div>

        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[391px] left-[187px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U9_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U9_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U9_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[391px] left-[369.5px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U11_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U11_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U11_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[391px] left-[567px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U13_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U13_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U13_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[391px] left-[744.5px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_Voltage_Avg}
          </span>
        </div>
        {/* second replica by yousaf shah saying the same code for each meter reading */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[391px] left-[972.2px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U16_PLC_Voltage_Avg}
          </span>
        </div>

        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[594.5px] left-[324px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U17_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U17_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U17_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[506.3px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U3_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U3_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U3_PLC_Voltage_BC}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[689.5px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U2_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U2_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U2_PLC_Voltage_BC}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[593px] left-[882.5px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_Voltage_BC}
          </span>
        </div>

        {/* {another version of the same code for each meter reading}  */}

        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[232.3px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U20_PLC_Voltage_BC}
          </span>
        </div>

        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[668px] left-[415px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U21_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U21_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U21_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[598px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[780.3px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Voltage_Avg}
          </span>
        </div>
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[973.5px] border-1 border-transparent py-[1px] w-[46px] h-[50px]">
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Current_Avg}
          </span>
          <span className="meterReadingUnit4Lt1">
            {roundedData?.U1_PLC_Voltage_Avg}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt1;
