"use client";
import React, { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import { mainMeterMapping } from "@/data/mainMeterMapping";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HiMiniChevronDown } from "react-icons/hi2";
import { IoChevronUp } from "react-icons/io5";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import config from "@/constant/apiRouteList";
import { useTheme } from "next-themes";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { Tooltip } from "@mui/material";

import CustomTrendChart from "@/components/trendsComponents/CustomTrendsChart";

import ReusableTrendChart from "@/components/trendsComponents/NewTestingChart";

function CustomTrend() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [area, setArea] = useState("");
  const [selectedMeter, setSelectedMeter] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfBtn, setShowPdfBtn] = useState(false);
  const buttonRef = useRef(null);
  const measureRef = useRef(null);
  const { theme } = useTheme();
  const [displayText, setDisplayText] = useState("Select Meters");
  const meterDropdownRef = useRef();
  const parameterDropdownRef = useRef();
  const areaOptions = [
    {
      id: 0,
      label: "Select Area",
      value: "",
    },
    {
      id: 1,
      label: "HFO",
      value: "HFO",
    },
    {
      id: 2,
      label: "Unit 4 HT Room",
      value: "HT_Room1",
    },
    {
      id: 3,
      label: "Unit 5 HT Room",
      value: "HT_Room2",
    },
    {
      id: 4,
      label: "UNIT 4 LT 1",
      value: "Unit 4 LT_1",
    },
    {
      id: 5,
      label: "UNIT 4 LT 2",
      value: "Unit 4 LT_2",
    },
    {
      id: 6,
      label: "UNIT 5 LT 1",
      value: "Unit 5 LT_1",
    },
    {
      id: 7,
      label: "UNIT 5 LT 2",
      value: "Unit 5 LT_2",
    },
  ];

  //============== unique color generation ==========================

  function transformData(rawResponse, mainMeterMapping) {
    return rawResponse.map((item) => {
      const transformedItem = {
        Date: item.timestamp.split(".")[0],
        Time: item.timestamp.split("T")[1].split(".")[0], // HH:MM:SS
      };

      // Go through each key in the response
      Object.keys(item).forEach((key) => {
        if (key === "timestamp") return;

        // Find if this key starts with any meterId from mapping
        const matchedMeter = mainMeterMapping.find((meter) =>
          key.startsWith(meter.meterId)
        );

        if (matchedMeter) {
          // Replace meterId with meterName
          transformedItem[matchedMeter.meterName] = item[key];
        }
      });

      return transformedItem;
    });
  }

  //============== unique color generation ==========================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        meterDropdownRef.current &&
        !meterDropdownRef.current.contains(event.target)
      ) {
        setShowMeters(false);
      }
      if (
        parameterDropdownRef.current &&
        !parameterDropdownRef.current.contains(event.target)
      ) {
        setShowParameters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const parameterMapping = {
    "Delivered Active Energy (kWh)": "Del_ActiveEnergy",
    "Active Power Total (kW)": "ActivePower_Total",
    "Current A (Amp)": "Current_A",
    "Current B (Amp)": "Current_B",
    "Current C (Amp)": "Current_C",
    "Current Average (Amp)": "Current_Avg",
    "Voltage AB (Volt)": "Voltage_AB",
    "Voltage BC (Volt)": "Voltage_BC",
    "Voltage CA (Volt)": "Voltage_CA",
    "Voltage Average (Volt)": "Voltage_Avg",
    "Voltage AN (Volt)": "Voltage_AN",
    "Voltage BN (Volt)": "Voltage_BN",
    "Voltage CN (Volt)": "Voltage_CN",
    "Voltage LN Average (Volt)": "Voltage_LN_Avg",
    "Power Factor A": "PowerFactor_A",
    "Power Factor B": "PowerFactor_B",
    "Power Factor C": "PowerFactor_C",
    "Power Factor Average": "PowerFactor_Avg",
    "Power Phase A": "Power_Phase_A",
    "Power Phase B": "Power_Phase_B",
    "Power Phase C": "Power_Phase_C",
    "Reactive Power Total (kVAR)": "ReactivePower_Total",
    "Apparent Power Total (kVA)": "ApparentPower_Total",
    "Harmonics V1 THD (%)": "Harmonics_V1_THD",
    "Harmonics V2 THD (%)": "Harmonics_V2_THD",
    "Harmonics V3 THD (%)": "Harmonics_V3_THD",
    "Harmonics I1": "Harmonics_I1_THD",
    "Harmonics I2": "Harmonics_I2_THD",
    "Harmonics I3": "Harmonics_I3_THD",
    "Active Energy Export": "ActiveEnergy_Exp_kWh",
  };

  const newFilteredMeters = mainMeterMapping.filter(
    (meter) => meter.area === area
  );

  const parameters = Object.keys(parameterMapping);

  const handleMeterSelection = (meter) => {
    setSelectedMeter((prev) => {
      if (prev.includes(meter)) {
        return prev.filter((m) => m !== meter);
      } else {
        if (prev.length >= 8) {
          Swal.fire({
            icon: "error",
            title: "Warning!",
            text: "You can select a maximum of 8 meters.",
            theme: theme,
            width: "400px",
            height: "auto",
          });
          return prev;
        }
        return [...prev, meter];
      }
    });
  };

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      area &&
      selectedMeter.length > 0 &&
      selectedParameter
    ) {
      const meterIds = selectedMeter.join(",");

      const suffixes = parameterMapping[selectedParameter];

      const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setLoading(true);

        try {
          const response = await fetch(`${config.BASE_URL}${config.TRENDS}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              start_date: startDate,
              end_date: endDate,
              meterId: meterIds,
              suffixes: suffixes,
              area: area,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch trend data: ${response.statusText}`
            );
          }

          const data = await response.json();
          setChartData(transformData(data, mainMeterMapping));
          setLoading(false);
          setShowPdfBtn(true);

          // Format the data
          const formatted = data.map((item) => {
            const point = {
              Date: new Date(item.timestamp),
              Time: new Date(item.timestamp).toLocaleTimeString(),
            };

            selectedMeter.forEach((m) => {
              const meterObj = mainMeterMapping.find(
                (meter) => meter.meterName === m
              );
              if (meterObj) {
                const key = `${meterObj.meterName}_${suffixes}`;
                point[m] =
                  item[key] !== undefined && item[key] !== null
                    ? parseFloat(item[key]).toFixed(2)
                    : null;
              }
            });

            return point;
          });

          if (
            formatted.length === 0 ||
            !formatted.some((d) => Object.values(d).some((v) => v !== null))
          ) {
            console.warn("No valid data available for the selected criteria");
            // setChartData([]);
          }
          // else {
          //   setChartData(formatted);
          // }
        } catch (err) {
          console.error("Error fetching trend data:", err);
          setLoading(false);
          // setChartData([]);
        }
      };

      fetchData();
    } else {
      // setChartData([]);
    }
  }, [startDate, endDate, area, selectedMeter, selectedParameter]);

  useEffect(() => {
    if (!buttonRef.current || !measureRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth - 40; // space for icon
    const meterNames = selectedMeter
      .map(
        (id) => newFilteredMeters.find((m) => m.meterId === id)?.meterName || id
      )
      .filter(Boolean);

    if (meterNames.length === 0) {
      setDisplayText("Select Meters");
      return;
    }

    let text = "";
    let finalText = "";

    for (let i = 0; i < meterNames.length; i++) {
      const next = text ? `${text}, ${meterNames[i]}` : meterNames[i];
      measureRef.current.textContent = next;

      if (measureRef.current.offsetWidth > buttonWidth) {
        finalText = text + (i < meterNames.length ? ", ..." : "");
        break;
      }

      text = next;
      finalText = text;
    }

    setDisplayText(finalText);
  }, [selectedMeter, newFilteredMeters, showMeters]);

  // 🔄 Handle window resize to recalc
  useEffect(() => {
    const handleResize = () => {
      setDisplayText("Select Meters"); // force recalc
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //------------------excel export--------------------------

  const exportToExcel = async () => {
    if (chartData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No data to export!",
        theme: theme,
      });
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Trend Data");

      // ✅ Hide default grid lines
      worksheet.properties.defaultGridColor = false;
      worksheet.views = [{ showGridLines: false }];

      // ✅ Format chartData (Date split only, Time w/o seconds)
      const headers = Object.keys(chartData[0] || {});
      const exportData = chartData.map((row) => {
        const newRow = {};
        headers.forEach((key) => {
          if (key === "Date") newRow[key] = row[key]?.split("T")[0] || "";
          else if (key === "Time") newRow[key] = row[key]?.slice(0, 5) || "";
          else newRow[key] = row[key] ?? "";
        });
        return newRow;
      });

      const columnCount = headers.length;

      // === HEADER SECTION ===
      worksheet.getRow(1).height = 40; // logos
      worksheet.getRow(2).height = 2; // separator line
      worksheet.getRow(3).height = 25; // trend + period
      worksheet.getRow(4).height = 30; // header

      // ✅ Add logos (left/right)
      const surajLogo = await fetch("/suraj-cotton-logo-reports.png")
        .then((res) => res.blob())
        .then((b) => b.arrayBuffer());
      const jahaannLogo = await fetch("/jahaann-light.png")
        .then((res) => res.blob())
        .then((b) => b.arrayBuffer());

      const surajImageId = workbook.addImage({
        buffer: surajLogo,
        extension: "png",
      });
      const jahaannImageId = workbook.addImage({
        buffer: jahaannLogo,
        extension: "png",
      });

      worksheet.mergeCells(1, 1, 1, columnCount);
      worksheet.addImage(surajImageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 90, height: 40 },
      });
      worksheet.addImage(jahaannImageId, {
        tl: { col: columnCount - 1, row: 0 },
        ext: { width: 120, height: 40 },
        editAs: "oneCell",
      });

      // ✅ Blue line below logos
      worksheet.mergeCells(2, 1, 2, columnCount);
      worksheet.getCell(2, 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D5999" },
      };

      // === TITLE ROW (Trend Data left, Period right) ===
      worksheet.mergeCells(3, 1, 3, Math.ceil(columnCount / 2));
      worksheet.mergeCells(3, Math.ceil(columnCount / 2) + 1, 3, columnCount);
      const trendCell = worksheet.getCell(3, 1);
      const periodCell = worksheet.getCell(3, Math.ceil(columnCount / 2) + 1);

      trendCell.value = `Trend Data: ${selectedParameter}`;
      periodCell.value = `Time-Period: ${startDate} to ${endDate}`;
      trendCell.font = { bold: true, size: 11, color: { argb: "FF1D5999" } };
      periodCell.font = { bold: true, size: 11, color: { argb: "FF1D5999" } };
      trendCell.alignment = { horizontal: "left", vertical: "middle" };
      periodCell.alignment = { horizontal: "right", vertical: "middle" };

      worksheet.getRow(3).eachCell((cell) => {
        cell.border = {
          bottom: { style: "thin", color: { argb: "FF1D5999" } },
        };
      });

      // === TABLE HEADER ROW ===
      const headerRow = worksheet.getRow(4);
      headerRow.values = headers;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        }; // wrap text
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1D5999" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFB0B0B0" } }, // gray borders
          bottom: { style: "thin", color: { argb: "FFB0B0B0" } },
          left: { style: "thin", color: { argb: "FFB0B0B0" } },
          right: { style: "thin", color: { argb: "FFB0B0B0" } },
        };
      });

      // ✅ DATA ROWS
      exportData.forEach((row) => {
        const dataRow = worksheet.addRow(Object.values(row));
        dataRow.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin", color: { argb: "FFB0B0B0" } },
            bottom: { style: "thin", color: { argb: "FFB0B0B0" } },
            left: { style: "thin", color: { argb: "FFB0B0B0" } },
            right: { style: "thin", color: { argb: "FFB0B0B0" } },
          };
        });
      });

      // ✅ Set column widths
      worksheet.columns = headers.map(() => ({ width: 20 }));

      // === DOWNLOAD FILE ===
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `trend_data_${selectedParameter}_${startDate}_to_${endDate}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "An error occurred while exporting to Excel",
        theme: theme,
      });
    }
  };

  //------------------export to  PDF--------------------------
  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.warn("pdfMake vfs fonts not found.");
  }

  const exportToPDF = async () => {
    if (chartData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No data to export!",
        theme: theme,
      });
      return;
    }

    // ✅ Prepare headers dynamically based on chartData keys
    const headers = Object.keys(chartData[0] || {});
    const tableBody = [];

    // ✅ Add header row first
    tableBody.push(headers.map((h) => ({ text: h, style: "tableHeader" })));

    // ✅ Format and add rows
    chartData.forEach((row) => {
      const rowData = headers.map((key) => {
        if (key === "Date") {
          // Show date as plain string, not through new Date()
          return row[key]?.split("T")[0] || "";
        } else if (key === "Time") {
          // Show only hours and minutes
          return row[key]?.slice(0, 5) || "";
        } else {
          return row[key] ?? "";
        }
      });
      tableBody.push(rowData);
    });

    // ✅ Load logos as Base64
    const surajCottonBase64Logo = await loadImageAsBase64(
      "/suraj-cotton-logo-reports.png"
    );
    const jahaannBase64Logo = await loadImageAsBase64("/jahaann-light.png");

    // ✅ Define PDF document
    const docDefinition = {
      pageOrientation: "landscape",
      content: [
        {
          columns: [
            { image: "surajcottonLogo", width: 80, alignment: "left" },
            { text: "", width: "*" },
            { image: "jahaannLogo", width: 100, alignment: "right" },
          ],
          columnGap: 10,
          margin: [0, 0, 0, 0],
        },
        {
          table: {
            widths: ["*"],
            body: [[""]],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 0,
            hLineColor: () => "#1D5999",
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
          margin: [0, 0, 0, 10], // spacing below line
        },
        {
          columns: [
            {
              // 🔹 Use selectedParameter here instead of unitForExportFile
              text: `Trend Data: ${selectedParameter || "-"}`,
              style: "header",
              alignment: "left",
            },
            {
              text: `Time-Period: ${startDate} to ${endDate}`,
              style: "subheader",
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          // ✅ Updated table with dynamic headers and formatted values
          table: {
            headerRows: 1,
            widths: Array(headers.length).fill("*"),
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#494848" : null),
            hLineColor: () => "#B0B0B0",
            vLineColor: () => "#B0B0B0",
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: "#1D5999",
        },
        subheader: {
          fontSize: 12,
          bold: true,
          color: "#1D5999",
        },
        tableHeader: {
          bold: true,
          color: "white",
          fillColor: "#1D5999",
          alignment: "center",
        },
      },
      defaultStyle: {
        fontSize: 10,
        alignment: "center",
      },
      images: {
        surajcottonLogo: surajCottonBase64Logo,
        jahaannLogo: jahaannBase64Logo,
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `trend_data_${selectedParameter}_${startDate}_to_${endDate}.pdf`
      );
  };
  console.log(chartData);
  return (
    <div className="relative bg-white shadow dark:bg-gray-800 rounded-md border-t-3 border-[#025697] overflow-y-auto h-[87vh] md:h-[81vh] px-4 py-3">
      <div className="relative z-10 h-full flex flex-col">
        <h1 className="text-lg font-bold mb-4 font-raleway text-[#1F5897] dark:text-[#D1D5DB]">
          Customized Trend
        </h1>
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <div className="w-full lg:w-[17.5%]">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-[17.5%]">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-[21%]">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Select Area
            </label>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setSelectedMeter([]);
                setChartData([]);
              }}
              className="w-full p-2 border rounded"
            >
              {areaOptions.map((area) => (
                <option
                  key={area.id}
                  value={area.value}
                  className="dark:text-gray-300 dark:bg-gray-800"
                >
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          <div ref={meterDropdownRef} className="relative w-full lg:w-[21%]">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Select Meters
            </label>

            {/* Dropdown button */}
            <button
              ref={buttonRef}
              onClick={() => setShowMeters(!showMeters)}
              className="w-full p-2 border rounded text-left cursor-pointer bg-white dark:bg-gray-800 relative overflow-hidden"
            >
              <span className="truncate">{displayText}</span>

              <span className="absolute right-2 top-2">
                {showMeters ? (
                  <IoChevronUp size={20} className="font-bold" />
                ) : (
                  <HiMiniChevronDown size={25} className="font-bold" />
                )}
              </span>

              {/* Hidden measuring element */}
              <span
                ref={measureRef}
                className="absolute whitespace-nowrap invisible pointer-events-none"
              ></span>
            </button>

            {showMeters && (
              <div className="absolute bg-white dark:bg-gray-800 border shadow z-10 w-full max-h-48 overflow-y-auto dark:text-gray-300">
                {newFilteredMeters.length === 0 ? (
                  <div className="p-2 text-gray-400 dark:text-gray-300">
                    No meters available
                  </div>
                ) : (
                  newFilteredMeters.map((meter) => (
                    <label
                      key={meter.meterId}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        value={meter.meterId}
                        checked={selectedMeter.includes(meter.meterId)}
                        onChange={() => handleMeterSelection(meter.meterId)}
                        className="mr-2"
                      />
                      {meter.meterName}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div
            ref={parameterDropdownRef}
            className="relative w-full lg:w-[23%]"
          >
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Select Parameter
            </label>
            <button
              onClick={() => setShowParameters(!showParameters)}
              className="w-full p-2 border rounded text-left cursor-pointer bg-white dark:bg-gray-800"
            >
              {selectedParameter || "Select Parameter"}
              <span className="float-right">
                {showParameters ? (
                  <IoChevronUp size={20} className="font-bold" />
                ) : (
                  <HiMiniChevronDown size={25} className="font-bold" />
                )}
              </span>
            </button>
            {showParameters && (
              <div className="absolute z-30 bg-white dark:bg-gray-800 border shadow z-10 w-full max-h-48 overflow-y-auto">
                {parameters.map((param) => (
                  <label
                    key={param}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="parameter"
                      value={param}
                      checked={selectedParameter === param}
                      onChange={(e) => {
                        setSelectedParameter(e.target.value);
                        setShowParameters(false);
                      }}
                      className="mr-2"
                    />
                    {param}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        {newFilteredMeters.length <= 0 ? (
          <div className="w-full flex flex-col items-center justify-center h-full">
            <img src="../../../trend_icon.png" width={250} alt="" />
            <span className="text-[13px] text-gray-300 dark:text-gray-500">
              Select Desired Filters to view Trend!
            </span>
          </div>
        ) : (
          <div className="flex-1 w-full">
            {loading === true ? (
              <CustomLoader />
            ) : (
              <div className="relative">
                {chartData.length > 0 && (
                  <div
                    className="absolute z-20 top-[-12px] right-13 items-center group"
                    style={{
                      display: !showPdfBtn ? "none" : "flex",
                    }}
                  >
                    <Tooltip
                      title={"Export PDF"}
                      arrow
                      placement="bottom-end"
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#D81F26",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 500,
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#D81F26",
                          },
                        },
                      }}
                    >
                      <button
                        onClick={exportToPDF}
                        className="p-1 rounded ml-2 bg-gray-300 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <FaRegFilePdf className="w-5 h-5 text-[#D81F26]" />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title={"Export EXCEL"}
                      arrow
                      placement="bottom-end"
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#217346",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 500,
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#217346",
                          },
                        },
                      }}
                    >
                      <button
                        onClick={exportToExcel}
                        className="ml-3 p-1 rounded bg-gray-300 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <FaRegFileExcel className="w-5 h-5 text-[#217346]" />
                      </button>
                    </Tooltip>
                  </div>
                )}

                <CustomTrendChart
                  data={chartData}
                  yAxisLabel={selectedParameter}
                />

                {/* <ReusableTrendChart
                  yAxisTitle={selectedParameter}
                  data={chartData}
                /> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomTrend;
