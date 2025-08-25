"use client";
import React from "react";
import ExcelJS from "exceljs";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  // console.log(themetheme);

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
  const unit4SpindlePerKw = unit4Spindle
    ? resData.unit4_consumption / unit4Spindle
    : 0;
  const unit5SpindlePerKw = unit5Spindle
    ? resData.unit5_consumption / unit5Spindle
    : 0;
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

  // ////////----------------------------------------------
  const getImageBuffer = async (imageUrl) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      return await blob.arrayBuffer();
    } catch (error) {
      console.error("Error loading image:", error);
      return null;
    }
  };

  const exportToExcel = async ({
    unit,
    startDate,
    endDate,
    tarifData,
    resData,
    unit4Spindle,
    unit5Spindle,
    theme,
  }) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Energy Summary Report");

    // Set worksheet properties
    worksheet.properties.defaultGridColor = false;
    worksheet.views = [{ showGridLines: false }];
    worksheet.pageSetup.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    // Define styles
    const titleStyle = {
    font: { bold: true, size: 12, color: { argb: "00000000" } }, // White text
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E5F3FD" }, // Dark blue background
    },
  };

    const headerStyle = {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } }, // White text
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A68B2" }, // Dark blue background
    },
    border: {
      top: { style: "thin", color: { argb: "FFFFFFFF" } },
      bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
      left: { style: "thin", color: { argb: "FFFFFFFF" } },
      right: { style: "thin", color: { argb: "FFFFFFFF" } },
    },
  };

    const dataStyle = {
    font: { size: 11 },
    alignment: { vertical: "middle", horizontal: "center" },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    },
  };

    const boldDataStyle = {
    ...dataStyle,
    font: { ...dataStyle.font, bold: true },
  };

  const leftAlignStyle = {
    ...dataStyle,
    alignment: { horizontal: "left", vertical: "middle", indent: 1 },
  };

    // Add logos
    try {
    const logo1Path = "../../../suraj-cotton-logo.png";
    const logo2Path = "../../../jahaann-light.png";

    const image1Buffer = await getImageBuffer(logo1Path);
    if (image1Buffer) {
      const image1Id = workbook.addImage({
        buffer: image1Buffer,
        extension: "png",
      });
      worksheet.addImage(image1Id, {
        tl: { col: 0, row: 0 },
        ext: { width: 150, height: 70 },
      });
    }

    const image2Buffer = await getImageBuffer(logo2Path);
    if (image2Buffer) {
      const image2Id = workbook.addImage({
        buffer: image2Buffer,
        extension: "png",
      });
      worksheet.addImage(image2Id, {
        tl: { col: 2, row: 0.5 },
        ext: { width: 170, height: 40 },
      });
    }
  } catch (error) {
    console.error("Error adding logos:", error);
  }
  const dateRow = worksheet.getRow(4);
  dateRow.getCell(1).value = `Start Date: ${startDate}`;
  dateRow.getCell(3).value = `End Date: ${endDate}`;
  dateRow.getCell(1).style = { font: { size: 11 }};
  dateRow.getCell(3).style = { font: { size: 11 },alignment:{horizontal:"right", vertical:"middle"}  };
  const titleRow = worksheet.getRow(5);
  titleRow.getCell(1).value = `Energy Summary Reports of ${
    unit === "Unit_4"
      ? "Unit 4"
      : unit === "Unit_5"
      ? "Unit 5"
      : unit === "ALL"
      ? "Unit 4 and Unit 5"
      : ""
  }`;
  worksheet.mergeCells(5, 1, 5, 3);
  titleRow.getCell(1).style = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: "center" },
  };
  titleRow.height = 20;
    const secondRow = worksheet.getRow(4);
    secondRow.getCell(1).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
    };
    secondRow.getCell(2).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
    };
    secondRow.getCell(3).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
    };
    worksheet.mergeCells(2, 2, 2, 2);
  
    worksheet.addRow([]);

    const tariffHeaderRow = worksheet.addRow(["Tariff Rates"]);
    tariffHeaderRow.getCell(1).style = {
      font: { size: 12, bold: true },
      alignment: { horizontal: "left" },
    };
    let allTariffs = [];
    if (unit === "Unit_4" || unit === "ALL") {
      allTariffs.push(
        `Wapda 1: ${tarifData.wapda1}`,
        `Wapda 2: ${tarifData.wapda2}`
      );
    }
    allTariffs.push(
      `Niigata: ${tarifData.niigata}`,
      `JMS 1: ${tarifData.jms}`,
      `GG: ${tarifData.gg}`,
      `DG: ${tarifData.dg}`
    );
    if (unit === "Unit_5" || unit === "ALL") {
      allTariffs.push(
        `Solar 1: ${tarifData.solar1}`,
        `Solar 2: ${tarifData.solar2}`
      );
    }
    const tariffValuesRow = worksheet.addRow([allTariffs.join(" | ")]);
    worksheet.mergeCells(8, 1, 8, 3); // Merge cells A9:H9
    tariffValuesRow.getCell(1).style = {
      font: { size: 11 },
      alignment: { horizontal: "left" },
    };

    worksheet.addRow([]);

    // Helper function to add a table
    const addTable = (title, headers, data) => {
      // Add title row
      const titleRow = worksheet.addRow([title]);
      worksheet.mergeCells(titleRow.number, 1, titleRow.number, headers.length);
      titleRow.getCell(1).style = titleStyle;
      titleRow.height = 20;

      // Add header row
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.style = headerStyle;
      });
      headerRow.height = 20;

      // Add data rows
      data.forEach((rowData) => {
        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          // Apply different styles based on content
          if (rowData[0] === "Total" || rowData[0] === "Average Unit Cost") {
            cell.style = boldDataStyle;
          } else if (colNumber === 1) {
            cell.style = leftAlignStyle;
          } else {
            cell.style = dataStyle;
          }
        });
        row.height = 20;
      });
      worksheet.addRow([]);
    };

    // GENERATION TABLE
    const generationData = [];
    if (unit === "Unit_4" || unit === "ALL") {
      generationData.push([
        "Wapda 1",
        resData.wapda1,
        (resData.wapda1 * Number(tarifData.wapda1)).toFixed(1),
      ]);
    }
    if (unit === "Unit_5" || unit === "ALL") {
      generationData.push([
        "Solar 1",
        resData.solar1,
        ((resData.solar1 * Number(tarifData.solar1)) / 2).toFixed(1),
      ]);
      generationData.push([
        "Solar 2",
        resData.solar2,
        ((resData.solar2 * Number(tarifData.solar2)) / 2).toFixed(1),
      ]);
    }

    const totalGenerationCost =
      wapda1Cost + solar1Cost + solar2Cost; /* your calculation */
    const averageUnitcost = totalCost / resData.total_generation;
    /* your calculation */

    generationData.push([
      "Total",
      resData.total_generation,
      totalGenerationCost.toFixed(1),
    ]);
    generationData.push(["Average Unit Cost", "", averageUnitcost.toFixed(1)]);

    addTable("Generation", ["Resources", "KW", "Cost"], generationData);

    // PRODUCTION TABLE
    const productionData = [];
    if (unit === "Unit_4" || unit === "ALL") {
      productionData.push([
        "Unit 4",
        unit4Spindle,
        (resData.unit4_consumption / unit4Spindle).toFixed(2),
        "00",
      ]);
    }
    if (unit === "Unit_5" || unit === "ALL") {
      productionData.push([
        "Unit 5",
        unit5Spindle,
        (resData.unit5_consumption / unit5Spindle).toFixed(2),
        "00",
      ]);
    }
    productionData.push([
      "Total",
      unit4Spindle + unit5Spindle,
      ((unit4Spindle + unit5Spindle) / resData.total_consumption).toFixed(2),
      "00",
    ]);

    addTable(
      "Production",
      ["Plant", "No. of Spindle", "Kw/Spindle", "Cost/Spindle"],
      productionData
    );

    // CONSUMPTION TABLE
    const consumptionData = [];
    if (unit === "Unit_4" || unit === "ALL") {
      consumptionData.push([
        "Unit 4",
        resData.unit4_consumption,
        (resData.unit4_consumption / 4).toFixed(1),
      ]);
    }
    if (unit === "Unit_5" || unit === "ALL") {
      consumptionData.push([
        "Unit 5",
        resData.unit5_consumption,
        (resData.unit5_consumption / 4).toFixed(1),
      ]);
    }
    consumptionData.push([
      "Total",
      resData.total_consumption,
      (resData.total_consumption / 8).toFixed(1),
    ]);

    addTable("Consumption", ["Resources", "KW", "Cost"], consumptionData);

    // MISCELLANEOUS TABLE
    const miscellaneousData = [];
    if (unit === "Unit_4" || unit === "ALL") {
      miscellaneousData.push([
        "Wapda Export",
        resData.wapdaexport,
        resData.wapdaexport,
      ]);
    }
    miscellaneousData.push([
      "Unaccountable Energy",
      resData.unaccountable_energy,
      (resData.unaccountable_energy / 2).toFixed(1),
    ]);

    addTable("Miscellaneous", ["Resources", "KW", "Cost"], miscellaneousData);

    // TRANSFORMER LOSSES TABLE (only for Unit_5 or ALL)
    if (unit === "Unit_5" || unit === "ALL") {
      const transformerData = [
        ["TF1", resData.trafo1Loss, (resData.trafo1Loss / 2).toFixed(1)],
        ["TF2", resData.trafo2Loss, (resData.trafo2Loss / 2).toFixed(1)],
        ["TF3", resData.trafo3Loss, (resData.trafo3Loss / 2).toFixed(1)],
        ["TF4", resData.trafo4Loss, (resData.trafo4Loss / 2).toFixed(1)],
        [
          "Total",
          resData.transformerLosses,
          (resData.transformerLosses / 8).toFixed(1),
        ],
      ];

      addTable(
        "Trans. / Traffo Losses",
        ["Resources", "KW", "Cost"],
        transformerData
      );
    }

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 30);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Power_Summary_${startDate}_to_${endDate}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // ////////----------------------------------------------

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
      <div className="flex  flex-col gap-3 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between  w-full flex-wrap  gap-1">
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
            End Date: {endDate}
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
              <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f] ">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[12px] font-inter font-semibold border-b border-gray-200"
                  >
                    Generation
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[12px] font-inter font-semibold w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                        Wapda 1
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {resData.wapda1}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {wapda1Cost.toFixed(1)}
                      </td>
                    </tr>

                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                        Wapda 2
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        0
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {0 * tarifData.wapda2}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                    Niigata
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                    JMS 1
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                    GG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                    DG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    0
                  </td>
                </tr>

                {(unit === "Unit_5" || unit === "ALL") && (
                  <>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                        Solar 1
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {resData.solar1}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {solar1Cost.toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                        Solar 2
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {resData.solar2}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                        {solar2Cost.toFixed(1)}
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    {resData.total_generation}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    {totalCost.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-y-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    Average Unit Cost
                  </td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300"></td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    {avgUnitCost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="">
            {/* production */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f]">
                <tr>
                  <th
                    colSpan="4"
                    className="text-center text-[12px] font-inter font-semibold border-1 border-gray-200"
                  >
                    Production
                  </th>
                </tr>
                <tr>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Plant
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    No. of Spindle
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Kw/Spindle
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost/Spindle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[12px] font-inter font-400">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit4Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit4SpindlePerKw.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit4SpindleCost.toFixed(2)}
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[12px] font-inter font-400">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit5Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit5SpindlePerKw.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit5SpindleCost.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[12px] font-inter font-400">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {unit4Spindle + unit5Spindle}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {totalSpindlePerKw.toFixed(2)}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {totalSpindlecost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[49%] flex flex-col gap-2  h-full">
          <div>
            {/* Consumption */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[12px] font-inter font-semibold border-b border-gray-200"
                  >
                    Consumption
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[12px] font-inter font-semibold w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                    Power House Aux.
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                    888.7
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                    888.87
                  </td>
                </tr> */}
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.unit4_consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit4Cost.toFixed(1)}
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.unit5_consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {unit5Cost.toFixed(1)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                    Total
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {resData.total_consumption.toFixed(2)}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {totalconsumption.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/* Miscellaneous */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[12px] font-inter font-semibold border-b border-gray-200"
                  >
                    Miscellaneous
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[12px] font-inter font-semibold w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      Wapda Export
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.wapdaexport.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {wapdaExportCost}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                    Unaccountable Energy
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                    {resData.unaccountable_energy.toFixed(1)}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
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
                <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f]">
                  <tr>
                    <th
                      colSpan="3"
                      className="text-center text-[12px] font-inter font-semibold border-b border-gray-200"
                    >
                      Trans. / Traffo Losses
                    </th>
                  </tr>
                  <tr>
                    <th className="text-start pl-[3rem] text-[12px] font-inter font-semibold w-[50%] border-1 border-gray-300">
                      Resources
                    </th>
                    <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                      KW
                    </th>
                    <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      TF1
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.trafo1Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {tf1Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      TF2
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.trafo2Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {tf2Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      TF3
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.trafo3Loss.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {tf3Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      TF4
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.trafo4Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {tf4Cost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      Total
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {resData.transformerLosses}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
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
