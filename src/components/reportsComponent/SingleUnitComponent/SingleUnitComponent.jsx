import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

const SingleUnitComponent = ({
  unit,
  startDate,
  endDate,
  unit4Spindle,
  unit5Spindle,
  resData,
  startTime,
  endTime,
}) => {
  const { theme } = useTheme();
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
      Mcs: { Unit_4: "1", Unit_5: "2" },
      InstalledLoad: { Unit_4: "151.0", Unit_5: "144.5" },
      ConsumedUnits: finalData?.BlowRoom_consumption || 0,
      unit: "both",
    },
    {
      Department: "Card + Breaker",
      Mcs: { Unit_4: "15", Unit_5: "" },
      InstalledLoad: { Unit_4: "19", Unit_5: "" },
      ConsumedUnits: finalData?.Card_Breaker_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Card",
      Mcs: { Unit_4: "", Unit_5: "14" },
      InstalledLoad: { Unit_4: "", Unit_5: "20.9" },
      ConsumedUnits: finalData?.Carding_consumption || 0,
      unit: "Unit_5",
    },
    {
      Department: "Comber + Uni Lap",
      Mcs: { Unit_4: "12", Unit_5: "17" },
      InstalledLoad: { Unit_4: "18", Unit_5: "33" },
      ConsumedUnits: finalData?.Comberandunilap_consumption || 0,
      unit: "both",
    },
    {
      Department: "Drawing(Finisher) + 2 Breaker",
      Mcs: { Unit_4: "8", Unit_5: "" },
      InstalledLoad: { Unit_4: "22.6", Unit_5: "" },
      ConsumedUnits: finalData?.DrawingFinisherand2Breaker_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Drawing Finisher 1-8 Breaker",
      Mcs: { Unit_4: "", Unit_5: "8" },
      InstalledLoad: { Unit_4: "", Unit_5: "13.6" },
      ConsumedUnits: finalData?.DrawingFinisher1to8Breaker_consumption || 0,
      unit: "Unit_5",
    },
    {
      Department: "Drawing Breaker + Simplex",
      Mcs: { Unit_4: "", Unit_5: "11" },
      InstalledLoad: { Unit_4: "", Unit_5: "40.5" },
      ConsumedUnits: finalData?.DrawingBreakerandSimplex_consumption || 0,
      unit: "Unit_5",
    },
    {
      Department: "Drawing Simplex",
      Mcs: { Unit_4: "6", Unit_5: "" },
      InstalledLoad: { Unit_4: "16.5", Unit_5: "" },
      ConsumedUnits: finalData?.DrawingSimplex_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "R. Transport System",
      Mcs: { Unit_4: "", Unit_5: "1" },
      InstalledLoad: { Unit_4: "", Unit_5: "30" },
      ConsumedUnits: finalData?.RTransportSystem_consumption || 0,
      unit: "both",
    },
    {
      Department: "Ring Dept",
      Mcs: { Unit_4: "24", Unit_5: "18" },
      InstalledLoad: { Unit_4: "80", Unit_5: "141.9" },
      ConsumedUnits: finalData?.Ring_consumption || 0,
      unit: "both",
    },
    {
      Department: "Auto Cone (Winding) 10-18",
      Mcs: { Unit_4: "9", Unit_5: "18" },
      InstalledLoad: { Unit_4: "30", Unit_5: "26.2" },
      ConsumedUnits: finalData?.AutoCone_Winding10to18_consumption || 0,
      unit: "both",
    },
    {
      Department: "B/Card + Comber Filter",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "199", Unit_5: "267.7" },
      ConsumedUnits: finalData?.B_CardandComberFilter_consumption || 0,
      unit: "both",
    },
    {
      Department: "A/C Back Process",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "138", Unit_5: "245.4" },
      ConsumedUnits: finalData?.AC_BackProcess_consumption || 0,
      unit: "both",
    },
    {
      Department: "A/C Ring",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "347.5", Unit_5: "476" },
      ConsumedUnits: finalData?.AC_Ring_consumption || 0,
      unit: "both",
    },
    {
      Department: "A/C Auto Cone(Winding)",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "71", Unit_5: "100.5" },
      ConsumedUnits: finalData?.AC_AutoCone_Winding_consumption || 0,
      unit: "both",
    },
    {
      Department: "Air Compressor",
      Mcs: { Unit_4: "3", Unit_5: "3" },
      InstalledLoad: { Unit_4: "119", Unit_5: "303" },
      ConsumedUnits: finalData?.AirCompressor_consumption || 0,
      unit: "both",
    },
    {
      Department: "Deep Well Turbine",
      Mcs: { Unit_4: "1", Unit_5: "1" },
      InstalledLoad: { Unit_4: "22", Unit_5: "22" },
      ConsumedUnits: finalData?.Deep_Well_Turbine_consumption || 0,
      unit: "both",
    },
    {
      Department: "Bailing Press",
      Mcs: { Unit_4: "1", Unit_5: "1" },
      InstalledLoad: { Unit_4: "15", Unit_5: "22.5" },
      ConsumedUnits: finalData?.BailingPress_consumption || 0,
      unit: "both",
    },
    {
      Department: "Mills Lighting",
      Mcs: { Unit_4: "1", Unit_5: "1" },
      InstalledLoad: { Unit_4: "60", Unit_5: "60" },
      ConsumedUnits: finalData?.Mills_Lighting_consumption || 0,
      unit: "both",
    },
    {
      Department: "Residential Colony",
      Mcs: { Unit_4: "", Unit_5: "1" },
      InstalledLoad: { Unit_4: "30", Unit_5: "30" },
      ConsumedUnits: finalData?.Residentialcolony_consumption || 0,
      unit: "both",
    },
    {
      Department: "Conditioning Machine",
      Mcs: { Unit_4: "1", Unit_5: "1" },
      InstalledLoad: { Unit_4: "72", Unit_5: "72" },
      ConsumedUnits: finalData?.Conditioning_Machine_consumption || 0,
      unit: "both",
    },
    {
      Department: "Workshop",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.Workshop_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Lab + Offices",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.Lab_and_Offices_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Power House Gas",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.Power_House2ndSourceGas_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Power House HFO",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.Power_House2ndSourceHFO_consumption || 0,
      unit: "Unit_4",
    },
    {
      Department: "Water Chiller",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.WaterChiller_consumption || 0,
      unit: "Unit_5",
    },
    {
      Department: "Spare",
      Mcs: { Unit_4: "", Unit_5: "" },
      InstalledLoad: { Unit_4: "", Unit_5: "" },
      ConsumedUnits: finalData?.Spare_consumption || 0,
      unit: "both",
    },
  ];

  // /////-------------------------export to excel
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
        ext: { width: 120, height: 60 },
      });

      const image2Buffer = await getImageBuffer("../../../jahaann-light.png");
      const image2Id = workbook.addImage({
        buffer: image2Buffer,
        extension: "png",
      });
      worksheet.addImage(image2Id, {
        tl: { col: 3.9, row: 1 },
        ext: { width: 130, height: 35 },
      });
      const borderRow = worksheet.getRow(4);
      for (let i = 1; i <= 4; i++) {
        const cell = borderRow.getCell(i);
        cell.border = {
          top: { style: "medium", color: { argb: "FF000000" } },
        };
      }
      worksheet.columns = [
        { width: 30 },
        { width: 10 },
        { width: 15 },
        { width: 30 },
      ];
      worksheet.mergeCells("A5:D6");
      const mainHeadingCell = worksheet.getCell("A5");
      mainHeadingCell.value = `Energy Usage report of ${
        unit === "Unit_4" ? "Unit 4" : unit === "Unit_5" ? "Unit 5" : ""
      }`;
      mainHeadingCell.font = { size: 16, bold: true };
      mainHeadingCell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      worksheet.mergeCells("A4:A4");
      const startDateCell = worksheet.getCell("A4");
      startDateCell.value = `Start Date: ${startDate} - ${startTime}`;
      startDateCell.font = { size: 12 };
      startDateCell.alignment = { vertical: "middle", horizontal: "left" };

      worksheet.mergeCells("D4:D4");
      const endDateCell = worksheet.getCell("D4");
      endDateCell.value = `End Date: ${endDate} - ${endTime}`;
      endDateCell.font = { size: 12 };
      endDateCell.alignment = { vertical: "middle", horizontal: "right" };

      const headerRow = worksheet.addRow([
        "Department",
        "Mcs",
        "Installed Load",
        "Consumed Units",
      ]);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0070C0" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      headerRow.height = 20;

      tableData
        .filter((row) => row.unit === "both" || row.unit === unit)
        .forEach((item) => {
          const mcs =
            typeof item.Mcs === "object" ? item.Mcs[unit] || "" : item.Mcs;
          const installedLoad =
            typeof item.InstalledLoad === "object"
              ? item.InstalledLoad[unit] || ""
              : item.InstalledLoad;

          const row = worksheet.addRow([
            item.Department,
            mcs,
            installedLoad,
            item.ConsumedUnits,
          ]);
          row.alignment = { vertical: "middle" };

          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            if (colNumber !== 1) {
              cell.alignment = { horizontal: "center" };
            }
            if (colNumber === 4) {
              cell.alignment = { horizontal: "left" };
            }
          });
        });

      const totalRow = worksheet.addRow([
        "Total Load",
        "",
        "",
        totalConsumption,
      ]);
      totalRow.font = { bold: true };
      totalRow.alignment = { horizontal: "left", vertical: "middle" };
      totalRow.cell = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
      };
      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0070C0" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
      });

      const spindleRow = worksheet.addRow([
        "No. of Bags",
        "",
        "",
        unit === "Unit_4"
          ? unit4Spindle > 0
            ? unit4Spindle
            : "N/A"
          : unit === "Unit_5"
          ? unit5Spindle > 0
            ? unit5Spindle
            : "N/A"
          : "N/A",
      ]);
      spindleRow.font = { bold: true };
      spindleRow.alignment = { horizontal: "left", vertical: "middle" };
      spindleRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0070C0" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
      });

      for (let i = 4; i <= worksheet.rowCount; i++) {
        const consumedUnitsCell = worksheet.getCell(`D${i}`);
        if (typeof consumedUnitsCell.value === "number") {
          consumedUnitsCell.numFmt = "0.00";
        }
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
  // /////-------------------------export to excel

  return (
    <>
      <div className="flex  flex-col gap-3">
        <div className="flex  items-center justify-between  w-full flex-wrap  gap-1">
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
      <div className="flex  gap-2 px-3 md:px-6 items-start justify-between pt-5">
        <div>
          <button
            onClick={() => exportEnergyReportToExcel()}
            className="bg-[#1A68B2] font-inter cursor-pointer text-white py-1 px-5 rounded text-[14.22px] font-500 font-inter"
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
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center">
        <h2 className="text-[18.62px] pb-2 pl-8 font-inter font-500 w-full text-start">
          {unit === "Unit_4" ? "Unit 4" : unit === "Unit_5" ? "Unit 5" : ""}
        </h2>
        <div className="w-full h-[10px]"></div>
        <div className="overflow-x-scroll md:w-[97%] custom-scrollbar-report md:overflow-x-hidden mb-3 h-full ">
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
              {tableData
                .filter((row) => row.unit === "both" || row.unit === unit)
                .map((row) => {
                  const mcs =
                    typeof row.Mcs === "object" ? row.Mcs[unit] || "" : row.Mcs;
                  const installedLoad =
                    typeof row.InstalledLoad === "object"
                      ? row.InstalledLoad[unit] || ""
                      : row.InstalledLoad;

                  return (
                    <tr
                      key={row.Department}
                      className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400"
                    >
                      <td className="capitalize px-2 py-1 border font-inter">
                        {row.Department}
                      </td>
                      <td className="capitalize px-2 py-1 text-center font-inter border">
                        {mcs}
                      </td>
                      <td className="capitalize px-2 py-1 text-center font-inter border">
                        {installedLoad}
                      </td>
                      <td className="capitalize px-2 py-1 text-center font-inter border">
                        {row.ConsumedUnits}
                      </td>
                    </tr>
                  );
                })}

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
                  No. of Bags
                </td>
                <td></td>
                <td></td>
                <td className="text-center px-2 py-1 text-[12px] font-inter font-500 border-1 border-gray-300 dark:border-gray-500">
                  {unit === "Unit_4" &&
                    (unit4Spindle > 0 ? unit4Spindle : "N/A")}
                  {unit === "Unit_5" &&
                    (unit5Spindle > 0 ? unit5Spindle : "N/A")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SingleUnitComponent;
