import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
const MultipleUnitComponent = ({
  unit,
  startDate,
  endDate,
  unit4Spindle,
  unit5Spindle,
  resData,
}) => {
  const { theme } = useTheme();
  const data = resData[0]||{};
  

  const u4U5Total = {};
  for (const key in data) {
    const match = key.match(/^unit_([45])(.+?)_consumption$/);
    if (match) {
      const unit = match[1];
      const machine = match[2].toLowerCase();
      if (!u4U5Total[machine]) u4U5Total[machine] = 0;
      u4U5Total[machine] += data[key];
    }
  }
  // total of unit 4 and unit 5
  let unit4Total = 0;
  let unit5Total = 0;
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith("unit_4") && typeof value === "number") {
      unit4Total += value;
    }
    if (key.startsWith("unit_5") && typeof value === "number") {
      unit5Total += value;
    }
  });
  // all total of unit + Unit 5
  let allTotalofU4U5Sum = unit4Total + unit5Total;
  const tableData = [
    {
      dept: "Blow Room",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 151.0,
      u5Load: 151.0,
      u4Consumption: data.unit_4BlowRoom_consumption,
      u5Consumption: data.unit_5BlowRoom_consumption,
      u4andU5TotalConsumption: u4U5Total.blowroom,
      unit: "both",
    },
    {
      dept: "Card",
      u4Mcs: 14,
      u5Mcs: 14,
      u4Load: 19.0,
      u5Load: 19.0,
      u4Consumption: data.unit_4Carding_consumption,
      u5Consumption: data.unit_5Carding_consumption,
      u4andU5TotalConsumption: u4U5Total.carding,
      unit: "both",
    },
    {
      dept: "Comber + Unitlap",
      u4Mcs: 9,
      u5Mcs: 9,
      u4Load: 6.2,
      u5Load: 6.2,
      u4Consumption: data.unit_4Comber_consumption,
      u5Consumption: data.unit_5Comber_consumption,
      u4andU5TotalConsumption: u4U5Total.comber,
      unit: "both",
    },
    {
      dept: "Drawing",
      u4Mcs: 6,
      u5Mcs: 6,
      u4Load: 13.6,
      u5Load: 13.6,
      u4Consumption: data.unit_4Drawing_consumption,
      u5Consumption: data.unit_5Drawing_consumption,
      u4andU5TotalConsumption: u4U5Total.drawing,
      unit: "Unit_4",
    },
    {
      dept: "simplex",
      u4Mcs: 6,
      u5Mcs: 6,
      u4Load: 16.5,
      u5Load: 16.5,
      u4Consumption: data.unit_4Simplex_consumption,
      u5Consumption: data.unit_5Simplex_consumption,
      u4andU5TotalConsumption: u4U5Total.simplex,
      unit: "both",
    },
    {
      dept: "Transport",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4RTransportSystem_consumption,
      u5Consumption: data.unit_5RTransportSystem_consumption,
      u4andU5TotalConsumption: u4U5Total.rtransportsystem,
      unit: "both",
    },
    {
      dept: "Ring",
      u4Mcs: 24,
      u5Mcs: 24,
      u4Load: 80.0,
      u5Load: 80.0,
      u4Consumption: data.unit_4Ring_consumption,
      u5Consumption: data.unit_5Ring_consumption,
      u4andU5TotalConsumption: u4U5Total.ring,
      unit: "both",
    },
    {
      dept: "Auto Cone",
      u4Mcs: 8,
      u5Mcs: 8,
      u4Load: 30.0,
      u5Load: 30.0,
      u4Consumption: data.unit_4AutoCone_consumption,
      u5Consumption: data.unit_5AutoCone_consumption,
      u4andU5TotalConsumption: u4U5Total.autocone,
      unit: "both",
    },
    {
      dept: "Air Compressor",
      u4Mcs: 3,
      u5Mcs: 3,
      u4Load: 119.0,
      u5Load: 119.0,
      u4Consumption: data.unit_4AirCompressor_consumption,
      u5Consumption: data.unit_5AirCompressor_consumption,
      u4andU5TotalConsumption: u4U5Total.aircompressor,
      unit: "Unit_4",
    },
    {
      dept: "Deep well turbine",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 22.0,
      u5Load: 22.0,
      u4Consumption: data.unit_4Turbine_consumption,
      u5Consumption: data.unit_5Turbine_consumption,
      u4andU5TotalConsumption: u4U5Total.turbine,
      unit: "both",
    },
    {
      dept: "bailing",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 15.0,
      u5Load: 15.0,
      u4Consumption: data.unit_4BailingPress_consumption,
      u5Consumption: data.unit_5BailingPress_consumption,
      u4andU5TotalConsumption: u4U5Total.bailingpress,
      unit: "both",
    },
    {
      dept: "spare",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Spare_consumption,
      u5Consumption: data.unit_5Spare_consumption,
      u4andU5TotalConsumption: u4U5Total.spare,
      unit: "both",
    },
    {
      dept: "Winding",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Winding_consumption,
      u5Consumption: data.unit_5Winding_consumption,
      u4andU5TotalConsumption: u4U5Total.winding,
      unit: "both",
    },
    {
      dept: "Bypass",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Bypass_consumption,
      u5Consumption: data.unit_5Bypass_consumption,
      u4andU5TotalConsumption: u4U5Total.bypass,
      unit: "Unit_4",
    },
    {
      dept: "lab",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Lab_consumption,
      u5Consumption: data.unit_5Lab_consumption,
      u4andU5TotalConsumption: u4U5Total.lab,
      unit: "Unit_4",
    },
    {
      dept: "Frame Finisher",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4FrameFinisher_consumption,
      u5Consumption: data.unit_5FrameFinisher_consumption,
      u4andU5TotalConsumption: u4U5Total.framefinisher,
      unit: "Unit_4",
    },
     {
      dept: "AC plant",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4ACPlant_consumption,
      u5Consumption: data.unit_5ACPlant_consumption,
      u4andU5TotalConsumption: u4U5Total.acplant,
      unit: "Unit_5",
    },
    {
      dept: "fiber deposit",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Fiberdeposit_consumption,
      u5Consumption: data.unit_5Fiberdeposit_consumption,
      u4andU5TotalConsumption: u4U5Total.fiberdeposit,
      unit: "Unit_5",
    },
     {
      dept: "yarn",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Yarn_consumption,
      u5Consumption: data.unit_5Yarn_consumption,
      u4andU5TotalConsumption: u4U5Total.yarn,
      unit: "Unit_5",
    },
    {
      dept: "water chiller",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4WaterChiller_consumption,
      u5Consumption: data.unit_5WaterChiller_consumption,
      u4andU5TotalConsumption: u4U5Total.waterchiller,
      unit: "Unit_5",
    },
    {
      dept: "HFO 2nd Source",
      u4Mcs: 9,
      u5Mcs: 9,
      u4Load: 6.2,
      u5Load: 6.2,
      u4Consumption: data.unit_4HFO2ndSource_consumption,
      u5Consumption: data.unit_5HFO2ndSource_consumption,
      u4andU5TotalConsumption: u4U5Total.hfo2ndsource,
      unit: "Unit_4",
    },
    {
      dept: "mills lighting",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Lightning_consumption,
      u5Consumption: data.unit_5Lightning_consumption,
      u4andU5TotalConsumption: u4U5Total.lightning,
      unit: "Unit_4",
    },
    {
      dept: "aux Unit # 05",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4AuxUnit5_consumption,
      u5Consumption: data.unit_5AuxUnit5_consumption,
      u4andU5TotalConsumption: u4U5Total.auxunit5,
      unit: "Unit_4",
    },
    {
      dept: "Residential Colony + workshop",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 30.0,
      u5Load: 30.0,
      u4Consumption: data.unit_4Residentialcolony_consumption,
      u5Consumption: data.unit_5Residentialcolony_consumption,
      u4andU5TotalConsumption: u4U5Total.residentialcolony,
      unit: "both",
    },
    {
      dept: "packing",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Packing_consumption,
      u5Consumption: data.unit_5Packing_consumption,
      u4andU5TotalConsumption: u4U5Total.packing,
      unit: "both",
    },
    {
      dept: "Capacitor Bank",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Capacitorbank_consumption,
      u5Consumption: data.unit_5Capacitorbank_consumption,
      u4andU5TotalConsumption: u4U5Total.packing,
      unit: "Unit_5",
    },
  ];
 
