"use client";
import React from "react";
import { SectionHeader } from "./SectionHeader";

export default function ReportTables({
  title,
  type, // "keyValue" | "standard" | "grouped"
  headers = [],
  data = [],
  columnLabels = {},
}) {
  return (
    <div className="w-full mt-5">
      {/* Title Section */}
      <SectionHeader title={title} />

      {/* Table Container */}
      <div className="w-full mt-3 overflow-x-auto">
        {type === "keyValue" && (
          <table className="border w-full lg:w-[40%] overflow-hidden">
            <tbody>
              {Object.entries(data).map(([key, value], idx) => (
                <tr key={idx} className="text-[14px] font-inter">
                  <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-2 border border-gray-400 dark:border-gray-500 w-[50%]">
                    {key.replace(/_/g, " ")}
                  </td>
                  <td className="py-1 px-4 border border-gray-400 dark:border-gray-500 text-left">
                    {typeof value === "number"
                      ? value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : value ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === "standard" && (
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {headers.map((head, idx) => (
                  <th
                    key={idx}
                    className="py-2 px-3 border border-gray-400 text-center"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {headers.map((h, i) => {
                    const key = Object.keys(row)[i];
                    const percentIcon =
                      key === "UtilizationPercent" ? " %" : "";

                    // const shadeCells = key===
                    return (
                      <td
                        key={key}
                        className="py-2 px-3 border border-gray-400 text-right"
                      >
                        {typeof row[key] === "number"
                          ? row[key].toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) + percentIcon
                          : row[key] ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === "grouped" && (
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {headers.map((col, idx) => (
                  <th
                    key={idx}
                    className="text-center border border-gray-700 px-3 py-2"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((dept, index) => (
                <React.Fragment key={index}>
                  {/* --- UNIT 4 --- */}
                  <tr className="text-[13px] md:text-[14px] border-t-2 border-x-2 border-gray-500 dark:border-gray-300">
                    <td
                      rowSpan={3}
                      className="border border-gray-300 font-medium text-center px-2 py-1 align-middle bg-gray-50 dark:bg-gray-800"
                    >
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 font-medium px-2 py-1 align-middle">
                      {dept.name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      4
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {dept.u4Mcs}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4ConectedLoadPerDept}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4AvgConsumption}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4UtilizationPercent} %
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4ConectedLoadPerMcs}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4RunnigLoad}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4Consumption}
                    </td>
                  </tr>

                  {/* --- UNIT 5 --- */}
                  <tr className="text-[13px] md:text-[14px] border-x-2 border-gray-500 dark:border-gray-300">
                    <td className="border border-gray-300 font-medium px-2 py-1 align-middle">
                      {dept.u5Name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      5
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {dept.u5Mcs}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5ConectedLoadPerDept}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5AvgConsumption}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5UtilizationPercent} %
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5ConectedLoadPerMcs}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5RunningLoad}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5Consumption}
                    </td>
                  </tr>

                  {/* --- TOTAL --- */}
                  <tr className="text-[13px] md:text-[14px] border-b-2 border-x-2 border-gray-500 font-semibold bg-gray-100 dark:bg-gray-700">
                    <td
                      colSpan={8}
                      className="text-right border border-gray-400 px-2 py-1"
                    >
                      Total
                    </td>
                    <td className="text-right border border-gray-400 px-2 py-1">
                      {dept.totalConsumption}
                    </td>
                  </tr>

                  {/* Spacer Row */}
                  <tr>
                    <td colSpan={10} className="h-2"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
