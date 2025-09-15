"use client";
import config from "@/constant/apiRouteList";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const fieldMetersBtn = [
  {
    link: "U1_GW02",
    title: "PDB1 CD1 (Field)",
    top: 310,
    left: 76,
    ltScheme: "LT_3",
  },
  {
    link: "U2_GW02",
    title: "PDB2 CD2 (Field)",
    top: 310,
    left: 245,
    ltScheme: "LT_3",
  },
  {
    link: "U3_GW02",
    title: "Card PDB 01 (Field)",
    top: 310,
    left: 423,
    ltScheme: "LT_3",
  },
  {
    link: "U4_GW02",
    title: "PDB 08 (Field)",
    top: 310,
    left: 602,
    ltScheme: "LT_3",
  },
  {
    link: "U22_GW03",
    title: "PDB 07 (Field)",
    top: 310,
    left: 780,
    ltScheme: "LT_4",
  },
  {
    link: "U23_GW03",
    title: "PDB 010 (Field)",
    top: 310,
    left: 959,
    ltScheme: "LT_4",
  },
];
const FieldMeters = () => {
  const [realtime, setRealtime] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [consumptionPerArea, setConumptionPerArea] = useState({});
  const router = useRouter();
  const token = localStorage.getItem("token");
  // fetch real time values
  const getRealTimeData = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.MAIN_METER_TAGS_LINK}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await response.json();
      if (response.ok) {
        setRealtime(resData);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  function roundNumbersInJson(obj) {
    const newObj = { ...obj };

    for (let key in newObj) {
      const value = newObj[key];

      if (typeof value === "number") {
        if (value >= 1000) {
          // No decimal
          newObj[key] = Math.round(value);
        } else if (value >= 100 && value < 1000) {
          // 1 decimal
          newObj[key] = Math.round(value * 10) / 10;
        } else if (value < 100) {
          // 2 decimals
          newObj[key] = Math.round(value * 100) / 100;
        }
      }
    }

    return newObj;
  }
  const roundedData = roundNumbersInJson(realtime);
  // fetch meter area status
  const fetchMeterAreaStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.METER_CONFIG.GET_METER_TOGGLE_STATUS}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();

      if (response.ok) {
        // setMeterToggleStatus(resResult);
        // Map meter status to selectedUnits
        const initialUnits = {};
        resResult.forEach((item) => {
          initialUnits[item.meterId] = item.area === "unit4" ? 4 : 5;
        });

        setCurrentArea(initialUnits);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // helper function to fix to 2 decimals
  const fix2decimals = (meter) => Number(meter.toFixed(0));

  const fieldMetersTags = [
    {
      activePowerTotalTag: roundedData?.U1_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW02_Voltage_Avg,
      top: 315,
      left: 80,
    },
    {
      activePowerTotalTag: roundedData?.U2_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW02_Voltage_Avg,
      top: 315,
      left: 250,
    },
    {
      activePowerTotalTag: roundedData?.U3_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW02_Voltage_Avg,
      top: 315,
      left: 428,
    },
    {
      activePowerTotalTag: roundedData?.U4_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW02_Voltage_Avg,
      top: 315,
      left: 606,
    },
    {
      activePowerTotalTag: roundedData?.U22_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW03_Voltage_Avg,
      top: 315,
      left: 784,
    },
    {
      activePowerTotalTag: roundedData?.U23_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW03_Voltage_Avg,
      top: 315,
      left: 963,
    },
  ];
  const unitConsumption = [
    {
      unit4Consumption: consumptionPerArea?.U4_U1_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U1_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 238,
      unit4Left: 44,
      unit5Top: 238,
      unit5Left: 117,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U2_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U2_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 237,
      unit4Left: 213,
      unit5Top: 236.5,
      unit5Left: 286,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U3_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U3_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 236.5,
      unit4Left: 391,
      unit5Top: 236.5,
      unit5Left: 464,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U4_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U4_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 236.5,
      unit4Left: 570,
      unit5Top: 236.5,
      unit5Left: 642,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U22_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U22_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 236.5,
      unit4Left: 748,
      unit5Top: 236.5,
      unit5Left: 820,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U23_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U23_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 236.5,
      unit4Left: 926,
      unit5Top: 236.5,
      unit5Left: 999,
    },
  ];
  const areaOnOffStatusLabels = [
    {
      key: "U1_GW02",
      on: [
        { top: 109.5, left: 50.5, img: "onmeter1.png", w: 27 },
        { top: 260, left: 63.5, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 109.5, left: 120.5, img: "offmeter1.png", w: 27 },
        { top: 259, left: 99, img: "offmeter2.png", w: 36 },
      ],
    },
    {
      key: "U2_GW02",
      on: [
        { top: 109.5, left: 220.5, img: "onmeter1.png", w: 27 },
        { top: 259.5, left: 233.5, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 108.5, left: 289.7, img: "offmeter1.png", w: 27 },
        { top: 259, left: 268.7, img: "offmeter2.png", w: 36 },
      ],
    },
    {
      key: "U3_GW02",
      on: [
        { top: 108.5, left: 398.5, img: "onmeter1.png", w: 27 },
        { top: 259.2, left: 411.5, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 108.5, left: 468.5, img: "offmeter1.png", w: 27 },
        { top: 259, left: 446.7, img: "offmeter2.png", w: 36 },
      ],
    },
    {
      key: "U4_GW02",
      on: [
        { top: 109.5, left: 576.1, img: "onmeter1.png", w: 27 },
        { top: 259.2, left: 589, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 109.5, left: 646, img: "offmeter1.png", w: 27 },
        { top: 259, left: 624.7, img: "offmeter2.png", w: 36 },
      ],
    },
    {
      key: "U22_GW03",
      on: [
        { top: 108.5, left: 754.4, img: "onmeter1.png", w: 27 },
        { top: 259.2, left: 767.4, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 108.5, left: 824, img: "offmeter1.png", w: 27 },
        { top: 259, left: 802.5, img: "offmeter2.png", w: 36 },
      ],
    },
    {
      key: "U23_GW03",
      on: [
        { top: 108.5, left: 932.5, img: "onmeter1.png", w: 27 },
        { top: 259.2, left: 945, img: "onmeter2.png", w: 36 },
      ],
      off: [
        { top: 108.5, left: 1002, img: "offmeter1.png", w: 27 },
        { top: 259, left: 981, img: "offmeter2.png", w: 36 },
      ],
    },
  ];

  // fetch meter consumption per area
  const fetchMConsumptionPerArea = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `${config.BASE_URL}/meter/meter-wise-consumption`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setConumptionPerArea(resResult);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchMConsumptionPerArea();
    fetchMeterAreaStatus();
    callhiddenConsumptionApi();
    getRealTimeData();
    const interval = setInterval(() => {
      getRealTimeData();
      fetchMConsumptionPerArea();
      callhiddenConsumptionApi();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-3 p-5 border-[#1F5897] overflow-auto ">
      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {fieldMetersBtn.map((meter) => {
          return (
            <button
              key={meter.link}
              onClick={() =>
                router.push(
                  `/meter?area=Unit_5&page-type=field-meter&LT_selections=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`
                )
              }
              style={{
                position: "absolute",
                top: `${meter.top}px`,
                left: `${meter.left}px`,
                width: "49px",
                height: "46px",
                zIndex: 100,
                borderRadius: "0.4.2rem", // rounded-md
                cursor: "pointer",
              }}
              className={`rounded-md`}
            ></button>
          );
        })}
        {/* Diagram Image */}
        <img
          src="./sld/field-meters.png"
          className=""
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* indicators */}
        {/* /////////////////////////////// */}
        {areaOnOffStatusLabels.map(({ key, on, off }) =>
          currentArea[key] === 4 ? (
            <React.Fragment key={key}>
              {on.map(({ top, left, img, w }, i) => (
                <div
                  key={`${key}-on-${i}`}
                  className="absolute bg-white"
                  style={{ top: `${top}px`, left: `${left}px` }}
                >
                  <img
                    src={`./fieldMeterStatus/${img}`}
                    // className={`w-[${w}px]`}
                    style={{ width: `${w}px` }}
                    alt=""
                  />
                </div>
              ))}
              {off.map(({ top, left, img, w }, i) => (
                <div
                  key={`${key}-off-${i}`}
                  className="absolute bg-white"
                  style={{ top: `${top}px`, left: `${left}px` }}
                >
                  <img
                    src={`./fieldMeterStatus/${img}`}
                    className={`w-[${w}px]`}
                    style={{ width: `${w}px` }}
                    alt=""
                  />
                </div>
              ))}
            </React.Fragment>
          ) : null
        )}
        {/* //============================= */}
        {/* per unit reading */}
        {unitConsumption.map((unit, index) => (
          <div key={index}>
            <div
              className="absolute font-fira-mono mt-[0.5px] flex items-center justify-center"
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit4Left,
                top: unit.unit4Top,
                width: "30px",
                height: "14px",
              }}
            >
              {/* {unit.unit4Consumption.toFixed(2)} */}
              {fix2decimals(unit.unit4Consumption ?? 0) || "00.00"}
            </div>
            <div
              className="absolute font-fira-mono mt-[0.8px] flex items-center justify-center"
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit5Left,
                top: unit.unit5Top,
                width: "29.5px",
                height: "14px",
              }}
            >
              {fix2decimals(unit.unit5Consumption) || "00.00"}
            </div>
          </div>
        ))}
        {/* Meter Readings */}
        {fieldMetersTags.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center z-40"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "30.5px",
              height: "36px",
            }}
          >
            <span
              className="font-fira-mono"
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                marginTop: "",
              }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
              className="font-fira-mono"
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                marginTop: "",
              }}
            >
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span
              className="font-fira-mono"
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                marginTop: "",
              }}
            >
              {meter.activeVoltageAvgTag || "00.00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldMeters;
