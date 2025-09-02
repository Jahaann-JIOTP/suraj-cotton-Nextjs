"use client";
import config from "@/constant/apiRouteList";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiSolidDownArrowSquare } from "react-icons/bi";
const fieldMetersBtn = [
  {
    link: "U1_GW02",
    title: "PDB2 CD1 (Field)",
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
    link: "U22_GW02",
    title: "PDB 07 (Field)",
    top: 310,
    left: 780,
    ltScheme: "LT_3",
  },
  {
    link: "U23_GW02",
    title: "PDB 07 (Field",
    top: 310,
    left: 959,
    ltScheme: "LT_3",
  },
];
const FieldMeters = () => {
  const [realtime, setRealtime] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  console.log("Areas of meter", currentArea.U1_GW02);
  const router = useRouter();
  // fetch real time values
  const getRealTimeData = async () => {
    const token = localStorage.getItem("token");
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
      activePowerTotalTag: roundedData?.U22_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW02_Voltage_Avg,
      top: 315,
      left: 784,
    },
    {
      activePowerTotalTag: roundedData?.U23_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW02_Voltage_Avg,
      top: 315,
      left: 963,
    },
  ];
  const unitConsumption = [
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 238,
      unit4Left: 44,
      unit5Top: 238,
      unit5Left: 117,
    },
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 237,
      unit4Left: 213,
      unit5Top: 236.5,
      unit5Left: 286,
    },
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 236.5,
      unit4Left: 391,
      unit5Top: 236.5,
      unit5Left: 464,
    },
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 236.5,
      unit4Left: 570,
      unit5Top: 236.5,
      unit5Left: 642,
    },
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 236.5,
      unit4Left: 748,
      unit5Top: 236.5,
      unit5Left: 820,
    },
    {
      unit4Consumption: "--.--",
      unit5Consumption: "--.--",
      unit4Top: 236.5,
      unit4Left: 926,
      unit5Top: 236.5,
      unit5Left: 999,
    },
  ];
  useEffect(() => {
    fetchMeterAreaStatus();
    getRealTimeData();
    const interval = setInterval(getRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-4 p-5 border-[#1F5897] overflow-auto ">
      <div className="relative h-full mx-auto" style={{ width: "1100px" }}>
        {fieldMetersBtn.map((meter) => (
          <button
            key={meter.link}
            onClick={() =>
              router.push(
                `/meter?area=Unit_5&page-type=field-meter&lt_scheme=LT_3&meter_id=${meter.link}&meter_name=${meter.title}`
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
        ))}
        {/* Diagram Image */}
        <img
          src="./sld/field-meters.png"
          className=""
          style={{ width: "1100px" }}
          alt="unit 4 sld"
        />
        {/* indicators */}
        {/* pdb cd1 indicator */}
        {/* {currentArea.U1_GW02 === 4 ? (
          <div className="absolute top-[127px] left-[50px]">
            <img src="./onMeter1.png" className="w-[26px]" alt="" />
          </div>
        ) : (
          ""
        )}
        {currentArea.U1_GW02 !== 5 ? (
          <div className="absolute top-[104px] left-[115.5px]">
            <BiSolidDownArrowSquare className="text-red-500  text-[36.5px]" />
          </div>
        ) : (
          ""
        )} */}
        {/* per unit reading */}
        {unitConsumption.map((unit, index) => (
          <div key={index}>
            <div
              className="absolute flex items-center justify-center text-[10px]"
              style={{
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit4Left,
                top: unit.unit4Top,
                width: "30px",
                height: "14px",
              }}
            >
              {unit.unit4Consumption}
            </div>
            <div
              className="absolute flex items-center justify-center text-[10px]"
              style={{
                color: "#05f805",
                fontWeight: 500,
                left: unit.unit5Left,
                top: unit.unit5Top,
                width: "29.5px",
                height: "14px",
              }}
            >
              {unit.unit5Consumption}
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
              style={{
                fontSize: "8px",
                color: "#05f805",
                fontWeight: 500,
                marginTop: "-0.5px",
              }}
            >
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span
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
