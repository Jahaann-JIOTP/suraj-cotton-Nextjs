"use client";
import config from "@/constant/apiRouteList";
import Link from "next/link";

import React, { useEffect, useState } from "react";
const fieldMetersBtn = [
  {
    link: "U1_GW02",
    title: "PDB1 CD1 (Field)",
    top: 315,
    left: 75,
    ltScheme: "LT_1",
  },
  {
    link: "U2_GW02",
    title: "PDB2 CD2 (Field)",
    top: 315,
    left: 257,
    ltScheme: "LT_1",
  },
  {
    link: "U3_GW02",
    title: "Card PDB 01 (Field)",
    top: 315,
    left: 430,
    ltScheme: "LT_1",
  },
  {
    link: "U4_GW02",
    title: "PDB 08 (Field)",
    top: 315,
    left: 605,
    ltScheme: "LT_1",
  },
  {
    link: "U22_GW03",
    title: "PDB 07 (Field)",
    top: 315,
    left: 780,
    ltScheme: "LT_2",
  },
  {
    link: "U23_GW03",
    title: "PDB 010 (Field)",
    top: 315,
    left: 955,
    ltScheme: "LT_2",
  },
];
const FieldMeters = () => {
  const [realtime, setRealtime] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [consumptionPerArea, setConumptionPerArea] = useState({});
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const today = currentDate.toISOString().split("T")[0];
  const tomorrow = nextDate.toISOString().split("T")[0];

  const token = localStorage.getItem("token");

  // fetch meter area status
  const fetchMeterAreaStatus = async () => {
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
      top: 322,
      left: 81,
    },
    {
      activePowerTotalTag: roundedData?.U2_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW02_Voltage_Avg,
      top: 322,
      left: 263,
    },
    {
      activePowerTotalTag: roundedData?.U3_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW02_Voltage_Avg,
      top: 322,
      left: 437,
    },
    {
      activePowerTotalTag: roundedData?.U4_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW02_Voltage_Avg,
      top: 322,
      left: 612,
    },
    {
      activePowerTotalTag: roundedData?.U22_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW03_Voltage_Avg,
      top: 322,
      left: 787,
    },
    {
      activePowerTotalTag: roundedData?.U23_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW03_Voltage_Avg,
      top: 322,
      left: 962,
    },
  ];
  const unitConsumption = [
    {
      unit4Consumption: consumptionPerArea?.U4_U1_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U1_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 228.4,
      unit4Left: 36,
      unit5Top: 228.4,
      unit5Left: 114.5,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U2_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U2_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 228.4,
      unit4Left: 226,
      unit5Top: 228.4,
      unit5Left: 304,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U3_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U3_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 228.4,
      unit4Left: 397.5,
      unit5Top: 228.4,
      unit5Left: 477,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U4_GW02_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U4_GW02_Del_ActiveEnergy ?? 0,
      unit4Top: 228.4,
      unit4Left: 567.8,
      unit5Top: 228,
      unit5Left: 650.3,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U22_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U22_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 228,
      unit4Left: 746.6,
      unit5Top: 228,
      unit5Left: 826,
    },
    {
      unit4Consumption: consumptionPerArea?.U4_U23_GW03_Del_ActiveEnergy ?? 0,
      unit5Consumption: consumptionPerArea?.U5_U23_GW03_Del_ActiveEnergy ?? 0,
      unit4Top: 228,
      unit4Left: 922.2,
      unit5Top: 228,
      unit5Left: 1002,
    },
  ];

  const areaOnOffStatusLabels = [
    {
      key: "U1_GW02",
      slots: [
        { id: 1, top: 105, leftOn: 54, leftOff: 130, w: 25 },
        { id: 2, top: 260, leftOn: 71, leftOff: 107, w: 36 },
      ],
    },
    {
      key: "U2_GW02",
      slots: [
        { id: 1, top: 105, leftOn: 243, leftOff: 320, w: 25 },
        { id: 2, top: 260, leftOn: 254, leftOff: 289, w: 36 },
      ],
    },
    {
      key: "U3_GW02",
      slots: [
        { id: 1, top: 105, leftOn: 412, leftOff: 492, w: 25 },
        { id: 2, top: 260, leftOn: 427, leftOff: 463, w: 36 },
      ],
    },
    {
      key: "U4_GW02",
      slots: [
        { id: 1, top: 105, leftOn: 585, leftOff: 665, w: 25 },
        { id: 2, top: 260, leftOn: 602, leftOff: 638, w: 36 },
      ],
    },
    {
      key: "U22_GW03",
      slots: [
        { id: 1, top: 105, leftOn: 762, leftOff: 840, w: 25 },
        { id: 2, top: 260, leftOn: 777, leftOff: 813, w: 36 },
      ],
    },
    {
      key: "U23_GW03",
      slots: [
        { id: 1, top: 105, leftOn: 938, leftOff: 1015, w: 25 },
        { id: 2, top: 260, leftOn: 953, leftOff: 989, w: 36 },
      ],
    },
  ];

  const fetchMConsumptionPerArea = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `${config.BASE_URL}/meter/meter-wise-consumption`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate: today,
            endDate: tomorrow,
          }),
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
                width: "64px",
                height: "59px",
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
          src="./sld/fieldMeter.png"
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
              className="absolute font-fira-mono mt-[1px] flex items-center justify-center"
              style={{
                fontSize: "11px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit4Left,
                top: unit.unit4Top,
                width: "42.2px",
                height: "19px",
              }}
            >
              {fix2decimals(unit.unit4Consumption ?? 0) || "00.00"}
            </div>
            <div
              className="absolute font-fira-mono mt-[1px] flex items-center justify-center"
              style={{
                fontSize: "11px",
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit5Left,
                top: unit.unit5Top,
                width: "42.2px",
                height: "19px",
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
              width: "40.5px",
              height: "47px",
            }}
          >
            <span
              className="font-fira-mono mt-[-1px]"
              style={{
                fontSize: "11px",
                color: "#05f805",
                fontWeight: 500,
                marginTop: "",
              }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
              className="font-fira-mono mt-[-0.5px]"
              style={{
                fontSize: "11px",
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
                fontSize: "11px",
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
