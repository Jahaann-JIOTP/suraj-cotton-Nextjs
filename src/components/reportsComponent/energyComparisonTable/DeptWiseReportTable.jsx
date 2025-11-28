"use client";
import { SectionHeader } from "@/components/tables/SectionHeader";
import { useTheme } from "next-themes";
import React from "react";

const DeptWiseReportTable = ({
  deptReportData = [],
  source = "",
  intervalsObj = {},
}) => {
  const { theme } = useTheme();
  return (
    <div className="pb-5">
      {/* header logos */}
      <div
        id="energy-report"
        className="flex px-3 md:px-6 flex-col gap-3 overflow-hidden"
      >
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
      {/* bar line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
      <div className="flex justify-start my-4">
        <button
          //   onClick={handleExportPdf}
          className="bg-[#1C4D82] hover:bg-[#1C4D82] cursor-pointer text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          Export to PDF
        </button>
      </div>
      {/* parameter table */}
      <SectionHeader title={"Report Parameters"} />
      <div className="w-[50%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            {Object.entries(intervalsObj).map(([label, value], idx) => {
              const isfirstRow = idx === 0;
              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600 w-[16.6%] border py-1 border-gray-400 px-3">
                    {label}
                  </td>

                  <td className={`border py-1 w-[16.6%]  border-gray-400 px-3`}>
                    {value ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* sources */}
      <div className="w-[16.6%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            <tr>
              <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600 w-full border py-1 border-gray-400 px-3">
                Sources
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className={`border py-1 w-full border-gray-400 px-3`}>
                {source}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Utilization */}
      <div className="mt-5">
        <SectionHeader title={"Department Wise Consumption"} />
        <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
          <thead className="bg-[#E5F3FD] dark:bg-gray-600">
            <tr className="text-[13px] md:text-[14px] font-inter">
              {[
                "Sr #",
                "Meter",
                "Unit",
                "LT",
                "No. of Machines",
                "Total Connected Load",
                "Average Power",
                "Average Power Factor",
                "Average Voltage",
                "Consumption",
              ].map((h, idx) => (
                <th key={idx} className="border border-gray-400">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    {h}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {deptReportData?.map((row, idx) => (
              <tr
                key={idx}
                className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="py-2 px-3 border border-gray-400 w-[3%] text-center">
                  {idx + 1}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-left">
                  {row.meterName}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[5%] text-center">
                  {row.area}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[5%] text-center">
                  {row.lt}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.MCS}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.connectedLoad}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.avgPower}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.avgPowerFactor}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.avgVoltage}
                </td>
                <td className="py-2 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.energy_consumption}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeptWiseReportTable;
