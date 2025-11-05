import { useTheme } from "next-themes";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import EnergyComparisonChart from "./EnergyComparisonChart";
import { to12HourFormat } from "@/utils/To12HourFormate";
const sectionHeaders = {
  rParams: "Report Parameters",
  summary: "Summary",
  utilization: "Utilization",
  dailyConsumption: "Consumption Detail (Daily)",
  consumptionPerDept:
    "Consumption Summary by Department For The Entire Time Period",
};
const summaryHeader = [
  "Unit No.",
  "Total Incoming From Generation (kWh)",
  "Total Incoming From Other Unit (kWh)",
  "Total Consumption (kWh)",
  "Total Transferred to Other Unit (kWh)",
  "Total Unaccountable Energy (kWh)",
];
const summarySecTabHNamearr = [
  "Unit No.",
  "Total Actual Connected Load (kWh/h)",
  "Total Connected Load (kWh/h)",
  "Utilization",
];
const consPerDeptHNme = {
  sNo: "Sr #",
  dept: "Department",
  unit: "Unit",
  mcs: "MCs",
  loadPerDept: "Connected Load Per Department (kWh/h)",
  loadPerMachine: "Connected Load Per Machine (kWh/h/Mc)",
  runningLoad: "Running Load (kWh/h/Mc)",
  avgDeptLoad: "Avg Department Load (kWh/h)",
  totalConsumption: "Total Units Consumed (kWh)",
};

const consPerDeptHNmearr = [
  "Sr #",
  "Department",
  "Unit",
  "MCs",
  "Connected Load Per Department (kWh/h)",
  "Connected Load Per Machine (kWh/h/Mc)",
  "Running Load (kWh/h/Mc)",
  "Avg Department Load (kWh/h)",
  "Total Units Consumed (kWh)",
];

