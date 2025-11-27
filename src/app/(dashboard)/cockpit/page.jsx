"use client";
import CardHeader from "@/components/cockpitComponent/CardHeader";
import CockpitChart from "@/components/cockpitComponent/CockpitChart";
import MainSourcesChart from "@/components/cockpitComponent/MainSourcesChart";
import config from "@/constant/apiRouteList";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

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

  // /============info messages===================
  const inforMessages = {
    TotalPlant:
      "Total Plant Sum (MW) = Below meters are included; total kW sum converted to MW by dividing by 1000:\n Wapda 2, HFO 1, JMS 620, Diesel+JGS I/C LT1, Diesel+JGS I/C LT2, Solar 352.50, Solar 52.17, Solar 1185, Solar 1070, Unit 4 HT Room Wapda 1",
    DieselJGS:
      "Both Diesel+JGS I/C LT1 and LT2 meters are included in Diesel+JGS I/C",
    WapdaHfoJms:
      "Both Wapda+HFO+JMS I/C LT1 and LT2 meters are included in Wapda+HFO+JMS I/C",
  };
  //===============calculating toatl of unit 4 main
  // total of main sources
  let totalMainSourcesActivePower =
    (Number(meterData.U27_PLC_ActivePower_Total) ||
      0 + Number(meterData.U22_PLC_ActivePower_Total) ||
      0 + Number(meterData.U26_PLC_ActivePower_Total) ||
      0 + Number(meterData.U24_GW01_ActivePower_Total) ||
      0 + Number(meterData.U28_PLC_ActivePower_Total) ||
      0 + Number(meterData.U6_GW02_ActivePower_Total) ||
      0 + Number(meterData.U17_GW03_ActivePower_Total) ||
      0 + Number(meterData.U19_PLC_ActivePower_Total) ||
      0 + Number(meterData.U11_GW01_ActivePower_Total) ||
      0 + Number(meterData.U23_GW01_ActivePower_Total) ||
      0) / 1000;
  console.log(
    "totalMainSourcesActivePower",
    totalMainSourcesActivePower.toFixed(2)
  );
  // diesel jgs
  let dieselJGSTotalActivePower =
    Number(meterData.U19_PLC_ActivePower_Total) +
    Number(meterData.U11_GW01_ActivePower_Total);
  let dieselJGSAvgPowerFactor =
    (Number(meterData.U27_PLC_PowerFactor_Avg) +
      Number(meterData.U27_PLC_PowerFactor_Avg)) /
    2;
  // wapda total
  let wapdaHfoJmsTotalActivePower =
    Number(meterData.U21_PLC_ActivePower_Total) +
    Number(meterData.U13_GW01_ActivePower_Total);
  let wapdaHfoJmsAVgPowerFactor =
    (Number(meterData.U21_PLC_PowerFactor_Avg) +
      Number(meterData.U13_GW01_PowerFactor_Avg)) /
    2;

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
    dieselJgs: {
      activePowerTotal: dieselJGSTotalActivePower,
      powerFactor: dieselJGSAvgPowerFactor,
    },
    wapdaHfoJms: {
      activePowerTotal: wapdaHfoJmsTotalActivePower,
      powerFactor: wapdaHfoJmsAVgPowerFactor,
    },
    solar352: {
      activePowerTotal: meterData.U24_GW01_ActivePower_Total || 0,
      powerFactor: meterData.U24_GW01_PowerFactor_Avg || 0,
    },
    solar52: {
      activePowerTotal: meterData.U28_PLC_ActivePower_Total || 0,
      powerFactor: meterData.U28_PLC_PowerFactor_Avg || 0,
    },
    tf1: {
      activePowerTotal: meterData.U13_GW02_ActivePower_Total || 0,
      powerFactor: meterData.U13_GW02_PowerFactor_Avg || 0,
    },
    tf2: {
      activePowerTotal: meterData.U16_GW03_ActivePower_Total || 0,
      powerFactor: meterData.U16_GW03_PowerFactor_Avg || 0,
    },
    solar1185: {
      activePowerTotal: meterData.U6_GW02_ActivePower_Total || 0,
      powerFactor: meterData.U6_GW02_PowerFactor_Avg || 0,
    },
    solar1070: {
      activePowerTotal: meterData.U17_GW03_ActivePower_Total || 0,
      powerFactor: meterData.U17_GW03_PowerFactor_Avg || 0,
    },
  };
  useEffect(() => {
    getMeterData();
    const interval = setInterval(getMeterData, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="overflow-hidden scroll:pt-[180px]">
      <div className="overflow-y-auto h-[81vh]">
        {/* <div className="w-full bg-white dark:bg-gray-800 border-t-3 shadow border-[#1D4F86] mb-3 space-y-2 rounded-md p-3"> */}
        {/* <div className="w-full text-center font-inter py-2 text-[18px] font-semibold">
            Main Sources
          </div>
          <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
            <MainSourcesChart
              value={totalMainSourcesActivePower.toFixed(2)}
              min={0}
              max={24}
              width="500px"
              height="500px"
              unit="MW"
            />
          </div> */}

        {/* </div> */}
        <div className="w-full bg-white dark:bg-gray-800 border-t-3 shadow border-[#1D4F86] space-y-2 rounded-md p-3">
          <div className="w-full text-center font-inter py-2 text-[18px] font-semibold">
            MAIN OVERVIEW
          </div>
          {/* main Sources */}

          {/* first row of overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Total plant */}
            <div className="relative flex flex-col rounded items-center bg-[#fef9c3] dark:bg-[#d9f99d]/30 justify-center">
              <CardHeader
                title="Total Plant Load"
                activePower={totalMainSourcesActivePower}
                showPowerFactor={false}
                totalPowerUnit="MW"
              />
              <div>
                <Tooltip
                  // title={inforMessages.TotalPlant}
                  title={<div>{inforMessages.TotalPlant}</div>}
                  arrow
                  placement="bottom-end"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#025697",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 500,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#025697",
                      },
                    },
                  }}
                >
                  <IoMdInformationCircleOutline
                    className="absolute top-4 right-2 p-[3px] text-[#025697] dark:text-white cursor-pointer bg-[#025697]/30 rounded-full"
                    size={30}
                  />
                </Tooltip>
              </div>
              <CockpitChart
                outerValue={totalMainSourcesActivePower.toFixed(2)}
                // innerValue={Number(meterIds.wapda.powerFactor).toFixed(2)}
                width="290px"
                height="300px"
                containerHeight="200px"
                outerRadiousProp="76%"
                innerRadiousProp="70%"
                innerMinRange={1}
                innerMaxRange={-1}
                outerMinRange={0}
                showInner={false}
                outerlineWidth={9}
                outerSplitNumberRange={6}
                title="Main Sources"
                outerMaxRange={6}
              />
            </div>
            <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
              <CardHeader
                title="Wapda 2"
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
                outerMaxRange={6000}
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
                outerMaxRange={4000}
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
                outerMaxRange={4000}
              />
            </div>
          </div>
          {/* second row of overview */}
          <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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
                outerMaxRange={4000}
              />
            </div>
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
                innerValue={Number(meterIds.mainIncoming.powerFactor).toFixed(
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
                outerMaxRange={3000}
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
                outerMaxRange={4000}
              />
            </div>
            {/* unit 4 ht room wapda 1 */}
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
                outerMaxRange={3000}
              />
            </div>
          </div>
        </div>
        <div className="grid max-[1024]:grid-cols-1 min-[1025]:grid-cols-2 gap-3 mt-3">
          {/* left side */}
          <div className="bg-white dark:bg-gray-800 rounded-md border-t-3 border-[#1D4F86] shadow">
            <div className="w-full text-center font-inter pt-3 text-[18px] font-semibold">
              LT ROOM UNIT 4
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center p-3">
              {/* Diesel+JGS I/C-1 */}
              <div className="relative flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Diesel+JGS I/C"
                  activePower={meterIds.dieselJgs.activePowerTotal}
                  powerFactor={meterIds.dieselJgs.powerFactor}
                />
                <Tooltip
                  title={inforMessages.DieselJGS}
                  arrow
                  placement="bottom-end"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#025697",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 500,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#025697",
                      },
                    },
                  }}
                >
                  <IoMdInformationCircleOutline
                    className="absolute top-4 right-2 p-[3px] text-[#025697] dark:text-white cursor-pointer bg-[#025697]/30 rounded-full"
                    size={30}
                  />
                </Tooltip>
                <CockpitChart
                  outerValue={Number(
                    meterIds.dieselJgs.activePowerTotal
                  ).toFixed(2)}
                  innerValue={Number(meterIds.dieselJgs.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={3500}
                />
              </div>
              {/* Wapda+HFO+JMS I/C-1 */}
              <div className="relative flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Wapda+HFO+JMS I/C"
                  activePower={meterIds.wapdaHfoJms.activePowerTotal}
                  powerFactor={meterIds.wapdaHfoJms.powerFactor}
                />
                <Tooltip
                  title={inforMessages.WapdaHfoJms}
                  arrow
                  placement="bottom-end"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#025697",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 500,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#025697",
                      },
                    },
                  }}
                >
                  <IoMdInformationCircleOutline
                    className="absolute top-4 right-2 p-[3px] text-[#025697] dark:text-white cursor-pointer bg-[#025697]/30 rounded-full"
                    size={30}
                  />
                </Tooltip>
                <CockpitChart
                  outerValue={Number(
                    meterIds.wapdaHfoJms.activePowerTotal
                  ).toFixed(2)}
                  innerValue={Number(meterIds.wapdaHfoJms.powerFactor).toFixed(
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
                  outerMaxRange={3500}
                />
              </div>
              {/* Solar 352.50 */}
              <div className="overflow-hidden flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Solar 352.50 kW"
                  activePower={meterIds.solar352.activePowerTotal}
                  powerFactor={meterIds.solar352.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(
                    meterIds.solar352.activePowerTotal
                  ).toFixed(2)}
                  innerValue={Number(meterIds.solar352.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={500}
                />
              </div>
              {/* Solar 52.17 */}
              <div className="overflow-hidden flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Solar 52.17 kW"
                  activePower={meterIds.solar52.activePowerTotal}
                  powerFactor={meterIds.solar52.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(meterIds.solar52.activePowerTotal).toFixed(
                    2
                  )}
                  innerValue={Number(meterIds.solar52.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={60}
                />
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="bg-white dark:bg-gray-800 rounded-md border-t-3 border-[#1D4F86] shadow">
            <div className="w-full text-center w-full text-center font-inter pt-3 text-[18px] font-semibold">
              LT ROOM UNIT 5
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center p-3">
              {/* TF 1 */}
              <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="TF 1"
                  activePower={meterIds.tf1.activePowerTotal}
                  powerFactor={meterIds.tf1.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(meterIds.tf1.activePowerTotal).toFixed(2)}
                  innerValue={Number(meterIds.tf1.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={2200}
                />
              </div>
              {/* TF 2 */}
              <div className="flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="TF 2"
                  activePower={meterIds.tf2.activePowerTotal}
                  powerFactor={meterIds.tf2.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(meterIds.tf2.activePowerTotal).toFixed(2)}
                  innerValue={Number(meterIds.tf2.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={2200}
                />
              </div>
              {/* Solar 1185 kW */}
              <div className="overflow-hidden flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Solar 1185 kW"
                  activePower={meterIds.solar1185.activePowerTotal}
                  powerFactor={meterIds.solar1185.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(
                    meterIds.solar1185.activePowerTotal
                  ).toFixed(2)}
                  innerValue={Number(meterIds.solar1185.powerFactor).toFixed(2)}
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
              {/* Solar 1070 kW */}
              <div className="overflow-hidden flex flex-col rounded items-center bg-[#E8F5FF] dark:bg-[#E8F5FF]/10 justify-center">
                <CardHeader
                  title="Solar 1070 kW"
                  activePower={meterIds.solar1070.activePowerTotal}
                  powerFactor={meterIds.solar1070.powerFactor}
                />
                <CockpitChart
                  outerValue={Number(
                    meterIds.solar1070.activePowerTotal
                  ).toFixed(2)}
                  innerValue={Number(meterIds.solar1070.powerFactor).toFixed(2)}
                  width="290px"
                  height="300px"
                  containerHeight="200px"
                  outerRadiousProp="76%"
                  innerRadiousProp="70%"
                  innerMinRange={1}
                  innerMaxRange={-1}
                  outerMinRange={0}
                  title="Wapda"
                  outerMaxRange={4000}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default cockpitDashboard;
