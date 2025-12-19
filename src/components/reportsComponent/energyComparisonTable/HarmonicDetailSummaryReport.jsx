"use client";
import React, { useState } from "react";
import { pdfStyles } from "@/components/tables/pdfStandardTable";
import { SectionHeader } from "@/components/tables/SectionHeader";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import { useTheme } from "next-themes";
import AnalyticsChart from "./AnalyticsChart";
import { ThreecolsPdfTable } from "@/components/tables/ThreecolsPdfTable";
const sectionHeaders = {
  rParams: "Report Parameters",
  mappingSec: "Dates Mapping",
  voltageChart: (
    <>
      THD<sub>V</sub> Summary
    </>
  ),
  currentChart: (
    <>
      THD<sub>I</sub> Summary
    </>
  ),
};

export const formatDateTime = (iso) => {
  if (!iso) return "";

  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).padStart(2, "0");

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0 → 12
  hours = String(hours).padStart(2, "0");

  return `${year}/${month}/${day} - ${hours}:${minutes} ${ampm}`;
};

const HarmonicDetailSummaryReport = ({
  intervalObj = {},
  voltageChartData = [],
  currentChartData = [],
  selectedSource = [],
  usageReportTimePeriod = "",
}) => {
  console.log(selectedSource);
  const { theme } = useTheme();
  // formate number

  const formateNumber = (num) => {
    return Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  //=======================================PDF export start ================================
  const HarmonicsComparisonPdfTable = ({ data = [] }) => {
    const getValue = (row, key) => {
      const value = row?.[key];

      if (value === null || value === undefined) return "-";

      // If it's a number (or numeric string)
      if (typeof value === "number" || !isNaN(value)) {
        return Number(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }

      // Fallback for non-numeric values
      return value;
    };
    return {
      margin: [0, 10, 0, 20],
      table: {
        headerRows: 2,

        // ✅ 10 equal columns + 1 small separator
        widths: [
          "11%",
          "11%",
          "11%",
          "11%",
          "11%",
          "0.7%",
          "11%",
          "11%",
          "11%",
          "11%",
        ],

        body: [
          // ===================== HEADER ROW 1 =====================
          [
            { text: "", border: [false, false, false, false] },
            {
              text: "Period 1",
              colSpan: 4,
              alignment: "center",
              style: "tablecell",
              bold: true,
              fontSize: 9,
            },
            {},
            {},
            {},
            { text: "", border: [true, false, false, false] },
            {
              text: "Period 2",
              colSpan: 4,
              alignment: "center",
              style: "tablecell",
              bold: true,
              fontSize: 9,
            },
            {},
            {},
            {},
          ],

          // ===================== HEADER ROW 2 =====================
          [
            {
              text: "Meter",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Avg THD",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Min Value",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Max Value",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Total Energy Consumed",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "",
              border: [false, false, false, false],
              fillColor: "#ffffff",
            },
            {
              text: "Avg THD",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Min Value",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Max Value",
              style: "tableHeader",
              alignment: "center",
              valign: "middle",
            },
            {
              text: "Total Energy Consumed",
              style: "tableHeader",
              alignment: "center",
            },
          ],

          // ===================== DATA ROWS =====================
          ...data.map((row) => [
            { text: row.meter, style: "tableCell" },

            {
              text: getValue(row, "p1Harmonics"),
              alignment: "center",
              style: "tableCell",
            },
            {
              stack: [
                { text: getValue(row, "p1Min"), bold: true },
                { text: formatDateTime(row.p1Mindate), fontSize: 7 },
              ],
              alignment: "center",
              style: "tableCell",
            },
            {
              stack: [
                { text: getValue(row, "p1Max"), bold: true },
                { text: formatDateTime(row.p1Maxdate), fontSize: 7 },
              ],
              alignment: "center",
              style: "tableCell",
            },
            {
              text: formateNumber(row.p1Consumption) ?? "-",
              style: "tableCell",
              alignment: "center",
            },

            {
              text: "",
              fillColor: "#ffffff",
              border: [false, false, false, false],
            },

            {
              text: getValue(row, "p2Harmonics"),
              style: "tableCell",
              alignment: "center",
            },
            {
              stack: [
                { text: getValue(row, "p2Min"), bold: true },
                {
                  text: formatDateTime(row.p2Mindate),
                  fontSize: 7,
                },
              ],
              alignment: "center",
              style: "tableCell",
            },
            {
              stack: [
                { text: getValue(row, "p2Max"), bold: true },
                { text: formatDateTime(row.p2Maxdate), fontSize: 7 },
              ],
              alignment: "center",
              style: "tableCell",
            },
            {
              text: formateNumber(row.p2Consumption) ?? "-",
              style: "tableCell",
              alignment: "center",
            },
          ]),
        ],
      },

      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#000000",
        vLineColor: () => "#000000",
      },
    };
  };

  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.error("pdfMake vfs fonts not found.");
  }
  const handleExportPdf = async () => {
    try {
      // ✅ Ensure logos load successfully
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
                text: "Harmonics Detail Summary Report",
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
        footer: (currentPage, pageCount) => ({
          text: `${currentPage}`,
          alignment: "center",
          fontSize: 9,
          margin: [0, 0, 0, 0],
          color: "#555",
        }),

        content: [
          // ================= Param table =================
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
                    ...selectedSource.flatMap((source) => {
                      const rows = [];
                      rows.push([
                        {
                          text: source,
                          style: "tableCell",
                          alignment: "left",
                          fillColor: "#F9F9F9",
                        },
                      ]);
                      return rows;
                    }),
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

          // ================= Voltage Min / Max table =================
          sectionHeaders.voltageChart
            ? {
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: ["THD", { text: "V", sub: true }, " Summary"],
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              }
            : null,

          HarmonicsComparisonPdfTable({
            data: voltageChartData,
          }),
          // ================= Current Min / Max table =================
          sectionHeaders.currentChart
            ? {
                pageBreak: "before",
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: ["THD", { text: "I", sub: true }, " Summary"],
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              }
            : null,
          HarmonicsComparisonPdfTable({
            data: currentChartData,
          }),
        ],

        styles: pdfStyles,
        defaultStyle: { font: "Roboto" },
        pageMargins: [40, 115, 40, 60],
      };

      pdfMake
        .createPdf(docDefinition)
        .download(
          `harmonics_detail_report_${reportedDate}_${reportedTime}.pdf`
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
      {selectedSource && (
        <div className="w-[20%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              <tr>
                <td className="font-semibold bg-[#E5F3FD] dark:bg-gray-600 w-full border py-1 border-gray-400 px-3">
                  Source
                </td>
              </tr>
              {selectedSource.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className={`border py-1 w-full border-gray-400 px-3`}>
                    {item}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* thd v avg chart */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.voltageChart} />
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse mt-5 text-sm">
            {/* ---------- HEADER ---------- */}
            <thead className="">
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="w-[12.8%]"></th>
                <th
                  colSpan={4}
                  className=" dark:bg-gray-600 py-1 border border-gray-400 w-[12.8%]"
                >
                  Period 1
                </th>
                <th className="w-[0.8%]"></th>
                <th
                  colSpan={4}
                  className=" dark:bg-gray-600 py-1 border border-gray-400 w-[12.8%]"
                >
                  Period 2
                </th>
              </tr>
              <tr className="bg-[#E5F3FD] dark:bg-gray-600 text-[13px] md:text-[14px] font-inter">
                <th className="py-2 px-3 border border-gray-400 text-center w-[11.11%]">
                  Meter
                </th>

                <th className="border border-gray-400 w-[11.11%]">Avg THD</th>
                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
                <th className="border border-gray-400 w-[11.11%]">
                  Total Energy Consumed
                </th>
                <th className="bg-white dark:bg-gray-800 border-x border-gray-400 w-[0.7%]"></th>
                <th className="border border-gray-400 w-[11.11%]">Avg THD</th>
                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
                <th className="border border-gray-400 w-[11.11%]">
                  Total Energy Consumed
                </th>
              </tr>
            </thead>

            {/* ---------- BODY ---------- */}
            <tbody>
              {voltageChartData.map((meter) => (
                <tr className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {/* Period */}
                  <td className="py-2 px-3 border border-gray-400  font-semibold">
                    {meter.meter}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p1Harmonics)}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p1Min)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p1Mindate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p1Max)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p2Mindate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p1Consumption)}
                  </td>
                  <td className="py-2 border-x bg-white dark:bg-gray-800 border-gray-400 text-center font-semibold"></td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p2Harmonics)}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p2Min)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p1Maxdate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p2Max)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p2Maxdate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p2Consumption)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.currentChart} />
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse mt-5 text-sm">
            {/* ---------- HEADER ---------- */}
            <thead className="">
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="w-[12.8%]"></th>
                <th
                  colSpan={4}
                  className=" dark:bg-gray-600 py-1 border border-gray-400 w-[12.8%]"
                >
                  Period 1
                </th>
                <th className="w-[0.8%]"></th>
                <th
                  colSpan={4}
                  className=" dark:bg-gray-600 py-1 border border-gray-400 w-[12.8%]"
                >
                  Period 2
                </th>
              </tr>
              <tr className="bg-[#E5F3FD] dark:bg-gray-600 text-[13px] md:text-[14px] font-inter">
                <th className="py-2 px-3 border border-gray-400 text-center w-[11.11%]">
                  Meter
                </th>

                <th className="border border-gray-400 w-[11.11%]">Avg THD</th>
                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
                <th className="border border-gray-400 w-[11.11%]">
                  Total Energy Consumed
                </th>
                <th className="bg-white dark:bg-gray-800 border-x border-gray-400 w-[0.7%]"></th>
                <th className="border border-gray-400 w-[11.11%]">Avg THD</th>
                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-400 w-[11.11%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
                <th className="border border-gray-400 w-[11.11%]">
                  Total Energy Consumed
                </th>
              </tr>
            </thead>

            {/* ---------- BODY ---------- */}
            <tbody>
              {currentChartData.map((meter) => (
                <tr className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {/* Period */}
                  <td className="py-2 px-3 border border-gray-400  font-semibold">
                    {meter.meter}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p1Harmonics)}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p1Min)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p1Mindate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p1Max)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p2Mindate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p1Consumption)}
                  </td>
                  <td className="py-2 border-x bg-white dark:bg-gray-800 border-gray-400 text-center font-semibold"></td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p2Harmonics)}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p2Min)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p1Maxdate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">
                        {formateNumber(meter.p2Max)}
                      </span>
                      <span className="text-[11px] text-center text-gray-600 dark:text-gray-300">
                        {formatDateTime(meter.p2Maxdate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {formateNumber(meter.p2Consumption)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HarmonicDetailSummaryReport;
