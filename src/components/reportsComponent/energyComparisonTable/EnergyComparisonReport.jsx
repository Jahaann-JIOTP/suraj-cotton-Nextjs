import { useTheme } from "next-themes";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import EnergyComparisonChart from "./EnergyComparisonChart";

const EnergyComparisonReport = ({ rawData, intervalsObj }) => {
  const { theme } = useTheme();
  //   extract data
  const dailyConsumption = rawData?.dailyConsumption || [];
  const consumptionPerDept = rawData?.summarybydept || [];
  // Get all keys from first object (excluding 'date')
  const allKeys = Object.keys(dailyConsumption[0]).filter((k) => k !== "date");
  const columnLabels = {
    Unit_4_LT1: "Unit 4 LT-1",
    Unit_4_LT2: "Unit 4 LT-2",
    Unit_5_LT1: "Unit 5 LT-1",
    Unit_5_LT2: "Unit 5 LT-2",
    Unit_4_Total: "Total Unit 4",
    Unit_5_Total: "Total Unit 5",
    Grand_Total: "Grand Total",
  };

  // Only include columns that exist in the response
  const visibleColumns = Object.keys(columnLabels).filter((key) =>
    allKeys.includes(key)
  );
  // Calculate totals for each column
  const totalRow = visibleColumns.reduce((acc, key) => {
    const sum = dailyConsumption.reduce(
      (total, row) => total + (Number(row[key]) || 0),
      0
    );
    acc[key] = sum;
    return acc;
  }, {});

  /// Summary table colculation
  // Detect which unit totals exist (Unit_4_Total / Unit_5_Total)
  const availableUnits = [];
  if ("Unit_4_Total" in dailyConsumption[0]) availableUnits.push(4);
  if ("Unit_5_Total" in dailyConsumption[0]) availableUnits.push(5);

  // Calculate total consumption for each unit
  const unitTotals = {};
  availableUnits.forEach((unit) => {
    const key = `Unit_${unit}_Total`;
    const sum = dailyConsumption.reduce(
      (total, row) => total + (Number(row[key]) || 0),
      0
    );
    unitTotals[unit] = sum;
  });

  // Calculate grand total (sum of all unit totals)
  const grandTotal = Object.values(unitTotals).reduce(
    (acc, val) => acc + val,
    0
  );
  // consumption per department
  const renderRows = () => {
    return consumptionPerDept.map((dept, index) => {
      const hasU4 = Object.keys(dept).some((k) => k.startsWith("u4"));
      const hasU5 = Object.keys(dept).some((k) => k.startsWith("u5"));

      const rows = [];

      if (hasU4) {
        rows.push({
          unit: 4,
          Mcs: dept.u4Mcs,
          ConnectedDept: dept.u4ConectedLoadPerDept,
          ConnectedMcs: dept.u4ConectedLoadPerMcs,
          RunningLoad: dept.u4RunnigLoad,
          AvgConsumption: dept.u4AvgConsumption,
          Consumption: dept.u4Consumption,
        });
      }

      if (hasU5) {
        rows.push({
          unit: 5,
          Mcs: dept.u5Mcs,
          ConnectedDept: dept.u5ConectedLoadPerDept,
          ConnectedMcs: dept.u5ConectedLoadPerMcs,
          RunningLoad: dept.u5RunnigLoad,
          AvgConsumption: dept.u5AvgConsumption,
          Consumption: dept.u5Consumption,
        });
      }

      // render rows
      return (
        <React.Fragment key={index}>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="text-sm border-gray-500"
              style={{
                borderTop:
                  i === 0 ? "2px solid #000" : "1px solid rgba(0,0,0,0.3)",
                borderBottom:
                  i === rows.length - 1
                    ? "2px solid #000"
                    : "1px solid rgba(0,0,0,0.3)",
              }}
            >
              {i === 0 && (
                <>
                  <td
                    rowSpan={rows.length}
                    className="border border-gray-600 font-medium text-center px-2 py-1 align-middle"
                  >
                    {index + 1}
                  </td>
                  <td
                    rowSpan={rows.length}
                    className="border border-gray-600 font-medium px-2 py-1 align-middle"
                  >
                    {dept.name}
                  </td>
                </>
              )}
              <td className="border border-gray-400 px-2 py-1 text-center">
                {row.unit}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                {row.Mcs ?? "-"}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {row.ConnectedDept ?? "-"}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {row.ConnectedMcs ?? "-"}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {row.RunningLoad ?? "-"}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {row.AvgConsumption ?? "-"}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {row.Consumption?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "-"}
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    });
  };
  const totalConsumption = consumptionPerDept.reduce((sum, dept) => {
    const u4 = Number(dept.u4Consumption) || 0;
    const u5 = Number(dept.u5Consumption) || 0;
    return sum + u4 + u5;
  }, 0);

  const unit4Total = availableUnits
    .map((unit) => (unit === 4 ? unitTotals[unit] : 0))
    .reduce((a, b) => a + b, 0);
  const unit5Total = availableUnits
    .map((unit) => (unit === 5 ? unitTotals[unit] : 0))
    .reduce((a, b) => a + b, 0);
  const unit4Lt1total = totalRow.Unit_4_LT1 || 0;
  const unit4Lt2total = totalRow.Unit_4_LT2 || 0;
  const unit5Lt1total = totalRow.Unit_5_LT1 || 0;
  const unit5Lt2total = totalRow.Unit_5_LT2 || 0;
  const unit4TotalPropstotal = {
    unit4Total,
    unit4Lt1total,
    unit4Lt2total,
  };
  const unit5TotalPropstotal = {
    unit5Total,
    unit5Lt1total,
    unit5Lt2total,
  };

  /////////////////================================================
  ////////////////export to pdf///////////////////////////////
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
                text: "",
                width: "*",
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
                fontSize: 14,
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

        content: [
          // --- (1) REPORT PARAMETERS — 50% width ---
          {
            width: "50%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: "Report Parameters", style: "sectionHeader" }],
                  ],
                },
                layout: "noBorders",
              },
              {
                table: {
                  widths: ["25%", "25%"],
                  body: [
                    [
                      { text: "Selected Period", style: "tableHeader" },
                      {
                        text: intervalsObj?.usageReportTimePeriod || "-",
                        style: "tableCell",
                      },
                    ],
                    [
                      { text: "Start Date", style: "tableHeader" },
                      {
                        text: `${intervalsObj?.startDate || "-"} ${
                          intervalsObj?.endTime || ""
                        }`,
                        style: "tableCell",
                      },
                    ],
                    [
                      { text: "End Date", style: "tableHeader" },
                      {
                        text: `${intervalsObj?.endDate || "-"} ${
                          intervalsObj?.endTime || ""
                        }`,
                        style: "tableCell",
                      },
                    ],
                    [
                      { text: "Selected Timezone", style: "tableHeader" },
                      { text: "(UTC+05:00) Asia Karachi", style: "tableCell" },
                    ],
                  ],
                },
                margin: [0, 5, 0, 10],
              },
              {
                table: {
                  widths: ["25%"],
                  body: (() => {
                    const body = [[{ text: "Sources", style: "tableHeader" }]];

                    // ✅ Handle cases for Unit_4, Unit_5, or ALL
                    if (intervalsObj?.unit === "Unit_4") {
                      body.push([{ text: "Unit 4", style: "tableCell" }]);
                    } else if (intervalsObj?.unit === "Unit_5") {
                      body.push([{ text: "Unit 5", style: "tableCell" }]);
                    } else if (
                      intervalsObj?.unit === "ALL" ||
                      intervalsObj?.unit === "All" ||
                      intervalsObj?.unit === "all"
                    ) {
                      body.push([{ text: "Unit 4", style: "tableCell" }]);
                      body.push([{ text: "Unit 5", style: "tableCell" }]);
                    }

                    return body;
                  })(),
                },
                margin: [0, 5, 0, 10],
              },
            ],
            margin: [0, 0, 0, 20],
          },

          // --- (2) SUMMARY — 50% width ---
          {
            width: "50%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [[{ text: "Summary", style: "sectionHeader" }]],
                },
                layout: "noBorders",
              },
              {
                table: {
                  widths: ["25%", "25%"],
                  body: [
                    [
                      { text: "Unit.", style: "tableHeader" },
                      {
                        text: "Total Consumption (kWh)",
                        style: "tableHeader",
                        alignment: "right",
                      },
                    ],
                    ...(availableUnits.map((unit) => [
                      { text: unit.toString(), style: "tableCell" },
                      {
                        text:
                          unitTotals[unit]?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "-",
                        style: "tableCell",
                        alignment: "right",
                      },
                    ]) || []),
                    [
                      { text: "Total", style: "tableHeader" },
                      {
                        text: (grandTotal || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                    ],
                  ],
                },
                margin: [0, 5, 0, 20],
              },
            ],
          },

          // --- (3) CONSUMPTION DETAIL — full width ---
          {
            width: "100%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: "Consumption Detail", style: "sectionHeader" }],
                  ],
                },
                layout: "noBorders",
              },
              {
                table: {
                  headerRows: 1,
                  widths: [
                    "auto",
                    ...Array(visibleColumns?.length || 0).fill("*"),
                  ],
                  body: [
                    [
                      { text: "Day", style: "tableHeader" },
                      ...(visibleColumns?.map((key) => ({
                        text: columnLabels[key],
                        style: "tableHeader",
                      })) || []),
                    ],
                    ...((dailyConsumption || []).map((row) => [
                      { text: row.date, style: "tableCell" },
                      ...(visibleColumns?.map((key) => ({
                        text:
                          row[key]?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "-",
                        style: "tableCell",
                        alignment: "right",
                      })) || []),
                    ]) || []),
                    [
                      { text: "Total", style: "tableHeader" },
                      ...(visibleColumns?.map((key) => ({
                        text:
                          totalRow[key]?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "-",
                        style: "tableCell",
                        alignment: "right",
                      })) || []),
                    ],
                  ],
                },
                margin: [0, 5, 0, 20],
              },
            ],
          },

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
                        text: "Consumption Summary by Department",
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
                  widths: Array(9).fill("*"),
                  body: [
                    [
                      { text: "Sr.No", style: "tableHeader" },
                      { text: "Process Department", style: "tableHeader" },
                      { text: "Unit", style: "tableHeader" },
                      { text: "M/C", style: "tableHeader" },
                      {
                        text: "Connected Load Per Department",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Connected Load Per Machine",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Running Load Per Department",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Average Department Load",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Total Consumption (KWH)",
                        style: "tableHeader",
                        alignment: "right",
                      },
                    ],
                    ...((consumptionPerDept || []).flatMap((dept, index) => {
                      const rows = [];
                      const hasU4 = Object.keys(dept || {}).some((k) =>
                        k.startsWith("u4")
                      );
                      const hasU5 = Object.keys(dept || {}).some((k) =>
                        k.startsWith("u5")
                      );

                      if (hasU4) {
                        rows.push([
                          {
                            text: (index + 1).toString(),
                            rowSpan: hasU5 ? 2 : 1,
                            style: "tableCell",
                          },
                          {
                            text: dept.name,
                            rowSpan: hasU5 ? 2 : 1,
                            style: "tableCell",
                          },
                          { text: "4", style: "tableCell" },
                          { text: dept.u4Mcs || "-", style: "tableCell" },
                          {
                            text: dept.u4ConectedLoadPerDept || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u4ConectedLoadPerMcs || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u4RunnigLoad || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u4AvgConsumption || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text:
                              dept.u4Consumption?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                        ]);
                      }

                      if (hasU5) {
                        rows.push([
                          hasU4
                            ? {}
                            : {
                                text: (index + 1).toString(),
                                style: "tableCell",
                              },
                          hasU4 ? {} : { text: dept.name, style: "tableCell" },
                          { text: "5", style: "tableCell" },
                          { text: dept.u5Mcs || "-", style: "tableCell" },
                          {
                            text: dept.u5ConectedLoadPerDept || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u5ConectedLoadPerMcs || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u5RunnigLoad || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text: dept.u5AvgConsumption || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                          {
                            text:
                              dept.u5Consumption?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "-",
                            style: "tableCell",
                            alignment: "right",
                          },
                        ]);
                      }

                      return rows;
                    }) || []),
                    [
                      {
                        text: "Total Consumption",
                        style: "tableHeader",
                        alignment: "right",
                        colSpan: 8, // Merge first 8 columns into one
                      },
                      ...Array(7).fill({}), // filler cells for the colSpan
                      {
                        text: (totalConsumption || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                    ],
                  ],
                },
                margin: [0, 5, 0, 20],
              },
            ],
          },
        ],

        styles: {
          sectionHeader: {
            fontSize: 16,
            bold: true,
            background: "#1C4D82",
            fillColor: "#1C4D82",
            color: "#FFFFFF",
            padding: [8, 4],
            margin: [8, 4],
            alignment: "left",
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            background: "#E5F3FD",
            fillColor: "#E5F3FD",
            padding: [4, 2],
          },
          tableCell: {
            fontSize: 9,
            padding: [4, 2],
          },
        },

        defaultStyle: {
          font: "Roboto",
        },
        pageMargins: [40, 120, 40, 60],
      };

      pdfMake.createPdf(docDefinition).download("Energy_Comparison_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  /////////////////================================================
  return (
    <div>
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
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
      <div className="flex justify-start my-4">
        <button
          onClick={handleExportPdf}
          className="bg-[#1C4D82] hover:bg-[#1C4D82] cursor-pointer text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <span>Export to PDF</span>
        </button>
      </div>
      {/* intervals */}
      <div className="w-full mt-5">
        <div className="w-full bg-[#1C4D82] text-white py-2 px-4 font-semibold text-[20px]">
          Report Parameters
        </div>
        {/* parameters table */}
        <div className="w-full mt-5">
          <table className=" border w-full lg:w-[40%]   overflow-hidden">
            <tbody>
              <tr className="text-[14px] font-inter">
                <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-2 border border-gray-400 dark:border-gray-500">
                  Selected Period
                </td>
                <td className="py-1 px-4 border border-gray-400 dark:border-gray-500">
                  {intervalsObj.usageReportTimePeriod}
                </td>
              </tr>
              <tr className="text-[14px] font-inter">
                <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-4 border border-gray-400 dark:border-gray-500">
                  Start Date
                </td>
                <td className="py-1 px-4 border border-gray-400 dark:border-gray-500">
                  {intervalsObj.startDate} {intervalsObj.endTime}
                </td>
              </tr>
              <tr className="text-[14px] font-inter">
                <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-4 border border-gray-400 dark:border-gray-500">
                  End Date
                </td>
                <td className="py-1 px-4 border border-gray-400 dark:border-gray-500">
                  {intervalsObj.endDate} {intervalsObj.endTime}
                </td>
              </tr>
              <tr className="text-[14px] font-inter">
                <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-4 border border-gray-400 dark:border-gray-500">
                  Selected Timezone
                </td>
                <td className="py-1 px-4 border border-gray-400 dark:border-gray-500">
                  (UTC+05:00) Asia Karachi
                </td>
              </tr>
            </tbody>
          </table>
          <table className="mt-2 border w-[44%] lg:w-[17.5%] overflow-hidden">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600 text-[14px] font-inter">
              <tr>
                <th className="py-1 px-4 text-left font-semibold border border-gray-400 dark:border-gray-500">
                  Sources
                </th>
              </tr>
            </thead>
            <tbody>
              {availableUnits.map((unit) => {
                return (
                  <tr key={unit} className="text-[14px] font-inter">
                    <td className="py-1 px-3 border border-gray-400 dark:border-gray-500">
                      Unit {unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Summary */}
      <div className="w-full mt-5">
        <div className="w-full bg-[#1C4D82] text-white py-2 px-4 font-semibold text-[20px]">
          Summary
        </div>
        <div className="w-full mt-5">
          <table className="w-full lg:w-[40%] border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[14px] font-inter">
                <th className="py-1 px-3 border border-gray-400 dark:border-gray-500 text-left">
                  Unit No.
                </th>
                <th className="py-1 px-3 border border-gray-400 dark:border-gray-500 text-right">
                  Total Consumption
                </th>
              </tr>
            </thead>
            <tbody>
              {availableUnits.map((unit) => (
                <tr key={unit} className="text-[14px] font-inter">
                  <td className="py-1 px-3 border border-gray-400 dark:border-gray-500">
                    {unit}
                  </td>
                  <td className="py-1 px-3 border border-gray-400 dark:border-gray-500 text-right">
                    {unitTotals[unit]?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "-"}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="font-semibold  text-[14px] font-inter">
                <td className="py-1 px-3 border border-gray-400 dark:border-gray-500">
                  Total
                </td>
                <td className="text-[#1C4D82] dark:text-white/80 py-1 px-3 border border-gray-400 dark:border-gray-500 text-right">
                  {grandTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Comsumption Detail */}
      <div className="w-full mt-5">
        <div className="w-full bg-[#1C4D82] text-white py-2 px-4 font-semibold text-[20px]">
          Comsumption Detail
        </div>
        <div className="w-full mt-5">
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[14px] font-inter">
                <th className="py-1 px-2 border border-gray-400 dark:border-gray-500">
                  Day
                </th>
                {visibleColumns.map((key) => (
                  <th
                    key={key}
                    className="py-1 px-2 border border-gray-400 dark:border-gray-500"
                  >
                    {columnLabels[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyConsumption.map((row, idx) => (
                <tr key={idx} className="text-[14px] font-inter">
                  <td className="py-1 px-2 border border-gray-400 dark:border-gray-500">
                    {row.date}
                  </td>
                  {visibleColumns.map((key) => (
                    <td
                      key={key}
                      className="py-1 px-2 border border-gray-400 dark:border-gray-500 text-right"
                    >
                      {row[key]?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="font-semibold text-[14px] font-inter">
                <td className="py-1 px-2 border border-gray-400 dark:border-gray-500">
                  Total
                </td>
                {visibleColumns.map((key) => (
                  <td
                    key={key}
                    className="text-[#1C4D82] dark:text-white/80 py-1 px-2 border border-gray-400 dark:border-gray-500 text-right"
                  >
                    {totalRow[key]?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Comsumption Detail */}
      <div className="w-full mt-5">
        <div className="w-full bg-[#1C4D82] text-white py-2 px-4 font-semibold text-[20px]">
          Consumption Summary by Department
        </div>
        <div className="w-full mt-5">
          <table className=" border w-full overflow-hidden">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[14px] font-inter">
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Sr.No
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Process Department
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Unit
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  M/C
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Connected Load Per Depratment
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Connected Load Per Machine
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Running Load Per Department
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Avg Department Load
                </th>
                <th className="text-center border border-gray-700 px-3 py-1 ">
                  Total Consumption (KWH)
                </th>
              </tr>
            </thead>
            <tbody>
              {renderRows()}
              <tr className="font-semibold text-[14px]">
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className=" px-2 py-1"></td>
                <td className="text-right border border-gray-700 px-2 py-1">
                  Total Consumption
                </td>
                <td className="text-[#1C4D82] dark:text-white/80 text-right border border-gray-700 px-2 py-1">
                  {totalConsumption.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Chart component */}
      {/* <div>
        <EnergyComparisonChart
          data={consumptionPerDept}
          unit5Total={unit5TotalPropstotal}
          unit4Total={unit4TotalPropstotal}
          intervalsObj={intervalsObj}
        />
      </div> */}
    </div>
  );
};

export default EnergyComparisonReport;
