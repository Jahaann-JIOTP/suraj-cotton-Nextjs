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
  startTime,
  endTime,
}) => {
  const { theme } = useTheme();

  // Convert tariff values safely to numbers
  const convertTariffToNumber = (obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, isNaN(Number(v)) ? 0 : Number(v)])
    );

  const tarif = convertTariffToNumber(tarifData);

  // Define source keys by unit
  const unitKeys = {
    u4: ["wapda1", "wapda2", "jms", "niigata", "lt1DieselJgs", "lt2DieselJgs"],
    u5: ["wapda2", "jms", "niigata", "solar1", "solar2"],
  };

  // Compute average tariff
  const calculateAverageTariff = (unitType) => {
    const getAvg = (keys) =>
      keys.reduce((sum, key) => sum + (tarif[key] || 0), 0) / keys.length;

    if (unitType === "Unit_4") return { unit4: getAvg(unitKeys.u4) };
    if (unitType === "Unit_5") return { unit5: getAvg(unitKeys.u5) };

    // ALL
    return {
      unit4: getAvg(unitKeys.u4),
      unit5: getAvg(unitKeys.u5),
      all:
        Object.values(tarif).reduce((sum, v) => sum + v, 0) /
        Object.values(tarif).length,
    };
  };

  const avgTariff = calculateAverageTariff(unit);
  const unit4Avg = avgTariff.unit4 || 0;
  const unit5Avg = avgTariff.unit5 || 0;
  const allAvg = avgTariff.all || 0;

  // === Dynamically Select Generation Sources ===
  const getGenerationKeys = () => {
    if (unit === "Unit_4") return unitKeys.u4;
    if (unit === "Unit_5") return unitKeys.u5;
    // For ALL, combine both without duplicates
    return [...new Set([...unitKeys.u4, ...unitKeys.u5])];
  };

  const selectedKeys = getGenerationKeys();

  // Label mapping for readable names
  const labelMap = {
    wapda1: "WAPDA 1",
    wapda2: "WAPDA 2",
    jms: "JMS",
    niigata: "Niigata",
    lt1DieselJgs: "LT1 Diesel JGS",
    lt2DieselJgs: "LT2 Diesel JGS",
    solar1: "Solar 1",
    solar2: "Solar 2",
  };

  // Generate generation array dynamically based on selected unit
  const generation = selectedKeys.map((key) => {
    const consumption = resData[key] || 0;
    const cost = consumption * (tarif[key] || 0);
    return { label: labelMap[key] || key, consumption, cost };
  });

  const totalGenCost = generation.reduce((sum, g) => sum + g.cost, 0);
  const totalGenConsumption = generation.reduce(
    (sum, g) => sum + g.consumption,
    0
  );
  const avgUnitCost = totalGenCost / (resData.total_generation || 1);

  generation.push({
    label: "Total",
    consumption: totalGenConsumption,
    cost: totalGenCost,
  });

  // === Consumption ===
  const consumption = [
    {
      label: "Unit 4 Consumption",
      consumption: resData.unit4_consumption || 0,
      cost: (resData.unit4_consumption || 0) * unit4Avg,
    },
    {
      label: "Unit 5 Consumption",
      consumption: resData.unit5_consumption || 0,
      cost: (resData.unit5_consumption || 0) * unit5Avg,
    },
  ];

  const totalConsumption = consumption.reduce((s, c) => s + c.consumption, 0);
  const totalConsumptionCost = consumption.reduce((s, c) => s + c.cost, 0);
  consumption.push({
    label: "Total",
    consumption: totalConsumption,
    cost: totalConsumptionCost,
  });

  // === Miscellaneous ===
  const miscellaneous = [
    {
      label: "WAPDA Export",
      consumption: resData.wapdaexport || 0,
      cost: (resData.wapdaexport || 0) * unit4Avg,
    },
    {
      label: "Unaccountable Energy",
      consumption: resData.unaccountable_energy || 0,
      cost: (resData.unaccountable_energy || 0) * allAvg,
    },
  ];

  const totalMiscConsumption = miscellaneous.reduce(
    (s, c) => s + c.consumption,
    0
  );
  const totalMiscCost = miscellaneous.reduce((s, c) => s + c.cost, 0);
  miscellaneous.push({
    label: "Total",
    consumption: totalMiscConsumption,
    cost: totalMiscCost,
  });

  // === Production (per spindle) ===
  // === Production (per spindle) ===
  const unit4SpindlePerKw = unit4Spindle
    ? (resData.unit4_consumption || 0) / unit4Spindle
    : 0;
  const unit5SpindlePerKw = unit5Spindle
    ? (resData.unit5_consumption || 0) / unit5Spindle
    : 0;

  // Create base data for both units
  const baseProduction = [
    {
      label: "Unit 4",
      spindles: unit4Spindle || 0,
      spindlePerKw: unit4SpindlePerKw,
      spindleCost: unit4SpindlePerKw * unit4Avg,
    },
    {
      label: "Unit 5 Production",
      spindles: unit5Spindle || 0,
      spindlePerKw: unit5SpindlePerKw,
      spindleCost: unit5SpindlePerKw * unit5Avg,
    },
  ];

  let production = [];
  let totalSpindles = 0;
  let totalSpindlePerKw = 0;
  let totalSpindleCost = 0;

  if (unit === "Unit_4") {
    const u4 = baseProduction[0];
    production = [u4];
    totalSpindles = u4.spindles;
    totalSpindlePerKw = u4.spindlePerKw;
    totalSpindleCost = u4.spindleCost;
  } else if (unit === "Unit_5") {
    const u5 = baseProduction[1];
    production = [u5];
    totalSpindles = u5.spindles;
    totalSpindlePerKw = u5.spindlePerKw;
    totalSpindleCost = u5.spindleCost;
  } else {
    // ALL Units
    production = [...baseProduction];
    totalSpindles = production.reduce((s, p) => s + p.spindles, 0);
    totalSpindlePerKw = production.reduce((s, p) => s + p.spindlePerKw, 0);
    totalSpindleCost = production.reduce((s, p) => s + p.spindleCost, 0);
  }

  // Add Total Row (common for all cases)
  production.push({
    label: "Total",
    spindles: totalSpindles,
    spindlePerKw: totalSpindlePerKw,
    spindleCost: totalSpindleCost,
  });

  // === Transformer Losses ===
  const traffoKeys = ["trafo1Loss", "trafo2Loss", "trafo3Loss", "trafo4Loss"];
  const traffoLosses = traffoKeys.map((key, i) => ({
    label: `Trafo ${i + 1}`,
    consumption: resData[key] || 0,
    cost: (resData[key] || 0) * unit5Avg,
  }));

  const totalTraffoConsumption = traffoLosses.reduce(
    (s, t) => s + t.consumption,
    0
  );
  const totalTraffoCost = traffoLosses.reduce((s, t) => s + t.cost, 0);
  traffoLosses.push({
    label: "Total",
    consumption: totalTraffoConsumption,
    cost: totalTraffoCost,
  });

  // === Final Structured Data ===
  const powerSummaryData = {
    generation,
    consumption,
    production,
    miscellaneous,
    traffoLosses,
    totals: {
      totalGenCost,
      avgUnitCost,
      totalConsumptionCost,
      totalMiscCost,
      totalSpindleCost,
      totalTraffoCost,
    },
  };

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
  // ================================================
  // EXCEL EXPORT (uses powerSummaryData structure)
  // ================================================
  const exportToExcel = async ({
    unit,
    startDate,
    endDate,
    startTime,
    endTime,
    tarifData,
    resData,
    unit4Spindle,
    unit5Spindle,
    theme,
    powerSummaryData,
  }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Energy Summary Report");

    // ---- Basic setup ----
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

    // ---- Styles ----
    const titleStyle = {
      font: { bold: true, size: 12, color: { argb: "00000000" } },
      alignment: { horizontal: "center", vertical: "middle" },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "E5F3FD" } },
    };
    const headerStyle = {
      font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
      alignment: { horizontal: "center", vertical: "middle" },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1A68B2" },
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
          ext: { width: 130, height: 60 },
        });
      }

      const image2Buffer = await getImageBuffer(logo2Path);
      if (image2Buffer) {
        const image2Id = workbook.addImage({
          buffer: image2Buffer,
          extension: "png",
        });
        worksheet.addImage(image2Id, {
          tl: { col: 2.8, row: 0.5 },
          ext: { width: 140, height: 35 },
        });
      }
    } catch (error) {
      console.error("Error adding logos:", error);
    }

    // ---- Header section ----
    const dateRow = worksheet.getRow(4);
    dateRow.getCell(1).value = `Start Date: ${startDate} - ${startTime}`;
    dateRow.getCell(3).value = `End Date: ${endDate} - ${endTime}`;
    const titleRow = worksheet.getRow(5);
    titleRow.getCell(1).value = `Energy Summary Report - ${
      unit === "Unit_4" ? "Unit 4" : unit === "Unit_5" ? "Unit 5" : "Unit 4 & 5"
    }`;
    worksheet.mergeCells(5, 1, 5, 3);
    titleRow.getCell(1).style = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center" },
    };
    worksheet.addRow([]);

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

    // ---- Helper function to add a table ----
    const addTable = (title, headers, data) => {
      const titleRow = worksheet.addRow([title]);
      worksheet.mergeCells(titleRow.number, 1, titleRow.number, headers.length);
      titleRow.getCell(1).style = titleStyle;
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((c) => (c.style = headerStyle));

      data.forEach((row) => {
        const r = worksheet.addRow(row);
        r.eachCell((cell, i) => {
          if (row[0] === "Total") cell.style = boldDataStyle;
          else if (i === 1) cell.style = leftAlignStyle;
          else cell.style = dataStyle;
        });
      });
      worksheet.addRow([]);
    };

    // ---- GENERATION ----
    const generationData = powerSummaryData.generation.map((g) => [
      g.label,
      g.consumption,
      g.cost,
    ]);
    addTable("Generation", ["Source", "kWh", "Cost"], generationData);

    // ---- CONSUMPTION ----
    const consumptionData = powerSummaryData.consumption.map((c) => [
      c.label,
      c.consumption,
      c.cost,
    ]);
    addTable("Consumption", ["Unit", "kWh", "Cost"], consumptionData);

    // ---- PRODUCTION ----
    const productionData = powerSummaryData.production.map((p) => [
      p.label,
      p.spindles,
      p.spindlePerKw,
      p.spindleCost,
    ]);
    addTable(
      "Production",
      ["Plant", "Spindles", "kW/Spindle", "Cost/Spindle"],
      productionData
    );

    // ---- MISCELLANEOUS ----
    const miscellaneousData = powerSummaryData.miscellaneous.map((m) => [
      m.label,
      m.consumption,
      m.cost,
    ]);
    addTable("Miscellaneous", ["Type", "kWh", "Cost"], miscellaneousData);

    // ---- TRANSFORMER LOSSES ----
    const traffoData = powerSummaryData.traffoLosses.map((t) => [
      t.label,
      t.consumption,
      t.cost,
    ]);
    addTable("Transformer Losses", ["Transformer", "kWh", "Cost"], traffoData);

    // ---- Auto-fit columns ----
    worksheet.columns.forEach((col) => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, (c) => {
        const valLen = c.value ? c.value.toString().length : 0;
        if (valLen > maxLen) maxLen = valLen;
      });
      col.width = Math.min(Math.max(maxLen + 2, 10), 25);
    });

    // ---- Download file ----
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

  // === Export handler ===
  const handleExport = () => {
    exportToExcel({
      unit,
      startDate,
      endDate,
      startTime,
      endTime,
      tarifData,
      resData,
      unit4Spindle,
      unit5Spindle,
      theme,
      powerSummaryData, // ✅ Pass the structured data here
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
            Start Date: {`${startDate} - ${startTime}`}
          </span>
          <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
            End Date: {`${endDate} - ${endTime}`}
          </span>
          <div className="flex items-center justify-end gap-4">
            <span className="text-[14.22px] font-400 font-inter">
              Tarrif Rates:
            </span>
            {(unit === "Unit_4" || unit === "ALL") && (
              <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                Wapda IC: {tarifData.wapda1}
              </span>
            )}
            {(unit === "Unit_4" || unit === "Unit_5" || unit === "ALL") && (
              <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                Wapda 2: {tarifData.wapda2}
              </span>
            )}

            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Niigata: {tarifData.niigata}
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              JMS 1: {tarifData.jms}
            </span>
            {(unit === "Unit_4" || unit === "ALL") && (
              <>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  GG: {tarifData.gg}
                </span>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  DG: {tarifData.dg}
                </span>
              </>
            )}
            {(unit === "Unit_5" || unit === "ALL") && (
              <>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Solar 1236.39 kW: {tarifData.solar1}
                </span>
                <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
                  Solar 1017 kW: {tarifData.solar2}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* tables */}
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="flex flex-col w-[49%] gap-2">
          {/* Generatiobn table */}
          <div className="w-full  custom-scrollbar-report">
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
                    kWh
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {powerSummaryData.generation.map((item) => (
                  <tr key={item.label + item.consumption}>
                    <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[0.5px]  text-[12px] font-inter font-400">
                      {item.label}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                      {item.consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                      {item.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="w-[50%] pl-[3rem] border-y-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    Average Unit Cost
                  </td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300"></td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300 py-[0.5px] text-[12px] font-inter font-400">
                    {/* {avgUnitCost.toFixed(2)} */}
                    00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* production table */}
          <div className="">
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
                    No. of Bags
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    kW/Bags
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost/Bags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {powerSummaryData?.production?.map((item) => (
                  <tr key={item.label}>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[12px] font-inter font-400">
                      {item.label}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.spindles}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.spindlePerKw.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.spindleCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[49%] flex flex-col gap-2  h-full">
          {/* Constumption Table */}
          <div>
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
                    kWh
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {powerSummaryData.consumption.map((item) => (
                  <tr key={item.label}>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      {item.label}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Miscellaneous Table */}
          <div>
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
                    kWh
                  </th>
                  <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {powerSummaryData?.miscellaneous?.map((item) => (
                  <tr key={item.label}>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[12px] font-inter font-400">
                      {item.label}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.consumption.toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[12px] font-inter font-400">
                      {item.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
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
                      kWh
                    </th>
                    <th className="text-center text-[12px] font-inter font-semibold w-[25%] border-1 border-gray-300">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {powerSummaryData.traffoLosses.map((item) => (
                    <tr key={item.label}>
                      <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[12px] font-inter font-400">
                        {item.label}
                      </td>
                      <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                        {item.consumption.toFixed(2)}
                      </td>
                      <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[12px] font-inter font-400">
                        {item.cost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
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
