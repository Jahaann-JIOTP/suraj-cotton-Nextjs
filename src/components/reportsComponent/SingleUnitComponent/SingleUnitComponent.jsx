import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const SingleUnitComponent = ({
  unit,
  startDate,
  endDate,
  unit4Spindle,
  unit5Spindle,
  resData,
}) => {
  const data = resData[0];
  const removePrefix = (data, unitPrefix) => {
    const result = {};
    for (const key in data) {
      if (key.startsWith(`${unitPrefix}`)) {
        const suffixKey = key.replace(`${unitPrefix}`, "");
        result[suffixKey] = data[key];
      }
    }
    return result;
  };
  const unit4CleanData = removePrefix(data, "unit_4");
  const unit5CleanData = removePrefix(data, "unit_5");
  const finalData =
    unit === "Unit_4"
      ? unit4CleanData
      : unit === "Unit_5"
      ? unit5CleanData
      : "";

  let totalConsumption = 0;

  for (const key in finalData) {
    totalConsumption += finalData[key];
  }
  // /////-------------------------export to excel
  const tableData = [
    {
      Department: "Blow Room",
      Mcs: "1",
      InstalledLoad: "151.0",
      ConsumedUnits: finalData?.blowroom_consumption || 0,
    },
    {
      Department: "Card(TC03@60kg&TC15@82Kg/hr)",
      Mcs: "14",
      InstalledLoad: "19.0",
      ConsumedUnits: finalData?.card_consumption || 0,
    },
    {
      Department: "Comber",
      Mcs: "9",
      InstalledLoad: "6.2",
      ConsumedUnits: finalData?.comber_consumption || 0,
    },
    {
      Department: "Drawing(Finsher)",
      Mcs: "6",
      InstalledLoad: "13.6",
      ConsumedUnits: finalData?.Drawing_consumption || 0,
    },
    {
      Department: "Simplex",
      Mcs: "6",
      InstalledLoad: "16.5",
      ConsumedUnits: finalData?.Simplex_consumption || 0,
    },
    {
      Department: "R. Transport System",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.RTransportSystem_consumption || 0,
    },
    {
      Department: "Ring Dept",
      Mcs: "24",
      InstalledLoad: "80.0",
      ConsumedUnits: finalData?.Ring_consumption || 0,
    },
    {
      Department: "Auto Cone",
      Mcs: "8",
      InstalledLoad: "30.0",
      ConsumedUnits: finalData?.AutoCone_consumption || 0,
    },
    {
      Department: "Air Compressor",
      Mcs: "3",
      InstalledLoad: "119.0",
      ConsumedUnits: finalData?.AirCompressor_consumption || 0,
    },
    {
      Department: "Deep Well Turbine",
      Mcs: "1",
      InstalledLoad: "22.0",
      ConsumedUnits: finalData?.Turbine_consumption || 0,
    },
    {
      Department: "Bailing Press",
      Mcs: "1",
      InstalledLoad: "15.0",
      ConsumedUnits: finalData?.BailingPress_consumption || 0,
    },
    {
      Department: "Residential Colony",
      Mcs: "",
      InstalledLoad: "30.0",
      ConsumedUnits: finalData?.Residentialcolony_consumption || 0,
    },
    {
      Department: "spare",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Spare_consumption || 0,
    },
    {
      Department: "Winding",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Winding_consumption || 0,
    },
    {
      Department: "Bypass",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Bypass_consumption || 0,
    },
    {
      Department: "Packing",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Packing_consumption || 0,
    },
    {
      Department: "Lab",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Lab_consumption || 0,
    },
    {
      Department: "Frame Finisher",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.FrameFinisher_consumption || 0,
    },
    {
      Department: "A/C Plant",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.ACPlant_consumption || 0,
    },
    {
      Department: "Fiber Deposit",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Fiberdeposit_consumption || 0,
    },
    {
      Department: "Yarn",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: finalData?.Yarn_consumption || 0,
    },
    {
      Department: "Total Load",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits: totalConsumption,
    },
    {
      Department: "Spindles",
      Mcs: "",
      InstalledLoad: "",
      ConsumedUnits:
        unit === "Unit_4"
          ? unit4Spindle
          : unit === "Unit_5"
          ? unit5Spindle
          : "",
    },
  ];

  const exportTableDataToExcel = async ({}) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Department Report");

      const columnNames = [
        "Department",
        "Mcs",
        "Installed Load Kwh",
        "Consumed units Kwh",
      ];

      worksheet.getRow(1).height = 30;

      // Heading Row (Row 1)
      worksheet.mergeCells("A1", "B1");
      worksheet.mergeCells("C1", "D1");

      const leftTitle = worksheet.getCell("A1");
      leftTitle.value = `Energy usage report of ${
        unit === "Unit_4" ? "Unit 4" : unit === "Unit_5" ? "Unit 5" : ""
      }`;
      leftTitle.font = { bold: true, size: 14, color: { argb: "FF1D5999" } };
      leftTitle.alignment = { horizontal: "left", vertical: "middle" };

      const rightTitle = worksheet.getCell("C1");
      rightTitle.value = `Start Date: ${startDate}\nEnd Date: ${endDate}`;
      rightTitle.font = { size: 12, color: { argb: "FF1D5999" } };
      rightTitle.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true,
      };

      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cedef0" },
      };

      // Header Row (Row 2)
      const headerRow = worksheet.getRow(2);
      headerRow.values = columnNames;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1D5999" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "cedef0" } },
          bottom: { style: "thin", color: { argb: "cedef0" } },
          left: { style: "thin", color: { argb: "cedef0" } },
          right: { style: "thin", color: { argb: "cedef0" } },
        };
      });

      // Add Table Data
      tableData.forEach((row, index) => {
        const newRow = worksheet.addRow([
          row.Department,
          row.Mcs,
          row.InstalledLoad,
          row.ConsumedUnits,
        ]);

        const isBoldRow =
          row.Department === "Total Load" || row.Department === "Spindles";
        newRow.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          if (isBoldRow) {
            cell.font = { bold: true };
          }
        });
      });

      // Set Column Widths
      worksheet.columns = columnNames.map(() => ({ width: 25 }));

      // Export
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `unit_${unit}_trend_data_${startDate}_to_${endDate}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "An error occurred while exporting the table data.",
        theme,
      });
    }
  };
  // /////-------------------------export to excel

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
            onClick={() =>
              exportTableDataToExcel({
                finalData: finalData, // ← this is your actual consumption data
                startDate,
                endDate,
                selectedParameter: "Spindle", // or any other metric you're showing
                unit,
                theme: "light", // or "dark", depending on your app
              })
            }
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
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center">
        <h2 className="text-[18.62px] pb-2 pl-8 font-inter font-500 w-full text-start">
          {unit === "Unit_4" ? "Unit 4" : unit === "Unit_5" ? "Unit 5" : ""}
        </h2>
        <div className="w-full h-[10px]"></div>
        <div className="overflow-x-scroll md:w-[100%] custom-scrollbar-report md:overflow-x-hidden h-full md:max-h-[47vh] overflow-y-auto">
          <table className="table w-full border-collapse border ">
            <thead className="sticky top-0 bg-[#E5F3FD] dark:bg-gray-600 z-10">
              <tr className="border border-gray-300 dark:border-gray-500">
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Department
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Mcs
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Installed Load Kwh
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Consumed units Kwh
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Blow Room
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  1
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  151.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.blowroom_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Card(TC03@60kg&TC15@82Kg/hr)
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  14
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  19.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.card_consumption}
                </td>
              </tr>

              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Comber
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  9
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  6.2
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.comber_consumption}
                </td>
              </tr>

              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Drawing(Finsher)
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  6
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  13.6
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Drawing_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Simplex
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  6
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  16.5
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Simplex_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  R. Transport System
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.RTransportSystem_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Ring Dept
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  24
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  80.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Ring_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Auto Cone
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  8
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  30.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.AutoCone_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Air Compressor
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  3
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  119.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.AirCompressor_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Deep Well Turbine
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  1
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  22.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Turbine_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Bailing Press
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  1
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  15.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.BailingPress_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Residential Colony
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                  30.0
                </td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Residentialcolony_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  spare
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Spare_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Winding
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Winding_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Bypass
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Bypass_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Packing
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Packing_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Lab
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Lab_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Frame Finisher
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.FrameFinisher_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  A/C Plant
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.ACPlant_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Fiber Deposit
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Fiberdeposit_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Yarn
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Yarn_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Water Chiller
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.WaterChiller_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  HFO 2nd Source
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.HFO2ndSource_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Lighting
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.Lightning_consumption}
                </td>
              </tr>
              <tr className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                  Aux Unit
                </td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center"></td>
                <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                  {finalData.AuxUnit5_consumption}
                </td>
              </tr>
              {/* -------------------- */}
              <tr className="border border-gray-300 dark:border-gray-500">
                <td className="px-2 py-1 border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                  Total Load
                </td>
                <td></td>
                <td></td>
                <td className="px-2 py-1 text-center text-[12px] font-inter font-500">
                  {totalConsumption.toFixed(2)}
                </td>
              </tr>
              <tr className="border-1 border-gray-300 dark:border-gray-500">
                <td className="border-1 px-2 py-1 border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                  No. of Spindles
                </td>
                <td></td>
                <td></td>
                <td className="text-center px-2 py-1 text-[12px] font-inter font-500 border-1 border-gray-300 dark:border-gray-500">
                  {unit === "Unit_4"
                    ? unit4Spindle
                    : unit === "Unit_5"
                    ? unit5Spindle
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="overflow-x-scroll  md:w-full md:overflow-x-hidden max-h-[29vh] overflow-y-auto">
          <table className="table w-full border-collapse border border-gray-300 dark:border-gray-500">
            <thead className="sticky top-0 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] w-full  z-10">
              <tr className="border border-gray-300 dark:border-gray-500">
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Department
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Mcs
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Consumed units Kwh
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Installed Load Kw
                </th>
              </tr>
            </thead>
          </table>
          <div className="">
            <table className="table w-full border-collapse border border-gray-400">
              <tbody>
                {tableData.map((item, index) => (
                  <tr
                    key={index}
                    className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400"
                  >
                    <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                      {item.department}
                    </td>
                    <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                      {item.mcs}
                    </td>
                    <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                      {item.consumedUnitKwh}
                    </td>
                    <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                      {item.installedLoadKw}
                    </td>
                  </tr>
                ))}
                <tr className="border border-gray-300 dark:border-gray-500">
                  <td className="px-2 py-1 border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                    Total Load
                  </td>
                  <td></td>
                  <td></td>
                  <td className="px-2 py-1 text-center text-[12px] font-inter font-500">
                    {totalInstalledLoad}
                  </td>
                </tr>
                <tr className="border border-gray-300 dark:border-gray-500">
                  <td className="border px-2 py-1 border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                    No. of Spindles
                  </td>
                  <td></td>
                  <td></td>
                  <td className="text-center px-2 py-1 text-[12px] font-inter font-500">
                    {spindles}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default SingleUnitComponent;
