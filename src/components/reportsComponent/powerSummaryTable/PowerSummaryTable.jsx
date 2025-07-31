import React from "react";
import ExcelJS from "exceljs";
// ///////////////////////////////////////////////
// const exportToExcel = ({
//   unit,
//   startDate,
//   endDate,
//   tarifData,
//   resData,
//   unit4Spindle,
//   unit5Spindle,
// }) => {
//   // Create a new workbook
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Energy Summary Report");
//   worksheet.properties.defaultGridColor = false;
//   worksheet.views = [{ showGridLines: false }];

//   // Set some default styles
//   const headerStyle = {
//     font: { bold: true, size: 12 },
//     alignment: { horizontal: "center" },
//     fill: {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFE5F3FD" },
//     },
//     border: {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const titleStyle = {
//     font: { bold: true, size: 12 },
//     alignment: { horizontal: "center" },
//   };

//   const dataStyle = {
//     font: { size: 11 },
//     border: {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const boldDataStyle = {
//     ...dataStyle,
//     font: { ...dataStyle.font, bold: true },
//   };

//   // Helper function to add a row with merged cells
//   const addMergedRow = (worksheet, text, startCol, endCol, style) => {
//     const row = worksheet.addRow([text]);
//     row.height = 20;
//     worksheet.mergeCells(row.number, startCol, row.number, endCol);
//     row.getCell(1).style = style;
//     return row;
//   };

//   // Helper function to add a header row
//   const addHeaderRow = (worksheet, headers, startCol = 1) => {
//     const row = worksheet.addRow(headers);
//     row.height = 20;
//     headers.forEach((_, index) => {
//       row.getCell(startCol + index).style = headerStyle;
//     });
//     return row;
//   };

//   // Calculate values
//   const wapda1Tarif = Number(tarifData.wapda1);
//   const solar1Tarif = Number(tarifData.solar1);
//   const solar2Tarif = Number(tarifData.solar2);
//   const totalGenerationCost =
//     unit === "Unit_4"
//       ? resData.total_generation
//       : unit === "Unit_5"
//       ? resData.total_generation / 2
//       : resData.total_generation / 3;
//   const averageUnitcost =
//     unit === "Unit_4"
//       ? totalGenerationCost
//       : unit === "Unit_5"
//       ? totalGenerationCost / 2
//       : totalGenerationCost / 3;

//   // Add tariff rates
//   const tariffRow = worksheet.addRow(["Tarrif Rates:", "", "", "", ""]);
//   worksheet.mergeCells(tariffRow.number, 1, tariffRow.number, 5);
//   tariffRow.getCell(1).style = { font: { size: 12 } };

//   const tariffValuesRow = worksheet.addRow([]);
//   if (unit === "Unit_4" || unit === "ALL") {
//     tariffValuesRow.getCell(1).value = `Wapda 1: ${tarifData.wapda1}`;
//     tariffValuesRow.getCell(2).value = `Wapda 2: ${tarifData.wapda2}`;
//   }
//   if (unit === "Unit_5" || unit === "ALL") {
//     tariffValuesRow.getCell(3).value = `Solar 1: ${tarifData.solar1}`;
//     tariffValuesRow.getCell(4).value = `Solar 2: ${tarifData.solar2}`;
//   }

//   // Add empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // GENERATION TABLE
//   addMergedRow(worksheet, "Generation", 1, 3, titleStyle);
//   addHeaderRow(worksheet, ["Resources", "KW", "Cost"]);

//   if (unit === "Unit_4" || unit === "ALL") {
//     worksheet.addRow([
//       "Wapda 1",
//       resData.wapda1,
//       (resData.wapda1 * wapda1Tarif).toFixed(1),
//     ]);
//   }

//   if (unit === "Unit_5" || unit === "ALL") {
//     worksheet.addRow([
//       "Solar 1",
//       resData.solar1,
//       ((resData.solar1 * solar1Tarif) / 2).toFixed(1),
//     ]);
//     worksheet.addRow([
//       "Solar 2",
//       resData.solar2,
//       ((resData.solar2 * solar2Tarif) / 2).toFixed(1),
//     ]);
//   }