const columnLabels = {
  Unit_4_LT1: "Unit 4 LT-1 (kWh)",
  Unit_4_LT2: "Unit 4 LT-2 (kWh)",
  Unit_5_LT1: "Unit 5 LT-1 (kWh)",
  Unit_5_LT2: "Unit 5 LT-2 (kWh)",
  Unit_4_Total: "Total Unit 4 (kWh)",
  Unit_5_Total: "Total Unit 5 (kWh)",
  Grand_Total: "Grand Total (kWh)",
};
export const SectionHeader = ({ title }) => {
  return (
    <div className="w-full bg-[#1C4D82] text-white py-2 px-4 font-semibold text-[20px]">
      {title}
    </div>
  );
};
const EnergyComparisonReport = ({ rawData, intervalsObj }) => {
  const { theme } = useTheme();
  // const [chartImages, setChartImages] = useState({ unit4: "", unit5: "" });
  //   extract data
  const dailyConsumption = rawData?.consumptionDetail || [];
  const consumptionPerDept = rawData?.summarybydept || [];
  const summaryConsumption = rawData?.dailyConsumption || [];
  const utilization = rawData?.utilization || [];
  // Get all keys from first object (excluding 'date')
  // ============get total of summary table
  const { totalIcg, totalConsumptionValue, UnaccountedEnergyTotal } =
    summaryConsumption.reduce(
      (
        acc,
        { Total_I_C_G = 0, Total_Consumption = 0, Unaccounted_Energy = 0 }
      ) => {
        acc.totalIcg += Total_I_C_G;
        acc.totalConsumptionValue += Total_Consumption;
        acc.UnaccountedEnergyTotal += Unaccounted_Energy;
        return acc;
      },
      { totalIcg: 0, totalConsumptionValue: 0, UnaccountedEnergyTotal: 0 }
    );

  const allKeys = Object.keys(dailyConsumption[0]).filter((k) => k !== "date");

  /// ==============convert 24 hour to 12 hour

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

  const totalConsumption = consumptionPerDept.reduce((sum, dept) => {
    const u4 = Number(dept.u4Consumption) || 0;
    const u5 = Number(dept.u5Consumption) || 0;
    return sum + u4 + u5;
  }, 0);

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
          {
            width: "50%",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: sectionHeaders.rParams, style: "sectionHeader" }],
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
                          to12HourFormat(intervalsObj.startTime) || ""
                        }`,
                        style: "tableCell",
                      },
                    ],
                    [
                      { text: "End Date", style: "tableHeader" },
                      {
                        text: `${intervalsObj?.endDate || "-"} ${
                          to12HourFormat(intervalsObj.endTime) || ""
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
          // summary
          {
            width: "*",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: sectionHeaders.summary, style: "sectionHeader" }],
                  ],
                },
                layout: "noBorders",
              },
              {
                table: {
                  widths: ["10%", "18%", "18%", "18%", "18%", "18%"],
                  body: [
                    [
                      ...summaryHeader.map((col, index) => ({
                        text: col,
                        style: "tableHeader",
                        alignment: index === 0 ? "left" : "center",
                      })),
                    ],
                    ...summaryConsumption.map((row) => [
                      { text: row.Unit.toString(), style: "tableCell" },
                      {
                        text: row.Total_I_C_G.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text: row.I_C_OU.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text: row.Total_Consumption.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text: row.Total_Tranferred_to_OU.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        ),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text: row.Unaccounted_Energy.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                    ]),
                    [
                      {
                        text: "Total",
                        bold: true,
                        padding: [4, 2],
                        fontSize: 10,
                        alignment: "left",
                      },
                      {
                        text: totalIcg.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCellRightBold",
                      },
                      {},
                      {
                        text: totalConsumptionValue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCellRightBold",
                      },
                      {},
                      {
                        text: UnaccountedEnergyTotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCellRightBold",
                      },
                    ],
                  ],
                },
                margin: [0, 5, 0, 20],
              },
            ],
          },
          // utilization
          {
            width: "*",
            stack: [
              {
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        text: sectionHeaders.utilization,
                        style: "sectionHeader",
                      },
                    ],
                  ],
                },
                layout: "noBorders",
              },
              {
                table: {
                  widths: ["10%", "30%", "30%", "30%"],
                  body: [
                    [
                      ...summarySecTabHNamearr.map((col, index) => ({
                        text: col,
                        style: "tableHeader",
                        alignment: index === 0 ? "left" : "center",
                      })),
                    ],
                    ...utilization.map((row) => [
                      { text: row.Unit.toString(), style: "tableCell" },

                      {
                        text: row.TotalConnectedLoadPerDept.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        ),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text: row.TotalAvgConsumption.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCell",
                        alignment: "right",
                      },
                      {
                        text:
                          row.UtilizationPercent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + " %",
                        style: "tableCell",
                        alignment: "right",
                      },
                    ]),
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
                    [
                      {
                        text: sectionHeaders.dailyConsumption,
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
                    "auto",
                    ...Array(visibleColumns?.length || 0).fill("*"),
                  ],
                  body: [
                    [
                      { text: "Day", style: "tableHeader" },
                      ...(visibleColumns?.map((key) => ({
                        text: columnLabels[key],
                        style: "tableHeader",
                        alignment: "center",
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
                      {
                        text: "Total",
                        bold: true,
                        fontSize: 10,
                        padding: [4, 2],
                      },
                      ...(visibleColumns?.map((key) => ({
                        text:
                          totalRow[key]?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "-",
                        bold: true,
                        padding: [4, 2],
                        fontSize: 10,
                        alignment: "right",
                      })) || []),
                    ],
                  ],
                },
                margin: [0, 5, 0, 20],
                dontBreakRows: true,
              },
            ],
          },

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
                  headerRows: 1,
                  widths: [
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                  ],
                  body: [
                    // --- Header row ---
                    [
                      {
                        text: consPerDeptHNme.sNo,
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },

                      {
                        text: consPerDeptHNme.dept,
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: consPerDeptHNme.unit,
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: consPerDeptHNme.mcs,
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                        noWrap: false,
                      },
                      {
                        text: "Connected Load Per Department (kWh/h)",
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: "Connected Load Per Machine (kWh/h/Mc)",
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: "Running Load (kWh/h/Mc)",
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: "Avg Department Load (kWh/h)",
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                      {
                        text: "Total Units Consumed (kWh)",
                        noWrap: false,
                        bold: true,
                        fontSize: 9,
                        background: "#E5F3FD",
                        fillColor: "#E5F3FD",
                        alignment: "center",
                      },
                    ],

                    // --- Dynamic rows for departments ---
                    ...((consumptionPerDept || []).flatMap((dept, index) => {
                      const rows = [];
                      const hasU4 = "u4Consumption" in dept;
                      const hasU5 = "u5Consumption" in dept;

                      const rowSpan = hasU4 && hasU5 ? 3 : 2; // Unit4 + Unit5 + Total OR Unit + Total

                      // --- UNIT 4 ---
                      if (hasU4) {
                        rows.push([
                          {
                            text: (index + 1).toString(),
                            rowSpan: rowSpan,
                            style: "tableCell",
                            alignment: "center",
                            verticalAlignment: "middle",
                          },
                          {
                            text: dept.name || "-",
                            style: "tableCell",
                            alignment: "left",
                          },
                          {
                            text: "4",
                            style: "tableCell",
                            alignment: "center",
                          },
                          {
                            text: dept.u4Mcs || "-",
                            style: "tableCell",
                            alignment: "center",
                          },
                          {
                            text: dept.u4ConectedLoadPerDept || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u4ConectedLoadPerMcs || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u4RunnigLoad || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u4AvgConsumption || "-",
                            style: "tableCellRight",
                          },
                          {
                            text:
                              dept.u4Consumption?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "-",
                            style: "tableCellRight",
                          },
                        ]);
                      }

                      // --- UNIT 5 ---
                      if (hasU5) {
                        rows.push([
                          hasU4
                            ? {} // Empty object when Unit 4 exists (rowSpan covers this)
                            : {
                                text: (index + 1).toString(),
                                rowSpan: rowSpan,
                                style: "tableCell",
                                alignment: "center",
                                verticalAlignment: "middle",
                              },
                          {
                            text: dept.u5Name || "-",
                            style: "tableCell",
                            alignment: "left",
                          },
                          {
                            text: "5",
                            style: "tableCell",
                            alignment: "center",
                          },
                          {
                            text: dept.u5Mcs || "-",
                            style: "tableCell",
                            alignment: "center",
                          },
                          {
                            text: dept.u5ConectedLoadPerDept || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u5ConectedLoadPerMcs || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u5RunningLoad || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u5AvgConsumption || "-",
                            style: "tableCellRight",
                          },
                          {
                            text:
                              dept.u5Consumption?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "-",
                            style: "tableCellRight",
                          },
                        ]);
                      }

                      // --- TOTAL ---
                      rows.push([
                        hasU4 || hasU5
                          ? {} // Empty object when units exist (rowSpan covers this)
                          : {
                              text: (index + 1).toString(),
                              style: "tableCell",
                              alignment: "center",
                              verticalAlignment: "middle",
                            },

                        { text: "", border: [false, false, false, true] },
                        { text: "", border: [false, false, false, true] },
                        { text: "", border: [false, false, false, true] },
                        { text: "", border: [false, false, false, true] },
                        { text: "", border: [false, false, false, true] },
                        { text: "", border: [false, false, false, true] },
                        {
                          text: "Total",
                          alignment: "center",
                          bold: true,
                          fontSize: 10,
                          padding: [4, 2],
                        },
                        {
                          text:
                            dept.totalConsumption?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "-",
                          style: "tableCellRightBold",
                        },
                      ]);

                      // --- Small gap row ---
                      rows.push([
                        {
                          text: "",
                          colSpan: 9,
                          border: [false, false, false, false],
                        },
                        ...Array(8).fill({
                          text: "",
                          border: [false, false, false, false],
                        }),
                      ]);

                      return rows;
                    }) || []),

                    // --- GRAND TOTAL ---
                    [
                      {
                        text: "",
                        colSpan: 6,
                        border: [false, false, false, false],
                      },
                      {},
                      {},
                      {},
                      {},
                      {}, // fills the remaining of colSpan=6

                      {
                        text: "Total Consumption",
                        colSpan: 2,
                        bold: true,
                        fontSize: 10,
                        padding: [4, 2],
                        alignment: "center",
                      },
                      {}, // filler for colSpan=2
                      {
                        text: (totalConsumption || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        style: "tableCellRightBold",
                      },
                    ],
                  ],
                },
                layout: {
                  // ✅ Light inner borders, darker outer borders
                  hLineWidth: (i, node) =>
                    i === 0 || i === node.table.body.length ? 1.2 : 0.5,
                  vLineWidth: (i, node) =>
                    i === 0 || i === node.table.widths.length ? 1.2 : 0.5,
                  hLineColor: () => "#666",
                  vLineColor: () => "#666",
                },
                // ✅ CRITICAL: Prevent rows from breaking across pages

                // ✅ Optional: Add some padding to ensure proper spacing
                margin: [0, 5, 0, 30],
              },
            ],
          },
          //==========================================================================

          // ============todo this will be added after the chart finalization
          // (2) --- Add charts at the end ---
          // ...(chartImages.unit4
          //   ? [
          //       {
          //         stack: [
          //           {
          //             image: chartImages.unit4,
          //             width: 500, // full width for landscape A4
          //             alignment: "center",
          //             margin: [0, 10, 0, 0],
          //           },
          //         ],
          //       },
          //     ]
          //   : []),

          // // Unit 5 chart (heading + chart on same page)
          // ...(chartImages.unit5
          //   ? [
          //       {
          //         stack: [
          //           {
          //             image: chartImages.unit5,
          //             width: 500,
          //             alignment: "center",
          //             margin: [0, 10, 0, 0],
          //           },
          //         ],
          //       },
          //     ]
          //   : []),
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
          tableCell: { fontSize: 9, padding: [4, 2] },
          tableCellRight: { fontSize: 9, padding: [4, 2], alignment: "right" },
          tableCellRightBold: {
            fontSize: 9,
            bold: true,
            padding: [4, 2],
            alignment: "right",
            color: "#000000",
          },
        },

        defaultStyle: {
          font: "Roboto",
        },
        pageMargins: [40, 115, 40, 60],
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
        <SectionHeader title={sectionHeaders.rParams} />
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
                  {intervalsObj.startDate}{" "}
                  {to12HourFormat(intervalsObj.startTime)}
                </td>
              </tr>
              <tr className="text-[14px] font-inter">
                <td className="bg-[#E5F3FD] dark:bg-gray-600 font-semibold py-1 px-4 border border-gray-400 dark:border-gray-500">
                  End Date
                </td>
                <td className="py-1 px-4 border border-gray-400 dark:border-gray-500">
                  {intervalsObj.endDate} {to12HourFormat(intervalsObj.endTime)}
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
        {/* Header */}
        <SectionHeader title={sectionHeaders.summary} />
        {/* Responsive Table Container */}
        <div className="w-full mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {summaryHeader.map((item) => (
                  <th className="py-2 px-3 border border-gray-400 text-center">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {summaryConsumption.map((row) => (
                <tr
                  key={row.Unit}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-3 border border-gray-400 text-center">
                    {row.Unit}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.Total_I_C_G.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.I_C_OU.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.Total_Consumption.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.Total_Tranferred_to_OU.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.Unaccounted_Energy?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-2 px-3 border border-gray-400 text-center">
                  Total
                </td>
                <td className="py-2 px-3 border border-gray-400 text-right">
                  {totalIcg?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-3 border border-gray-400 text-right"></td>
                <td className="py-2 px-3 border border-gray-400 text-right">
                  {totalConsumptionValue?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-3 border border-gray-400 text-right"></td>
                <td className="py-2 px-3 border border-gray-400 text-right">
                  {UnaccountedEnergyTotal?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Utilization */}
      <div className="w-full mt-5">
        {/* Header */}
        <SectionHeader title={sectionHeaders.utilization} />

        {/* Responsive Table Container */}
        {/* new table */}
        <div className="w-full mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {summarySecTabHNamearr.map((col) => (
                  <th className="py-2 px-3 border border-gray-400 text-center whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {utilization.map((row) => (
                <tr
                  key={row.Unit}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-3 border border-gray-400 text-center">
                    {row.Unit}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.TotalConnectedLoadPerDept.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.TotalAvgConsumption.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 border border-gray-400 text-right">
                    {row.UtilizationPercent.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comsumption Detail */}
      <div className="w-full mt-5">
        {/* Header */}
        <SectionHeader title={sectionHeaders.dailyConsumption} />

        {/* Responsive Table Container */}
        <div className="w-full mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                <th className="py-2 px-3 border border-gray-400 dark:border-gray-500 whitespace-nowrap text-left">
                  Day
                </th>
                {visibleColumns.map((key) => (
                  <th
                    key={key}
                    className="py-2 px-3 border border-gray-400 dark:border-gray-500 whitespace-nowrap text-right"
                  >
                    {columnLabels[key]}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dailyConsumption.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-2 px-3 border border-gray-400 dark:border-gray-500 whitespace-nowrap">
                    {row.date}
                  </td>
                  {visibleColumns.map((key) => (
                    <td
                      key={key}
                      className="py-2 px-3 border border-gray-400 dark:border-gray-500 text-right whitespace-nowrap"
                    >
                      {row[key]?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Total Row */}
              <tr className="font-semibold text-[13px] md:text-[14px] font-inter bg-gray-100 dark:bg-gray-700">
                <td className="py-2 px-3 border border-gray-400 dark:border-gray-500 whitespace-nowrap">
                  Total
                </td>
                {visibleColumns.map((key) => (
                  <td
                    key={key}
                    className="dark:text-white/80 py-2 px-3 border border-gray-400 dark:border-gray-500 text-right whitespace-nowrap"
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

      {/* Comsumption Detail by depratment */}
      <div className="w-full mt-5">
        {/* Header */}

        <SectionHeader title={sectionHeaders.consumptionPerDept} />

        {/* Responsive Table Wrapper */}
        <div className="w-full mt-5">
          <table className="min-w-full overflow-x-auto">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {consPerDeptHNmearr.map((col) => (
                  <th className="text-center border border-gray-700 px-3 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {consumptionPerDept.map((dept, index) => {
                const hasU4 = "u4Consumption" in dept;
                const hasU5 = "u5Consumption" in dept;

                return (
                  <React.Fragment key={index}>
                    {/* --- UNIT 4 or 5 (First Row) --- */}
                    <tr className="text-[13px] md:text-[14px] border-t-2 border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td
                        rowSpan={1 + (hasU4 ? 1 : 0) + (hasU5 ? 1 : 0)}
                        className="border border-gray-300 font-medium text-center px-2 py-1 align-middle bg-gray-50 dark:bg-gray-800"
                      >
                        {index + 1}
                      </td>

                      {/* If Unit 4 exists */}
                      {hasU4 ? (
                        <>
                          <td className="border border-gray-300 font-medium px-2 py-1 align-middle whitespace-nowrap">
                            {dept.name || "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            4
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {dept.u4Mcs ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u4ConectedLoadPerDept ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u4ConectedLoadPerMcs ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u4RunnigLoad ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u4AvgConsumption ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u4Consumption?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-"}
                          </td>
                        </>
                      ) : hasU5 ? (
                        <>
                          <td className="border border-gray-300 font-medium px-2 py-1 align-middle whitespace-nowrap">
                            {dept.u5Name || "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            5
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {dept.u5Mcs ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u5ConectedLoadPerDept ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u5ConectedLoadPerMcs ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u5RunningLoad ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u5AvgConsumption ?? "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {dept.u5Consumption?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? "-"}
                          </td>
                        </>
                      ) : null}
                    </tr>

                    {/* --- UNIT 5 Row (If both Units Exist) --- */}
                    {hasU4 && hasU5 && (
                      <tr className="text-[13px] md:text-[14px] border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="border border-gray-300 font-medium px-2 py-1 align-middle whitespace-nowrap">
                          {dept.u5Name || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          5
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {dept.u5Mcs ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {dept.u5ConectedLoadPerDept ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {dept.u5ConectedLoadPerMcs ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {dept.u5RunningLoad ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {dept.u5AvgConsumption ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {dept.u5Consumption?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) ?? "-"}
                        </td>
                      </tr>
                    )}

                    {/* --- TOTAL Row --- */}
                    <tr className="text-[13px] md:text-[14px] border-b-2 border-x-2 border-gray-500 dark:border-gray-300 font-semibold bg-gray-100 dark:bg-gray-700">
                      <td
                        colSpan={7}
                        className="text-right border border-gray-400 px-2 py-1 align-middle whitespace-nowrap"
                      >
                        Total
                      </td>
                      <td className="text-right border border-gray-400 px-2 py-1 align-middle dark:text-white/80 whitespace-nowrap">
                        {dept.totalConsumption?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </td>
                    </tr>

                    {/* --- Spacing between Departments --- */}
                    <tr>
                      <td colSpan={9} className="h-2"></td>
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* --- GRAND TOTAL --- */}
              <tr className="font-semibold text-[13px] md:text-[14px] dark:bg-gray-600">
                <td colSpan={6}></td>
                <td
                  colSpan={2}
                  className="text-center border-2 border-gray-700 dark:border-gray-300 px-2 py-2 whitespace-nowrap"
                >
                  Grand Total Consumption
                </td>
                <td className="dark:text-white/80 text-right border-2 border-gray-700 dark:border-gray-300 px-2 py-2 whitespace-nowrap">
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
      {/* <div className="mb-3">
        <EnergyComparisonChart
          data={consumptionPerDept}
          unit5Total={unit5TotalPropstotal}
          unit4Total={unit4TotalPropstotal}
          intervalsObj={intervalsObj}
          onChartReady={(images) => setChartImages(images)}
        />
      </div> */}
    </div>
  );
};

export default EnergyComparisonReport;
