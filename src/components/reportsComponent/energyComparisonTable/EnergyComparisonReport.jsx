import { useTheme } from "next-themes";
import React from "react";

const EnergyComparisonReport = ({ rawData }) => {
  const { theme } = useTheme();
  //   extract data
  const startTimestamp = rawData.startTimestamp;
  const endTimestamp = rawData.endTimestamp;

  // Extract date and time using string methods
  const startDate = startTimestamp.split("T")[0]; // "2025-10-13"
  const startTime =
    startTimestamp.split("T")[1].split(":")[0] +
    ":" +
    startTimestamp.split("T")[1].split(":")[1]; // "06:00"

  const endDate = endTimestamp.split("T")[0]; // "2025-10-14"
  const endTime =
    endTimestamp.split("T")[1].split(":")[0] +
    ":" +
    endTimestamp.split("T")[1].split(":")[1]; // "06:00"

  console.log("Start Date:", startDate);
  console.log("Start Time:", startTime);
  console.log("End Date:", endDate);
  console.log("End Time:", endTime);
  return (
    <div>
      <div className="flex px-3 md:px-6 flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between  w-full flex-wrap  gap-1">
          <div className="flex flex-col items-start justify-start md:w-[49%]">
            <img
              src={
                theme === "light"
                  ? "../../../suraj-cotton-logo.png"
                  : "../../../suraj-cotton-login-logo.png"
              }
              alt=""
              className="w-[8rem]"
            />
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 justify-start md:w-[49%]">
            <img
              src={
                theme === "light"
                  ? "../../../jahaann-light.png"
                  : "../../../jahaann-dark.png"
              }
              alt=""
              className="w-[10rem]"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
      {/* intervals */}
      <div className="w-full mt-5">
        <div className="w-full bg-[#bdd7ee] py-2 px-4 font-semibold text-[20px]">
          Report Parameters
        </div>
        {/* parameters table */}
        <div className="w-full mt-5">
          <table class=" bg-white border  overflow-hidden">
            <thead class="">
              <tr>
                <th class="py-1 px-4 text-left font-semibold text-gray-700 border-b">
                  Parameter
                </th>
                <th class="py-1 px-4 text-left font-semibold text-gray-700 border-b">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="">
                <td class="py-1 px-4 border-b">Selected Period</td>
                <td class="py-1 px-4 border-b">Month</td>
              </tr>
              <tr class="">
                <td class="py-1 px-4 border-b">Start Date</td>
                <td class="py-1 px-4 border-b">
                  {startDate} {startTime}
                </td>
              </tr>
              <tr class="">
                <td class="py-1 px-4 border-b">End Date</td>
                <td class="py-1 px-4 border-b">
                  {endDate} {endTime}
                </td>
              </tr>
              <tr class="">
                <td class="py-1 px-4 border-b">Report Type</td>
                <td class="py-1 px-4 border-b">SingleComparison</td>
              </tr>
              <tr class="">
                <td class="py-1 px-4 border-b">Comparison Type</td>
                <td class="py-1 px-4 border-b">SuperToday vs Yesterday</td>
              </tr>
              <tr class="">
                <td class="py-1 px-4 border-b">Selected Timezone</td>
                <td class="py-1 px-4 border-b">(UTC+05:00) Asia Karachi</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Source</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergyComparisonReport;
