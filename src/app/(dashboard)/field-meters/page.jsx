"use client";
import config from "@/constant/apiRouteList";
import Link from "next/link";

import React, { useEffect, useState } from "react";
const fieldMetersBtn = [
  {
    link: "U1_GW02",
    title: "PDB1 CD1 (Field)",
    top: 289,
    left: 71,
    ltScheme: "LT_1",
  },
  {
    link: "U2_GW02",
    title: "PDB2 CD2 (Field)",
    top: 289,
    left: 242,
    ltScheme: "LT_1",
  },
  {
    link: "U3_GW02",
    title: "Card PDB 01 (Field)",
    top: 289,
    left: 420,
    ltScheme: "LT_1",
  },
  {
    link: "U4_GW02",
    title: "PDB 08 (Field)",
    top: 289,
    left: 598,
    ltScheme: "LT_1",
  },
  {
    link: "U22_GW03",
    title: "PDB 07 (Field)",
    top: 289,
    left: 776,
    ltScheme: "LT_2",
  },
  {
    link: "U23_GW03",
    title: "PDB 010 (Field)",
    top: 289,
    left: 954,
    ltScheme: "LT_2",
  },
];
const FieldMeters = () => {
  const [realtime, setRealtime] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [consumptionPerArea, setConumptionPerArea] = useState({});

  const token = localStorage.getItem("token");

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
        if (Math.abs(value) > 1e3) {
          newObj[key] = 0;
        } else if (value >= 1000) {
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

  // helper function to fix to 2 decimals
  const fix2decimals = (meter) => Number(meter.toFixed(0));

  const fieldMetersTags = [
    {
      activePowerTotalTag: roundedData?.U1_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW02_Voltage_Avg,
      top: 295,
      left: 76,
    },
    {
      activePowerTotalTag: roundedData?.U2_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW02_Voltage_Avg,
      top: 295,
      left: 247.5,
    },
    {
      activePowerTotalTag: roundedData?.U3_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW02_Voltage_Avg,
      top: 295,
      left: 425.5,
    },
    {
      activePowerTotalTag: roundedData?.U4_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW02_Voltage_Avg,
      top: 295,
      left: 603.5,
    },
    {
      activePowerTotalTag: roundedData?.U22_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW03_Voltage_Avg,
      top: 295,
      left: 781.5,
    },
    {
      activePowerTotalTag: roundedData?.U23_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW03_Voltage_Avg,
      top: 295,
      left: 959.5,
    },
  ];
  const unitConsumption = [
    {
      unit4Consumption: consumptionPerArea?.U4_U1_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U1_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 41,
      unit5Top: 211.5,
      unit5Left: 110,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U2_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U2_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 210,
      unit5Top: 211.5,
      unit5Left: 281,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U3_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U3_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 390,
      unit5Top: 211.5,
      unit5Left: 459,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U4_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U4_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 566.5,
      unit5Top: 211.5,
      unit5Left: 636.5,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U22_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U22_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 746,
      unit5Top: 211.5,
      unit5Left: 813,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U23_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U23_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 211.5,
      unit4Left: 924,
      unit5Top: 211.5,
      unit5Left: 993,
    },
  ];

  const areaOnOffStatusLabels = [
    {
      key: "U1_GW02",
      slots: [
        { id: 1, top: 90, leftOn: 50.5, leftOff: 120, w: 25 },
        { id: 2, top: 238, leftOn: 63.4, leftOff: 99, w: 36 },
      ],
    },
    {
      key: "U2_GW02",
      slots: [
        { id: 1, top: 90, leftOn: 220.2, leftOff: 289.7, w: 25 },
        { id: 2, top: 238, leftOn: 233.5, leftOff: 268.7, w: 36 },
      ],
    },
    {
      key: "U3_GW02",
      slots: [
        { id: 1, top: 90, leftOn: 398.2, leftOff: 468.5, w: 25 },
        { id: 2, top: 238, leftOn: 411.5, leftOff: 446.7, w: 36 },
      ],
    },
    {
      key: "U4_GW02",
      slots: [
        { id: 1, top: 90, leftOn: 576.1, leftOff: 646, w: 25 },
        { id: 2, top: 238, leftOn: 589, leftOff: 624.7, w: 36 },
      ],
    },
    {
      key: "U22_GW03",
      slots: [
        { id: 1, top: 90, leftOn: 754.4, leftOff: 824, w: 25 },
        { id: 2, top: 238, leftOn: 767.4, leftOff: 802.5, w: 36 },
      ],
    },
    {
      key: "U23_GW03",
      slots: [
        { id: 1, top: 90, leftOn: 932.5, leftOff: 1002, w: 25 },
        { id: 2, top: 238, leftOn: 945, leftOff: 981, w: 36 },
      ],
    },
  ];

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
    fetchMeterAreaStatus();
    fetchMConsumptionPerArea();
    getRealTimeData();
    const interval = setInterval(() => {
      fetchMeterAreaStatus();
      getRealTimeData();
      fetchMConsumptionPerArea();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-3 p-5 border-[#1F5897] overflow-auto ">
      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {fieldMetersBtn.map((meter) => {
          return (
            <Link
              key={meter.link}
              href={`/meter?area=Unit_5&page-type=field-meter&LT_selections=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`}
              style={{
                position: "absolute",
                top: `${meter.top}px`,
                left: `${meter.left}px`,
                width: "56px",
                height: "52px",
                zIndex: 100,
                borderRadius: "0.4.2rem", // rounded-md
                cursor: "pointer",
              }}
              className={`rounded-md`}
            ></Link>
          );
        })}
        {/* Diagram Image */}
        <img
          src="./sld/fieldmeter.png"
          className=""
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />

        {/* //============================= */}

        {areaOnOffStatusLabels.map(({ key, slots }) => (
          <React.Fragment key={key}>
            {slots.map(({ id, top, leftOn, leftOff, w }) => {
              const areaValue = currentArea[key]; // 4 or 5

              // Default images
              let imgOn = `offmeter${id}.png`;
              let imgOff = `offmeter${id}.png`;

              // Assign correct images
              if (areaValue === 4) {
                imgOn = `onmeter${id}.png`;
              } else if (areaValue === 5) {
                imgOff = `onmeter${id}.png`;
              }

              // ✅ Rotate only meter2 images on unit 5 (X axis)
              const needsRotation = areaValue === 5 && id === 2;

              const rotationStyle = needsRotation
                ? { transform: "rotateY(180deg)" }
                : {};

              return (
                <React.Fragment key={`${key}-${id}`}>
                  {/* First slot (ON side) */}
                  <div
                    className="absolute"
                    style={{ top: `${top}px`, left: `${leftOn}px` }}
                  >
                    <img
                      src={`./fieldMeterStatus/${imgOn}`}
                      style={{ width: `${w}px`, ...rotationStyle }}
                      alt=""
                    />
                  </div>

                  {/* Second slot (OFF side) */}
                  <div
                    className="absolute"
                    style={{ top: `${top}px`, left: `${leftOff}px` }}
                  >
                    <img
                      src={`./fieldMeterStatus/${imgOff}`}
                      style={{ width: `${w}px`, ...rotationStyle }}
                      alt=""
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}

        {/* per unit reading */}
        {unitConsumption.map((unit, index) => (
          <div key={index}>
            <div
              className="absolute font-fira-mono mt-[0.5px] flex items-center justify-center"
              style={{
                fontSize: "9px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit4Left,
                top: unit.unit4Top,
                width: "35.5px",
                height: "16px",
              }}
            >
              {fix2decimals(unit.unit4Consumption ?? 0) || "00.00"}
            </div>
            <div
              className="absolute font-fira-mono mt-[0.8px] flex items-center justify-center"
              style={{
                fontSize: "9px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit5Left,
                top: unit.unit5Top,
                width: "35.2px",
                height: "16px",
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
            className="absolute flex flex-col items-center justify-between z-40"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
              width: "35px",
              height: "41px",
            }}
          >
            <span
              className="font-fira-mono"
              style={{
                fontSize: "9px",
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
                fontSize: "9px",
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
                fontSize: "9px",
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