//   worksheet.addRow([
//     "Total",
//     resData.total_generation,
//     totalGenerationCost.toFixed(1),
//   ]);
//   worksheet.addRow(["Average Unit Cost", "", averageUnitcost.toFixed(1)]);

//   // Apply styles to data rows
//   for (let i = 10; i <= worksheet.rowCount; i++) {
//     const row = worksheet.getRow(i);
//     row.height = 20;
//     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//       cell.style = dataStyle;
//       if (i === worksheet.rowCount - 1 || i === worksheet.rowCount) {
//         cell.style = boldDataStyle;
//       }
//       if (colNumber === 1 && i < worksheet.rowCount - 1) {
//         cell.style = {
//           ...cell.style,
//           alignment: { horizontal: "left", indent: 1 },
//         };
//       } else {
//         cell.style = { ...cell.style, alignment: { horizontal: "center" } };
//       }
//     });
//   }

//   // Add empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // PRODUCTION TABLE
//   addMergedRow(worksheet, "Production", 1, 4, titleStyle);
//   addHeaderRow(
//     worksheet,
//     ["Plant", "No. of Spindle", "Kw/Spindle", "Cost/Spindle"],
//     1
//   );

//   if (unit === "Unit_4" || unit === "ALL") {
//     worksheet.addRow([
//       "Unit 4",
//       unit4Spindle,
//       (resData.unit4_consumption / unit4Spindle).toFixed(2),
//       "00",
//     ]);
//   }

//   if (unit === "Unit_5" || unit === "ALL") {
//     worksheet.addRow([
//       "Unit 5",
//       unit5Spindle,
//       (resData.unit5_consumption / unit5Spindle).toFixed(2),
//       "00",
//     ]);
//   }

//   worksheet.addRow([
//     "Total",
//     unit4Spindle + unit5Spindle,
//     ((unit4Spindle + unit5Spindle) / resData.total_consumption).toFixed(2),
//     "00",
//   ]);

//   // Apply styles to production data
//   for (let i = worksheet.rowCount - 3; i <= worksheet.rowCount; i++) {
//     const row = worksheet.getRow(i);
//     row.height = 20;
//     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//       cell.style = dataStyle;
//       if (i === worksheet.rowCount) {
//         cell.style = boldDataStyle;
//       }
//       if (colNumber === 1) {
//         cell.style = {
//           ...cell.style,
//           alignment: { horizontal: "left", indent: 1 },
//         };
//       } else {
//         cell.style = { ...cell.style, alignment: { horizontal: "center" } };
//       }
//     });
//   }

//   // Add empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // CONSUMPTION TABLE
//   addMergedRow(worksheet, "Consumption", 1, 3, titleStyle);
//   addHeaderRow(worksheet, ["Resources", "KW", "Cost"]);

//   if (unit === "Unit_4" || unit === "ALL") {
//     worksheet.addRow([
//       "Unit 4",
//       resData.unit4_consumption,
//       (resData.unit4_consumption / 4).toFixed(1),
//     ]);
//   }

//   if (unit === "Unit_5" || unit === "ALL") {
//     worksheet.addRow([
//       "Unit 5",
//       resData.unit5_consumption,
//       (resData.unit5_consumption / 4).toFixed(1),
//     ]);
//   }

//   worksheet.addRow([
//     "Total",
//     resData.total_consumption,
//     (resData.total_consumption / 8).toFixed(1),
//   ]);

//   // Apply styles to consumption data
//   for (let i = worksheet.rowCount - 3; i <= worksheet.rowCount; i++) {
//     const row = worksheet.getRow(i);
//     row.height = 20;
//     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//       cell.style = dataStyle;
//       if (i === worksheet.rowCount) {
//         cell.style = boldDataStyle;
//       }
//       if (colNumber === 1) {
//         cell.style = {
//           ...cell.style,
//           alignment: { horizontal: "left", indent: 1 },
//         };
//       } else {
//         cell.style = { ...cell.style, alignment: { horizontal: "center" } };
//       }
//     });
//   }

