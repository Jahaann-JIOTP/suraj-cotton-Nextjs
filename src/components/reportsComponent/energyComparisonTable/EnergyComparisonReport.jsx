"use client";
import React from "react";
import { pdfStyles } from "@/components/tables/pdfStandardTable";
import { SectionHeader } from "@/components/tables/SectionHeader";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import { useTheme } from "next-themes";
import { ThreecolsPdfTable } from "@/components/tables/ThreecolsPdfTable";
import { ComparisonStandardTable } from "@/components/tables/ComparisonStarndardTable";
import { buildLowVoltagePdfTable } from "@/components/tables/BuildLowVoltagePdfTable";
import { MdOutlineInfo } from "react-icons/md";
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
  lowVoltageTotal = {},
  lowVoltageTotalPdf = {},
  utilizationData = [],
  consumptionPerDept = [],
  mergedProduction = [],
  totalConsumptionFirstrange = 0,
  totalConsumptionSecondrange = 0,
}) => {
  const { theme } = useTheme();
  // formate number
  const formateNumber = (num) => {
    return Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  //=======================================PDF export start ================================
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
                text: "Energy Comparison Report",
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
          //==========================================================================
          // ------------------parameter table------------------------------
          ThreecolsPdfTable({
            title: sectionHeaders.rParams,
            data: intervalObj,
          }),
          // Sources
          {
            width: "100%",
            stack: [
              {
                table: {
                  headerRows: 1,
                  widths: ["20%"],
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
                        text: "Unit 4",
                        style: "tableCell",
                        alignment: "left",
                      },
                    ],
                    [
                      {
                        text: "Unit 5",
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
          //==========================================================================
          //-------------------------generation summary-------------------------------
          ThreecolsPdfTable({
            title: sectionHeaders.HTside,
            data: htSideData,
            boldKyes: ["Total"],
            pageBreakAfter: true,
          }),
          //==========================================================================
          //-----------------------Consumption Summary--------------------------------
          ThreecolsPdfTable({
            title: sectionHeaders.lossesSummary,
            data: mergedSummary,
            boldKyes: ["Total_Consumption"],
          }),
          ThreecolsPdfTable({
            data: deltaOnly,
          }),

          //==========================================================================
          //------------------------Low Voltage Side Summary--------------------------
          buildLowVoltagePdfTable({
            title: sectionHeaders.summary,
            data: lowVoltageSide,
            totalRow: lowVoltageTotalPdf,
            headers: [
              "Total Incoming From Generation (kWh)",
              "Total Incoming From Other Unit (kWh)",
              "Total Consumption (kWh)",
              "Total Transferred to Other Unit (kWh)",
              "Total Unaccountable Energy (kWh)",
            ],
            keys: [
              "Total_I_C_G",
              "I_C_OU",
              "Total_Consumption",
              "Total_Tranferred_to_OU",
              "Unaccounted_Energy",
            ],
            pageBreakAfter: true,
          }),
          //==========================================================================
          //---------------------------Utilization table-------------------------------
          ComparisonStandardTable({
            title: sectionHeaders.utilization,
            data: utilizationData, // array of row objects
            headers: [
              "Total Actual Connected Load (kWh/h)",
              "Total Connected Load (kWh/h)",
              "Utilization",
            ],
            keys: [
              "TotalConnectedLoadPerDept",
              "TotalAvgConsumption",
              "UtilizationPercent",
            ],
            percentKeys: ["UtilizationPercent"],
          }),
          //==========================================================================
          //----------------------------production summary-----------------------------
          ComparisonStandardTable({
            title: sectionHeaders.production,
            data: mergedProduction, // array of row objects
            headers: [
              "Total No. of Bags",
              "Avg. Count",
              "Total Consumption (kWh)",
              "Consumption Per Bag (kWh/Bag)",
            ],
            keys: [
              "TotalProduction",
              "TotalAvgCount",
              "TotalConsumption",
              "consumptionperbag",
            ],
          }),

          //==========================================================================
          // --- (4) CONSUMPTION SUMMARY BY DEPARTMENT — full width ---

          {
            width: "100%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: sectionHeaders.consumptionPerDept,
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              },

              {
                table: {
                  headerRows: 2,
                  widths: [
                    "3%",
                    "12.42%",
                    "5%",
                    "5%",
                    "12.42%",
                    "6.21%",
                    "6.21%",
                    "6.21%",
                    "6.21%",
                    "11.42%",
                    "12.42%",
                    "6.21%",
                    "7.21%",
                  ],

                  body: [
                    /* ───────────── HEADER ROW 1 ───────────── */
                    [
                      {
                        text: "Sr #",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Department",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Unit",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "MCs",
                        style: "tableHeader",
                        alignment: "center",
                      },

                      {
                        text: "Connected Load Per Department (kWh/h)",
                        style: "tableHeader",
                        alignment: "center",
                      },

                      {
                        text: "Avg Running Load Per Dept",
                        colSpan: 2,
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {},

                      {
                        text: "Utilization",
                        colSpan: 2,
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {},

                      {
                        text: "Connected Load Per Machine (kWh/h/Mc)",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Avg Running Load Per Machine (kWh/h/Mc)",
                        style: "tableHeader",
                        alignment: "center",
                      },

                      {
                        text: "Total Units Consumed (kWh)",
                        colSpan: 2,
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {},
                    ],

                    /* ───────────── HEADER ROW 2 ───────────── */
                    [
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [true, true, false, true],
                      },
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },

                      {
                        text: "P1",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },
                      {
                        text: "P2",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },

                      {
                        text: "P1",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },
                      {
                        text: "P2",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },

                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },
                      {
                        text: "",
                        fillColor: "#EAF4FF",
                        border: [false, true, false, true],
                      },

                      {
                        text: "P1",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },
                      {
                        text: "P2",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#EAF4FF",
                      },
                    ],

                    // /* EMPTY HEADER SPACER (13 columns) */
                    // ["", "", "", "", "", "", "", "", "", "", "", "", ""],

                    /* ───────────── DYNAMIC ROWS ───────────── */
                    ...consumptionPerDept.flatMap((dept, index) => {
                      const rows = [];

                      /* UNIT 4 ROW */
                      rows.push([
                        {
                          text: index + 1,
                          rowSpan: 3,
                          style: "tableCell",
                          alignment: "center",
                          fillColor: "#F9F9F9",
                        },

                        {
                          text: dept.name ?? "-",
                          style: "tableCell",
                          alignment: "left",
                        },
                        { text: "4", alignment: "center", style: "tableCell" },
                        {
                          text: dept.u4Mcs ?? "-",
                          alignment: "center",
                          style: "tableCell",
                        },

                        {
                          text: dept.u4ConectedLoadPerDept ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u4AvgConsumption?.p1 ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u4AvgConsumption?.p2 ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u4UtilizationPercent?.p1
                            ? dept.u4UtilizationPercent.p1 + " %"
                            : "-",
                          fillColor: "#E5F3FD",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u4UtilizationPercent?.p2
                            ? dept.u4UtilizationPercent.p2 + " %"
                            : "-",
                          fillColor: "#E5F3FD",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u4ConectedLoadPerMcs ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u4RunnigLoad ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text:
                            dept.u4Consumption?.p1?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text:
                            dept.u4Consumption?.p2?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRight",
                        },
                      ]);

                      /* UNIT 5 ROW */
                      rows.push([
                        "",

                        {
                          text: dept.u5Name ?? "-",
                          style: "tableCell",
                          alignment: "left",
                        },
                        { text: "5", alignment: "center", style: "tableCell" },
                        {
                          text: dept.u5Mcs ?? "-",
                          alignment: "center",
                          style: "tableCell",
                        },

                        {
                          text: dept.u5ConectedLoadPerDept ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u5AvgConsumption?.p1 ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u5AvgConsumption?.p2 ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u5UtilizationPercent?.p1
                            ? dept.u5UtilizationPercent.p1 + " %"
                            : "-",
                          fillColor: "#E5F3FD",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u5UtilizationPercent?.p2
                            ? dept.u5UtilizationPercent.p2 + " %"
                            : "-",
                          fillColor: "#E5F3FD",
                          style: "tableCellRight",
                        },

                        {
                          text: dept.u5ConectedLoadPerMcs ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text: dept.u5RunningLoad ?? "-",
                          style: "tableCellRight",
                        },

                        {
                          text:
                            dept.u5Consumption?.p1?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRight",
                        },
                        {
                          text:
                            dept.u5Consumption?.p2?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRight",
                        },
                      ]);

                      /* TOTAL ROW — FIXED TO 13 CELLS */
                      rows.push([
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },
                        {
                          text: "",
                          fillColor: "#F9F9F9",
                          border: [false, false, false, true],
                        },

                        {
                          text: "Total",
                          alignment: "center",
                          bold: true,
                          fillColor: "#F9F9F9",
                          fontSize: 10,
                          padding: [4, 2],
                        },

                        {
                          text:
                            dept.totalConsumption?.p1?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRightBold",
                          fillColor: "#F9F9F9",
                        },
                        {
                          text:
                            dept.totalConsumption?.p2?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-",
                          style: "tableCellRightBold",
                          fillColor: "#F9F9F9",
                        },
                      ]);

                      /* GAP ROW — FIXED TO 13 COLUMNS */
                      rows.push([
                        {
                          text: "",
                          colSpan: 13,
                          border: [false, false, false, false],
                        },
                        ...Array(12).fill(""),
                      ]);

                      return rows;
                    }),
                    // --- GRAND TOTAL ---
                    [
                      // first period grand total
                      {
                        stack: [
                          {
                            text: [
                              {
                                text: "Note: ",
                                color: "#1E538C",
                                bold: true,
                              },
                              {
                                text: "HFO + JMS Auxiliary not included in grand total.",
                                color: "#1E538C",
                                italics: true,
                              },
                            ],
                            fontSize: 9,
                            margin: [0, 2, 0, 0],
                          },
                        ],
                        colSpan: 9,
                        border: [false, false, false, false],
                      },
                      ...Array(8).fill({}),
                      {
                        text: "Grand Total Consumption Period 1",
                        colSpan: 2,
                        bold: true,
                        fontSize: 10,
                        alignment: "center",
                        fillColor: "#E5F3FD",
                        border: [true, true, true, true],
                      },
                      {},
                      {
                        text: totalConsumptionFirstrange
                          ? formateNumber(totalConsumptionFirstrange)
                          : "0.00",
                        alignment: "right",
                        bold: true,
                        fontSize: 10,
                        colSpan: 2,
                        border: [true, true, true, true],
                      },
                      {},
                    ],
                    [
                      ...Array(9).fill({
                        text: "",
                        border: [false, false, false, false],
                      }),
                      {
                        text: "Grand Total Consumption Period 2",
                        colSpan: 2,
                        bold: true,
                        fontSize: 10,
                        alignment: "center",
                        fillColor: "#E5F3FD",
                        border: [true, true, true, true],
                      },
                      {},
                      {
                        text: totalConsumptionSecondrange
                          ? formateNumber(totalConsumptionSecondrange)
                          : "0.00",
                        alignment: "right",
                        bold: true,
                        fontSize: 10,
                        colSpan: 2,
                        border: [true, true, true, true],
                      },
                      {},
                    ],
                  ],
                },

                layout: {
                  hLineWidth: () => 0.4,
                  vLineWidth: () => 0.4,
                },

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
        .download(
          `energy_comparison_report_${reportedDate}_${reportedTime}.pdf`
        );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  //=======================================PDF export end ================================
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
          onClick={handleExportPdf}
          className="bg-[#1C4D82] hover:bg-[#1C4D82] cursor-pointer text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          Export to PDF
        </button>
      </div>
      {/* parameter table */}
      <SectionHeader title={sectionHeaders.rParams} />
      <div className="w-[60%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            {Object.entries(intervalObj).map(([label, value], idx) => {
              const isfirstRow = idx === 0;
              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600 w-[20%] border py-1 border-gray-400 px-3">
                    {label}
                  </td>

                  <td
                    className={`border py-1 w-[20%] ${
                      isfirstRow
                        ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                        : ""
                    } border-gray-400 px-3`}
                  >
                    {value?.p1 ?? "-"}
                  </td>

                  <td
                    className={`border  py-1 w-[20%] ${
                      isfirstRow
                        ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                        : ""
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
      <div className="w-[20%] mt-5 overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm">
          <tbody>
            <tr>
              <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600 w-full border py-1 border-gray-400 px-3">
                Sources
              </td>
            </tr>
            {(unit === "ALL" || unit === "Unit_4") && (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className={`border py-1 w-full border-gray-400 px-3`}>
                  Unit 4
                </td>
              </tr>
            )}
            {(unit === "ALL" || unit === "Unit_5") && (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
        <div className="w-[60%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              {Object.entries(htSideData).map(([label, value], idx) => {
                const isfirstRow = idx === 0;
                const isBold = label === "Total";
                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600  w-[20%] border py-1 border-gray-400 px-3">
                      {label}
                    </td>

                    <td
                      className={`border py-1 w-[20%] ${
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {value?.p1?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>

                    <td
                      className={`border py-1 w-[20%] ${
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
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
        <div className="w-[60%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              {Object.entries(mergedSummary).map(([label, value], idx) => {
                const isfirstRow = idx === 0;
                const isBold = label === "Total_Consumption";
                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600  w-[16.6%] border py-1 border-gray-400 px-3">
                      {label.replaceAll("_", " ")}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value.p1 === "number"
                        ? formateNumber(value?.p1)
                        : value?.p1 ?? "-"}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
                      } ${isBold ? "font-semibold" : ""} border-gray-400 px-3`}
                    >
                      {typeof value.p2 === "number"
                        ? formateNumber(value?.p2)
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
                    <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600  w-[16.6%] border py-1 border-gray-400 px-3">
                      {label.replaceAll("_", " ")}
                    </td>

                    <td
                      className={`border py-1 w-[16.6%] ${
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
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
                        isfirstRow
                          ? "bg-[#E5F3FD] dark:bg-gray-600 font-semibold"
                          : ""
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
                    {lowVoltageTotal?.totalIcg?.p1?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotal.totalIcg.p2.toLocaleString("en-US", {
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
                    {lowVoltageTotal?.totalConsumptionValue?.p1?.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotal.totalConsumptionValue.p2.toLocaleString(
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
                    {lowVoltageTotal?.UnaccountedEnergyTotal?.p1?.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                  <div className="w-1/2 py-2 px-3 text-center">
                    {lowVoltageTotal.UnaccountedEnergyTotal.p2.toLocaleString(
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
                <th key={idx} className="border border-gray-400 w-[30%]">
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
                    className="border border-gray-400 w-[30%] p-0"
                  >
                    <div className="flex">
                      <div className="w-1/2 py-2 px-3 border-r border-gray-400 text-center">
                        {item.p1?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {item === row.UtilizationPercent ? "%" : ""}
                      </div>
                      <div className="w-1/2 py-2 px-3 text-center">
                        {item.p2?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {item === row.UtilizationPercent ? "%" : ""}
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
                <th key={idx} className="border border-gray-400 w-[22.5%]">
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
                    className="border border-gray-400 w-[22.5%] p-0"
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
      {/* Consumption per dept */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.consumptionPerDept} />
        <div className="w-full mt-5 overflow-x-auto">
          <table className="min-w-full w-full  text-sm md:text-base">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              {/* <tr className="text-[13px] md:text-[14px] font-inter">
                <th
                  rowSpan={2}
                  className="text-center border px-3 py-2 w-[60px]"
                >
                  Sr #
                </th>
                <th
                  rowSpan={2}
                  className="text-center border px-3 py-2 w-[160px]"
                >
                  Department
                </th>
                <th
                  rowSpan={2}
                  className="text-center border px-3 py-2 w-[60px]"
                >
                  Unit
                </th>
                <th
                  rowSpan={2}
                  className="text-center border px-3 py-2 w-[60px]"
                >
                  MCs
                </th>

                <th rowSpan={2} className="text-center border px-3 py-2">
                  Connected Load Per Department (kWh/h)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Avg Running Load Per Department (kWh/h)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Utilization
                </th>

                <th rowSpan={2} className="text-center border px-3 py-2">
                  Connected Load Per Machine (kWh/h/Mc)
                </th>

                <th rowSpan={2} className="text-center border px-3 py-2">
                  Avg Running Load Per Machine (kWh/h/Mc)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Total Units Consumed (kWh)
                </th>
              </tr> */}
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="text-center border px-3 py-2 w-[60px]">Sr #</th>
                <th className="text-center border px-3 py-2 w-[160px]">
                  Department
                </th>
                <th className="text-center border px-3 py-2 w-[60px]">Unit</th>
                <th className="text-center border px-3 py-2 w-[60px]">MCs</th>

                <th className="text-center border px-3 py-2">
                  Connected Load Per Department (kWh/h)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Avg Running Load Per Department (kWh/h)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Utilization
                </th>

                <th className="text-center border px-3 py-2">
                  Connected Load Per Machine (kWh/h/Mc)
                </th>

                <th className="text-center border px-3 py-2">
                  Avg Running Load Per Machine (kWh/h/Mc)
                </th>

                <th colSpan={2} className="text-center border px-3 py-2">
                  Total Units Consumed (kWh)
                </th>
              </tr>

              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="text-center px-3 py-2"></th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border px-3 py-2">P1</th>
                <th className="text-center border px-3 py-2">P2</th>
                <th className="text-center border px-3 py-2">P1</th>
                <th className="text-center border px-3 py-2">P2</th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border-y px-3 py-2"></th>
                <th className="text-center border px-3 py-2">P1</th>
                <th className="text-center border px-3 py-2">P2</th>
              </tr>
            </thead>

            <tbody>
              {consumptionPerDept.map((dept, index) => (
                <React.Fragment key={index}>
                  {/* ─────────────── UNIT 4 ─────────────── */}
                  <tr className="text-[13px] md:text-[14px] border-t-2 border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {/* Sr # */}
                    <td
                      rowSpan={3}
                      className="border w-[3%] border-gray-300 font-medium text-center px-2 py-1 align-middle bg-gray-50 dark:bg-gray-800"
                    >
                      {index + 1}
                    </td>

                    {/* Department */}
                    <td className="border w-[13%] border-gray-300 font-medium px-2 py-1 align-middle">
                      {dept.name || "-"}
                    </td>

                    {/* Unit */}
                    <td className="border w-[3%] border-gray-300 px-2 py-1 text-center">
                      4
                    </td>

                    {/* MCs */}
                    <td className="border w-[3%] border-gray-300 px-2 py-1 text-center">
                      {dept.u4Mcs ?? "-"}
                    </td>

                    {/* Connected Load Per Department */}
                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4ConectedLoadPerDept ?? "-"}
                    </td>

                    {/* Avg Running Load Per Dept → P1 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4AvgConsumption?.p1 ?? "-"}
                    </td>

                    {/* Avg Running Load Per Dept → P2 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4AvgConsumption?.p2 ?? "-"}
                    </td>

                    {/* Utilization → P1 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u4UtilizationPercent?.p1
                        ? dept.u4UtilizationPercent.p1 + " %"
                        : "-"}
                    </td>

                    {/* Utilization → P2 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u4UtilizationPercent?.p2
                        ? dept.u4UtilizationPercent.p2 + " %"
                        : "-"}
                    </td>

                    {/* Connected Load Per Machine */}
                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4ConectedLoadPerMcs ?? "-"}
                    </td>

                    {/* Avg Running Load per Machine */}
                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4RunnigLoad ?? "-"}
                    </td>

                    {/* Total Consumption → P1 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4Consumption?.p1?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>

                    {/* Total Consumption → P2 */}
                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u4Consumption?.p2?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  {/* ─────────────── UNIT 5 ─────────────── */}
                  <tr className="text-[13px] md:text-[14px] border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="border w-[13%] border-gray-300 font-medium px-2 py-1 align-middle">
                      {dept.u5Name || "-"}
                    </td>

                    <td className="border w-[3%] border-gray-300 px-2 py-1 text-center">
                      5
                    </td>

                    <td className="border w-[3%] border-gray-300 px-2 py-1 text-center">
                      {dept.u5Mcs ?? "-"}
                    </td>

                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5ConectedLoadPerDept ?? "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5AvgConsumption?.p1 ?? "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5AvgConsumption?.p2 ?? "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u5UtilizationPercent?.p1
                        ? dept.u5UtilizationPercent.p1 + " %"
                        : "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u5UtilizationPercent?.p2
                        ? dept.u5UtilizationPercent.p2 + " %"
                        : "-"}
                    </td>

                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5ConectedLoadPerMcs ?? "-"}
                    </td>

                    <td className="border w-[13%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5RunningLoad ?? "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5Consumption?.p1?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>

                    <td className="border w-[6.5%] border-gray-300 px-2 py-1 text-right">
                      {dept.u5Consumption?.p2?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  {/* ─────────────── TOTAL ROW ─────────────── */}
                  <tr className="text-[13px] md:text-[14px] border-b-2 border-x-2 border-gray-500 dark:border-gray-300 font-semibold bg-gray-100 dark:bg-gray-700">
                    <td
                      colSpan={10}
                      className="text-right border border-gray-400 px-2 py-1"
                    >
                      Total
                    </td>

                    <td className="text-right w-[6.5%] border border-gray-400 px-2 py-1">
                      {dept.totalConsumption?.p1?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>

                    <td className="text-right w-[6.5%] border border-gray-400 px-2 py-1">
                      {dept.totalConsumption?.p2?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={13} className="h-2"></td>
                  </tr>
                </React.Fragment>
              ))}

              {/* ─────────────── GRAND TOTAL ROW ─────────────── */}
              <tr className="font-semibold text-[13px] md:text-[14px] dark:bg-gray-600">
                <td rowSpan={2} colSpan={9} className="dark:bg-gray-800">
                  <span className="flex items-center gap-5 text-gray-600 dark:text-gray-300">
                    <MdOutlineInfo
                      className="text-[#1E538C] dark:text-[#E5F3FD] bg-[#1E538C]/20 dark:bg-[#E5F3FD]/40 rounded-full p-[3px]"
                      size={30}
                    />
                    HFO + JMS Auxiliary not included in grand total consumption.
                  </span>
                </td>
                <td
                  colSpan={2}
                  className="text-center border-2 border-gray-700 dark:border-gray-300 px-2 py-1"
                >
                  Grand Total Consumption Period 1
                </td>
                <td
                  colSpan={2}
                  className="text-right border-2 border-gray-700 dark:border-gray-300 px-2 py-1"
                >
                  {formateNumber(totalConsumptionFirstrange)}
                </td>
              </tr>
              <tr className="font-semibold text-[13px] md:text-[14px] dark:bg-gray-600">
                <td
                  colSpan={2}
                  className="text-center border-2 border-gray-700 dark:border-gray-300 px-2 py-1"
                >
                  Grand Total Consumption Period 2
                </td>
                <td
                  colSpan={2}
                  className="text-right border-2 border-gray-700 dark:border-gray-300 px-2 py-1"
                >
                  {formateNumber(totalConsumptionSecondrange)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergyComparisonReport;
