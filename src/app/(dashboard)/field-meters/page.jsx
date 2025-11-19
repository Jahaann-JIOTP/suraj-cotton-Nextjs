"use client";
import config from "@/constant/apiRouteList";
import Link from "next/link";

import React, { useEffect, useState } from "react";

const NewFieldMeter = () => {
  const [realtime, setRealtime] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [consumptionPerArea, setConumptionPerArea] = useState({});
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const today = currentDate.toISOString().split("T")[0];
  const tomorrow = nextDate.toISOString().split("T")[0];

  const token = localStorage.getItem("token");
  console.log("current area", currentArea);
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
  const fix2decimals = (meter = 0) => Number(meter.toFixed(2));

  const fieldMetersTags = [
    // pdbcd1 and pdb08 meters
    {
      title: "Card 1-4+9-12",
      link: "U5_GW01",
      activePowerTotalTag: roundedData?.U5_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U5_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U5_GW01_Voltage_Avg,
      mtop: 124,
      mleft: 55,
      linktop: 116,
      linkleft: 48,
      ltScheme: "LT_1",
    },
    {
      title: "Comber 1-14+Lap Former 1-3",
      link: "U14_GW02",
      activePowerTotalTag: roundedData?.U14_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U14_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U14_GW02_Voltage_Avg,
      mtop: 124,
      mleft: 291.5,
      linktop: 116,
      linkleft: 284,
      ltScheme: "LT_1",
    },
    {
      title: "PDBCD1",
      link: "U1_GW02",
      activePowerTotalTag: roundedData?.U1_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U1_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U1_GW02_Voltage_Avg,
      mtop: 346,
      mleft: 55,
      linktop: 338,
      linkleft: 48,
      ltScheme: "LT_1",
    },
    {
      title: "PDB08",
      link: "U4_GW02",
      activePowerTotalTag: roundedData?.U4_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U4_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U4_GW02_Voltage_Avg,
      mtop: 346,
      mleft: 291.5,
      linktop: 338,
      linkleft: 284,
      ltScheme: "LT_1",
    },
    // // pdbcd2 and pdb01
    {
      title: "Card 5-8+13-14+Breaker 5-6",
      link: "U9_GW01",
      activePowerTotalTag: roundedData?.U9_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U9_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U9_GW01_Voltage_Avg,
      mtop: 124,
      mleft: 565.5,
      linktop: 116,
      linkleft: 559,
      ltScheme: "LT_1",
    },
    {
      title: "Card 8-14",
      link: "U17_GW02",
      activePowerTotalTag: roundedData?.U17_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U17_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U17_GW02_Voltage_Avg,
      mtop: 124,
      mleft: 801,
      linktop: 116,
      linkleft: 794,
      ltScheme: "LT_1",
    },
    {
      title: "PDBCD2",
      link: "U2_GW02",
      activePowerTotalTag: roundedData?.U2_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U2_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U2_GW02_Voltage_Avg,
      mtop: 346.5,
      mleft: 565.5,
      linktop: 338,
      linkleft: 559,
      ltScheme: "LT_1",
    },
    {
      title: "PDB 01",
      link: "U3_GW02",
      activePowerTotalTag: roundedData?.U3_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U3_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U3_GW02_Voltage_Avg,
      mtop: 346.5,
      mleft: 801,
      linktop: 338,
      linkleft: 794,
      ltScheme: "LT_1",
    },
    // // pdb 10 meters
    {
      title: "Ring 5-8",
      link: "U15_GW01",
      activePowerTotalTag: roundedData?.U15_GW01_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U15_GW01_Current_Avg,
      activeVoltageAvgTag: roundedData?.U15_GW01_Voltage_Avg,
      mtop: 124,
      mleft: 1108.5,
      linktop: 116,
      linkleft: 1102,
      ltScheme: "LT_1",
    },
    {
      title: "Winding 10-18",
      link: "U10_GW03",
      activePowerTotalTag: roundedData?.U10_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U10_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U10_GW03_Voltage_Avg,
      mtop: 122,
      mleft: 1356.5,
      linktop: 114,
      linkleft: 1349.5,
      ltScheme: "LT_1",
    },
    {
      title: "PDB 10",
      link: "U23_GW03",
      activePowerTotalTag: roundedData?.U23_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U23_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U23_GW03_Voltage_Avg,
      mtop: 350,
      mleft: 1260,
      linktop: 343,
      linkleft: 1252,
      ltScheme: "LT_1",
    },
    // // PDB 07 meters
    {
      title: "Ring 21-24",
      link: "U12_PLC",
      activePowerTotalTag: roundedData?.U12_PLC_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U12_PLC_Current_Avg,
      activeVoltageAvgTag: roundedData?.U12_PLC_Voltage_Avg,
      mtop: 124,
      mleft: 1570.5,
      linktop: 116,
      linkleft: 1564,
      ltScheme: "LT_1",
    },
    {
      title: "Winding 1-9",
      link: "U18_GW02",
      activePowerTotalTag: roundedData?.U18_GW02_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U18_GW02_Current_Avg,
      activeVoltageAvgTag: roundedData?.U18_GW02_Voltage_Avg,
      mtop: 122,
      mleft: 1817.5,
      linktop: 114,
      linkleft: 1810,
      ltScheme: "LT_1",
    },
    {
      title: "PDB 07",
      link: "U22_GW03",
      activePowerTotalTag: roundedData?.U22_GW03_ActivePower_Total,
      activeCurrentAvgTag: roundedData?.U22_GW03_Current_Avg,
      activeVoltageAvgTag: roundedData?.U22_GW03_Voltage_Avg,
      mtop: 351,
      mleft: 1719.5,
      linktop: 343,
      linkleft: 1712,
      ltScheme: "LT_1",
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
      <div className="relative h-full mx-auto" style={{ width: "1900px" }}>
        {fieldMetersTags.map((meter) => {
          return (
            <Link
              key={meter.link}
              href={`/meter?area=Unit_5&page-type=field-meter&LT_selections=${meter.ltScheme}&meter_id=${meter.link}&meter_name=${meter.title}`}
              style={{
                position: "absolute",
                top: `${meter.linktop}px`,
                left: `${meter.linkleft}px`,
                width: "72px",
                height: "68px",
                zIndex: 100,
                borderRadius: "0.4.2rem",
                cursor: "pointer",
              }}
              className={`rounded-md`}
            ></Link>
          );
        })}
        <img
          src="./fieldMeterStatus/fmsldupdated.png"
          className=""
          style={{ width: "1900px" }}
          alt="unit 4 sld"
        />

        {/* Meter Readings */}
        {fieldMetersTags.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center justify-between z-40"
            style={{
              top: `${meter.mtop}px`,
              left: `${meter.mleft}px`,
              width: "45px",
              height: "53px",
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
              {fix2decimals(meter.activePowerTotalTag) || "00.00"}
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
              {fix2decimals(meter.activeCurrentAvgTag) || "00.00"}
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
              {fix2decimals(meter.activeVoltageAvgTag) || "00.00"}
            </span>
          </div>
        ))}
        {/* meter status */}

        <div>
          {/* card 1-4 + 9-12 */}
          <img
            src={`./fieldMeterStatus/${
              currentArea.U1_GW02 === 4 ? "g" : "r"
            }1.png`}
            className="w-[38px] absolute top-[184px] left-[65px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              // currentArea.U4_GW02 === 4 ? "g" : "r"
              currentArea.U1_GW02 === 5 ? "g" : "r"
            }1.png`}
            className="w-[38px] absolute top-[184px] left-[302px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U2_GW02 === 4 ? "g" : "r"
            }1.png`}
            className="w-[38px] absolute top-[184px] left-[575px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              // currentArea.U3_GW02 === 4 ? "g" : "r"
              currentArea.U2_GW02 === 5 ? "g" : "r"
            }1.png`}
            className="w-[38px] absolute top-[184px] left-[812px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U23_GW03 === 4 ? "g" : "r"
            }5.png`}
            className="h-[179.5px] absolute top-[233px] left-[1002.5px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U23_GW03 === 4 ? "g" : "r"
            }4.png`}
            className="w-[120px] h-[51px] absolute top-[185px] left-[1018px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U23_GW03 === 4 ? "g" : "r"
            }4.png`}
            className="w-[155px] h-[51px] absolute rotate-y-180 top-[185px] left-[1134.5px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/g6.png`}
            className="h-[107px] absolute rotate-y-180 top-[233px] left-[1270px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U23_GW03 === 5 ? "g" : "r"
            }4.png`}
            className="w-[98px] h-[53px] absolute top-[183px] left-[1288px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U22_GW03 === 4 ? "g" : "r"
            }5.png`}
            className="h-[179.5px] absolute top-[233px] left-[1463px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U22_GW03 === 4 ? "g" : "r"
            }4.png`}
            className="w-[120px] h-[51px] absolute top-[185px] left-[1478px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U22_GW03 === 4 ? "g" : "r"
            }4.png`}
            className="w-[155px] h-[51px] absolute rotate-y-180 top-[185px] left-[1594.5px]"
            alt=""
          />
          <img
            src="./fieldMeterStatus/g6.png"
            className="h-[107px] absolute rotate-y-180 top-[233px] left-[1730px]"
            alt=""
          />
          <img
            src={`./fieldMeterStatus/${
              currentArea.U22_GW03 === 5 ? "g" : "r"
            }4.png`}
            className="w-[98px] h-[53px] absolute top-[183px] left-[1748px]"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default NewFieldMeter;