// ---------------------------
const originalString = "javascript is easy";
const capitalizedSentence = originalString
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
console.log(capitalizedSentence);
// ---------------------------

  const getImageBuffer = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return await blob.arrayBuffer();
  };

  const exportEnergyReportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Energy Usage Report");

      worksheet.properties.defaultGridColor = false;
      worksheet.views = [{ showGridLines: false }];

      const image1Buffer = await getImageBuffer(
        "../../../suraj-cotton-logo.png"
      );
      const image1Id = workbook.addImage({
        buffer: image1Buffer,
        extension: "png",
      });
      worksheet.addImage(image1Id, {
        tl: { col: 0, row: 0 },
        ext: { width: 150, height: 70 },
      });

      const image2Buffer = await getImageBuffer("../../../jahaann-light.png");
      const image2Id = workbook.addImage({
        buffer: image2Buffer,
        extension: "png",
      });
      worksheet.addImage(image2Id, {
        tl: { col: 9, row: 1 },
        ext: { width: 170, height: 40 },
      });

      const borderRow = worksheet.getRow(4);
      for (let i = 1; i <= 10; i++) {
        const cell = borderRow.getCell(i);
        cell.border = {
          top: { style: "medium", color: { argb: "FF000000" } },
        };
      }

      let currentRowIndex = 5;

      worksheet.columns = [
        { width: 35 },
        { width: 8 },
        { width: 20 },
        { width: 25 },
        { width: 3 },
        { width: 8 },
        { width: 20 },
        { width: 25 },
        { width: 3 },
        { width: 25 },
      ];

      worksheet.mergeCells(`C${currentRowIndex}:G${currentRowIndex}`);
      const mainHeadingCell = worksheet.getCell(`C${currentRowIndex}`);
      mainHeadingCell.value = `Energy Usage report of ${
        unit === "Unit_4"
          ? "Unit 4"
          : unit === "Unit_5"
          ? "Unit 5"
          : "Unit 4 and Unit 5"
      }`;
      mainHeadingCell.font = { size: 16, bold: true };
      mainHeadingCell.alignment = { vertical: "middle", horizontal: "center" };

      worksheet.mergeCells(`H${currentRowIndex - 1}:I${currentRowIndex - 1}`);
      const startDateCell = worksheet.getCell(`H${currentRowIndex - 1}`);
      startDateCell.value = `Start Date: ${startDate}`;
      startDateCell.font = { size: 12 };
      startDateCell.alignment = { horizontal: "right", vertical: "middle" };

      worksheet.mergeCells(`J${currentRowIndex - 1}:J${currentRowIndex - 1}`);
      const endDateCell = worksheet.getCell(`J${currentRowIndex - 1}`);
      endDateCell.value = `End Date: ${endDate}`;
      endDateCell.font = { size: 12 };
      endDateCell.alignment = { horizontal: "right", vertical: "middle" };

      currentRowIndex += 5;

      const unitHeaderRow = worksheet.addRow([]);
      unitHeaderRow.getCell(2).value = "Unit 4";
      unitHeaderRow.getCell(6).value = "Unit 5";
      unitHeaderRow.getCell(10).value = "Unit 4 + Unit 5";
      worksheet.mergeCells(unitHeaderRow.number, 2, unitHeaderRow.number, 4);
      worksheet.mergeCells(unitHeaderRow.number, 6, unitHeaderRow.number, 8);
      unitHeaderRow.eachCell((cell) => {
        if (cell.value) {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center" };
        }
      });

      const headerRow = worksheet.addRow([
        "Department",
        "Mcs",
        "Installed Load Kw",
        "Consumed units Kwh",
        "",
        "Mcs",
        "Installed Load Kwh",
        "Consumed Units Kwh",
        "",
        "Total Consumed Units Kw",
      ]);
      headerRow.eachCell((cell) => {
        if (cell.value) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0070C0" },
          };
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });
      headerRow.height = 30;

      tableData.forEach((item) => {
        const row = worksheet.addRow([
          item.dept.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          item.unit!=="Unit_5"?item.u4Mcs:"",
          item.unit!=="Unit_5"?item.u4Load:"",
          item.unit!=="Unit_5"?item.u4Consumption || 0:"--",
          "",
          item.unit!=="Unit_4"?item.u5Mcs:"",
          item.unit!=="Unit_4"?item.u5Load:"",
          item.unit!=="Unit_4"?item.u5Consumption || 0:"--",
          "",
          item.u4andU5TotalConsumption || 0,
        ]);

        row.eachCell((cell, colNumber) => {
          if ([1, 2, 3, 4, 6, 7, 8, 10].includes(colNumber)) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }

          if ([2, 3, 6, 7,].includes(colNumber)) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE5F3FD" },
            };
          }

          if (colNumber !== 1 && colNumber !== 5 && colNumber !== 9) {
            cell.alignment = { horizontal: "center" };
          }
        });
      });

      const totalRow = worksheet.addRow([
        "Total Load",
        "",
        "",
        unit4Total?.toFixed(2) || 0,
        "",
        "",
        "",
        unit5Total?.toFixed(2) || 0,
        "",
        allTotalofU4U5Sum?.toFixed(2) || 0,
      ]);
      totalRow.eachCell((cell, colNumber) => {
        if ([1, 2, 3, 4, 6, 7, 8, 10].includes(colNumber)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0070C0" },
          };
        }
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        if ([1, 2, 3, 4, 6, 7, 8, 10].includes(colNumber)) {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }

        if (cell.value) cell.alignment = { horizontal: "center" };
      });

      const spindleRow = worksheet.addRow([
        "Total Spindles",
        "",
        "",
        unit4Spindle,
        "",
        "",
        "",
        unit5Spindle,
        "",
        (unit4Spindle + unit5Spindle)?.toFixed(2) || 0,
      ]);
      spindleRow.eachCell((cell, colNumber) => {
        if ([1, 2, 3, 4, 6, 7, 8, 10].includes(colNumber)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0070C0" },
          };
        }
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
       
        if ([1, 2, 3, 4, 6, 7, 8, 10].includes(colNumber)) {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
        if (cell.value) cell.alignment = { horizontal: "center" };
      });

      // Format numeric cells
      for (let i = 5; i <= worksheet.rowCount; i++) {
        [4, 8, 10].forEach((col) => {
          const cell = worksheet.getCell(
            `${String.fromCharCode(64 + col)}${i}`
          );
          if (typeof cell.value === "number") {
            cell.numFmt = "0.00";
          }
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        `${unit}_Energy_Usage_Report_${startDate}_to_${endDate}.xlsx`
      );

      Swal.fire({
        icon: "success",
        title: "Report Exported",
        text: "Energy usage report has been exported successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error.message);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "An error occurred while exporting the report",
      });
    }
  };
  // /////////////////////////////--------------export to excel

  return (
    <div>
      <div className="flex px-3 md:px-6 flex-col gap-3 overflow-hidden">
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
      <div className="flex gap-2 px-3 md:px-6 items-start justify-between pt-5">
        <div>
          <button
            onClick={() => exportEnergyReportToExcel()}
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
        </div>
      </div>
      <div className="px-3 md:px-6 ">
        <h2 className="text-[18.62px] pb-4 font-inter font-500">
          Unit 4 + Unit 5
        </h2>

        <div className="w-full">
          <div className="flex gap-1 flex-col h-full mb-1 w-full max-w-full overflow-x-auto md:overflow-x-auto lg:overflow-x-visible custom-scrollbar-report">
            {/* ------------------- */}
            <div className="min-w-[1024px] lg:min-w-full flex justify-end gap-[1rem]">
              <div className="w-[17rem] lg:w-[29.6%] flex items-center gap-2">
                <div className="w-[47.5%] relative h-[1px] bg-black dark:bg-gray-500">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[15%] font-500 font-inter text-[12px] text-center">
                  Unti 4
                </div>
                <div className="w-[45%] h-[1px] relative bg-black dark:bg-gray-500">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
              <div className="w-[24rem] lg:w-[29.9%] flex items-center gap-2">
                <div className="w-[47.5%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[12%] font-500 font-inter text-[12px] text-center">
                  Unti 5
                </div>
                <div className="w-[45%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
              <div className="w-[7.5rem] lg:w-[16.5%] flex items-center">
                <div className="w-[27%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[46%] font-500 font-inter text-[12px] text-center">
                  Unti 4 + Unit 5
                </div>
                <div className="w-[27%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
            </div>
            {/* ------------------- */}
            <div className="">
              <div className="flex-nowrap dark:border-gray-500 flex gap-4 min-w-[1024px] lg:min-w-full">
                <table className="table w-full border-collapse border border-gray-300 dark:border-gray-500">
                  <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f] w-full z-10">
                    <tr className="border border-gray-300 dark:border-gray-500">
                      <th className="border border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter font-semibold">
                        Department
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter font-semibold">
                        Mcs
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Installed Load Kw
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Consumed units Kwh
                      </th>
                      <th className=" border-b-1 border-white dark:border-gray-800 bg-white dark:bg-gray-800  px-[5px] py-1 text-[12px] font-inter font-semibold"></th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Mcs
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Intalled Load Kwh
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Consumed Units Kwh
                      </th>
                      <th className=" border-b-1 border-white dark:border-gray-800 bg-white dark:bg-gray-800  px-[5px] py-1 text-[12px] font-inter font-semibold"></th>
                      <th className="border font-semibold border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter">
                        Total Consumed Units Kw
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className="h-[27px] text-[12px] font-inter font-400"
                      >
                        <td className="capitalize px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-400">
                          {row.dept}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 text-center">
                          {row.unit!=="Unit_5"?row.u4Mcs:""}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 text-center">
                          {row.unit!=="Unit_5"?row.u4Load:""}
                        </td>
                        <td className="px-[5px] py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                          {row.unit!=="Unit_5"?row?.u4Consumption?.toFixed(2) || 0:"--"}
                        </td>
                        <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-400"></td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500  text-center">
                          {row.unit!=="Unit_4"?row.u5Mcs:""}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500  text-center">
                          {row.unit!=="Unit_4" ? row.u5Load:""}
                        </td>
                        <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-400">
                          {row.unit!=="Unit_4"?row.u5Consumption || 0:"--"}
                        </td>
                        <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-400"></td>
                        <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                          {row?.u4andU5TotalConsumption?.toFixed(2) || 0}
                        </td>
                      </tr>
                    ))}
                    <tr className="h-[27px] text-[12px] font-inter font-semibold">
                      <td className="px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-semibold">
                        Total Load
                      </td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-[5px] py-1 text-center border-r-1 border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Total?.toFixed(2) || 0}
                      </td>
                      <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-semibold">
                        {unit5Total?.toFixed(2) || 0}
                      </td>
                      <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {allTotalofU4U5Sum?.toFixed(2) || 0}
                      </td>
                    </tr>
                    <tr className="h-[27px] border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                      <td className="px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-semibold">
                        Total Spindles
                      </td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-[5px] py-1 text-center border-r-1 border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Spindle}
                      </td>
                      <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-semibold">
                        {unit5Spindle}
                      </td>
                      <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Spindle + unit5Spindle}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleUnitComponent;
