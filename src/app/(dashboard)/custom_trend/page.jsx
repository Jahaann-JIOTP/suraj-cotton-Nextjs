"use client";
import React, { useState, useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import config from "@/constant/apiRouteList";
function CustomTrend() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [area, setArea] = useState("");
  const [lt, setLt] = useState("");
  const [selectedMeter, setSelectedMeter] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    "Light Internal ": "U4_PLC",
    "Power House 2nd Source": "U5_PLC",
    Turbine: "U6_PLC",
    Spare: "U7_PLC",
    "Drawing 01": "U8_PLC",
    "Winding 01 (PLC) ": "U9_PLC",
    "Ring 01": "U10_PLC",
    "Ring 5": "U11_PLC",
    "Ring 6(Auto Cone 1-9)": "U12_PLC",
    "Comber 1": "U13_PLC",
    Compressor: "U14_PLC",
    "Simplex 01": "U15_PLC",
    "Compressor 02 (90kW)": "U16_PLC",
    "Ring AC ": "U17_PLC",
    "Ring AC (Bypass)": "U18_PLC",
    "Diesel + Gas Incoming ": "U19_PLC",
    "Compressor (Bypass)": "U20_PLC",
    "Wapda + HFO + Gas Incoming": "U21_PLC",
    "Drying Simplex AC": "U1_GW01",
    "Weikel Conditioning Machine": "U2_GW01",
    "Winding AC": "U3_GW01",
    "Mills RES-CLNY& Workshop": "U4_GW01",
    "Card 1": "U5_GW01",
    Colony: "U6_GW01",
    "Power House and Source": "U7_GW01",
    "Blow Room": "U8_GW01",
    "Card 2": "U9_GW01",
    "Winding 01 (GW)  ": "U10_GW01",
    "Gas LT Panel": "U11_GW01",
    "Card Filter (Bypass)": "U12_GW01",
    "Wapda + HFO + Gas Incoming ": "U13_GW01",
    "D/R Card Filter": "U14_GW01",
    "Ring 02 (Auto Cone 10-18)": "U15_GW01",
    "Ring 04": "U16_GW01",
    "Ring 03": "U17_GW01",
    "Bale Press": "U18_GW01",
    "AC Lab": "U19_GW01",
    "Spare 01": "U20_GW01",
    "Spare-02": "U21_GW01",
    "HFO Incoming": "U22_GW01",
    "Wapda 1 Incoming": "U23_GW01",
  };

  const parameterMapping = {
    "Del Active Energy  ": "Del_ActiveEnergy",
    " Current A    ": "Current_A",
    "Current B     ": "Current_B",
    "Current C     ": "Current_C",
    "Power Factor A   ": "PowerFactor_A",
    "Power Factor B    ": "PowerFactor_B",
    "Power Factor C     ": "PowerFactor_C",
    "Active Power ": "ActivePower_Total",
    "Reactive power Total ": "ReactivePower_Total",
    "Apparent Power Total  ": "ApparentPower_Total",
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
  }

  const parameters = Object.keys(parameterMapping);

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
      const LT_selections = lt === "ALL" ? "ALL" : lt;

      fetch(`${config.SURAJ_COTTON_BASE_URL}/trends`, {
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
          LT_selections: LT_selections,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch trend data");
          }
          return res.json();
        })
        .then((data) => {
          const formatted = data.map((item) => {
            const point = { timestamp: new Date(item.timestamp) };
            selectedMeter.forEach((m) => {
              const key = `${meterMapping[m]}_${suffixes}`;
              point[m] =
                item[key] !== undefined ? parseFloat(item[key]) || null : null; // Handle undefined or invalid values
            });
            return point;
          });
          console.log("Formatted Chart Data:", formatted); // Debug log
          if (
            formatted.length === 0 ||
            !formatted.some((d) => Object.values(d).some((v) => v !== null))
          ) {
            console.warn("No valid data available for the selected criteria");
            setChartData([]);
          } else {
            setChartData(formatted);
          }
        })
        .catch((err) => {
          console.error("Error fetching trend data:", err);
          setChartData([]);
        });
    } else {
      setChartData([]); // Clear chart data if conditions are not met
    }
  }, [startDate, endDate, area, lt, selectedMeter, selectedParameter]);

  useEffect(() => {
    if (chartData.length === 0) {
      return;
    }

    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create("chartDiv", am4charts.XYChart);
    chart.logo.disabled = true;
    chart.data = chartData.filter(
      (d) => d.timestamp && Object.values(d).some((v) => v !== null)
    ); // Filter out invalid data
    const textColor = isDarkMode ? "#ccc" : "#5f5f5f";
    const gridColor = isDarkMode ? "#666" : "#888"; // Updated to a more visible color for both modes

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
    } else if (param.includes("Del Active Energy")) {
      valueAxis.title.text = "Del Active Energy (kWH)";
    } else if (param.includes("power factor a")) {
      valueAxis.title.text = "Power Factor A";
    } else if (param.includes("power factor b")) {
      valueAxis.title.text = "Power Factor B";
    } else if (param.includes("power factor c")) {
      valueAxis.title.text = "Power Factor C";
    } else if (param.includes("apparent power total")) {
      valueAxis.title.text = "Apparent Power Total (kVA)";
    } else if (param.includes("reactive power total")) {
      valueAxis.title.text = "Reactive Power Total (kVAR)";
    } else if (param.includes("active power")) {
      valueAxis.title.text = "Active Power (kW)";
    } else {
      valueAxis.title.text = selectedParameter.trim();
    }
    valueAxis.title.fill = am4core.color(textColor);
    valueAxis.renderer.grid.template.stroke = am4core.color(gridColor);
    valueAxis.renderer.labels.template.fill = am4core.color(textColor);

    const colorMap = {
      Transport: am4core.color("#FF9933"),
      "Unit 05 Aux": am4core.color("#A569BD"),
      "Light External": am4core.color("#F7DC6F"),
      "Light Internal ": am4core.color("#F8C471"),
      "Power House 2nd Source": am4core.color("#E74C3C"),
      Turbine: am4core.color("#3498DB"),
      Spare: am4core.color("#BDC3C7"),
      "Drawing 01": am4core.color("#5DADE2"),
      "Winding 01 (PLC)": am4core.color("#2874A6"),
      "Ring 01": am4core.color("#1F618D"),
      "Ring 5": am4core.color("#2E86C1"),
      "Ring 6(Auto Cone 1-9)": am4core.color("#2980B9"),
      "Comber 1": am4core.color("#1ABC9C"),
      Compressor: am4core.color("#F1C40F"),
      "Simplex 01": am4core.color("#27AE60"),
      "Compressor 02 (90kW)": am4core.color("#F39C12"),
      "Ring AC ": am4core.color("#58D68D"),
      "Ring AC (Bypass)": am4core.color("#2ECC71"),
      "Diesel + Gas Incoming ": am4core.color("#C0392B"),
      "Compressor (Bypass)": am4core.color("#F4D03F"),
      "Wapda + HFO + Gas Incoming": am4core.color("#922B21"),
      "Drying Simplex AC": am4core.color("#52BE80"),
      "Weikel Conditioning Machine": am4core.color("#45B39D"),
      "Winding AC": am4core.color("#1D8348"),
      "Mills RES-CLNY& Workshop": am4core.color("#9B59B6"),
      "Card 1": am4core.color("#154360"),
      Colony: am4core.color("#A04000"),
      "Power House and Source": am4core.color("#C0392B"),
      "Blow Room": am4core.color("#2471A3"),
      "Card 2": am4core.color("#1A5276"),
      "Winding 01 (GW)": am4core.color("#1A5276"),
      "Gas LT Panel": am4core.color("#641E16"),
      "Card Filter (Bypass)": am4core.color("#7FB3D5"),
      "Wapda + HFO + Gas Incoming ": am4core.color("#ffc107"),
      "D/R Card Filter": am4core.color("#D98880"),
      "Ring 02 (Auto Cone 10-18)": am4core.color("#2C3E50 "),
      "Ring 04": am4core.color("#566573"),
      "Ring 03": am4core.color("#34495E"),
      "Bale Press": am4core.color("#873600"),
      "AC Lab": am4core.color("#16A085"),
      "Spare 01": am4core.color("#AAB7B8"),
      "Spare-02": am4core.color("#D5DBDB"),
      "HFO Incoming": am4core.color("#943126"),
      "Wapda 1 Incoming": am4core.color("#B03A2E"),
    };

    selectedMeter.forEach((meter, i) => {
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "timestamp";
      series.dataFields.valueY = meter;
      series.name = `${meter} (${meterMapping[meter]})`;
      series.stroke = colorMap[meter] || am4core.color("#00eaff");
      series.strokeWidth = 2;
      series.tooltipText = "{dateX}: [b]{valueY}[/]";
      series.show(); // Ensure series is visible
    });

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.minHeight = 15;
    function customizeGrip(grip) {
      grip.icon.disabled = true;
      grip.background.disabled = true;
      var img = grip.createChild(am4core.Rectangle);
      img.width = 6;
      img.height = 6;
      img.fill = am4core.color("#999");
      img.rotation = 45;
      img.align = "center";
      img.valign = "middle";
      var line = grip.createChild(am4core.Rectangle);
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
    chart.exporting.filePrefix = "Customized_Trends";
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.exporting.formatOptions.getKey("json").disabled = true;
    chart.exporting.formatOptions.getKey("html").disabled = true;
    chart.exporting.formatOptions.getKey("csv").disabled = true;
    chart.exporting.formatOptions.getKey("pdf").disabled = true;
    chart.exporting.menu.items[0].icon =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk9L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRrcmFuc2Zvcm09InRyYW5zbGF0ZSgtNzIwLjAwMDAwMCwgLTQzMi4wMDAwMDApIj48cGF0aCBkPSJNNzIxLDQ0NiBMNzMzLDQ0NiBMNzMzLDQ0MyBMNzM1LDQ0MyBMNzM1LDQ0NiBMNzM1LDQ0OCBMNzIxLDQ0OCBaIE07MjEsNDQzIEw3MjMsNDQzIEw3MjMsODQ2IEw3MjEsNDQ2IFogTTcyNiw0MzMgTDczMCw0MzMgTDczMCw0NDAgTDczMiw0NDggTDcyOCw0NDUgTDcyNCw0NDggTDcyNiw0NDggWiBNNzI2LDQzMyIgIGlkPSJSZWN0YW5nbGUgMjE3Ii8+PC9nPjwvZz48L3N2Zz4=";

    return () => {
      chart.dispose();
      am4core.unuseAllThemes();
    };
  }, [chartData, isDarkMode, selectedParameter]);

  return (
    <div className="relative flex-shrink-0 w-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 h-max lg:h-[81vh] bg-white dark:bg-gray-800 border-t-3 border-[#1F5897] rounded-[8px] shadow-md ">
      <div className="absolute inset-0" style={{ opacity: 1 }}></div>
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
                setSelectedMeter([]); // Reset selected meters when LT changes
              }}
              className="w-full p-2 border rounded"
            >
              <option value="" className="dark:bg-gray-800 dark:text-gray-300">
                Select LT
              </option>
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
              className="w-full p-2 border rounded text-left bg-white dark:bg-gray-800"
            >
              {selectedMeter.length > 0
                ? selectedMeter.join(", ")
                : "Select Meters"}
              <span className="float-right">{showMeters ? "▲" : "▼"}</span>
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
                        onChange={() =>
                          setSelectedMeter((prev) =>
                            prev.includes(meter)
                              ? prev.filter((m) => m !== meter)
                              : [...prev, meter]
                          )
                        }
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
              className="w-full p-2 border rounded text-left bg-white dark:bg-gray-800"
            >
              {selectedParameter || "Select Parameter"}
              <span className="float-right">{showParameters ? "▲" : "▼"}</span>
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
          <div
            id="chartDiv"
            className="w-full h-[40vh]  transition-all duration-300 rounded-md bg-white dark:bg-gray-800 overflow-x-auto"
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
              `}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomTrend;
