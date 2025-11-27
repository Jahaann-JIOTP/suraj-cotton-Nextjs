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
const sourcesData = {
  Sources: "Sources",
  "Unit 4": "Unit 4",
  "Unit 5": "Unit 5",
};

const EnergyComparisonReport = ({ rawData = {}, intervalObj = {} }) => {
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
      <div className="w-full mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            {Object.entries(intervalObj).map(([label, value], idx) => (
              <tr key={idx}>
                <td className="font-semibold border border-gray-400 px-3 py-2">
                  {label}
                </td>

                <td className="border border-gray-400 px-3 py-2">
                  {value?.p1 ?? "-"}
                </td>

                <td className="border border-gray-400 px-3 py-2">
                  {value?.p2 ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* sources */}
      {/* <KayValueTable title="" data={sourcesData} isSingleCol={true} /> */}
    </div>
  );
};

export default EnergyComparisonReport;