//   // Add empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // MISCELLANEOUS TABLE
//   addMergedRow(worksheet, "Miscellaneous", 1, 3, titleStyle);
//   addHeaderRow(worksheet, ["Resources", "KW", "Cost"]);

//   if (unit === "Unit_4" || unit === "ALL") {
//     worksheet.addRow([
//       "Wapda Export",
//       resData.wapdaexport,
//       resData.wapdaexport,
//     ]);
//   }

//   worksheet.addRow([
//     "Unaccountable Energy",
//     resData.unaccountable_energy,
//     (resData.unaccountable_energy / 2).toFixed(1),
//   ]);

//   // Apply styles to miscellaneous data
//   for (let i = worksheet.rowCount - 2; i <= worksheet.rowCount; i++) {
//     const row = worksheet.getRow(i);
//     row.height = 20;
//     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//       cell.style = dataStyle;
//       if (colNumber === 1) {
//         cell.style = {
//           ...cell.style,
//           alignment: { horizontal: "left", indent: 1 },
//         };
//       } else {
//         cell.style = { ...cell.style, alignment: { horizontal: "center" } };
//       }
//     });
//   }

//   // Add empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // TRANSFORMER LOSSES TABLE (only for Unit_5 or ALL)
//   if (unit === "Unit_5" || unit === "ALL") {
//     addMergedRow(worksheet, "Trans. / Traffo Losses", 1, 3, titleStyle);
//     addHeaderRow(worksheet, ["Resources", "KW", "Cost"]);

//     worksheet.addRow([
//       "TF1",
//       resData.trafo1Loss,
//       (resData.trafo1Loss / 2).toFixed(1),
//     ]);
//     worksheet.addRow([
//       "TF2",
//       resData.trafo2Loss,
//       (resData.trafo2Loss / 2).toFixed(1),
//     ]);
//     worksheet.addRow([
//       "TF3",
//       resData.trafo3Loss,
//       (resData.trafo3Loss / 2).toFixed(1),
//     ]);
//     worksheet.addRow([
//       "TF4",
//       resData.trafo4Loss,
//       (resData.trafo4Loss / 2).toFixed(1),
//     ]);
//     worksheet.addRow([
//       "Total",
//       resData.transformerLosses,
//       (resData.transformerLosses / 8).toFixed(1),
//     ]);

//     // Apply styles to transformer losses data
//     for (let i = worksheet.rowCount - 5; i <= worksheet.rowCount; i++) {
//       const row = worksheet.getRow(i);
//       row.height = 20;
//       row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//         cell.style = dataStyle;
//         if (i === worksheet.rowCount) {
//           cell.style = boldDataStyle;
//         }
//         if (colNumber === 1) {
//           cell.style = {
//             ...cell.style,
//             alignment: { horizontal: "left", indent: 1 },
//           };
//         } else {
//           cell.style = { ...cell.style, alignment: { horizontal: "center" } };
//         }
//       });
//     }
//   }

//   // Auto-fit columns
//   worksheet.columns.forEach((column) => {
//     let maxLength = 0;
//     column.eachCell({ includeEmpty: true }, (cell) => {
//       let columnLength = cell.value ? cell.value.toString().length : 0;
//       if (columnLength > maxLength) {
//         maxLength = columnLength;
//       }
//     });
//     column.width = maxLength < 10 ? 10 : maxLength + 2;
//   });

