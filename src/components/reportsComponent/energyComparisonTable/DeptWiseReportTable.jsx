"use client";
import { SectionHeader } from "@/components/tables/SectionHeader";
import { useTheme } from "next-themes";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import { buildKeyValuePdfTable } from "@/components/tables/pdfKayValue";
import { pdfStyles } from "@/components/tables/pdfStandardTable";
const sectionHeading = {
  parameters: "Report Parameters",
  deptWiseReport: "Department Wise Consumption",
};
const deptTableHeader = [
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
];
const DeptWiseReportTable = ({
  deptReportData = [],
  source = "",
  intervalsObj = {},
}) => {
  const { theme } = useTheme();
  // total of cosumption
  const sumOfValues = deptReportData.reduce((acc, cur) => {
    return acc + cur.energy_consumption;
  }, 0);
  const formateNumber = (num) => {
    return Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.error("pdfMake vfs fonts not found.");
  }
  const handleExportPdf = async () => {
    try {
      // ✅ Ensure images load successfully before proceeding

      const surajCottonBase64Logo = await loadImageAsBase64(
        "/suraj-cotton-logo-reports.png"
      );
      const jahaannBase64Logo = await loadImageAsBase64("/jahaann-light.png");

      if (!surajCottonBase64Logo || !jahaannBase64Logo) {
        alert("Error loading logos. Please check the file paths.");
        return;
      }

      pdfMake.fonts = {
        Roboto: {
          normal: "Roboto-Regular.ttf",
          bold: "Roboto-Medium.ttf",
          italics: "Roboto-Italic.ttf",
          bolditalics: "Roboto-MediumItalic.ttf",
        },
      };

      const now = new Date();
      const reportedDate = now.toLocaleDateString("en-GB");
      const reportedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        header: (currentPage, pageCount) => [
          {
            columns: [
              {
                image: surajCottonBase64Logo,
                width: 80,
                margin: [40, 20, 0, 0],
              },
              {
                text: "Department-Wise Energy Consumption Report",
                width: "*",
                alignment: "center",
                fontSize: 11,
                margin: [0, 25, 0, 0],
              },
              {
                image: jahaannBase64Logo,
                width: 110,
                alignment: "right",
                margin: [0, 25, 20, 0],
              },
            ],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 763,
                y2: 0,
                lineWidth: 2,
                lineColor: "#1C4D82",
              },
            ],
            margin: [40, 5, 0, 0],
          },
          {
            columns: [
              {
                text: "Suraj Cotton Mills Limited, Raiwind",
                alignment: "left",
                margin: [40, 5, 0, 0],
                fontSize: 12,
                bold: true,
                color: "#000000",
              },
              {
                text: `Reported Date: ${reportedDate} ${reportedTime}`,
                alignment: "right",
                margin: [0, 5, 40, 0],
                fontSize: 9,
                bold: true,
              },
            ],
          },
        ],
        footer: function (currentPage, pageCount) {
          return {
            text: `${currentPage}`,
            alignment: "center",
            fontSize: 9,
            margin: [0, 0, 0, 0], // [left, top, right, bottom]
            color: "#555",
          };
        },

        content: [
          // --- (1) REPORT PARAMETERS — 50% width ---

          buildKeyValuePdfTable({
            title: sectionHeading.parameters,
            data: intervalsObj,
          }),
          //  source table
          {
            width: "100%",
            stack: [
              {
                table: {
                  headerRows: 1,
                  widths: ["25%"],
                  body: [
                    [
                      {
                        text: "Sources",
                        style: "tableHeader",
                        alignment: "left",
                      },
                    ],
                    [
                      {
                        text: source,
                        style: "tableCell",
                        alignment: "left",
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => "#000000",
                  vLineColor: () => "#000000",
                },
                margin: [0, 5, 0, 10],
              },
            ],
          },
          // --- Dept Wise Report ---

          {
            width: "100%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: sectionHeading.deptWiseReport,
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              },
              {
                table: {
                  headerRows: 1,
                  widths: [
                    "3%",
                    "12.42%",
                    "5%",
                    "5%",
                    "12.42%",
                    "12.42%",
                    "12.42%",
                    "12.42%",
                    "12.42%",
                    "12.42%",
                  ],
                  body: [
                    // --- Header row ---
                    [
                      ...(deptTableHeader?.map((key) => ({
                        text: key,
                        style: "tableHeader",
                        alignment: "center",
                      })) || []),
                    ],

                    // --- Dynamic rows for departments ---
                    ...((deptReportData || []).flatMap((dept, index) => {
                      const rows = [];
                      rows.push([
                        {
                          text: (index + 1).toString(),

                          style: "tableCell",
                          alignment: "center",
                          border: [true, false, true, true],
                          verticalAlignment: "middle",
                        },
                        {
                          text: dept.meterName || "-",
                          style: "tableCell",
                          alignment: "left",
                        },
                        {
                          text: dept.area || "-",
                          style: "tableCell",
                          alignment: "center",
                        },
                        {
                          text: dept.lt || "-",
                          style: "tableCell",
                          alignment: "center",
                        },
                        {
                          text: dept.MCS || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                        {
                          text: dept.connectedLoad || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                        {
                          text: formateNumber(dept.avgPower) || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                        {
                          text: formateNumber(dept.avgPowerFactor) || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                        {
                          text: formateNumber(dept.avgVoltage) || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                        {
                          text: formateNumber(dept.energy_consumption) || "-",
                          style: "tableCellRight",
                          alignment: "center",
                        },
                      ]);
                      return rows;
                    }) || []),
                    [
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },
                      { text: "", border: [false, false, false, false] },

                      {
                        text: "Total",
                        alignment: "center",
                        bold: true,
                        fontSize: 10,
                        padding: [4, 2],
                      },
                      {
                        text: formateNumber(sumOfValues) || "-",
                        style: "tableCellRightBold",
                        alignment: "center",
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => "#000000",
                  vLineColor: () => "#000000",
                },
                // ✅ CRITICAL: Prevent rows from breaking across pages

                // ✅ Optional: Add some padding to ensure proper spacing
                margin: [0, 5, 0, 30],
              },
            ],
          },
        ],

        styles: pdfStyles,

        defaultStyle: {
          font: "Roboto",
        },
        pageMargins: [40, 115, 40, 60],
      };

      pdfMake
        .createPdf(docDefinition)
        .download(`dept_wise_report_${reportedDate}_${reportedTime}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

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
          onClick={handleExportPdf}
          className="bg-[#1C4D82] hover:bg-[#1C4D82] cursor-pointer text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          Export to PDF
        </button>
      </div>
      {/* parameter table */}
      <SectionHeader title={sectionHeading.parameters} />
      <div className="w-[50%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            {Object.entries(intervalsObj).map(([label, value], idx) => {
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
      <div className="w-[25%] mt-5 overflow-x-auto">
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
        <SectionHeader title={sectionHeading.deptWiseReport} />
        <table className="min-w-full mt-5 text-sm">
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
                <td className="py-1 px-3 border border-gray-400 w-[3%] text-center">
                  {idx + 1}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-left">
                  {row.meterName}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[5%] text-center">
                  {row.area}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[5%] text-center">
                  {row.lt}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.MCS}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {row.connectedLoad}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {formateNumber(row.avgPower)}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {formateNumber(row.avgPowerFactor)}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {formateNumber(row.avgVoltage)}
                </td>
                <td className="py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                  {formateNumber(row.energy_consumption)}
                </td>
              </tr>
            ))}
            <tr className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <td colSpan={8} className="py-2 px-3 w-[12.42%] text-center"></td>
              <td className="font-semibold bg-gray-100 dark:bg-gray-700 py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                Total
              </td>
              <td className="font-semibold bg-gray-100 dark:bg-gray-700 py-1 px-3 border border-gray-400 w-[12.42%] text-center">
                {formateNumber(sumOfValues)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeptWiseReportTable;
