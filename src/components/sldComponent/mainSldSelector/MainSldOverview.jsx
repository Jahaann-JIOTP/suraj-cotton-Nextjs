"use client";
import { useRouter } from "next/navigation";
const mainOverviewMeterData = [
  // {
  //   link: "U1_PLC",
  //   title: "Transport",
  //   top: 187,
  //   left: 95,
  // },
  // {
  //   link: "U3_PLC",
  //   title: "Lighting Outside",
  //   top: 187,
  //   left: 245,
  // },
  // {
  //   link: "U5_PLC",
  //   title: "Power House",
  //   top: 180,
  //   left: 511,
  // },
  // {
  //   link: "U7_PLC",
  //   title: "Spare",
  //   top: 363,
  //   left: 97,
  // },
  // {
  //   link: "U9_PLC",
  //   title: "Winding 1",
  //   top: 363,
  //   left: 200,
  // },
  // {
  //   link: "U2_PLC",
  //   title: "Unit 5 aux",
  //   top: 363,
  //   left: 306,
  // },
  {
    link: "U20_GW03",
    title: "T/F 3",
    top: 599,
    left: 106,
    area: "Unit_5",
    lt_scheme: "LT_4",
  },
  {
    link: "U19_GW03",
    title: "T/F 4",
    top: 599,
    left: 296,
    area: "Unit_5",
    lt_scheme: "LT_4",
  },
  {
    link: "U23_GW01",
    title: "Power House IC",
    top: 595,
    left: 788,
    area: "Unit_4",
    lt_scheme: "LT_2",
  },
  {
    link: "U22_GW01",
    title: "Wapda IC",
    top: 597,
    left: 975,
    area: "Unit_4",
    lt_scheme: "LT_2",
  },
];

const MainSldOverview = ({ roundedData }) => {
  const router = useRouter();
  const mainOverviewMeterTags = [
    // wapda 2
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 193,
      left: 99,
    },
    // hfo 1
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 193,
      left: 249,
    },
    // I-GG
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 185.5,
      left: 515,
    },
    // 0/g 2
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 369,
      left: 101,
    },
    // 0/g 1
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 370,
      left: 204,
    },
    // s/t
    {
      // activePowerTotalTag: roundedData?.U1_PLC_ActivePower_Total,
      activePowerTotalTag: "00.00",
      // activeCurrentAvgTag: roundedData?.U1_PLC_Current_Avg,
      activeCurrentAvgTag: "00.00",
      // activeVoltageAvgTag: roundedData?.U1_PLC_Voltage_Avg,
      activeVoltageAvgTag: "00.00",
      top: 370,
      left: 310,
    },
    // T/F 3
    {
      activePowerTotalTag: roundedData?.U20_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW03_Voltage_Avg,
      top: 605,
      left: 110,
    },
    // T/F 4
    {
      activePowerTotalTag: roundedData?.U19_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW03_Voltage_Avg,
      top: 605,
      left: 300,
    },
    // p/h ic
    {
      activePowerTotalTag: roundedData?.U23_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW01_Voltage_Avg,
      top: 601,
      left: 792,
    },
    // wapda ic
    {
      activePowerTotalTag: roundedData?.U22_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW01_Voltage_Avg,
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
                `/meter?area=${meter.area}&lt_scheme=${meter.lt_scheme}&meter_id=${meter.link}&meter_name=${meter.title}`
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
            className={``}
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
            key={index}
            className={`absolute z-20  w-[44.5px] h-[50px] flex flex-col items-center`}
          >
            <span className="meterReadingUnit4Lt1 mt-[-2.5px]">
              {meter.activePowerTotalTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-3.5px]">
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span className="meterReadingUnit4Lt1 mt-[-4.5px]">
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}

        <button
          className="absolute top-[944px] left-[94px] w-[314px] h-[37px] cursor-pointer"
          onClick={() => router.push("/sld?unit=unit5")}
        ></button>

        <button
          className="absolute top-[942px] left-[735px] w-[404px] h-[38px] cursor-pointer"
          onClick={() => router.push("/sld?unit=unit4")}
        ></button>
      </div>
    </div>
  );
};

export default MainSldOverview;
