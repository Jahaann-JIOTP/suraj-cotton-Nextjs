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
        ext: { width: 150, height: 70 },
      });

      const image2Buffer = await getImageBuffer("../../../jahaann-light.svg");
      const image2Id = workbook.addImage({
        buffer: image2Buffer,
        extension: "svg",
      });
      worksheet.addImage(image2Id, {
        tl: { col: 3, row: 1 },
        ext: { width: 170, height: 40 },
      });
      const borderRow = worksheet.getRow(4);
      for (let i = 1; i <= 4; i++) {
        const cell = borderRow.getCell(i);
        cell.border = {
          top: { style: "medium", color: { argb: "FF000000" } },
        };
      }
      worksheet.columns = [
        { width: 35 },
        { width: 15 },
        { width: 25 },
        { width: 25 },
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

      worksheet.mergeCells("C4:C4");
      const startDateCell = worksheet.getCell("C4");
      startDateCell.value = `Start Date: ${startDate}`;
      startDateCell.font = { size: 12 };
      startDateCell.alignment = { vertical: "middle", horizontal: "right" };

      worksheet.mergeCells("D4:D4");
      const endDateCell = worksheet.getCell("D4");
      endDateCell.value = `End Date: ${endDate}`;
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

      tableData.forEach((item) => {
        const row = worksheet.addRow([
          item.Department,
          item.Mcs,
          item.InstalledLoad,
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
        });
      });

      const totalRow = worksheet.addRow([
        "Total Load",
        "",
        "",
        totalConsumption,
      ]);
      totalRow.font = { bold: true };
      totalRow.alignment = { vertical: "middle" };
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
        "No. of Spindles",
        "",
        "",
        unit === "Unit_4"
          ? unit4Spindle
          : unit === "Unit_5"
          ? unit5Spindle
          : "",
      ]);
      spindleRow.font = { bold: true };
      spindleRow.alignment = { vertical: "middle" };
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
              {tableData.map((row) => (
                <tr
                  key={row.Department}
                  className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400"
                >
                  <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                    {row.Department}
                  </td>
                  <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                    {row.Mcs}
                  </td>
                  <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                    {row.InstalledLoad}
                  </td>
                  <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                    {row.ConsumedUnits}
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
