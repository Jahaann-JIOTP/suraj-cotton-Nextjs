"use client";
import { useRouter } from "next/navigation";
import React from "react";
const lt2MeterData = [
  {
    link: "U1_GW01",
    title: "Drying Simplex AC",
    top: 220,
    left: 63,
  },
  {
    link: "U3_GW01",
    title: "Winding AC",
    top: 220,
    left: 264,
  },
  {
    link: "U5_GW01",
    title: "Card 1",
    top: 220,
    left: 463,
  },
  {
    link: "U8_GW01",
    title: "Blow Room",
    top: 220,
    left: 666,
  },
  {
    link: "U10_GW01",
    title: "Winding 1",
    top: 220,
    left: 867,
  },
  {
    link: "U2_GW01",
    title: "Weikel cond",
    top: 330,
    left: 165,
  },
  {
    link: "U4_GW01",
    title: "Mills RES-CLNY & Workshop",
    top: 330,
    left: 365,
  },
  {
    link: "U6_GW01",
    title: "Colony",
    top: 330,
    left: 565,
  },
  {
    link: "U9_GW01",
    title: "Cart 2",
    top: 330,
    left: 766,
  },
  {
    link: "U11_GW01",
    title: "Gas LT Pannel",
    top: 330,
    left: 966,
  },
  {
    link: "U12_GW01",
    title: "Card Filter",
    top: 530,
    left: 65,
  },
  {
    link: "U15_GW01",
    title: "Ring 2",
    top: 530,
    left: 274,
  },
  {
    link: "U17_GW01",
    title: "Ring 3",
    top: 530,
    left: 475,
  },
  {
    link: "U19_GW01",
    title: "AC Lab",
    top: 530,
    left: 675,
  },
  {
    link: "U21_GW01",
    title: "Spare 2",
    top: 530,
    left: 872,
  },
  {
    link: "U22_GW01",
    title: "Wapda 1 Incomming",
    top: 530,
    left: 1060,
  },
  {
    link: "U14_GW01",
    title: "D/R card Filter",
    top: 647,
    left: 176,
  },
  {
    link: "U16_GW01",
    title: "Ring 4",
    top: 647,
    left: 377,
  },
  {
    link: "U18_GW01",
    title: "Bale Press",
    top: 647,
    left: 577,
  },
  {
    link: "U20_GW01",
    title: "Spare",
    top: 647,
    left: 777,
  },
  {
    link: "U23_GW01",
    title: "HFO Incomming",
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
              borderRadius: "0.375rem", // rounded-md
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
        {/* Buttons */}
        {/* Meter Readings */}
        {/* //////////// drying simplex ac ///////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[230.5px] left-[69.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U1_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// winding ac ///////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[230.5px] left-[270.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U3_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// card 1 //////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[231px] left-[470px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U5_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// blow room ///////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[230.5px] left-[672px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U8_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U8_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U8_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// winding 1///////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[231px] left-[872.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U10_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////////////////// */}
        {/* <div className="absolute flex flex-col items-center justify-around z-40 top-[239.5px] left-[1050px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg || "00.00"}
          </span>
        </div> */}
        {/* /////////// weikel cond////////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[341.5px] left-[170.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U2_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// mills res-clny workshop///////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[340.5px] left-[372px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U4_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U4_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U4_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// colony ///////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[340.5px] left-[572px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U6_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// cart 2 ///////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[340.5px] left-[772px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U9_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// gas lt panel//////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[340.5px] left-[972px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U11_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U11_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U11_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* //////////// card filter ///////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[540px] left-[71px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U12_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U12_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U12_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// ring 2 //////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[540.5px] left-[280px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U15_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// ring 3 //////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[540px] left-[480px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U17_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// AC lab//////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[540px] left-[681.2px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U19_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////// spare 2 /////////// */}
        <div className="absolute flex flex-col items-center justify-around z-40 border-1 border-transparent top-[541.5px] left-[878px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U21_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////// wapda 1 icomming /////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[541px] left-[1067.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U22_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U22_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U22_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////// d/r card filter /////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[657.5px] left-[182px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U14_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U14_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U14_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// ring 4 //////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[657.5px] left-[384px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U16_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// bale press //////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[657.8px] left-[583.2px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U18_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ///////////// spare //////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[658px] left-[783.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U20_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U20_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U20_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
        {/* ////////////hfo incomming///////////// */}
        <div className="absolute flex flex-col items-center justify-around border-1 border-transparent z-40 top-[658px] left-[983.5px] w-[51px] h-[57px]">
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_ActivePower_Total || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_Current_Avg || "00.00"}
          </span>
          <span className="meterReadingUnit4Lt2">
            {roundedData?.U23_GW01_Voltage_Avg || "00.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt2;
