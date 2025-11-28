"use client";
import KayValueTable from "@/components/tables/KayValueTable";
import { SectionHeader } from "@/components/tables/SectionHeader";
import { useTheme } from "next-themes";
import React from "react";
const sectionHeaders = {
  rParams: "Report Parameters",
  HTside: "Generation Summary",
  lossesSummary: "Consumption Summary",
  summary: "Low Voltage Side Summary",
  utilization: "Utilization",
  production: "Production Summary",
  dailyConsumption: "Consumption Detail (Daily)",
  prodDetail: "Production Detail (Daily)",
  consumptionPerDept:
    "Consumption Summary by Department for the Entire Time Period",
};

const EnergyComparisonReport = ({
  intervalObj = {},
  unit = "",
  htSideData = {},
  mergedSummary = {},
  deltaOnly = {},
  lowVoltageSide = [],
  lowVoltageTotla = {},
  utilizationData = [],
  mergedProduction = [],
}) => {
  const { theme } = useTheme();
  return (
    <div>
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
      <SectionHeader title={sectionHeaders.rParams} />
      <div className="w-[50%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            {Object.entries(intervalObj).map(([label, value], idx) => {
              const isfirstRow = idx === 0;
              return (
                <tr key={idx}>
                  <td className="font-semibold bg-[#E5F3FD]  w-[16.6%] border py-1 border-gray-400 px-3">
                    {label}
                  </td>

                  <td
                    className={`border py-1 w-[16.6%] ${
                      isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                    } border-gray-400 px-3`}
                  >
                    {value?.p1 ?? "-"}
                  </td>

                  <td
                    className={`border py-1 w-[16.6%] ${
                      isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                    } border-gray-400 px-3`}
                  >
                    {value?.p2 ?? "-"}
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
              <td className="font-semibold bg-[#E5F3FD] w-full border py-1 border-gray-400 px-3">
                Sources
              </td>
            </tr>
            {(unit === "ALL" || unit === "Unit_4") && (
              <tr>
                <td className={`border py-1 w-full border-gray-400 px-3`}>
                  Unit 4
                </td>
              </tr>
            )}
            {(unit === "ALL" || unit === "Unit_5") && (
              <tr>
                <td className={`border py-1 w-full border-gray-400 px-3`}>
                  Unit 5
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Ht Side / Generation Summary */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.HTside} />
        <div className="w-[50%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              {Object.entries(htSideData).map(([label, value], idx) => {
                const isfirstRow = idx === 0;
                const isBold = label === "Total";
                return (
                  <tr key={idx}>
                    <td className="font-semibold bg-[#E5F3FD]  w-[16.6%] border py-1 border-gray-400 px-3">
                      {label}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {value?.p1?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {value?.p2?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* losses / consumption summary */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.lossesSummary} />
        <div className="w-[50%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              {Object.entries(mergedSummary).map(([label, value], idx) => {
                const isfirstRow = idx === 0;
                const isBold = label === "Total_Consumption";
                return (
                  <tr key={idx}>
                    <td className="font-semibold bg-[#E5F3FD]  w-[16.6%] border py-1 border-gray-400 px-3">
                      {label.replaceAll("_", " ")}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value === "number"
                        ? value?.p1?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value?.p1 ?? "-"}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value === "number"
                        ? value?.p2?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value.p2 ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className="w-full border mt-5 border-gray-400 text-sm">
            <tbody>
              {Object.entries(deltaOnly).map(([label, value], idx) => {
                const isfirstRow = idx === 0;
                const isBold = label === "Total";
                return (
                  <tr key={idx}>
                    <td className="font-semibold bg-[#E5F3FD]  w-[16.6%] border py-1 border-gray-400 px-3">
                      {label.replaceAll("_", " ")}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value === "number"
                        ? value?.p1?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value?.p1 ?? "-"}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow ? "bg-[#E5F3FD] font-semibold" : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value === "number"
                        ? value?.p2?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value.p2 ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Low voltage side summary */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.summary} />
        <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
          {/* ---------- HEADER ---------- */}
          <thead className="bg-[#E5F3FD] dark:bg-gray-600">
            {/* Main header row */}
            <tr className="text-[13px] md:text-[14px] font-inter">
              <th className="py-2 px-3 border border-gray-400 text-center w-[10%]">
                Unit No.
              </th>

              {/* Each header with 2 sub-columns */}
              {[
                "Total Incoming From Generation (kWh)",
                "Total Incoming From Other Unit (kWh)",
                "Total Consumption (kWh)",
                "Total Transferred to Other Unit (kWh)",
                "Total Unaccountable Energy (kWh)",
              ].map((h, idx) => (
                <th key={idx} className="border border-gray-400 w-[18%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    {h}
                  </div>

                  {/* sub-headers */}
                  <div className="flex min-h-[30px] border-t border-gray-400">
                    <div className="flex items-center justify-center w-1/2 py-1 border-r border-gray-400 text-center font-semibold">
                      P1
                    </div>
                    <div className="flex items-center justify-center w-1/2 py-1 text-center font-semibold">
                      P2
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {lowVoltageSide.map((row, idx) => (
              <tr
                key={idx}
                className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Unit column */}
                <td className="py-2 px-3 border border-gray-400 w-[10%] text-center">
                  {row.unit}
                </td>

                {/* All columns with two subcells */}
                {[
                  row.Total_I_C_G,
                  row.I_C_OU,
                  row.Total_Consumption,
                  row.Total_Tranferred_to_OU,
                  row.Unaccounted_Energy,
                ].map((item, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-gray-400 w-[18%] p-0"
                  >
                    <div className="flex">
                      <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                        {item.p1?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="w-1/2 py-2 px-3 text-center">
                        {item.p2?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {/* ---------- TOTAL ROW (optional) ---------- */}
            <tr className="font-semibold text-[13px] md:text-[14px] font-inter bg-gray-100 dark:bg-gray-700">
              <td className="py-2 px-3 border border-gray-400 text-center">
                Total
              </td>
              <td className="border border-gray-400 w-[18%] p-0">
                <div className="flex">
                  <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                    {lowVoltageTotla?.totalIcg?.p1?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotla.totalIcg.p2.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </td>
              <td className="border border-gray-400 w-[18%] p-0">
                <div className="flex">
                  <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                    -
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">-</div>
                </div>
              </td>
              <td className="border border-gray-400 w-[18%] p-0">
                <div className="flex">
                  <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                    {lowVoltageTotla?.totalConsumptionValue?.p1?.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotla.totalConsumptionValue.p2.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                </div>
              </td>
              <td className="border border-gray-400 w-[18%] p-0">
                <div className="flex">
                  <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                    -
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">-</div>
                </div>
              </td>
              <td className="border border-gray-400 w-[18%] p-0">
                <div className="flex">
                  <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                    {lowVoltageTotla?.UnaccountedEnergyTotal?.p1?.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotla.UnaccountedEnergyTotal.p2.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Utilization */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.utilization} />
        <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
          {/* ---------- HEADER ---------- */}
          <thead className="bg-[#E5F3FD] dark:bg-gray-600">
            {/* Main header row */}
            <tr className="text-[13px] md:text-[14px] font-inter">
              <th className="py-2 px-3 border border-gray-400 text-center w-[10%]">
                Unit No.
              </th>

              {/* Each header with 2 sub-columns */}
              {[
                "Total Actual Connected Load (kWh/h)",
                "Total Connected Load (kWh/h)",
                "Utilization",
              ].map((h, idx) => (
                <th key={idx} className="border border-gray-400 w-[18%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    {h}
                  </div>

                  {/* sub-headers */}
                  <div className="flex min-h-[30px] border-t border-gray-400">
                    <div className="flex items-center justify-center w-1/2 py-1 border-r border-gray-400 text-center font-semibold">
                      P1
                    </div>
                    <div className="flex items-center justify-center w-1/2 py-1 text-center font-semibold">
                      P2
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {utilizationData.map((row, idx) => (
              <tr
                key={idx}
                className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Unit column */}
                <td className="py-2 px-3 border border-gray-400 w-[10%] text-center">
                  {row.unit}
                </td>

                {/* All columns with two subcells */}
                {[
                  row.TotalConnectedLoadPerDept,
                  row.TotalAvgConsumption,
                  row.UtilizationPercent,
                ].map((item, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-gray-400 w-[18%] p-0"
                  >
                    <div className="flex">
                      <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                        {item.p1?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="w-1/2 py-2 px-3 text-center">
                        {item.p2?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Production summary */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.production} />
        <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
          {/* ---------- HEADER ---------- */}
          <thead className="bg-[#E5F3FD] dark:bg-gray-600">
            {/* Main header row */}
            <tr className="text-[13px] md:text-[14px] font-inter">
              <th className="py-2 px-3 border border-gray-400 text-center w-[10%]">
                Unit No.
              </th>

              {/* Each header with 2 sub-columns */}
              {[
                "Total No. of Bags",
                "Avg. Count",
                "Total Consumption (kWh)",
                "Consumption Per Bag (kWh/Bag)",
              ].map((h, idx) => (
                <th key={idx} className="border border-gray-400 w-[18%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    {h}
                  </div>

                  {/* sub-headers */}
                  <div className="flex min-h-[30px] border-t border-gray-400">
                    <div className="flex items-center justify-center w-1/2 py-1 border-r border-gray-400 text-center font-semibold">
                      P1
                    </div>
                    <div className="flex items-center justify-center w-1/2 py-1 text-center font-semibold">
                      P2
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {mergedProduction.map((row, idx) => (
              <tr
                key={idx}
                className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Unit column */}
                <td className="py-2 px-3 border border-gray-400 w-[10%] text-center">
                  {row.unit}
                </td>

                {/* All columns with two subcells */}
                {[
                  row.TotalProduction,
                  row.TotalAvgCount,
                  row.TotalConsumption,
                  row.consumptionperbag,
                ].map((item, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-gray-400 w-[18%] p-0"
                  >
                    <div className="flex">
                      <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                        {item.p1?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="w-1/2 py-2 px-3 text-center">
                        {item.p2?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnergyComparisonReport;
