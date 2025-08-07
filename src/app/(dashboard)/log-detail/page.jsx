"use client";
import config from "@/constant/apiRouteList";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import CustomLoader from "@/components/customLoader/CustomLoader";
import Swal from "sweetalert2";

const LogDetails = () => {
  const [meterLogsData, setMeterLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const searchParams = useSearchParams();
  const type = searchParams.get("val");
  const meter_id = searchParams.get("meter_id");
  const meterName = searchParams.get("meter-name");
  const router = useRouter();

  const getMeterLogsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.LOGS_DATA}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            meters: meter_id,
            start_date: startDate,
            end_date: endDate,
          }),
        }
      );

      if (response.ok) {
        const resResult = await response.json();
        setMeterLogsData(resResult.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch logs:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    getMeterLogsData();
  }, [startDate, endDate]);

  const columns = Array.from(
    new Set(
      meterLogsData
        .flatMap((row) => Object.keys(row))
        .filter((key) => key !== "meterId")
    )
  );

  const getImageBuffer = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return await blob.arrayBuffer();
  };

  const exportToExcel = async () => {
    if (meterLogsData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No data to export!",
      });
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Meter Logs");
      worksheet.properties.defaultGridColor = false;
      worksheet.views = [{ showGridLines: false }];

      // Get image buffers
      const image1Buffer = await getImageBuffer(
        "../../../suraj-cotton-logo.png"
      );
      const image2Buffer = await getImageBuffer("../../../jahaann-light.svg");

      // Add images
      const image1Id = workbook.addImage({
        buffer: image1Buffer,
        extension: "png",
      });
      const image2Id = workbook.addImage({
        buffer: image2Buffer,
        extension: "svg",
      });

      // Dynamically determine column count
      const exportData = meterLogsData.map((row) => {
        const newRow = {};
        columns.forEach((col) => {
          if (col === "time") {
            const date = new Date(row[col]);
            newRow["Date"] = date.toLocaleDateString("en-GB");
            newRow["Time"] = date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          } else {
            newRow[col.replace(/_/g, " ")] =
              typeof row[col] === "number"
                ? Math.abs(row[col]) > 1e9
                  ? 0
                  : Math.round(row[col] * 100) / 100
                : row[col] == null
                ? 0
                : row[col];
          }
        });
        return newRow;
      });

      const columnNames = Object.keys(exportData[0]);
      const columnCount = columnNames.length;

      // === Add images ===
      worksheet.addImage(image1Id, {
        tl: { col: 0, row: 0 },
        ext: { width: 120, height: 50 },
      });

      // Dynamically place second image at last column
      worksheet.addImage(image2Id, {
        tl: { col: columnCount - 1, row: 0.5 },
        ext: { width: 130, height: 30 },
      });

      // === Add Titles and Header Row ===
      worksheet.getRow(1).height = 32;
      worksheet.getRow(2).height = 30;
      worksheet.getRow(3).height = 30;
      // worksheet.getRow(4).height = 30;
      for (let i = 1; i <= columnCount; i++) {
        worksheet.getCell(1, i).border = {
          bottom: { style: "thin", color: { argb: "FF000000" } },
        };
      }

      worksheet.mergeCells(1, 1, 1, columnCount);
      // worksheet.mergeCells(2, 1, 2, columnCount);
      worksheet.mergeCells(2, 1, 2, Math.floor(columnCount / 2));
      const title1 = worksheet.getCell(2, 1);
      title1.value = `Meter Name: ${meterName?.toUpperCase()}`;
      title1.font = { bold: false, size: 16, color: { argb: "000000" } };
      title1.alignment = { horizontal: "left", vertical: "middle" };

      worksheet.mergeCells(2, Math.floor(columnCount / 2) + 1, 2, columnCount);
      const title2 = worksheet.getCell(2, Math.floor(columnCount / 2) + 1);
      title2.value = `Log Type: ${type?.toUpperCase()}`;
      title2.font = { bold: false, size: 13, color: { argb: "000000" } };
      title2.alignment = { horizontal: "right", vertical: "middle" };

      for (let i = 1; i <= columnCount; i++) {
        worksheet.getCell(2, i).border = {
          bottom: { style: "thin", color: { argb: "FF3A83C6" } },
        };
      }

      // === Header row ===
      const headerRow = worksheet.getRow(3);
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

      // === Add data rows ===
      exportData.forEach((row) => {
        const dataRow = worksheet.addRow(Object.values(row));
        dataRow.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin", color: { argb: "cedef0" } },
            bottom: { style: "thin", color: { argb: "cedef0" } },
            left: { style: "thin", color: { argb: "cedef0" } },
            right: { style: "thin", color: { argb: "cedef0" } },
          };
        });
      });

      worksheet.columns = columnNames.map(() => ({ width: 20 }));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `meter_logs_${meterName}_${type}_${startDate}_to_${endDate}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "An error occurred while exporting to Excel",
      });
    }
  };

  return (
    <div className="h-[81vh]  custom-scrollbar-report overflow-y-auto bg-white dark:bg-gray-800 border-t-3 border-[#1D5999] rounded-md px-5 py-2">
      <h1 className="font-700 font-inter text-[24px]">
        Meter Logs - <span className="uppercase text-[#1D5999]">{type}</span>
      </h1>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center justify-start gap-5">
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endtDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={exportToExcel}
            className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#22C35D] to-[#15813D] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer"
          >
            Export excel
          </button>
          <button
            onClick={() => router.back()}
            className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#989FAC] to-[#4E5765] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <CustomLoader />
        ) : (
          <div className="rounded border border-gray-300">
            <div className="max-full">
              <table className="w-full border-collapse table-fixed">
                <thead className=" text-white sticky top-[-9] z-10">
                  <tr className="bg-[#1D5999] border-t-2 border-[#1D5999]">
                    {columns.flatMap((col, index) => {
                      if (col === "time") {
                        return [
                          <th
                            key={`date-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            Date
                          </th>,
                          <th
                            key={`time-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            Time
                          </th>,
                        ];
                      } else {
                        return (
                          <th
                            key={`col-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            {col.replace(/_/g, " ")}
                          </th>
                        );
                      }
                    })}
                  </tr>
                </thead>
                <tbody>
                  {meterLogsData.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {columns.map((col, colIdx) =>
                        col === "time" ? (
                          [
                            <td
                              key={`${rowIdx}-date-${colIdx}`}
                              className="border border-gray-200 px-3 py-1 text-center text-sm"
                            >
                              {new Date(row[col]).toLocaleDateString("en-GB")}
                            </td>,
                            <td
                              key={`${rowIdx}-time-${colIdx}`}
                              className="border border-gray-200 px-3 py-1 text-center text-sm"
                            >
                              {new Date(row[col]).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>,
                          ]
                        ) : (
                          <td
                            key={`${rowIdx}-${col}-${colIdx}`}
                            className="border border-gray-200 px-3 py-1 text-center text-sm"
                          >
                            {typeof row[col] === "number"
                              ? Math.abs(row[col]) > 1e9
                                ? 0
                                : Math.round(row[col] * 100) / 100
                              : row[col] == null
                              ? 0
                              : row[col]}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDetails;
