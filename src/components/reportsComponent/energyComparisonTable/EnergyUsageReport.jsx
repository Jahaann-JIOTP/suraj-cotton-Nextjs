import { useTheme } from "next-themes";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { loadImageAsBase64 } from "@/utils/imageToBase64";

// import EnergyComparisonChart from "./EnergyComparisonChart";
import { MdOutlineInfo } from "react-icons/md";
import KayValueTable from "@/components/tables/KayValueTable";
import { SectionHeader } from "@/components/tables/SectionHeader";
import StandardTable from "../../tables/StandardTable";
import {
  consPerDeptHNmearr,
  dailyProductionHeaders,
  lowVoltageSummaryheadings,
  productionSummaryHeadings,
  utilizationHeadings,
} from "@/data/reportTableHeaders";
import {
  buildStandardPdfTable,
  pdfStyles,
} from "@/components/tables/pdfStandardTable";
import { buildKeyValuePdfTable } from "@/components/tables/pdfKayValue";

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

const columnLabels = {
  Unit_4_LT1: "Unit 4 LT-1 (kWh)",
  Unit_4_LT2: "Unit 4 LT-2 (kWh)",
  Unit_5_LT1: "Unit 5 LT-1 (kWh)",
  Unit_5_LT2: "Unit 5 LT-2 (kWh)",
  Unit_4_Total: "Total Unit 4 (kWh)",
  Unit_5_Total: "Total Unit 5 (kWh)",
  Grand_Total: "Grand Total (kWh)",
};
const sourcesData = {
  Sources: "Sources",
  "Unit 4": "Unit 4",
  "Unit 5": "Unit 5",
};
const EnergyUsageReport = ({ rawData, intervalsObj, newIntervalObj }) => {
  const { theme } = useTheme();

  // const [chartImages, setChartImages] = useState({ unit4: "", unit5: "" });
  //   extract data
  const dailyConsumption = Array.isArray(rawData?.consumptionDetail)
    ? rawData.consumptionDetail
    : [];
  const consumptionPerDept = Array.isArray(rawData?.summarybydept)
    ? rawData.summarybydept
    : [];
  const summaryConsumption = Array.isArray(rawData?.dailyConsumption)
    ? rawData.dailyConsumption
    : [];
  const utilization = Array.isArray(rawData?.utilization)
    ? rawData.utilization
    : [];
  const productionSummary = Array.isArray(rawData?.productionSummary)
    ? rawData.productionSummary
    : [];
  const productionSummaryDaily = Array.isArray(rawData?.productionSummaryDaily)
    ? rawData.productionSummaryDaily
    : [];
  //=====================extract hfo aux values
  const hfoAuxObj = consumptionPerDept.find(
    (item) =>
      item.name === "HFO + JMS Auxiliary" ||
      item.u5Name === "HFO + JMS Auxiliary"
  );

  const hfoAux = hfoAuxObj ? hfoAuxObj.totalConsumption : 0;

  //=====================extract hfo aux values
  const HTside = rawData?.HTside || {};
  const lossesSummary = rawData?.lossesSummary || {};
  const removeKeys = ["Δ Generation / Consumption"];
  const lossesSummaryWithoutGC = {};
  const lossesSummaryWidthGC = {};
  Object.entries(lossesSummary).forEach(([key, value]) => {
    if (removeKeys.includes(key)) {
      lossesSummaryWidthGC[key] = value;
    } else {
      lossesSummaryWithoutGC[key] = value;
    }
  });
  const isEmpty =
    dailyConsumption.length === 0 &&
    consumptionPerDept.length === 0 &&
    summaryConsumption.length === 0 &&
    utilization.length === 0;
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <p className="text-lg font-semibold mb-2">No Data Available</p>
        <p>Please select a valid time period or refresh your data.</p>
      </div>
    );
  }
  // Get all keys from first object (excluding 'date')
  // ============get total of summary table
  const { totalIcg, totalConsumptionValue, UnaccountedEnergyTotal } =
    summaryConsumption.reduce(
      (
        acc,
        { Total_I_C_G = 0, Total_Consumption = 0, Unaccounted_Energy = 0 }
      ) => {
        acc.totalIcg += Number(Total_I_C_G) || 0;
        acc.totalConsumptionValue += Number(Total_Consumption) || 0;
        acc.UnaccountedEnergyTotal += Number(Unaccounted_Energy) || 0;
        return acc;
      },
      { totalIcg: 0, totalConsumptionValue: 0, UnaccountedEnergyTotal: 0 }
    );

  // ✅ Avoid "Cannot read property of undefined"
  const firstRow = dailyConsumption.length > 0 ? dailyConsumption[0] : {};
  const allKeys = Object.keys(firstRow).filter((k) => k !== "date");

  const visibleColumns = Object.keys(columnLabels).filter((key) =>
    allKeys.includes(key)
  );
  const totalRow =
    dailyConsumption.length > 0
      ? visibleColumns.reduce((acc, key) => {
          const sum = dailyConsumption.reduce(
            (total, row) => total + (Number(row[key]) || 0),
            0
          );
          acc[key] = sum;
          return acc;
        }, {})
      : {};
  // ✅ Handle available units dynamically
  const availableUnits = [];
  if ("Unit_4_Total" in firstRow) availableUnits.push(4);
  if ("Unit_5_Total" in firstRow) availableUnits.push(5);
  //-----------------------consumption table haeder-----------------
  const dailyConsumptionHeaders = [
    { key: "date", label: "Day" },
    ...visibleColumns.map((key) => ({ key, label: columnLabels[key] })),
  ];
  //-----------------------production daily header-----------------

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
  const totalafterAux = totalConsumption - hfoAux;

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

          buildKeyValuePdfTable({
            title: sectionHeaders.rParams,
            data: newIntervalObj,
          }),
          // sources
          buildKeyValuePdfTable({
            title: "",
            data: sourcesData,
            isSingleCol: true,
          }),
          // --- HT side ---
          buildKeyValuePdfTable({
            title: sectionHeaders.HTside,
            data: HTside,
            pageBreakAfter: true,
            unit: "(kWh)",
            boldKeys: ["Total"],
          }),
          // --- Losses Summary ---

          buildKeyValuePdfTable({
            title: sectionHeaders.lossesSummary,
            data: lossesSummaryWithoutGC,
            unit: "(kWh)",
            boldKeys: ["Total_Consumption"],
          }),
          buildKeyValuePdfTable({
            title: "",
            data: lossesSummaryWidthGC,
            unit: "",
            hiligthValueCell: true,
          }),
          // Low Voltage Side summary

          buildStandardPdfTable({
            title: sectionHeaders.summary,
            headers: lowVoltageSummaryheadings,
            data: summaryConsumption,
            cellWidth: "18%",
            formatNumberKeys: [
              "Total_I_C_G",
              "I_C_OU",
              "Total_Consumption",
              "Total_Tranferred_to_OU",
              "Unaccounted_Energy",
            ],
            totalRow: {
              Unit: "Total",
              Total_I_C_G: totalIcg,
              Total_Consumption: totalConsumptionValue,
              Unaccounted_Energy: UnaccountedEnergyTotal,
            },
          }),
          // utilization

          buildStandardPdfTable({
            title: sectionHeaders.utilization,
            headers: utilizationHeadings,
            data: utilization,
            cellWidth: "30%",
            formatNumberKeys: [
              "TotalConnectedLoadPerDept",
              "TotalAvgConsumption",
              "UtilizationPercent",
            ],
            percentKeys: ["UtilizationPercent"],
            // pageBreakAfter: true,
          }),
          // Production Summary

          buildStandardPdfTable({
            title: sectionHeaders.production,
            headers: productionSummaryHeadings,
            data: productionSummary,
            formatNumberKeys: [
              "TotalAvgCount",
              "TotalConsumption",
              "consumptionperbag",
            ],
            cellWidth: "22.5%",
          }),
          // ---CONSUMPTION DETAIL Daily ---

          buildStandardPdfTable({
            title: sectionHeaders.dailyConsumption,
            headers: dailyConsumptionHeaders,
            data: dailyConsumption,
            totalRow: { date: "Total", ...totalRow },
            firstColAlign: "center",
            cellWidth: "12.85%",
            formatNumberKeys: [
              "Unit_4_LT1",
              "Unit_4_LT2",
              "Unit_4_Total",
              "Unit_5_LT1",
              "Unit_5_LT2",
              "Unit_5_Total",
              "Grand_Total",
            ],
          }),
          // ---  Production DETAIL Daily ---

          buildStandardPdfTable({
            title: sectionHeaders.prodDetail,
            headers: dailyProductionHeaders,
            data: productionSummaryDaily,
            highlightKeys: [
              "Unit_4_consumptionperbag",
              "Unit_5_consumptionperbag",
            ],
            formatNumberKeys: [
              "Unit_4_AvgCount",
              "Unit_5_AvgCount",
              "Unit_4_consumptionperbag",
              "Unit_5_consumptionperbag",
            ],
            cellWidth: "15%",
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
                    "auto",
                  ],
                  body: [
                    // --- Header row ---
                    [
                      ...(consPerDeptHNmearr?.map((key) => ({
                        text: key,
                        style: "tableHeader",
                        alignment: "center",
                      })) || []),
                    ],

                    // --- Dynamic rows for departments ---
                    ...((consumptionPerDept || []).flatMap((dept, index) => {
                      const rows = [];
                      const hasU4 = "u4Consumption" in dept;
                      const hasU5 = "u5Consumption" in dept;

                      // const rowSpan = hasU4 && hasU5 ? 3 : 2; // Unit4 + Unit5 + Total OR Unit + Total

                      // --- UNIT 4 ---
                      // {
                      //   text: (index + 1).toString(),
                      //   // rowSpan: rowSpan,
                      //   style: "tableCell",
                      //   alignment: "center",
                      //   verticalAlignment: "middle",
                      //   horizontalAlignment: "middle",
                      // },
                      if (hasU4) {
                        rows.push([
                          {
                            text: "",
                            // rowSpan: 2,
                            // style: "tableCell",
                            alignment: "center",
                            border: [true, true, false, false],
                            verticalAlignment: "middle",
                            horizontalAlignment: "middle",
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
                            text: dept.u4AvgConsumption || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u4UtilizationPercent + " %" || "-",
                            style: "tableCellRight",
                            background: "#E5F3FD",
                            fillColor: "#E5F3FD",
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
                          // hasU4
                          //   ? {} // Empty object when Unit 4 exists (rowSpan covers this)
                          //   :
                          {
                            text: (index + 1).toString(),
                            rowSpan: 2,
                            style: "tableCell",
                            alignment: "center",
                            border: [true, false, true, true],
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
                            text: dept.u5AvgConsumption || "-",
                            style: "tableCellRight",
                          },
                          {
                            text: dept.u5UtilizationPercent + " %" || "-",
                            style: "tableCellRight",
                            background: "#E5F3FD",
                            fillColor: "#E5F3FD",
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
                        // hasU4 || hasU5
                        //   ? {} // Empty object when units exist (rowSpan covers this)
                        //   :
                        {
                          text: "",
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
                          colSpan: 10,
                          border: [false, false, false, false],
                        },
                        ...Array(9).fill({
                          text: "",
                          border: [false, false, false, false],
                        }),
                      ]);

                      return rows;
                    }) || []),

                    // --- GRAND TOTAL ---
                    [
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
                        colSpan: 7,
                        border: [false, false, false, false],
                      },
                      {},
                      {},
                      {},
                      {},
                      {},
                      {},

                      {
                        text: "Grand Total Consumption",
                        colSpan: 2,
                        bold: true,
                        fontSize: 10,
                        alignment: "center",
                        fillColor: "#E5F3FD",
                        border: [true, true, true, true],
                      },
                      {},
                      {
                        text: totalafterAux
                          ? totalafterAux.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00",
                        alignment: "right",
                        bold: true,
                        fontSize: 10,
                        border: [true, true, true, true],
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

        styles: pdfStyles,

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
      {/* ==============report parameters=============== */}
      <KayValueTable title={sectionHeaders.rParams} data={newIntervalObj} />
      {/* --------------------Sources------------------ */}
      <KayValueTable title="" data={sourcesData} isSingleCol={true} />
      {/* ==============HT Side Summary=============== */}
      <KayValueTable
        title={sectionHeaders.HTside}
        data={HTside}
        unit="(kWh)"
        boldKeys={["Total"]}
      />
      {/* ==============Losses Summary=============== */}
      <KayValueTable
        title={sectionHeaders.lossesSummary}
        data={lossesSummaryWithoutGC}
        unit="(kWh)"
        boldKeys={["Total_Consumption"]}
      />
      <KayValueTable
        title=""
        data={lossesSummaryWidthGC}
        hiligthValueCell={true}
      />

      {/* ==============Low Voltage side Summary=============== */}
      <StandardTable
        title={sectionHeaders.summary}
        headers={lowVoltageSummaryheadings}
        data={summaryConsumption}
        formatNumberKeys={[
          "Total_I_C_G",
          "I_C_OU",
          "Total_Consumption",
          "Total_Tranferred_to_OU",
          "Unaccounted_Energy",
        ]}
        cellWidth="18%"
        totalRow={{
          Unit: "Total",
          Total_I_C_G: totalIcg,
          Total_Consumption: totalConsumptionValue,
          Unaccounted_Energy: UnaccountedEnergyTotal,
        }}
      />
      {/* ==============Utlization=============== */}
      <StandardTable
        title={sectionHeaders.utilization}
        formatNumberKeys={[
          "TotalConnectedLoadPerDept",
          "TotalAvgConsumption",
          "UtilizationPercent",
        ]}
        cellWidth="30%"
        headers={utilizationHeadings}
        data={utilization}
        percentKeys={["UtilizationPercent"]}
      />
      {/* ==============Production Summary=============== */}
      <StandardTable
        title={sectionHeaders.production}
        formatNumberKeys={[
          "TotalAvgCount",
          "TotalConsumption",
          "consumptionperbag",
        ]}
        cellWidth="22.5%"
        headers={productionSummaryHeadings}
        data={productionSummary}
      />
      {/* ==============Daily Consumption Summary=============== */}
      <StandardTable
        title={sectionHeaders.dailyConsumption}
        formatNumberKeys={[
          "Unit_4_LT1",
          "Unit_4_LT2",
          "Unit_4_Total",
          "Unit_5_LT1",
          "Unit_5_LT2",
          "Unit_5_Total",
          "Grand_Total",
        ]}
        cellWidth="12.85%"
        headers={dailyConsumptionHeaders}
        data={dailyConsumption}
        totalRow={{ date: "Total", ...totalRow }}
        firstColAlign="left"
      />
      {/* ==============Daily production Summary=============== */}
      <StandardTable
        title={sectionHeaders.prodDetail}
        formatNumberKeys={[
          "Unit_4_AvgCount",
          "Unit_5_AvgCount",
          "Unit_4_consumptionperbag",
          "Unit_5_consumptionperbag",
        ]}
        cellWidth="15%"
        headers={dailyProductionHeaders}
        data={productionSummaryDaily}
        highlightKeys={["Unit_4_consumptionperbag", "Unit_5_consumptionperbag"]}
      />

      {/* Comsumption Detail by depratment */}
      <div className="w-full mt-5">
        <SectionHeader title={sectionHeaders.consumptionPerDept} />

        <div className="w-full mt-5 overflow-x-auto">
          <table className="min-w-full w-full  text-sm md:text-base">
            <thead className="bg-[#E5F3FD] dark:bg-gray-600">
              <tr className="text-[13px] md:text-[14px] font-inter">
                {consPerDeptHNmearr.map((col) => (
                  <th
                    key={col}
                    className="text-center border border-gray-700 px-3 py-2"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {consumptionPerDept.map((dept, index) => (
                <React.Fragment key={index}>
                  <tr className="text-[13px] md:text-[14px] border-t-2 border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td
                      rowSpan={3}
                      className="border border-gray-300 font-medium text-center px-2 py-1 align-middle bg-gray-50 dark:bg-gray-800"
                    >
                      {index + 1}
                    </td>

                    <td className="border border-gray-300 font-medium px-2 py-1 align-middle">
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
                      {dept.u4AvgConsumption ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u4UtilizationPercent + " %" ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4ConectedLoadPerMcs ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4RunnigLoad ?? "-"}
                    </td>

                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u4Consumption?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  <tr className="text-[13px] md:text-[14px] border-x-2 border-gray-500 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 font-medium px-2 py-1 align-middle">
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
                      {dept.u5AvgConsumption ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right bg-[#E5F3FD] dark:bg-[#e5f3fd5d]">
                      {dept.u5UtilizationPercent + " %" ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5ConectedLoadPerMcs ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5RunningLoad ?? "-"}
                    </td>

                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {dept.u5Consumption?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  <tr className="text-[13px] md:text-[14px] border-b-2 border-x-2 border-gray-500 dark:border-gray-300 font-semibold bg-gray-100 dark:bg-gray-700">
                    <td
                      colSpan={8}
                      className="text-right border border-gray-400 px-2 py-1 align-middle"
                    >
                      Total
                    </td>
                    <td className="text-right border border-gray-400 px-2 py-1 align-middle dark:text-white/80">
                      {dept.totalConsumption?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={10} className="h-2"></td>
                  </tr>
                </React.Fragment>
              ))}

              <tr className="font-semibold text-[13px] md:text-[14px] dark:bg-gray-600">
                <td colSpan={7} className="dark:bg-gray-800">
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
                  className="text-center border-2 border-gray-700 dark:border-gray-300 px-2 py-2"
                >
                  Grand Total Consumption
                </td>
                <td className="dark:text-white/80 text-right border-2 border-gray-700 dark:border-gray-300 px-2 py-2">
                  {totalafterAux.toLocaleString("en-US", {
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

export default EnergyUsageReport;
