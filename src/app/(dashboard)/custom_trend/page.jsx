"use client";
import React, { useState, useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import ExcelJS from "exceljs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HiMiniChevronDown } from "react-icons/hi2";
import { IoChevronUp } from "react-icons/io5";
import { saveAs } from "file-saver";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Swal from "sweetalert2";
import config from "@/constant/apiRouteList";
import { useTheme } from "next-themes";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { LuFileUp } from "react-icons/lu";
import { loadImageAsBase64 } from "@/utils/imageToBase64";
function CustomTrend() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [area, setArea] = useState("");
  const [lt, setLt] = useState("");
  const [selectedMeter, setSelectedMeter] = useState([""]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitForExportFile, setUnitForExportFile] = useState("");
  const [showPdfBtn, setShowPdfBtn] = useState(false);

  const { theme } = useTheme();

  const meterDropdownRef = useRef();
  const parameterDropdownRef = useRef();

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    handleThemeChange();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleThemeChange);
  }, []);

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

  const meterMapping = {
    Transport: "U1_PLC",
    "Unit 05 Aux": "U2_PLC",
    "Light External": "U3_PLC",
    "Light Internal": "U4_PLC",
    "Power House 2nd Source": "U5_PLC",
    Turbine: "U6_PLC",
    "Spare (PLC)": "U7_PLC",
    "Drawing 01": "U8_PLC",
    "Winding 01(PLC)": "U9_PLC",
    "Ring 01": "U10_PLC",
    "Ring 5": "U11_PLC",
    "Ring 6(Auto Cone 1-9)": "U12_PLC",
    "Comber 1": "U13_PLC",
    Compressor: "U14_PLC",
    "Simplex 01": "U15_PLC",
    "Compressor 02 (90kW)": "U16_PLC",
    "Ring AC": "U17_PLC",
    "Ring AC (Bypass)": "U18_PLC",
    "Diesel + Gas Incoming": "U19_PLC",
    "Compressor (Bypass)": "U20_PLC",
    "Wapda + HFO + Gas Incoming (PLC)": "U21_PLC",
    "Drying Simplex AC": "U1_GW01",
    "Weikel Conditioning Machine": "U2_GW01",
    "Winding AC": "U3_GW01",
    "Mills RES-CLNY & Workshop": "U4_GW01",
    "Card 1": "U5_GW01",
    Colony: "U6_GW01",
    "Power House and Source": "U7_GW01",
    "Blow Room": "U8_GW01",
    "Card 2": "U9_GW01",
    "Winding 01 (GW)": "U10_GW01",
    "Gas LT Panel": "U11_GW01",
    "Card Filter (Bypass)": "U12_GW01",
    "Wapda + HFO + Gas Incoming (GW01)": "U13_GW01",
    "D/R Card Filter": "U14_GW01",
    "Ring 02 (Auto Cone 10-18)": "U15_GW01",
    "Ring 04": "U16_GW01",
    "Ring 03": "U17_GW01",
    "Bale Press": "U18_GW01",
    "AC Lab": "U19_GW01",
    "Spare 01 (GW01)": "U20_GW01",
    "Spare 02 (GW01)": "U21_GW01",
    "HFO Incoming": "U22_GW01",
    "Wapda 1 Incoming": "U23_GW01",
    // Meters for Unit 5 LT1
    "PDB CD1": "U1_GW02",
    "PDB CD2": "U2_GW02",
    "Card PDB 01": "U3_GW02",
    "PDB 8": "U4_GW02",
    "PF Panel 1": "U5_GW02",
    Solar: "U6_GW02",
    "Ring 1-3": "U7_GW02",
    "A/C Plant Spinning (GW02-1)": "U8_GW02",
    "Blow Room L1": "U9_GW02",
    "Ring Frames 4-6": "U10_GW02",
    "A/C Plant Blowing": "U11_GW02",
    "MLDB1 Blower Room Card": "U12_GW02",
    "Transformer 1 LT-1 ACB": "U13_GW02",
    "Spare (GW02)": "U14_GW02",
    "A/C Plant Spinning (GW02-2)": "U15_GW02",
    "Water Chiller": "U16_GW02",
    "Card M/C 8-14": "U17_GW02",
    "Auto Con-link Conner 1-9": "U18_GW02",
    "Card M/C 1-7": "U19_GW02",
    "AC Plant Winding": "U20_GW02",
    "Simplex M/C S1-5": "U21_GW02",
    "Spare (GW02-2)": "U22_GW02",
    "Draw Frame Finish": "U23_GW02",
    // Meters for Unit 5 LT2
    "Ring Frame 7-9": "U1_GW03",
    "Yarn Conditioning M/C": "U2_GW03",
    "MLDB3 Single Room Quarter": "U3_GW03",
    "Roving Transport System": "U4_GW03",
    "Ring Frame 10-12": "U5_GW03",
    "Comber MCS 1-14": "U6_GW03",
    "Spare (GW03)": "U7_GW03",
    "Spare2 (GW03)": "U8_GW03",
    "Ring Frame 13-15": "U9_GW03",
    "Auto Con-linker Conner M/S 10-12": "U10_GW03",
    "Baling Press": "U11_GW03",
    "Ring Frame 16-18": "U12_GW03",
    "Fiber Deposit Plant": "U13_GW03",
    "MLDB2 Ring Con": "U14_GW03",
    "Deep Valve Turbine": "U15_GW03",
    "Transformer 2 LT-2 ACB": "U16_GW03",
    "Solar 2": "U17_GW03",
    "PF Panel 2": "U18_GW03",
    "Wapda + HFO + Gas Incoming (GW03)": "U21_GW03",
    "WAPDA + HFO + Gas Outgoing T/F 3": "U20_GW03",
    "WAPDA + HFO + Gas Outgoing T/F 4": "U19_GW03",
    "PDB 07": "U22_GW03",
    "PDB 10": "U23_GW03",
  };

  const parameterMapping = {
    "Del Active Energy": "Del_ActiveEnergy",
    "Active Power Total": "ActivePower_Total",
    "Current A": "Current_A",
    "Current B": "Current_B",
    "Current C": "Current_C",
    "Current Avg": "Current_Avg",
    "Voltage AB": "Voltage_AB",
    "Voltage BC": "Voltage_BC",
    "Voltage CA": "Voltage_CA",
    "Voltage Avg": "Voltage_Avg",
    "Voltage AN": "Voltage_AN",
    "Voltage BN": "Voltage_BN",
    "Voltage CN": "Voltage_CN",
    "Voltage LN Avg": "Voltage_LN_Avg",
    "Power Factor A": "PowerFactor_A",
    "Power Factor B": "PowerFactor_B",
    "Power Factor C": "PowerFactor_C",
    "Power Factor Avg": "PowerFactor_Avg",
    "Reactive Power Total": "ReactivePower_Total",
    "Apparent Power Total": "ApparentPower_Total",
    "Harmonics V1": "Harmonics_V1_THD",
    "Harmonics V2": "Harmonics_V2_THD",
    "Harmonics V3": "Harmonics_V3_THD",
  };

  let filteredMeters = [];
  if (area === "Unit 4") {
    const allMeters = Object.keys(meterMapping);
    const lt1Meters = allMeters.filter((key) =>
      meterMapping[key].endsWith("PLC")
    );
    const lt2Meters = allMeters.filter((key) =>
      meterMapping[key].endsWith("GW01")
    );

    if (lt === "LT_1") {
      filteredMeters = lt1Meters;
    } else if (lt === "LT_2") {
      filteredMeters = lt2Meters;
    } else if (lt === "ALL") {
      filteredMeters = [...lt1Meters, ...lt2Meters];
    }
  } else if (area === "Unit 5") {
    const allMeters = Object.keys(meterMapping);
    const lt1Meters = allMeters.filter((key) =>
      meterMapping[key].endsWith("GW02")
    );
    const lt2Meters = allMeters.filter((key) =>
      meterMapping[key].endsWith("GW03")
    );

    if (lt === "LT_3") {
      filteredMeters = lt1Meters;
    } else if (lt === "LT_4") {
      filteredMeters = lt2Meters;
    } else if (lt === "ALL") {
      filteredMeters = [...lt1Meters, ...lt2Meters];
    }
  }

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
      lt &&
      selectedMeter.length > 0 &&
      selectedParameter
    ) {
      const meterIds = selectedMeter.map((m) => meterMapping[m]).join(",");
      const suffixes = parameterMapping[selectedParameter];

      const fetchData = async (ltSelection) => {
        setLoading(true);

        const response = await fetch(`${config.BASE_URL}${config.TRENDS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            meterId: meterIds,
            suffixes: suffixes,
            area: area,
            LT_selections: ltSelection,
          }),
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch trend data for ${ltSelection}: ${response.statusText}`
          );
        }
        setLoading(false);
        setShowPdfBtn(true);
        return response.json();
      };

      const fetchAllData = async () => {
        try {
          let data = [];
          if (lt === "ALL" && area === "Unit 5") {
            const [lt1Data, lt2Data] = await Promise.all([
              fetchData("LT_1"),
              fetchData("LT_2"),
            ]);
            data = [...lt1Data, ...lt2Data];
          } else {
            data = await fetchData(lt);
          }
          const formatted = data.map((item) => {
            // const point = { timestamp: new Date(item.timestamp) };
            const point = {
              Date: new Date(item.timestamp),
              Time: new Date(item.timestamp).toLocaleTimeString(),
            };
            selectedMeter.forEach((m) => {
              const key = `${meterMapping[m]}_${suffixes}`;

              point[m] =
                item[key] !== undefined
                  ? parseFloat(item[key]).toFixed(2) || null
                  : null;
            });

            return point;
          });
          if (
            formatted.length === 0 ||
            !formatted.some((d) => Object.values(d).some((v) => v !== null))
          ) {
            console.warn("No valid data available for the selected criteria");
            setChartData([]);
          } else {
            setChartData(formatted);
          }
        } catch (err) {
          console.error("Error fetching trend data:", err);
          setChartData([]);
        }
      };

      fetchAllData();
    } else {
      setChartData([]);
    }
  }, [startDate, endDate, area, lt, selectedMeter, selectedParameter]);

  useEffect(() => {
    if (chartData.length === 0) {
      console.warn("No chart data to render");
      return;
    }

    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create("chartDiv", am4charts.XYChart);
    chart.logo.disabled = true;
    chart.data = chartData;

    const textColor = isDarkMode ? "#ccc" : "#5f5f5f";
    const gridColor = isDarkMode ? "#666" : "#888";

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = { timeUnit: "second", count: 1 };
    dateAxis.renderer.grid.template.stroke = am4core.color(gridColor);
    dateAxis.renderer.labels.template.fill = am4core.color(textColor);

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    const param = selectedParameter.trim().toLowerCase();
    if (param.includes("current a")) {
      valueAxis.title.text = "Current A (Amp)";
    } else if (param.includes("current b")) {
      valueAxis.title.text = "Current B (Amp)";
    } else if (param.includes("current c")) {
      valueAxis.title.text = "Current C (Amp)";
    } else if (param.includes("current avg")) {
      valueAxis.title.text = "Current Average (Amp)";
    } else if (param.includes("del active energy")) {
      valueAxis.title.text = "Delivered Active Energy (kWh)";
    } else if (param.includes("active power total")) {
      valueAxis.title.text = "Active Power Total (kW)";
    } else if (param.includes("voltage ab")) {
      valueAxis.title.text = "Voltage AB (Volt)";
    } else if (param.includes("voltage bc")) {
      valueAxis.title.text = "Voltage BC (Volt)";
    } else if (param.includes("voltage ca")) {
      valueAxis.title.text = "Voltage CA (Volt)";
    } else if (param.includes("voltage avg")) {
      valueAxis.title.text = "Voltage Average (Volt)";
    } else if (param.includes("voltage an")) {
      valueAxis.title.text = "Voltage AN (Volt)";
    } else if (param.includes("voltage bn")) {
      valueAxis.title.text = "Voltage BN (Volt)";
    } else if (param.includes("voltage cn")) {
      valueAxis.title.text = "Voltage CN (Volt)";
    } else if (param.includes("voltage ln avg")) {
      valueAxis.title.text = "Voltage LN Average (Volt)";
    } else if (param.includes("power factor a")) {
      valueAxis.title.text = "Power Factor A";
    } else if (param.includes("power factor b")) {
      valueAxis.title.text = "Power Factor B";
    } else if (param.includes("power factor c")) {
      valueAxis.title.text = "Power Factor C";
    } else if (param.includes("power factor avg")) {
      valueAxis.title.text = "Power Factor Average";
    } else if (param.includes("reactive power total")) {
      valueAxis.title.text = "Reactive Power Total (kVAR)";
    } else if (param.includes("apparent power total")) {
      valueAxis.title.text = "Apparent Power Total (kVA)";
    } else if (param.includes("harmonics v1")) {
      valueAxis.title.text = "Harmonics V1 THD (%)";
    } else if (param.includes("harmonics v2")) {
      valueAxis.title.text = "Harmonics V2 THD (%)";
    } else if (param.includes("harmonics v3")) {
      valueAxis.title.text = "Harmonics V3 THD (%)";
    }
    setUnitForExportFile(valueAxis.title.text);
    valueAxis.title.fill = am4core.color(textColor);
    valueAxis.renderer.grid.template.stroke = am4core.color(gridColor);
    valueAxis.renderer.labels.template.fill = am4core.color(textColor);
    const colorMap = {
      Transport: am4core.color("#FF9933"),
      "Unit 05 Aux": am4core.color("#A569BD"),
      "Light External": am4core.color("#F7DC6F"),
      "Light Internal": am4core.color("#8BC63E"),
      "Power House 2nd Source": am4core.color("#E74C3C"),
      Turbine: am4core.color("#3498DB"),
      "Spare (PLC)": am4core.color("#BDC3C7"),
      "Drawing 01": am4core.color("#000FE6"),
      "Winding 01(PLC)": am4core.color("#680056"),
      "Ring 01": am4core.color("#8BC63E"),
      "Ring 5": am4core.color("#FFCEB0"),
      "Ring 6(Auto Cone 1-9)": am4core.color("#DFB4DA"),
      "Comber 1": am4core.color("#8DFFF0"),
      Compressor: am4core.color("#FF8DB5"),
      "Simplex 01": am4core.color("#27AE60"),
      "Compressor 02 (90kW)": am4core.color("#B2927A"),
      "Ring AC": am4core.color("#4A7A3D"),
      "Ring AC (Bypass)": am4core.color("#2ECC71"),
      "Diesel + Gas Incoming": am4core.color("#000000"),
      "Compressor (Bypass)": am4core.color("#415A77"),
      "Wapda + HFO + Gas Incoming (PLC)": am4core.color("#d9cbd9"),
      "Drying Simplex AC": am4core.color("#9A8C98"),
      "Weikel Conditioning Machine": am4core.color("#0E9594"),
      "Winding AC": am4core.color("#DEE2E6"),
      "Mills RES-CLNY & Workshop": am4core.color("#640D14"),
      "Card 1": am4core.color("#FFC4D6"),
      Colony: am4core.color("#B15E6C"),
      "Power House and Source": am4core.color("#C8B6FF"),
      "Blow Room": am4core.color("#A4AC86"),
      "Card 2": am4core.color("#9B5DE5"),
      "Winding 01 (GW)": am4core.color("#1A5276"),
      "Gas LT Panel": am4core.color("#641E16"),
      "Card Filter (Bypass)": am4core.color("#7FB3D5"),
      "Wapda + HFO + Gas Incoming (GW01)": am4core.color("#ffc107"),
      "D/R Card Filter": am4core.color("#D98880"),
      "Ring 02 (Auto Cone 10-18)": am4core.color("#ADE8F4"),
      "Ring 04": am4core.color("#566573"),
      "Ring 03": am4core.color("#34495E"),
      "Bale Press": am4core.color("#873600"),
      "AC Lab": am4core.color("#16A085"),
      "Spare 01 (GW01)": am4core.color("#AAB7B8"),
      "Spare 02 (GW01)": am4core.color("#D5DBDB"),
      "HFO Incoming": am4core.color("#943126"),
      "Wapda 1 Incoming": am4core.color("#B03A2E"),
      "PDB CD1": am4core.color("#8E44AD"),
      "PDB CD2": am4core.color("#2980B9"),
      "Card PDB 01": am4core.color("#B03A2E"),
      "PDB 8": am4core.color("#D35400"),
      "PF Panel 1": am4core.color("#27AE60"),
      Solar: am4core.color("#F1C40F"),
      "Ring 1-3": am4core.color("#f4a5c4"),
      "A/C Plant Spinning (GW02-1)": am4core.color("#2ECC71"),
      "Blow Room L1": am4core.color("#E67E22"),
      "Ring Frames 4-6": am4core.color("#3498DB"),
      "A/C Plant Blowing": am4core.color("#9dfeab"),
      "MLDB1 Blower Room Card": am4core.color("#F1948A"),
      "Transformer 1 LT-1 ACB": am4core.color("#7D3C98"),
      "Spare (GW02)": am4core.color("#D5DBDB"),
      "A/C Plant Spinning (GW02-2)": am4core.color("#95cea7"),
      "Water Chiller": am4core.color("#F0B27A"),
      "Card M/C 8-14": am4core.color("#F7DC6F"),
      "Auto Con-link Conner 1-9": am4core.color("#9e837a"),
      "Card M/C 1-7": am4core.color("#E74C3C"),
      "AC Plant Winding": am4core.color("#F5B041"),
      "Simplex M/C S1-5": am4core.color("#D35400"),
      "Spare (GW02-2)": am4core.color("#D5DBDB"),
      "Draw Frame Finish": am4core.color("#F0B27A"),
      "Ring Frame 7-9": am4core.color("#c8d0f0"),
      "Yarn Conditioning M/C": am4core.color("#2980B9"),
      "MLDB3 Single Room Quarter": am4core.color("#F39C12"),
      "Roving Transport System": am4core.color("#D35400"),
      "Ring Frame 10-12": am4core.color("#ffa0c5"),
      "Comber MCS 1-14": am4core.color("#B15E6C"),
      "Spare2 (GW03)": am4core.color("#AAB7B8"),
      "Ring Frame 13-15": am4core.color("#8E44AD"),
      "Auto Con-linker Conner M/S 10-12": am4core.color("#c095e4"),
      "Baling Press": am4core.color("#ffe589"),
      "Ring Frame 16-18": am4core.color("#3498DB"),
      "Fiber Deposit Plant": am4core.color("#6c584c"),
      "MLDB2 Ring Con": am4core.color("#F1948A"),
      "Deep Valve Turbine": am4core.color("#f2e1be"),
      "Transformer 2 LT-2 ACB": am4core.color("#ffdd00"),
      "Solar 2": am4core.color("#d2cdc2"),
      "Wapda + HFO + Gas Incoming (GW03)": am4core.color("#E74C3C"),
      "WAPDA + HFO + Gas Outgoing T/F 3": am4core.color("#da44f4"),
      "WAPDA + HFO + Gas Outgoing T/F 4": am4core.color("#5DADE2"),
      "PDB 07": am4core.color("#c3d1e7"),
      "PDB 10": am4core.color("#D35400"),
      "PF Panel 2": am4core.color("#27AE60"),
    };

    if (selectedMeter.length > 0) {
      selectedMeter.forEach((meter) => {
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "Date";
        series.dataFields.valueY = meter;
        series.name = `${meter}`;
        series.stroke = colorMap[meter] || am4core.color("#00eaff");
        series.strokeWidth = 2;
        series.tooltipText = "{dateX}: [b]{valueY.formatNumber('#.##')}[/]";
        series.show();
      });
    }

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.minHeight = 15;
    function customizeGrip(grip) {
      grip.icon.disabled = true;
      grip.background.disabled = true;
      const img = grip.createChild(am4core.Rectangle);
      img.width = 6;
      img.height = 6;
      img.fill = am4core.color("#999");
      img.rotation = 45;
      img.align = "center";
      img.valign = "middle";
      const line = grip.createChild(am4core.Rectangle);
      line.height = 15;
      line.width = 2;
      line.fill = am4core.color("#999");
      line.align = "center";
      line.valign = "middle";
    }
    customizeGrip(chart.scrollbarX.startGrip);
    customizeGrip(chart.scrollbarX.endGrip);
    chart.scrollbarX.scrollbarChart.plotContainer.filters.clear();
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.labels.template.fill = am4core.color(textColor);

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.items = [
      {
        menu: [
          {
            label: "PNG",
            type: "png",
          },
          {
            label: "JPG",
            type: "jpg",
          },
          {
            label: "SVG",
            type: "svg",
          },
        ],
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjUgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTY0IDQ2NGMtOC44IDAtMTYtNy4yLTE2LTE2TDQ4IDY0YzAtOC44IDcuMi0xNiAxNi0xNmwxNjAgMCAwIDgwYzAgMTcuNyAxNC4zIDMyIDMyIDMybDgwIDAgMCAyODhjMCA4LjgtNy4yIDE2LTE2IDE2TDY0IDQ2NHpNNjQgMEMyOC43IDAgMCAyOC43IDAgNjRMMCA0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRsMjU2IDBjMzUuMyAwIDY0LTI4LjcgNjQtNjRsMC0yOTMuNWMwLTE3LTYuNy0zMy4zLTE4LjctNDUuM0wyNzQuNyAxOC43QzI2Mi43IDYuNyAyNDYuNSAwIDIyOS41IDBMNjQgMHptOTYgMjU2YTMyIDMyIDAgMSAwIC02NCAwIDMyIDMyIDAgMSAwIDY0IDB6bTY5LjIgNDYuOWMtMy00LjMtNy45LTYuOS0xMy4yLTYuOXMtMTAuMiAyLjYtMTMuMiA2LjlsLTQxLjMgNTkuNy0xMS45LTE5LjFjLTIuOS00LjctOC4xLTcuNS0xMy42LTcuNXMtMTAuNiAyLjgtMTMuNiA3LjVsLTQwIDY0Yy0zLjEgNC45LTMuMiAxMS4xLS40IDE2LjJzOC4yIDguMiAxNCA4LjJsNDggMCAzMiAwIDQwIDAgNzIgMGM2IDAgMTEuNC0zLjMgMTQuMi04LjZzMi40LTExLjYtMS0xNi41bC03Mi0xMDR6Ii8+PC9zdmc+",
      },
    ];

    // Position and other settings
    chart.exporting.filePrefix = "Customized_Trends";
    chart.exporting.menu.align = "left";
    chart.exporting.menu.verticalAlign = "top";
    chart.exporting.menu.marginRight = 10;

    chart.exporting.filePrefix = "Customized_Trends";
    chart.exporting.menu.align = "left";
    chart.exporting.menu.verticalAlign = "top";
    chart.exporting.formatOptions.getKey("json").disabled = true;
    chart.exporting.formatOptions.getKey("html").disabled = true;
    chart.exporting.formatOptions.getKey("csv").disabled = true;
    chart.exporting.formatOptions.getKey("pdf").disabled = true;
    chart.exporting.formatOptions.getKey("xlsx").disabled = true;
    chart.exporting.formatOptions.getKey("print").disabled = true;
    chart.exporting.formatOptions.getKey("pdfdata").disabled = true;

    // chart.exporting.menu.items[0].icon =
    //   "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjAuMDAwMDAwLCAtNDMyLjAwMDAwMCkiPjxwYXRoIGQ9Ik03MjEsNDQ2IEw3MzMsNDQ2IEw3MzMsNDQzIEw3MzUsNDQzIEw3MzUsNDQ2IEw3MzUsNDQ4IEw3MjEsNDQ4IFogTTcyMSw0NDMgTDcyMyw0NDMgTDcyMyw0NDYgTDcyMSw0NDYgWiBNNzI2LDQzMyBMNzMwLDQzMyBMNzMwLDQ0MCBMNzMyLDQ0MCBMNzI4LDQ0NSBMNzI0LDQ0MCBMNzI2LDQ0MCBaIE03MjYsNDMzIiBpZD0iUmVjdGFuZ2xlIDIxNyIvPjwvZz48L2c+PC9zdmc+";
    chart.exporting.menu.items[0].icon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjUgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTY0IDQ2NGMtOC44IDAtMTYtNy4yLTE2LTE2TDQ4IDY0YzAtOC44IDcuMi0xNiAxNi0xNmwxNjAgMCAwIDgwYzAgMTcuNyAxNC4zIDMyIDMyIDMybDgwIDAgMCAyODhjMCA4LjgtNy4yIDE2LTE2IDE2TDY0IDQ2NHpNNjQgMEMyOC43IDAgMCAyOC43IDAgNjRMMCA0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRsMjU2IDBjMzUuMyAwIDY0LTI4LjcgNjQtNjRsMC0yOTMuNWMwLTE3LTYuNy0zMy4zLTE4LjctNDUuM0wyNzQuNyAxOC43QzI2Mi43IDYuNyAyNDYuNSAwIDIyOS41IDBMNjQgMHptOTYgMjU2YTMyIDMyIDAgMSAwIC02NCAwIDMyIDMyIDAgMSAwIDY0IDB6bTY5LjIgNDYuOWMtMy00LjMtNy45LTYuOS0xMy4yLTYuOXMtMTAuMiAyLjYtMTMuMiA2LjlsLTQxLjMgNTkuNy0xMS45LTE5LjFjLTIuOS00LjctOC4xLTcuNS0xMy42LTcuNXMtMTAuNiAyLjgtMTMuNiA3LjVsLTQwIDY0Yy0zLjEgNC45LTMuMiAxMS4xLS40IDE2LjJzOC4yIDguMiAxNCA4LjJsNDggMCAzMiAwIDQwIDAgNzIgMGM2IDAgMTEuNC0zLjMgMTQuMi04LjZzMi40LTExLjYtMS0xNi41bC03Mi0xMDR6Ii8+PC9zdmc+";

    return () => {
      chart.dispose();
      am4core.unuseAllThemes();
    };
  }, [chartData, isDarkMode, selectedParameter]);
  //------------------excel export--------------------------
  // Add this function inside your CustomTrend component
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
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Trend Data");

      // Prepare export data
      const exportData = chartData.map((row) => {
        const newRow = {
          Date: new Date(row.Date).toLocaleDateString(),
          Time: row.Time,
        };

        selectedMeter.forEach((meter) => {
          newRow[meter] = row[meter] || 0;
        });

        return newRow;
      });

      const columnNames = Object.keys(exportData[0]);
      const columnCount = columnNames.length;

      // Set row heights
      worksheet.getRow(1).height = 30;
      worksheet.getRow(2).height = 30;
      worksheet.getRow(3).height = 30;

      // Add title rows
      worksheet.mergeCells(1, 1, 1, columnCount);
      const title1 = worksheet.getCell(1, 1);
      title1.value = `Trend Data: ${selectedParameter}`;
      title1.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
      title1.alignment = { horizontal: "center", vertical: "middle" };
      title1.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cedef0" },
      };

      worksheet.mergeCells(2, 1, 2, columnCount);
      const title2 = worksheet.getCell(2, 1);
      title2.value = `Period: ${startDate} to ${endDate}`;
      title2.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
      title2.alignment = { horizontal: "center", vertical: "middle" };
      title2.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cedef0" },
      };
      title2.border = {
        top: { style: "thin", color: { argb: "3A83C6" } },
      };

      // Add headers
      const headerRow = worksheet.getRow(3);
      headerRow.values = columnNames;

      // Style header row
      headerRow.eachCell((cell, colNumber) => {
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

      // Add data rows
      exportData.forEach((row) => {
        const dataRow = worksheet.addRow(Object.values(row));
        dataRow.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // Set column widths
      worksheet.columns = columnNames.map(() => ({ width: 20 }));

      // Generate and download the file
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

    const exportData = chartData.map((row) => {
      const newRow = [
        new Date(row.Date).toLocaleDateString(),
        row.Time,
        ...selectedMeter.map((meter) => row[meter] || 0),
      ];
      return newRow;
    });

    const headers = ["Date", "Time", ...selectedMeter];
    const surajCottonBase64Logo = await loadImageAsBase64(
      "/suraj-cotton-logo-reports.png"
    );
    const jahaannBase64Logo = await loadImageAsBase64("/jahaann-light.png");

    const docDefinition = {
      pageOrientation: "landscape",
      content: [
        {
          columns: [
            {
              image: "surajcottonLogo",
              width: 100,
              alignment: "left",
            },
            {
              text: "", // spacer
              width: "*",
            },
            {
              image: "jahaannLogo",
              width: 100,
              alignment: "right",
            },
          ],
          columnGap: 10,
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              text: `Trend Data: ${unitForExportFile}`,
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
          table: {
            headerRows: 1,
            widths: Array(headers.length).fill("*"),
            body: [
              headers.map((h) => ({ text: h, style: "tableHeader" })),
              ...exportData,
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#1D5999" : null),
            hLineColor: () => "#cedef0",
            vLineColor: () => "#cedef0",
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

  return (
    <div className="relative flex-shrink-0 w-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 h-max lg:h-[81vh] bg-white dark:bg-gray-800 border-t-3 border-[#1F5897] rounded-[8px] shadow-md">
      <div className="relative z-10 h-full flex flex-col">
        <h1 className="text-lg font-bold mb-4 font-raleway text-[#1F5897] dark:text-[#D1D5DB]">
          Customized Trend
        </h1>
        <div className="w-full flex flex-col gap-4 mb-6 md:grid md:grid-cols-6 md:gap-4">
          <div className="w-full">
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
          <div className="w-full">
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
          <div className="w-full">
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
                setLt("");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="" className="dark:text-gray-300 dark:bg-gray-800">
                Select Area
              </option>
              <option
                value="Unit 4"
                className="dark:text-gray-300 dark:bg-gray-800"
              >
                UNIT 4
              </option>
              <option
                value="Unit 5"
                className="dark:text-gray-300 dark:bg-gray-800"
              >
                UNIT 5
              </option>
            </select>
          </div>
          <div className="w-full">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Select LT
            </label>
            <select
              value={lt}
              onChange={(e) => {
                const value = e.target.value;
                setLt(value);
                setSelectedMeter([]);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="" className="dark:bg-gray-800 dark:text-gray-300">
                Select LT
              </option>
              {area === "Unit 4" && (
                <>
                  <option
                    value="LT_1"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    LT1
                  </option>
                  <option
                    value="LT_2"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    LT2
                  </option>
                  <option
                    value="ALL"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    Select All
                  </option>
                </>
              )}
              {area === "Unit 5" && (
                <>
                  <option
                    value="LT_3"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    LT_3
                  </option>
                  <option
                    value="LT_4"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    LT_4
                  </option>
                  <option
                    value="ALL"
                    className="dark:bg-gray-800 dark:text-gray-300"
                  >
                    Select All
                  </option>
                </>
              )}
            </select>
          </div>
          <div ref={meterDropdownRef} className="relative w-full">
            <label
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              style={{ color: "#1F5897" }}
            >
              Select Meters
            </label>
            <button
              onClick={() => setShowMeters(!showMeters)}
              className="w-full p-2 border rounded text-left cursor-pointer bg-white dark:bg-gray-800"
            >
              {selectedMeter.length > 0
                ? `${selectedMeter[0]}${
                    selectedMeter.length > 1 ? ", ..." : ""
                  }`
                : "Select Meters"}
              <span className="float-right">
                {showMeters ? (
                  <IoChevronUp size={20} className="font-bold" />
                ) : (
                  <HiMiniChevronDown size={25} className="font-bold" />
                )}
              </span>
            </button>
            {showMeters && (
              <div className="absolute bg-white dark:bg-gray-800 border shadow z-10 w-full max-h-48 overflow-y-auto dark:text-gray-300">
                {filteredMeters.length === 0 ? (
                  <div className="p-2 text-gray-400 dark:text-gray-300">
                    No meters available
                  </div>
                ) : (
                  filteredMeters.map((meter) => (
                    <label
                      key={meter}
                      className="block px-4 py-2 hover:bg-gray-100 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        value={meter}
                        checked={selectedMeter.includes(meter)}
                        onChange={() => handleMeterSelection(meter)}
                        className="mr-2"
                      />
                      {meter}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          <div ref={parameterDropdownRef} className="relative w-full">
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
              <div className="absolute bg-white dark:bg-gray-800 border shadow z-10 w-full max-h-48 overflow-y-auto">
                {parameters.map((param) => (
                  <label
                    key={param}
                    className="block px-4 py-2 hover:bg-gray-100"
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
        <div className="flex-1 w-full">
          {loading === true ? (
            <CustomLoader />
          ) : (
            <div className="relative">
              <div
                className="absolute z-20 top-[40px] left-[5.5px] items-center group"
                style={{
                  display: !showPdfBtn ? "none" : "flex",
                }}
              >
                {/* Main button */}
                <button className="bg-[#f3f0f0] hover:bg-[#afafaf] dark:bg-gray-600 text-[#969393] hover:text-black rounded transition-colors duration-200">
                  <LuFileUp className="w-[28.5px] h-[37px]" />
                </button>

                {/* Vertical buttons - shown on hover only */}
                {/* <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible flex flex-col ml-1 space-y-1 transition-all duration-200"> */}
                <div className="absolute top-[0px] left-[25px] hidden group-hover:flex flex-col ml-1 gap-[1px]  transition-all duration-200">
                  <button
                    onClick={exportToPDF}
                    className="cursor-pointer bg-[#e2e2e2] hover:bg-[#ACACAC] text-black rounded p-3 transition-colors duration-200"
                  >
                    PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="cursor-pointer bg-[#e2e2e2] hover:bg-[#ACACAC] text-black rounded p-3 transition-colors duration-200"
                  >
                    XLSX
                  </button>
                </div>
              </div>
              <div
                id="chartDiv"
                className="w-full transition-all duration-300 rounded-md bg-white dark:bg-gray-800 overflow-x-auto"
                style={{
                  height: "60vh",
                  minHeight: "220px",
                  maxHeight: "98%",
                }}
              >
                <style>
                  {`
                #chartDiv::-webkit-scrollbar {
                  width: 0px;
                  height: 0px;
                }
                #chartDiv::-webkit-scrollbar-track {
                  background: transparent;
                }
                #chartDiv::-webkit-scrollbar-thumb:hover {
                  background-color: #555;
                }
                @media (max-width: 1024px) {
                  #chartDiv { height: 45vh !important; min-height: 180px; }
                }
                @media (max-width: 768px) {
                  #chartDiv { height: 35vh !important; min-height: 140px; }
                }
                @media (max-width: 480px) {
                  #chartDiv { height: 28vh !important; min-height: 100px; }
                }
              `}
                </style>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomTrend;
