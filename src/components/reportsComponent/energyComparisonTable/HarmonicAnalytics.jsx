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
  mappingSec: "Dates mapping",
  voltageChart: "Harmonics Votage Analytics Chart",
  currentChart: "Harmonics Current Analytics Chart",
};

const avgTabData = [
  {
    period: "Period 1",
    minValue: 20,
    minDate: "2025-12-13T20:30:00",
    maxValue: 40,
    maxDate: "2025-12-13T18:30:00",
  },
  {
    period: "Period 2",
    minValue: 15,
    minDate: "2025-12-13T20:30:00",
    maxValue: 30,
    maxDate: "2025-12-13T18:30:00",
  },
];

const HarmonicAnalytics = ({
  intervalObj = {},
  voltageChartData = [],
  currentChartData = [],
  selectedSource = "",
  usageReportTimePeriod = "",
}) => {
  const [voltageChartImg, setVoltageChartImg] = useState(null);
  const [currentChartImg, setCurrentChartImg] = useState(null);
  const { theme } = useTheme();
  // formate number
  function formatLocalDateTime(dateStr) {
    if (!dateStr) return "";

    // Extract date & time directly from string (NO Date object)
    // Example input: 2025-11-01T14:30:04.358+05:00
    const [datePart, timePart] = dateStr.split("T");
    const [hh24, mm] = timePart.split(":");

    let hour = parseInt(hh24, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // convert to 12-hour

    return `${datePart} ${String(hour).padStart(2, "0")}:${mm} ${ampm}`;
  }

  // get dates for date mapping array
  function mapDatesByDay(data) {
    const result = {
      Cluster: {
        p1: "Period 1",
        p2: "Period 2",
      },
    };
    data.forEach((item) => {
      result[item.year] = {
        p1: formatLocalDateTime(item.p1date),
        p2: formatLocalDateTime(item.p2date),
      };
    });
    return result;
  }

  const datesMap = mapDatesByDay(voltageChartData);
  const formatDateTime = (iso) => {
    if (!iso) return "";

    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return usageReportTimePeriod === "day"
      ? `${day}/${month}`
      : `${day}/${month} - ${hours}:${minutes}`;
  };

  //=======================================PDF export start ================================
  const generatePdfTable = ({ title, data }) => {
    if (!data || data.length === 0) return [];

    // Dynamic header columns from the first row keys
    const headers = [
      { text: "Period", style: "tableHeader", alignment: "center" },
      {
        text: "Min Value",
        style: "tableHeader",
        alignment: "center",
      },
      {
        text: "Max Value",
        style: "tableHeader",
        alignment: "center",
      },
    ];

    // Table body

    const body = [
      // Title row

      [
        {
          text: title,
          colSpan: 3,

          alignment: "center",
          bold: true,
          fontSize: 9,
          fillColor: "#E5F3FD",
          // margin: [0, 5, 0, 5],
        },
        {},
        {},
      ],

      // Header row
      headers,
      // Data rows
      ...data.map((row) => [
        { text: row.period, alignment: "center", bold: true, fontSize: 9 },
        {
          alignment: "center",
          stack: [
            {
              text: String(row.minValue),
              fontSize: 9,
              bold: true,
            },
            {
              text: formatDateTime(row.minDate),
              fontSize: 7,
              color: "#555",
              margin: [0, 2, 0, 0],
            },
          ],
        },
        {
          alignment: "center",
          stack: [
            {
              text: String(row.maxValue),
              fontSize: 9,
              bold: true,
            },
            {
              text: formatDateTime(row.maxDate),
              fontSize: 7,
              color: "#555",
              margin: [0, 2, 0, 0],
            },
          ],
        },
      ]),
    ];

    return [
      {
        table: {
          widths: ["20%", "20%", "20%"],
          body: body,
          headerRows: 2, // Keep first two rows as title + header
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            // Alternate row colors
            if (rowIndex === 0) return "#E5F3FD"; // title row
            if (rowIndex === 1) return "#E5F3FD"; // header row
            return rowIndex % 2 === 0 ? "#F9FAFB" : null;
          },
          hLineWidth: function () {
            return 1;
          },
          vLineWidth: function () {
            return 1;
          },
          hLineColor: "#CCCCCC",
          vLineColor: "#CCCCCC",
          paddingLeft: function () {
            return 5;
          },
          paddingRight: function () {
            return 5;
          },
          paddingTop: function () {
            return 5;
          },
          paddingBottom: function () {
            return 5;
          },
        },
        margin: [0, 10, 0, 20],
      },
    ];
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
                text: "Harmonics Analytics Report",
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

          // ================= Dates Mapping table =================
          ThreecolsPdfTable({
            title: sectionHeaders.mappingSec,
            data: datesMap,
          }),

          // ================= Voltage Min / Max table =================
          sectionHeaders.voltageChart
            ? {
                pageBreak: "before",
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: sectionHeaders.voltageChart,
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              }
            : null,
          ...generatePdfTable({
            title: "Actual Min Max Value of the Interval",
            data: avgTabData,
          }),

          // ✅ Voltage Chart Image
          voltageChartImg
            ? {
                image: voltageChartImg,
                width: 600, // adjust as needed
                height: 220,
                margin: [0, 10, 0, 20],
                alignment: "center",
              }
            : {},

          // ================= Current Min / Max table =================
          sectionHeaders.currentChart
            ? {
                pageBreak: "before",
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: sectionHeaders.currentChart,
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              }
            : null,
          ...generatePdfTable({
            title: "Actual Min Max Value of the Interval",
            data: avgTabData,
          }),

          // ✅ Current Chart Image
          currentChartImg
            ? {
                image: currentChartImg,
                width: 600, // adjust as needed
                height: 220,
                margin: [0, 10, 0, 20],
                alignment: "center",
              }
            : {},
        ],

        styles: pdfStyles,
        defaultStyle: { font: "Roboto" },
        pageMargins: [40, 115, 40, 60],
      };

      pdfMake
        .createPdf(docDefinition)
        .download(
          `harmonics_analytics_report_${reportedDate}_${reportedTime}.pdf`
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
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className={`border py-1 w-full border-gray-400 px-3`}>
                  {selectedSource}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* mapping section */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.mappingSec} />
        <div className="w-[60%] mt-5 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              {Object.entries(datesMap).map(([label, value], idx) => {
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
      </div>
      {/* thd v avg chart */}
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.voltageChart} />
        <div className="w-[60%] mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
            {/* ---------- HEADER ---------- */}
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th
                  colSpan={3}
                  className="py-2 px-3 border border-gray-400 text-center w-full"
                >
                  Actual Min Max Value of the Interval
                </th>
              </tr>
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="py-2 px-3 border border-gray-400 text-center w-[20%]">
                  Period
                </th>

                <th className="border border-gray-600 w-[20%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-600 w-[20%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
              </tr>
            </thead>

            {/* ---------- BODY ---------- */}
            <tbody>
              {avgTabData.map((row, index) => (
                <tr
                  key={index}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Period */}
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {row.period}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">{row.minValue}</span>
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">
                        {formatDateTime(row.minDate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">{row.maxValue}</span>
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">
                        {formatDateTime(row.maxDate)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <AnalyticsChart
            data={voltageChartData}
            // title={`${selectedSource} Harmonics & Range Analysis`}
            onExportReady={setVoltageChartImg}
          />
        </div>
      </div>
      <div className="mt-5">
        <SectionHeader title={sectionHeaders.currentChart} />
        <div className="w-[60%] mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 mt-5 text-sm">
            {/* ---------- HEADER ---------- */}
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th
                  colSpan={3}
                  className="py-2 px-3 border border-gray-400 text-center w-full"
                >
                  Actual Min Max Value of the Interval
                </th>
              </tr>
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="py-2 px-3 border border-gray-400 text-center w-[20%]">
                  Period
                </th>

                <th className="border border-gray-600 w-[20%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Min Value
                  </div>
                </th>

                <th className="border border-gray-600 w-[20%]">
                  <div className="text-center flex items-center justify-center min-h-[50px] py-1">
                    Max Value
                  </div>
                </th>
              </tr>
            </thead>

            {/* ---------- BODY ---------- */}
            <tbody>
              {avgTabData.map((row, index) => (
                <tr
                  key={index}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Period */}
                  <td className="py-2 px-3 border border-gray-400 text-center font-semibold">
                    {row.period}
                  </td>

                  {/* Min Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">{row.minValue}</span>
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">
                        {formatDateTime(row.minDate)}
                      </span>
                    </div>
                  </td>

                  {/* Max Value */}
                  <td className="border border-gray-400 p-0">
                    <div className="flex flex-col items-center justify-center py-2 px-3">
                      <span className="font-semibold">{row.maxValue}</span>
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">
                        {formatDateTime(row.maxDate)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <AnalyticsChart
            data={currentChartData}
            // title={`${selectedSource} Harmonics & Range Analysis`}
            onExportReady={setCurrentChartImg}
          />
        </div>
      </div>
    </div>
  );
};

export default HarmonicAnalytics;
