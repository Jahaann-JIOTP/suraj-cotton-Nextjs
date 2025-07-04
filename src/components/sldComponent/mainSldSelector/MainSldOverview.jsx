"use client";
import { useRouter } from "next/navigation";
const mainOverviewMeterData = [
  {
    link: "U1_PLC",
    title: "Transport",
    top: 187,
    left: 95,
  },
  {
    link: "U3_PLC",
    title: "Lighting Outside",
    top: 187,
    left: 245,
  },
  {
    link: "U5_PLC",
    title: "Power House",
    top: 180,
    left: 511,
  },
  {
    link: "U7_PLC",
    title: "Spare",
    top: 363,
    left: 97,
  },
  {
    link: "U9_PLC",
    title: "Winding 1",
    top: 363,
    left: 200,
  },
  {
    link: "U2_PLC",
    title: "Unit 5 aux",
    top: 363,
    left: 306,
  },
  {
    link: "U4_PLC",
    title: "Lighting Inside",
    top: 599,
    left: 106,
  },
  {
    link: "U6_PLC",
    title: "Turbine",
    top: 599,
    left: 296,
  },
  {
    link: "U8_PLC",
    title: "Drawing 1",
    top: 595,
    left: 788,
  },
  {
    link: "U10_PLC",
    title: "Ring 1",
    top: 597,
    left: 975,
  },
];

const MainSldOverview = ({ roundedData }) => {
  const router = useRouter();
  const mainOverviewMeterTags = [
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 193,
      left: 99,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 193,
      left: 249,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 185.5,
      left: 515,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 369,
      left: 101,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 370,
      left: 204,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 370,
      left: 310,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 605,
      left: 110,
    },
    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 605,
      left: 300,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 601,
      left: 792,
    },

    {
      activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      top: 603,
      left: 978.5,
    },
  ];

  return (
    <div className="w-full">
      <div className="relative w-[1200px] mx-auto">
        {mainOverviewMeterData.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_4&lt_scheme=LT_1&meter_id=${meter.link}&meter_name=${meter.title}`
              )
            }
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "65px",
              height: "62px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem", // rounded-md
              cursor: "pointer",
            }}
            className={`border-1 border-red-500`}
          ></button>
        ))}
        <img
          src="./main-overview.png"
          alt="Main Overview"
          className="w-[1200px] mx-auto"
        />
        {mainOverviewMeterTags.map((meter, index) => (
          <div
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
            className={`absolute border-1 border-red-500  z-20  w-[44.5px] h-[50px] flex flex-col items-center`}
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

        <button
          className="absolute top-[944px] left-[94px] w-[314px] h-[37px] cursor-pointer  border border-red-600"
          onClick={() => router.push("/sld?unit=unit5")}
        ></button>

        <button
          className="absolute top-[942px] left-[735px] w-[404px] h-[38px] cursor-pointer border border-red-600"
          onClick={() => router.push("/sld?unit=unit4")}
        ></button>
      </div>
    </div>
  );
};

export default MainSldOverview;