//   // Generate Excel file
//   workbook.xlsx.writeBuffer().then((buffer) => {
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `Power_Summary_${startDate}_to_${endDate}.xlsx`;
//     a.click();
//     URL.revokeObjectURL(url);
//   });
// };
// ///////////////////////////////////////////////
const PowerSummaryTable = ({
  unit,
  startDate,
  endDate,
  tarifData,
  resData,
  unit4Spindle,
  unit5Spindle,
}) => {
  const wapda1Tarif = Number(tarifData.wapda1);
  const wapda2Tarif = Number(tarifData.wapda1);
  const niigataTarif = Number(tarifData.wapda1);
  const jmsTarif = Number(tarifData.wapda1);
  const ggTarif = Number(tarifData.wapda1);
  const dgTarif = Number(tarifData.wapda1);
  const solar1Tarif = Number(tarifData.solar1);
  const solar2Tarif = Number(tarifData.solar2);
  const unit4AverageTarif =
    (wapda1Tarif + wapda2Tarif + niigataTarif + jmsTarif + ggTarif + dgTarif) /
    6;
  const unit5AverageTarif =
    (wapda1Tarif + wapda2Tarif + niigataTarif + jmsTarif + ggTarif + dgTarif) /
    6;
  const allAverageTarif =
    (wapda1Tarif +
      wapda2Tarif +
      wapda1Tarif +
      wapda2Tarif +
      niigataTarif +
      jmsTarif +
      ggTarif +
      dgTarif) /
    8;

  // generation cost
  const wapda1Cost = resData.wapda1 * wapda1Tarif;
  const solar1Cost = resData.solar1 * solar1Tarif;
  const solar2Cost = resData.solar2 * solar2Tarif;
  const totalCost = wapda1Cost + solar1Cost + solar2Cost;
  const avgUnitCost = totalCost / resData.total_generation;
  // consumption
  const unit4Cost = resData.unit4_consumption * unit4AverageTarif;
  const unit5Cost = resData.unit5_consumption * unit5AverageTarif;
  const totalconsumption = unit4Cost + unit5Cost;
  // Miscellaneous
  const wapdaExportCost = resData.wapdaexport * unit4AverageTarif;
  const unAccountableEnergyCost =
    resData.unaccountable_energy * allAverageTarif;
  // production
  const unit4SpindlePerKw = resData.unit4_consumption / unit4Spindle;
  const unit5SpindlePerKw = resData.unit5_consumption / unit5Spindle;
  const unit4SpindleCost = unit4SpindlePerKw * unit4AverageTarif;
  const unit5SpindleCost = unit5SpindlePerKw * unit5AverageTarif;
  const totalSpindlePerKw = unit4SpindlePerKw + unit5SpindlePerKw;
  const totalSpindlecost = unit4SpindlePerKw + unit5SpindlePerKw;
  // Trans. / Traffo Losses
  const tf1Cost = resData.trafo1Loss * unit5AverageTarif;
  const tf2Cost = resData.trafo2Loss * unit5AverageTarif;
  const tf3Cost = resData.trafo3Loss * unit5AverageTarif;
  const tf4Cost = resData.trafo4Loss * unit5AverageTarif;
  const totalTfCost = tf1Cost + tf2Cost + tf3Cost + tf4Cost;
  // ///////////////
  const handleExport = () => {
    exportToExcel({
      unit,
      startDate,
      endDate,
      tarifData,
      resData,
      unit4Spindle,
      unit5Spindle,
    });
  };
  // ///////////////
  return (
    <>
      <div className="flex  flex-col gap-3 overflow-hidden pt-3">
        <div className="flex flex-col md:flex-row items-start justify-between  w-full flex-wrap  gap-1">
          <div className="flex flex-col items-start justify-start md:w-[49%]">
            <span className="text-[14.22px] font-500 font-inter">
              Invoice To:
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Suraj Cotton Pvt. Limited
            </span>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 justify-start md:w-[49%]">
            <span className="text-[14.22px] font-500 font-inter">
              Jahaann Technologies
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              22-C Block, G.E.C.H.S, Phase 3 Peco Road Lahore , Pakistan
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Phone: +923245894399
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] mt-5 bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
      <div className="flex flex-col gap-2 md:flex-row px-3 md:px-6 items-start justify-between pt-5">
        <div>
          <button
            onClick={() => handleExport()}
            className="bg-[#1A68B2] cursor-pointer text-white py-1 px-5 rounded text-[14.22px] font-500 font-inter"
          >
            Export
          </button>
        </div>
        <div className="flex flex-col items-start md:items-end justify-start">
          <span className="text-[14.22px] font-500 font-inter">
            Consumption Report
          </span>
          <span className="text-[14.22px] mt-2 font-400 font-inter text-[#727272] dark:text-gray-400">
            Start Date: {startDate}
          </span>
          <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
            End date: {endDate}
          </span>
          <div className="flex items-center justify-end gap-4">
            <span className="text-[14.22px] font-400 font-inter">
              Tarrif Rates:
            </span>
            {(unit === "Unit_4" || unit === "ALL") && (
              <>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Wapda 1: {tarifData.wapda1}
                </span>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Wapda 2: {tarifData.wapda2}
                </span>
              </>
            )}

            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Niigata: {tarifData.niigata}
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              JMS 1: {tarifData.jms}
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              GG: {tarifData.gg}
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              DG: {tarifData.dg}
            </span>
            {(unit === "Unit_5" || unit === "ALL") && (
              <>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Solar 1: {tarifData.solar1}
                </span>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Solar 2: {tarifData.solar2}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* tables */}
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="flex flex-col w-[49%] gap-2">
          <div className="w-full  custom-scrollbar-report">
            {/* generation table */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Generation
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[15px] text-black font-semibold w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[15px] text-black font-semibold w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[15px] text-black font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                        Wapda 1
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {resData.wapda1}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {wapda1Cost.toFixed(1)}
                      </td>
                    </tr>

                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                        Wapda 2
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        0
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {0 * tarifData.wapda2}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                    Niigata
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                    JMS 1
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                    GG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                    DG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    0
                  </td>
                </tr>

                {(unit === "Unit_5" || unit === "ALL") && (
                  <>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                        Solar 1
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {resData.solar1}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {solar1Cost.toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-gray-900">
                        Solar 2
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {resData.solar2}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                        {solar2Cost.toFixed(1)}
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[15px]  text-black font-600">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    {resData.total_generation}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500">
                    {totalCost.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-y-1 border-gray-300 py-[0.5px] text-[15px]  text-black font-600">
                    Average Unit Cost
                  </td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300"></td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300 py-[0.5px] text-[15px] text-gray-500 font-600">
                    {avgUnitCost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="">
            {/* production */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="4"
                    className="text-center text-[15px] text-black font-500 border-1 border-gray-200"
                  >
                    Production
                  </th>
                </tr>
                <tr>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Plant
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    No. of Spindle
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Kw/Spindle
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost/Spindle
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px]  text-gray-900">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit4Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit4SpindlePerKw.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit4SpindleCost.toFixed(2)}
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px]  text-gray-900">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit5Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit5SpindlePerKw.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit5SpindleCost.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px] font-500 text-gray-900">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    {unit4Spindle + unit5Spindle}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    {totalSpindlePerKw.toFixed(2)}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    {totalSpindlecost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[49%] flex flex-col gap-2 overflow-y-auto h-[28rem] custom-scrollbar-report">
          <div>
            {/* Consumption */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Consumption
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                    Power House Aux.
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    888.7
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    888.87
                  </td>
                </tr> */}
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {resData.unit4_consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {unit4Cost.toFixed(1)}
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {resData.unit5_consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {unit5Cost.toFixed(1)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px] font-500 text-black">
                    Total
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    {resData.total_consumption.toFixed(2)}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    {totalconsumption.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/* Miscellaneous */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Miscellaneous
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      Wapda Export
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.wapdaexport.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {wapdaExportCost}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Unaccountable Energy
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                    {resData.unaccountable_energy.toFixed(1)}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                    {unAccountableEnergyCost.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/* Trans. / Traffo Losses */}
            {(unit === "Unit_5" || unit === "ALL") && (
              <table className="min-w-full border border-gray-200">
                <thead className="bg-[#E5F3FD]">
                  <tr>
                    <th
                      colSpan="3"
                      className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                    >
                      Trans. / Traffo Losses
                    </th>
                  </tr>
                  <tr>
                    <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                      Resources
                    </th>
                    <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                      KW
                    </th>
                    <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF1
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo1Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {tf1Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF2
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo2Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {tf2Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF3
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo3Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {tf3Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF4
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo4Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {tf4Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px] font-500  text-black">
                      Total
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.transformerLosses}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {totalTfCost.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PowerSummaryTable;
