"use client";
import React from "react";
import { useRouter } from "next/navigation";
const singlemeterData = [
  {
    link: "U8_PLC",
    top: 317,
    left: 195,
  },
  {
    link: "U15_PLC",
    top: 317,
    left: 385,
  },
  {
    link: "U12_PLC",
    top: 317,
    left: 575,
  },
  {
    link: "U14_PLC",
    top: 317,
    left: 763,
  },
  {
    link: "U9_PLC",
    top: 392,
    left: 291,
  },
  {
    link: "U11_PLC",
    top: 392,
    left: 480,
  },
  {
    link: "U13_PLC",
    top: 392,
    left: 670,
  },
  {
    link: "U16_PLC",
    top: 393,
    left: 867,
  },
  {
    link: "U17_PLC",
    top: 600,
    left: 295,
  },
  {
    link: "U3_PLC",
    top: 600,
    left: 486,
  },
  {
    link: "U2_PLC",
    top: 600,
    left: 675,
  },
  {
    link: "U20_PLC",
    top: 600,
    left: 865,
  },
  {
    link: "U4_PLC",
    top: 676,
    left: 391,
  },
  {
    link: "U21_PLC",
    top: 676,
    left: 580,
  },
  {
    link: "U1_PLC",
    top: 676,
    left: 770,
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
        {/* {singlemeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/sld/${meter.link}?area=unit4&lt_scheme=lt1&meter_id=${meter.link}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "76px",
              height: "70px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={``}
          ></button>
        ))} */}
        {/* Diagram Image */}
        <img
          src="../../../Unit-4-lt1-sld.png"
          className="w-full h-full"
          alt="unit 4 sld"
        />
        {/* Meter Readings */}
        {/* ///////////////////////// */}
        <div className="absolute flex flex-col items-center justify-center border-1  gap-[4px] z-20 top-[319px] left-[95px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[313.5px] left-[279px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[313.5px] left-[464px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[318px] left-[648px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[318px] left-[840px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[390px] left-[192px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[390px] left-[371.5px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[390px] left-[570px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[390px] left-[740px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[390px] left-[970px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[320px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[500px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[684px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[595px] left-[876px] w-[48px] h-[53px]">
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

        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[230px] w-[48px] h-[53px]">
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

        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[420px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[600px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[780px] w-[48px] h-[53px]">
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
        <div className="absolute flex flex-col items-center justify-center gap-[4px] z-20 top-[667px] left-[970px] w-[48px] h-[53px]">
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
