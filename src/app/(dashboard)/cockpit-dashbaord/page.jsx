"use client";
import CardHeader from "@/components/cockpitComponent/CardHeader";
import CockpitChart from "@/components/cockpitComponent/CockpitChart";
import config from "@/constant/apiRouteList";
import React, { useEffect, useState } from "react";
const data = {
  wapdaKw: 100.12,
  wapdaPf: 0.4,
  hfo1Kw: 1100.12,
  hfo1Pf: 0.8,
  jmsKw: 1020,
  jmsPf: -0.4,
  hfoAuxKw: 900,
  hfoAuxPf: 0.1,
};

const cockpitDashboard = () => {
  const [meterData, setMeterData] = useState([]);
  const getMeterData = async () => {
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
        setMeterData(resData);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  console.log(meterData);
  // function roundNumbersInJson(obj) {
  //   const newObj = { ...obj };

  //   for (let key in newObj) {
  //     const value = newObj[key];

  //     if (typeof value === "number") {
  //       if (Math.abs(value) > 1e5) {
  //         newObj[key] = 0;
  //       } else if (value >= 1000) {
  //         // No decimal
  //         newObj[key] = Math.round(value);
  //       }
  //       // else if (value >= 100 && value < 1000) {
  //       //   // 1 decimal
  //       //   newObj[key] = Math.round(value * 10) / 10;
  //       // } else if (value < 100) {
  //       //   // 2 decimals
  //       //   newObj[key] = Math.round(value * 100) / 100;
  //       // }
  //     }
  //   }

  //   return newObj;
  // }
  // const roundedData = roundNumbersInJson(meterData);
  const meterIds = {
    wapda: {
      activePowerTotal: meterData.U27_PLC_ActivePower_Total || 0,
      powerFactor: meterData.U27_PLC_PowerFactor_Avg || 0,
    },
    hfo1: {
      activePowerTotal: meterData.U22_PLC_ActivePower_Total || 0,
      powerFactor: meterData.U22_PLC_PowerFactor_Avg || 0,
    },
    jms: {
      activePowerTotal: meterData.U26_PLC_ActivePower_Total || 0,
      powerFactor: meterData.U26_PLC_PowerFactor_Avg || 0,
    },
    hfoAux: {
      activePowerTotal: meterData.U25_PLC_ActivePower_Total || 0,
      powerFactor: meterData.U25_PLC_PowerFactor_Avg || 0,
    },
    mainIncoming: {
      activePowerTotal: meterData.U21_GW03_ActivePower_Total || 0,
      powerFactor: meterData.U21_GW03_PowerFactor_Avg || 0,
    },
    unit4HtPhIcHfo: {
      activePowerTotal: meterData.U22_GW01_ActivePower_Total || 0,
      powerFactor: meterData.U22_GW01_PowerFactor_Avg || 0,
    },
    unit4HtWapda: {
      activePowerTotal: meterData.U23_GW01_ActivePower_Total || 0,
      powerFactor: meterData.U23_GW01_PowerFactor_Avg || 0,
    },
    dieselJgs: "",
    wapdaHfoJms: "",
    solar352: "",
    solar52: "",
    solar1185: "",
    tf1: "",
    tf2: "",
    tf21070: "",
  };
  useEffect(() => {
    getMeterData();
    const interval = setInterval(getMeterData, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="overflow-y-auto h-[81vh]">
      <div className="w-full bg-white dark:bg-gray-800 border-t-3 shadow border-[#1D4F86] space-y-2 rounded-md p-3">
        <div className="w-full flex items-center py-3 justify-center">
          MAIN OVERVIEW
        </div>
        {/* first row of overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* wapda chart */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="Wapda"
              activePower={meterIds.wapda.activePowerTotal}
              powerFactor={meterIds.wapda.powerFactor}
            />

            <CockpitChart
              outerValue={Number(meterIds.wapda.activePowerTotal).toFixed(2)}
              innerValue={Number(meterIds.wapda.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
          {/* hfo 1 chart */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="HFO 1"
              activePower={meterIds.hfo1.activePowerTotal}
              powerFactor={meterIds.hfo1.powerFactor}
            />
            <CockpitChart
              outerValue={Number(meterIds.hfo1.activePowerTotal).toFixed(2)}
              innerValue={Number(meterIds.hfo1.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={3000}
            />
          </div>
          {/* jms 620 chart */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="JMS 620"
              activePower={meterIds.jms.activePowerTotal}
              powerFactor={meterIds.jms.powerFactor}
            />
            <CockpitChart
              outerValue={Number(meterIds.jms.activePowerTotal).toFixed(2)}
              innerValue={Number(meterIds.jms.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
          {/* hfo aux chart */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="HFO Aux"
              activePower={meterIds.hfoAux.activePowerTotal}
              powerFactor={meterIds.hfoAux.powerFactor}
            />
            <CockpitChart
              outerValue={Number(meterIds.hfoAux.activePowerTotal).toFixed(2)}
              innerValue={Number(meterIds.hfoAux.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
        </div>
        {/* second row of overview */}
        <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-3 gap-2">
          {/* main incoming meter */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="Main Incoming Unit 5"
              activePower={meterIds.mainIncoming.activePowerTotal}
              powerFactor={meterIds.mainIncoming.powerFactor}
            />
            <CockpitChart
              outerValue={Number(
                meterIds.mainIncoming.activePowerTotal
              ).toFixed(2)}
              innerValue={Number(meterIds.mainIncoming.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
          {/* ht room ph ic hfo meter */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="Unit 4 HT Room P/H IC HFO"
              activePower={meterIds.unit4HtPhIcHfo.activePowerTotal}
              powerFactor={meterIds.unit4HtPhIcHfo.powerFactor}
            />
            <CockpitChart
              outerValue={Number(
                meterIds.unit4HtPhIcHfo.activePowerTotal
              ).toFixed(2)}
              innerValue={Number(meterIds.unit4HtPhIcHfo.powerFactor).toFixed(
                2
              )}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
          {/* ? unit 4 ht room wapda 1 */}
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <CardHeader
              title="Unit 4 HT Room Wapda 1"
              activePower={meterIds.unit4HtWapda.activePowerTotal}
              powerFactor={meterIds.unit4HtWapda.powerFactor}
            />
            <CockpitChart
              outerValue={Number(
                meterIds.unit4HtWapda.activePowerTotal
              ).toFixed(2)}
              innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(2)}
              width="290px"
              height="300px"
              containerHeight="200px"
              outerRadiousProp="76%"
              innerRadiousProp="70%"
              innerMinRange={1}
              innerMaxRange={-1}
              outerMinRange={0}
              title="Wapda"
              outerMaxRange={1500}
            />
          </div>
        </div>
      </div>
      <div className="grid max-[1024]:grid-cols-1 min-[1025]:grid-cols-2 gap-3 mt-3">
        {/* left side */}
        <div className="bg-white dark:bg-gray-800 rounded-md border-t-3 border-[#1D4F86] shadow">
          <div className="w-full text-center">LT ROOM UNIT 4</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center p-3">
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="bg-white dark:bg-gray-800 rounded-md border-t-3 border-[#1D4F86] shadow">
          <div className="w-full text-center">LT ROOM UNIT 4</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center p-3">
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Unit 4 HT Room Wapda 1"
                activePower={meterIds.unit4HtWapda.activePowerTotal}
                powerFactor={meterIds.unit4HtWapda.powerFactor}
              />
              <CockpitChart
                outerValue={Number(
                  meterIds.unit4HtWapda.activePowerTotal
                ).toFixed(2)}
                innerValue={Number(meterIds.unit4HtWapda.powerFactor).toFixed(
                  2
                )}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                title="Wapda"
                outerMaxRange={1500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default cockpitDashboard;
