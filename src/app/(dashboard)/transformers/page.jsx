"use client";
import React, { useState } from "react";

import HeatMapChart from "@/components/dashboardComponents/heatMapCharts/HeatMapCharts";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import TransformerSide from "@/components/dashboardComponents/heatMapCharts/TransformerSide";

const TransformerData = [
  {
    hour: "12pm",
    weekday: "Sun",
    value: 1046,
  },
  {
    hour: "1am",
    weekday: "Sun",
    value: 800,
  },
  {
    hour: "2am",
    weekday: "Sun",
    value: 808,
  },
  {
    hour: "3am",
    weekday: "Sun",
    value: 2500,
  },
  {
    hour: "4am",
    weekday: "Sun",
    value: 813,
  },
  {
    hour: "5am",
    weekday: "Sun",
    value: 800,
  },
  {
    hour: "6am",
    weekday: "Sun",
    value: 805,
  },
  {
    hour: "7am",
    weekday: "Sun",
    value: 1445,
  },
  {
    hour: "8am",
    weekday: "Sun",
    value: 819,
  },
  {
    hour: "9am",
    weekday: "Sun",
    value: 830,
  },
  {
    hour: "10am",
    weekday: "Sun",
    value: 841,
  },
  {
    hour: "11am",
    weekday: "Sun",
    value: 847,
  },
  {
    hour: "12am",
    weekday: "Sun",
    value: 855,
  },
  {
    hour: "1pm",
    weekday: "Sun",
    value: 856,
  },
  {
    hour: "2pm",
    weekday: "Sun",
    value: 866,
  },
  {
    hour: "3pm",
    weekday: "Sun",
    value: 872,
  },
  {
    hour: "4pm",
    weekday: "Sun",
    value: 887,
  },
  {
    hour: "5pm",
    weekday: "Sun",
    value: 882,
  },
  {
    hour: "6pm",
    weekday: "Sun",
    value: 867,
  },
  {
    hour: "7pm",
    weekday: "Sun",
    value: 864,
  },
  {
    hour: "8pm",
    weekday: "Sun",
    value: 863,
  },
  {
    hour: "9pm",
    weekday: "Sun",
    value: 865,
  },
  {
    hour: "10pm",
    weekday: "Sun",
    value: 871,
  },
  {
    hour: "11pm",
    weekday: "Sun",
    value: 866,
  },
  {
    hour: "12pm",
    weekday: "Mon",
    value: 867,
  },
  {
    hour: "1am",
    weekday: "Mon",
    value: 837,
  },
  {
    hour: "2am",
    weekday: "Mon",
    value: 853,
  },
  {
    hour: "3am",
    weekday: "Mon",
    value: 901,
  },
  {
    hour: "4am",
    weekday: "Mon",
    value: 940,
  },
  {
    hour: "5am",
    weekday: "Mon",
    value: 916,
  },
  {
    hour: "6am",
    weekday: "Mon",
    value: 955,
  },
  {
    hour: "7am",
    weekday: "Mon",
    value: 1053,
  },
  {
    hour: "8am",
    weekday: "Mon",
    value: 1176,
  },
  {
    hour: "9am",
    weekday: "Mon",
    value: 1293,
  },
  {
    hour: "10am",
    weekday: "Mon",
    value: 1355,
  },
  {
    hour: "11am",
    weekday: "Mon",
    value: 1462,
  },
  {
    hour: "12am",
    weekday: "Mon",
    value: 1425,
  },
  {
    hour: "1pm",
    weekday: "Mon",
    value: 1369,
  },
  {
    hour: "2pm",
    weekday: "Mon",
    value: 1370,
  },
  {
    hour: "3pm",
    weekday: "Mon",
    value: 1360,
  },
  {
    hour: "4pm",
    weekday: "Mon",
    value: 1388,
  },
  {
    hour: "5pm",
    weekday: "Mon",
    value: 1307,
  },
  {
    hour: "6pm",
    weekday: "Mon",
    value: 1203,
  },
  {
    hour: "7pm",
    weekday: "Mon",
    value: 1091,
  },
  {
    hour: "8pm",
    weekday: "Mon",
    value: 1033,
  },
  {
    hour: "9pm",
    weekday: "Mon",
    value: 1018,
  },
  {
    hour: "10pm",
    weekday: "Mon",
    value: 976,
  },
  {
    hour: "11pm",
    weekday: "Mon",
    value: 951,
  },
  {
    hour: "12pm",
    weekday: "Tue",
    value: 921,
  },
  {
    hour: "1am",
    weekday: "Tue",
    value: 842,
  },
  {
    hour: "2am",
    weekday: "Tue",
    value: 873,
  },
  {
    hour: "3am",
    weekday: "Tue",
    value: 902,
  },
  {
    hour: "4am",
    weekday: "Tue",
    value: 920,
  },
  {
    hour: "5am",
    weekday: "Tue",
    value: 913,
  },
  {
    hour: "6am",
    weekday: "Tue",
    value: 955,
  },
  {
    hour: "7am",
    weekday: "Tue",
    value: 1025,
  },
  {
    hour: "8am",
    weekday: "Tue",
    value: 1176,
  },
  {
    hour: "9am",
    weekday: "Tue",
    value: 1263,
  },
  {
    hour: "10am",
    weekday: "Tue",
    value: 1316,
  },
  {
    hour: "11am",
    weekday: "Tue",
    value: 1200,
  },
  {
    hour: "12am",
    weekday: "Tue",
    value: 1420,
  },
  {
    hour: "1pm",
    weekday: "Tue",
    value: 1316,
  },
  {
    hour: "2pm",
    weekday: "Tue",
    value: 1313,
  },
  {
    hour: "3pm",
    weekday: "Tue",
    value: 1337,
  },
  {
    hour: "4pm",
    weekday: "Tue",
    value: 1346,
  },
  {
    hour: "5pm",
    weekday: "Tue",
    value: 1343,
  },
  {
    hour: "6pm",
    weekday: "Tue",
    value: 1276,
  },
  {
    hour: "7pm",
    weekday: "Tue",
    value: 1269,
  },
  {
    hour: "8pm",
    weekday: "Tue",
    value: 1403,
  },
  {
    hour: "9pm",
    weekday: "Tue",
    value: 1442,
  },
  {
    hour: "10pm",
    weekday: "Tue",
    value: 1347,
  },
  {
    hour: "11pm",
    weekday: "Tue",
    value: 1301,
  },
  {
    hour: "12pm",
    weekday: "Wed",
    value: 1260,
  },
  {
    hour: "1am",
    weekday: "Wed",
    value: 1192,
  },
  {
    hour: "2am",
    weekday: "Wed",
    value: 1053,
  },
  {
    hour: "3am",
    weekday: "Wed",
    value: 1135,
  },
  {
    hour: "4am",
    weekday: "Wed",
    value: 1251,
  },
  {
    hour: "5am",
    weekday: "Wed",
    value: 1285,
  },
  {
    hour: "6am",
    weekday: "Wed",
    value: 1379,
  },
  {
    hour: "7am",
    weekday: "Wed",
    value: 1429,
  },
  {
    hour: "8am",
    weekday: "Wed",
    value: 1605,
  },
  {
    hour: "9am",
    weekday: "Wed",
    value: 1722,
  },
  {
    hour: "10am",
    weekday: "Wed",
    value: 1379,
  },
  {
    hour: "11am",
    weekday: "Wed",
    value: 1857,
  },
  {
    hour: "12am",
    weekday: "Wed",
    value: 1403,
  },
  {
    hour: "1pm",
    weekday: "Wed",
    value: 1316,
  },
  {
    hour: "2pm",
    weekday: "Wed",
    value: 1309,
  },
  {
    hour: "3pm",
    weekday: "Wed",
    value: 1319,
  },
  {
    hour: "4pm",
    weekday: "Wed",
    value: 1302,
  },
  {
    hour: "5pm",
    weekday: "Wed",
    value: 1243,
  },
  {
    hour: "6pm",
    weekday: "Wed",
    value: 1103,
  },
  {
    hour: "7pm",
    weekday: "Wed",
    value: 1005,
  },
  {
    hour: "8pm",
    weekday: "Wed",
    value: 938,
  },
  {
    hour: "9pm",
    weekday: "Wed",
    value: 915,
  },
  {
    hour: "10pm",
    weekday: "Wed",
    value: 876,
  },
  {
    hour: "11pm",
    weekday: "Wed",
    value: 842,
  },
  {
    hour: "12pm",
    weekday: "Thu",
    value: 818,
  },
  {
    hour: "1am",
    weekday: "Thu",
    value: 842,
  },
  {
    hour: "2am",
    weekday: "Thu",
    value: 1162,
  },
  {
    hour: "3am",
    weekday: "Thu",
    value: 1120,
  },
  {
    hour: "4am",
    weekday: "Thu",
    value: 1184,
  },
  {
    hour: "5am",
    weekday: "Thu",
    value: 1152,
  },
  {
    hour: "6am",
    weekday: "Thu",
    value: 1138,
  },
  {
    hour: "7am",
    weekday: "Thu",
    value: 1251,
  },
  {
    hour: "8am",
    weekday: "Thu",
    value: 1295,
  },
  {
    hour: "9am",
    weekday: "Thu",
    value: 1292,
  },
  {
    hour: "10am",
    weekday: "Thu",
    value: 1321,
  },
  {
    hour: "11am",
    weekday: "Thu",
    value: 1392,
  },
  {
    hour: "12am",
    weekday: "Thu",
    value: 1357,
  },
  {
    hour: "1pm",
    weekday: "Thu",
    value: 1251,
  },
  {
    hour: "2pm",
    weekday: "Thu",
    value: 1259,
  },
  {
    hour: "3pm",
    weekday: "Thu",
    value: 1276,
  },
  {
    hour: "4pm",
    weekday: "Thu",
    value: 1263,
  },
  {
    hour: "5pm",
    weekday: "Thu",
    value: 1205,
  },
  {
    hour: "6pm",
    weekday: "Thu",
    value: 1091,
  },
  {
    hour: "7pm",
    weekday: "Thu",
    value: 1005,
  },
  {
    hour: "8pm",
    weekday: "Thu",
    value: 948,
  },
  {
    hour: "9pm",
    weekday: "Thu",
    value: 921,
  },
  {
    hour: "10pm",
    weekday: "Thu",
    value: 896,
  },
  {
    hour: "11pm",
    weekday: "Thu",
    value: 842,
  },
  {
    hour: "12pm",
    weekday: "Fri",
    value: 843,
  },
  {
    hour: "1am",
    weekday: "Fri",
    value: 842,
  },
  {
    hour: "2am",
    weekday: "Fri",
    value: 863,
  },
  {
    hour: "3am",
    weekday: "Fri",
    value: 880,
  },
  {
    hour: "4am",
    weekday: "Fri",
    value: 886,
  },
  {
    hour: "5am",
    weekday: "Fri",
    value: 884,
  },
  {
    hour: "6am",
    weekday: "Fri",
    value: 912,
  },
  {
    hour: "7am",
    weekday: "Fri",
    value: 973,
  },
  {
    hour: "8am",
    weekday: "Fri",
    value: 1103,
  },
  {
    hour: "9am",
    weekday: "Fri",
    value: 1183,
  },
  {
    hour: "10am",
    weekday: "Fri",
    value: 1198,
  },
  {
    hour: "11am",
    weekday: "Fri",
    value: 1279,
  },
  {
    hour: "12am",
    weekday: "Fri",
    value: 1243,
  },
  {
    hour: "1pm",
    weekday: "Fri",
    value: 1190,
  },
  {
    hour: "2pm",
    weekday: "Fri",
    value: 1176,
  },
  {
    hour: "3pm",
    weekday: "Fri",
    value: 1183,
  },
  {
    hour: "4pm",
    weekday: "Fri",
    value: 1184,
  },
  {
    hour: "5pm",
    weekday: "Fri",
    value: 1140,
  },
  {
    hour: "6pm",
    weekday: "Fri",
    value: 1031,
  },
  {
    hour: "7pm",
    weekday: "Fri",
    value: 943,
  },
  {
    hour: "8pm",
    weekday: "Fri",
    value: 906,
  },
  {
    hour: "9pm",
    weekday: "Fri",
    value: 872,
  },
  {
    hour: "10pm",
    weekday: "Fri",
    value: 842,
  },
  {
    hour: "11pm",
    weekday: "Fri",
    value: 841,
  },
  {
    hour: "12pm",
    weekday: "Sat",
    value: 824,
  },
  {
    hour: "1am",
    weekday: "Sat",
    value: 809,
  },
  {
    hour: "2am",
    weekday: "Sat",
    value: 808,
  },
  {
    hour: "3am",
    weekday: "Sat",
    value: 800,
  },
  {
    hour: "4am",
    weekday: "Sat",
    value: 2500,
  },
  {
    hour: "5am",
    weekday: "Sat",
    value: 805,
  },
  {
    hour: "6am",
    weekday: "Sat",
    value: 815,
  },
  {
    hour: "7am",
    weekday: "Sat",
    value: 827,
  },
  {
    hour: "8am",
    weekday: "Sat",
    value: 832,
  },
  {
    hour: "9am",
    weekday: "Sat",
    value: 844,
  },
  {
    hour: "10am",
    weekday: "Sat",
    value: 2500,
  },
  {
    hour: "11am",
    weekday: "Sat",
    value: 842,
  },
  {
    hour: "12am",
    weekday: "Sat",
    value: 2500,
  },
  {
    hour: "1pm",
    weekday: "Sat",
    value: 844,
  },
  {
    hour: "2pm",
    weekday: "Sat",
    value: 845,
  },
  {
    hour: "3pm",
    weekday: "Sat",
    value: 838,
  },
  {
    hour: "4pm",
    weekday: "Sat",
    value: 835,
  },
  {
    hour: "5pm",
    weekday: "Sat",
    value: 842,
  },
  {
    hour: "6pm",
    weekday: "Sat",
    value: 830,
  },
  {
    hour: "7pm",
    weekday: "Sat",
    value: 826,
  },
  {
    hour: "8pm",
    weekday: "Sat",
    value: 834,
  },
  {
    hour: "9pm",
    weekday: "Sat",
    value: 826,
  },
  {
    hour: "10pm",
    weekday: "Sat",
    value: 818,
  },
  {
    hour: "11pm",
    weekday: "Sat",
    value: 807,
  },
];
const TranformersPage = () => {
  const [transformerTimePeriod, setTransformerTimePeriod] = useState("today");
  const handleTimePeriodForTransformer = (period) => {
    setTransformerTimePeriod(period);
  };
  // todo
  const totalVal = 87654.2;
  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mb-2">
          <h1 className="font-raleway font-600 text-[17px] md:text-[20px]">
            Transformer Energy Usage Heat Map
          </h1>
          <TimePeriodSelector getTimePeriod={handleTimePeriodForTransformer} />
        </div>
        <div className="flex w-full flex-col md:flex-row gap-2 mb-2">
          {/* transformer 1 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 1 (kWh) Total: {totalVal}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart TransformerData={TransformerData} />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                    transformerReading={100}
                    nxtMaintenance={100}
                    remainingHrs={100}
                    traffoTemp={1000}
                    losses={200}
                  />
                </div>
              </div>
              <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                <div className="flex w-[93%] items-center justify-between flex-wrap">
                  {[
                    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                    1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500,
                  ].map((item, index, array) => {
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
            </div>
          </div>
          {/* transformer 2 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 2 (kWh) Total: {totalVal}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart TransformerData={TransformerData} />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                    transformerReading={100}
                    nxtMaintenance={100}
                    remainingHrs={100}
                    traffoTemp={1000}
                    losses={200}
                  />
                </div>
              </div>
              <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                <div className="flex w-[93%] items-center justify-between flex-wrap">
                  {[
                    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                    1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500,
                  ].map((item, index, array) => {
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
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col md:flex-row gap-2">
          {/* transformer 3 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 3 (kWh) Total: {totalVal}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart TransformerData={TransformerData} />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                    transformerReading={100}
                    nxtMaintenance={100}
                    remainingHrs={100}
                    traffoTemp={1000}
                    losses={200}
                  />
                </div>
              </div>
              <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                <div className="flex w-[93%] items-center justify-between flex-wrap">
                  {[
                    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                    1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500,
                  ].map((item, index, array) => {
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
            </div>
          </div>
          {/* transformer 4 */}
          <div className="flex flex-col w-full md:w-[49%] bg-white h-[23rem] md:h-[20.8rem] dark:bg-gray-700 rounded-md shadow-lg border-t-3 border-t-[#1A68B2]">
            <div className="flex items-center justify-start gap-2 md:gap-5 px-5 pt-2">
              <img src="../../../heatmapIcon.png" alt="" />
              <h2 className="font-inter font-500 text-[16px] text-[#3978A8]">
                Transformer 4 (kWh) Total: {totalVal}
              </h2>
            </div>
            <div>
              <div className="flex">
                <div className="w-[70%] flex items-center justify-center">
                  <HeatMapChart TransformerData={TransformerData} />
                </div>
                <div className="w-[30%]">
                  <TransformerSide
                    transformerReading={100}
                    nxtMaintenance={100}
                    remainingHrs={100}
                    traffoTemp={1000}
                    losses={200}
                  />
                </div>
              </div>
              <div className="w-full px-5 mt-[-10px] md:mt-[-17px]">
                <div className="flex w-[93%] items-center justify-between flex-wrap">
                  {[
                    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                    1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500,
                  ].map((item, index, array) => {
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranformersPage;
