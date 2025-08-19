"use client";
import React, { useEffect, useState } from "react";

import HeatMapChart from "@/components/dashboardComponents/heatMapCharts/HeatMapCharts";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import TransformerSide from "@/components/dashboardComponents/heatMapCharts/TransformerSide";
import config from "@/constant/apiRouteList";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import { useMaintenanceCountdown } from "@/components/dashboardComponents/heatMapCharts/useCountdonwTimer";

const intervalPeriod = 60 * 60 * 1000;
const TranformersPage = () => {
  const [maintenanceHrsT1, setmaintenanceHrsT1] = useState({});
  const [maintenanceHrsT2, setmaintenanceHrsT2] = useState({});
  const [maintenanceHrsT3, setmaintenanceHrsT3] = useState({});
  const [maintenanceHrsT4, setmaintenanceHrsT4] = useState({});
  const [transformerTimePeriod, setTransformerTimePeriod] =
    useState("thisweek");
  const [loading, setLoading] = useState(false);
  const [transformerTotalValTag, setTransformerTotalValTag] = useState({});
  console.log("..............................",transformerTotalValTag)
  const [data, setData] = useState([]);
  const { startDate, endDate } = getDateRangeFromString(transformerTimePeriod);

  // /----------------------------Destructure main to four array------------------------------
  const trafo1 = data.map(({ date, Trafo1 }) => ({ date, Trafo1 }));
  const trafo2 = data.map(({ date, Trafo2 }) => ({ date, Trafo2 }));
  const trafo3 = data.map(({ date, Trafo3 }) => ({ date, Trafo3 }));
  const trafo4 = data.map(({ date, Trafo4 }) => ({ date, Trafo4 }));

  const remainingHrsT1 = useMaintenanceCountdown(
    maintenanceHrsT1.value,
    maintenanceHrsT1.updatedAt
  );
  const remainingHrsT2 = useMaintenanceCountdown(
    maintenanceHrsT2.value,
    maintenanceHrsT2.updatedAt
  );
  const remainingHrsT3 = useMaintenanceCountdown(
    maintenanceHrsT3.value,
    maintenanceHrsT3.updatedAt
  );
  const remainingHrsT4 = useMaintenanceCountdown(
    maintenanceHrsT4.value,
    maintenanceHrsT4.updatedAt
  );


  // /////////trafo losses
  const trafo1Losses = (Number(transformerTotalValTag.Trafo1losses)/(Number(transformerTotalValTag.Trafo1Incoming) + Number(transformerTotalValTag.Trafo1outgoing)))*100;
  const trafo2Losses = (Number(transformerTotalValTag.Trafo2losses)/(Number(transformerTotalValTag.Trafo2Incoming) + Number(transformerTotalValTag.Trafo2outgoing)))*100;
  const trafo3Losses = (Number(transformerTotalValTag.Trafo3losses)/(Number(transformerTotalValTag.Trafo3Incoming) + Number(transformerTotalValTag.Trafo3outgoing)))*100;
  const trafo4Losses = (Number(transformerTotalValTag.Trafo4losses)/(Number(transformerTotalValTag.Trafo4Incoming) + Number(transformerTotalValTag.Trafo4outgoing)))*100;
  
  const fetchMaintenanceHrs = async (url, setState) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${config.BASE_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resResult = await response.json();
      if (response.ok) {
        setState(resResult);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransformerTotalTag = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.SINGLE_VALUE_DIV}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setTransformerTotalValTag(resResult.total_consumption);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTransformerData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_HEAT_MAP_DATA}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setData(resResult);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };
  const trafo1and2 = [
    600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
    1900, 2000,
  ];
  const trafo3and4 = [
    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
    2100, 2200, 2300, 2400, 2500,
  ];

  const loadMaintenanceHrs = (transformerName) => {
  const apiMap = {
    T1: { url: config.DASHBOARD.GET_MAINTENANCE_HOURS_T1, setter: setmaintenanceHrsT1 },
    T2: { url: config.DASHBOARD.GET_MAINTENANCE_HOURS_T2, setter: setmaintenanceHrsT2 },
    T3: { url: config.DASHBOARD.GET_MAINTENANCE_HOURS_T3, setter: setmaintenanceHrsT3 },
    T4: { url: config.DASHBOARD.GET_MAINTENANCE_HOURS_T4, setter: setmaintenanceHrsT4 },
  };

  const selected = apiMap[transformerName];
  if (selected) {
    fetchMaintenanceHrs(selected.url, selected.setter);
  } else {
    console.warn(`Unknown transformerName: ${transformerName}`);
  }
};
useEffect(() => {
  // Initial load for all transformers
  ["T1", "T2", "T3", "T4"].forEach(loadMaintenanceHrs);
}, []);
  useEffect(() => {
    fetchTransformerTotalTag();

    fetchTransformerData();
    const interval = setInterval(() => {
      fetchTransformerData();
    }, intervalPeriod);
    return () => clearInterval(interval);
  }, [transformerTimePeriod]);

  return (
    <>
      <div className="h-full lg:h-[81vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mb-2">
          <h1 className="font-raleway font-600 text-[17px] md:text-[20px]">
            Transformer Energy Usage Heat Map
          </h1>
          <TimePeriodSelector
            selected={transformerTimePeriod}
            setSelected={setTransformerTimePeriod}
          />
        </div>
        <div className="flex w-full flex-col md:flex-row gap-2 mb-2">
          {/* transformer 1 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 1 (kWh) Total:{" "}
                {Number(transformerTotalValTag.Trafo1outgoing||0).toLocaleString("en-US")}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart
                    TransformerData={trafo1}
                    id="transformer1"
                    dataKey="Trafo1"
                    loading={loading}
                  />
                </div>
                <div className="w-[30%]">
                  <TransformerSide 
                  onMaintenanceUpdated={loadMaintenanceHrs}
                    transformerReading={"2.5 MVA"}
                    nxtMaintenance={maintenanceHrsT1.value}
                    remainingHrs={remainingHrsT1}
                    traffoTemp={"Not Connected"}
                    losses={trafo1Losses.toFixed(2)}
                    trafoName="T1"
                  />
                </div>
              </div>
              {!loading && (
                <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                  <div className="flex w-[93%] items-center justify-between flex-wrap">
                    {trafo1and2.map((item, index, array) => {
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;
                      const isHiddenOnSmall =
                        index % 2 === 1 && !isFirst && !isLast;
                      return (
                        <span
                          key={item}
                          className={`text-[11px] ${
                            isHiddenOnSmall ? "hidden xl:inline" : "inline"
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className="w-[93%] h-[20px]"
                    style={{
                      background:
                        "linear-gradient(to right, #012AFF, #05EFFD, #0BFF01, #FDFF00, #FE0803)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          {/* transformer 2 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 2 (kWh) Total:
                {Number(transformerTotalValTag.Trafo2outgoing||0).toLocaleString("en-US")}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  {/* <HeatMapChart TransformerData={trafo2} id="transformer2" /> */}
                  <HeatMapChart
                    TransformerData={trafo2}
                    id="transformer2"
                    dataKey="Trafo2"
                    loading={loading}
                  />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                  onMaintenanceUpdated={loadMaintenanceHrs}
                    transformerReading={"2.5 MVA"}
                    nxtMaintenance={maintenanceHrsT2.value}
                    remainingHrs={remainingHrsT2}
                    traffoTemp={"Not Connected"}
                    losses={trafo2Losses.toFixed(2)}
                    trafoName="T2"
                  />
                </div>
              </div>
              {!loading && (
                <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                  <div className="flex w-[93%] items-center justify-between flex-wrap">
                    {trafo1and2.map((item, index, array) => {
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;
                      const isHiddenOnSmall =
                        index % 2 === 1 && !isFirst && !isLast;

                      return (
                        <span
                          key={item}
                          className={`text-[11px] ${
                            isHiddenOnSmall ? "hidden xl:inline" : "inline"
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className="w-[93%] h-[20px]"
                    style={{
                      background:
                        "linear-gradient(to right, #012AFF, #05EFFD, #0BFF01, #FDFF00, #FE0803)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col md:flex-row gap-2">
          {/* transformer 3 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 3 (kWh) Total:{" "}
                {Number(transformerTotalValTag.Trafo3outgoing||0).toLocaleString("en-US")}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart
                    TransformerData={trafo3}
                    id="transformer3"
                    dataKey="Trafo3"
                    loading={loading}
                  />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                  onMaintenanceUpdated={loadMaintenanceHrs}
                    transformerReading={"2.0 MVA"}
                    nxtMaintenance={maintenanceHrsT3.value}
                    remainingHrs={remainingHrsT3}
                    traffoTemp={"Not Connected"}
                    losses={trafo3Losses.toFixed(2)}
                    trafoName="T3"
                  />
                </div>
              </div>
              {!loading && (
                <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                  <div className="flex w-[93%] items-center justify-between flex-wrap">
                    {trafo3and4.map((item, index, array) => {
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;
                      const isHiddenOnSmall =
                        index % 2 === 1 && !isFirst && !isLast;
                      return (
                        <span
                          key={item}
                          className={`text-[11px] ${
                            isHiddenOnSmall ? "hidden xl:inline" : "inline"
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className="w-[93%] h-[20px]"
                    style={{
                      background:
                        "linear-gradient(to right, #012AFF, #05EFFD, #0BFF01, #FDFF00, #FE0803)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          {/* transformer 4 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 4 (kWh) Total:{" "}
                {Number(transformerTotalValTag.Trafo4outgoing||0).toLocaleString("en-US")}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  {/* <HeatMapChart TransformerData={trafo4} id="transforme4" /> */}
                  <HeatMapChart
                    TransformerData={trafo4}
                    id="transformer4"
                    dataKey="Trafo4"
                    loading={loading}
                  />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                  onMaintenanceUpdated={loadMaintenanceHrs}
                    transformerReading={"2.0 MVA"}
                    nxtMaintenance={maintenanceHrsT4.value}
                    remainingHrs={remainingHrsT4}
                    traffoTemp={"Not Connected"}
                    losses={trafo4Losses.toFixed(2)}
                    trafoName="T4"
                  />
                </div>
              </div>
              {!loading && (
                <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                  <div className="flex w-[93%] items-center justify-between flex-wrap">
                    {trafo3and4.map((item, index, array) => {
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;
                      const isHiddenOnSmall =
                        index % 2 === 1 && !isFirst && !isLast;

                      return (
                        <span
                          key={item}
                          className={`text-[11px] ${
                            isHiddenOnSmall ? "hidden xl:inline" : "inline"
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className="w-[93%] h-[20px]"
                    style={{
                      background:
                        "linear-gradient(to right, #012AFF, #05EFFD, #0BFF01, #FDFF00, #FE0803)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranformersPage;
