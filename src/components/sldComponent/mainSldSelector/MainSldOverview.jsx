"use client";
import Link from "next/link";
const mainOverviewMeterData = [
  {
    link: "U27_PLC",
    title: "Wapda 2",
    top: 167,
    left: 179,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U22_PLC",
    title: "HFO 1",
    top: 167,
    left: 313,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U26_PLC",
    title: "JMS 620",
    top: 154,
    left: 548,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U23_PLC",
    title: "O/G 2 (Unit 5)",
    top: 322,
    left: 179,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U24_PLC",
    title: "O/G 1 (Unit 4)",
    top: 322,
    left: 271,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U25_PLC",
    title: "HFO AUX",
    top: 322,
    left: 366,
    area: "hfo",
    // lt_scheme: "LT_1",
  },
  {
    link: "U21_GW03",
    title: "Main Incoming (Unit 5)",
    top: 449,
    left: 181,
    area: "ht",
    // lt_scheme: "LT_2",
  },

  {
    link: "U20_GW03",
    title: "T/F 1",
    top: 690,
    left: 183,
    area: "ht",
    // lt_scheme: "LT_4",
  },
  {
    link: "U19_GW03",
    title: "T/F 2",
    top: 688,
    left: 357,
    area: "ht",
    // lt_scheme: "LT_4",
  },
  {
    link: "U22_GW01",
    title: "P/H IC HFO",
    top: 607,
    left: 795,
    area: "ht",
    // lt_scheme: "LT_2",
  },
  {
    link: "U23_GW01",
    title: "Wapda 1",
    top: 605,
    left: 962,
    area: "ht",
    // lt_scheme: "LT_2",
  },
];

const MainSldOverview = ({ roundedData }) => {
  const mainOverviewMeterTags = [
    // wapda 2
    {
      activePowerTotalTag: roundedData?.U27_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U27_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U27_PLC_Voltage_Avg,
      top: 173,
      left: 183,
    },
    // hfo 1
    {
      activePowerTotalTag: roundedData?.U22_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_PLC_Voltage_Avg,
      top: 173,
      left: 317,
    },
    // I-GG
    {
      activePowerTotalTag: roundedData?.U26_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U26_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U26_PLC_Voltage_Avg,
      top: 161,
      left: 553,
    },
    // 0/g 2
    {
      activePowerTotalTag: roundedData?.U23_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_PLC_Voltage_Avg,
      top: 328.5,
      left: 183,
    },
    // 0/g 1
    {
      activePowerTotalTag: roundedData?.U24_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U24_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U24_PLC_Voltage_Avg,
      top: 329,
      left: 276,
    },
    // HFO Aux
    {
      activePowerTotalTag: roundedData?.U25_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U25_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U25_PLC_Voltage_Avg,
      top: 329,
      left: 370.5,
    },
    // Main incomming
    {
      activePowerTotalTag: roundedData?.U21_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U21_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U21_GW03_Voltage_Avg,
      top: 455,
      left: 185.3,
    },
    // T/F 1
    {
      activePowerTotalTag: roundedData?.U20_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U20_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U20_GW03_Voltage_Avg,
      top: 695,
      left: 188.5,
    },
    // T/F 2
    {
      activePowerTotalTag: roundedData?.U19_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U19_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U19_GW03_Voltage_Avg,
      top: 695,
      left: 361,
    },
    // p/h ic
    {
      activePowerTotalTag: roundedData?.U22_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW01_Voltage_Avg,
      top: 614,
      left: 800,
    },
    // wapda ic
    {
      activePowerTotalTag: roundedData?.U23_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW01_Voltage_Avg,
      top: 611,
      left: 967,
    },
  ];

  return (
    <div className="w-full">
      <div className="relative mx-auto" style={{ width: "1200px" }}>
        {mainOverviewMeterData.map((meter) => (
          <Link
            href={`/meter?area=${meter.area}&page-type=sld&LT_selections=${
              meter.lt_scheme
            }&meter_id=${meter.link}&meter_name=${encodeURIComponent(
              meter.title,
            )}`}
            key={meter.link}
            style={{
              position: "absolute",
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "55px",
              height: "55px",
              backgroundColor: "transparent",
              zIndex: 21,
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          ></Link>
        ))}
        <img
          src="./surajcotton-sld/mainoverview.png"
          alt="Main Overview"
          className="mx-auto"
          style={{ width: "1200px" }}
        />
        {mainOverviewMeterTags.map((meter, index) => (
          <div
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "36px",
              height: "42px",
            }}
            key={index}
            className={`absolute z-20 flex flex-col items-center`}
          >
            <span
              className="text-[10.2px] font-fira-mono"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activePowerTotalTag || "000"}
            </span>
            <span
              className="text-[10.2px] font-fira-mono mt-[-1.5px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeCurrentAvgTag || "000"}
            </span>
            <span
              className="text-[10.2px] font-fira-mono mt-[-1px]"
              style={{ color: "#05f805", fontWeight: 500 }}
            >
              {meter.activeVoltageAvgTag || "000"}
            </span>
          </div>
        ))}

        <Link
          className="absolute font-inter bg-white cursor-pointer"
          href={"/sld?area=Unit_5"}
          style={{
            border: "1px dotted darkgray",
            height: "38px",
            left: "151px",
            top: "948px",
            width: "314px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          To Unit # 5
        </Link>

        <Link
          className="absolute font-inter bg-white text-[#2e2d2d] cursor-pointer"
          href={"/sld?area=Unit_4"}
          style={{
            border: "1px dotted darkgray",
            left: "738px",
            width: "375px",
            top: "948px",
            height: "38px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          To Unit # 4
        </Link>
      </div>
    </div>
  );
};

export default MainSldOverview;
