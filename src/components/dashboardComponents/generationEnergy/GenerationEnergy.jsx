"use client";
import React, { useEffect, useRef, useState } from "react";
import { generationConsumption } from "@/data/generationEnergy";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

am4core.useTheme(am4themes_animated);

const GenerationEnergy = () => {
  const [selectedCategory, setSelectedCategory] = useState("WAPDA 1");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");
  const [loading, setLoading] = useState(false);
  const [isGenerationEnergyFullView, setGenerationEnergyFullView] =
    useState(false);
  const { theme } = useTheme(); // Light or dark
  const chartRef = useRef(null);
  const handleGenerationEnergyFullView = () => {
    setGenerationEnergyFullView((prev) => !prev);
  };

  const fetchGenerationEnergyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_GENERATION_ENERGY}${selectedTimePeriod}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        if (Array.isArray(resResult) && resResult.length > 0) {
          updateChart(resResult, selectedTimePeriod);
        } else {
          console.warn("No chart data received.");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGenerationEnergyData();
  }, [selectedTimePeriod, theme]);
  // useEffect(() => {
  //   fetchGenerationEnergyData();
  //   const categoryData = generationConsumption[selectedCategory];
  //   if (categoryData) {
  //     updateChart(categoryData[selectedTimePeriod], selectedTimePeriod);
  //   }
  // }, [selectedCategory, selectedTimePeriod, theme]);

  const updateChart = (data, value) => {
    const isDark = theme === "dark";

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const chart = am4core.create("generationEnergy", am4charts.XYChart);
    chartRef.current = chart;

    if (chart.logo) chart.logo.disabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.labels.template.fontSize = 10;
    chart.legend.labels.template.fontWeight = "500";
    chart.legend.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    chart.legend.markers.template.width = 10;
    chart.legend.markers.template.height = 10;

    let xField, series1Field, series2Field, series1Name, series2Name;

    switch (value) {
      case "today":
        xField = "Time";
        series1Field = "Yesterday";
        series2Field = "Today";
        series1Name = "Yesterday (kWh)";
        series2Name = "Today (kWh)";
        break;
      case "week":
        xField = "Day";
        series1Field = "Last Week";
        series2Field = "This Week";
        series1Name = "Last Week (kWh)";
        series2Name = "This Week (kWh)";
        break;
      case "month":
        xField = "Weeks";
        series1Field = "Last Month";
        series2Field = "This Month";
        series1Name = "Last Month (kWh)";
        series2Name = "This Month (kWh)";
        break;
      case "year":
        xField = "Month";
        series1Field = "Previous Year";
        series2Field = "Current Year";
        series1Name = "Previous Year (kWh)";
        series2Name = "Current Year (kWh)";
        break;
      default:
        console.warn("Invalid time period selected:", value);
        return;
    }

    // ⚠️ Check for empty or invalid data
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No data provided for chart");
      return;
    }

    chart.data = data;

    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xField;
    xAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    xAxis.renderer.labels.template.fontSize = 10;
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.7;
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    yAxis.renderer.labels.template.fontSize = 10;

    function createSeries(field, name, color) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.clustered = true;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = xField;
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.tooltip.pointerOrientation = "vertical";
      series.columns.template.width = am4core.percent(70);
      series.columns.template.fill = am4core.color(color);
      series.columns.template.stroke = am4core.color(color);
    }

    createSeries(series1Field, series1Name, "#11A8D7");
    createSeries(series2Field, series2Name, "#00378A");

    chart.cursor = new am4charts.XYCursor();
  };
  return (
    <div
      className={`${
        isGenerationEnergyFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative  px-1 py-2 md:p-3 h-[15rem] md:h-[13.5rem] lg:h-[12rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md `}
    >
      <div className="relative flex items-center flex-col md:flex-row gap-3 md:gap-[0.7vw] justify-between">
        <span className="text-[15px] text-[#1A68B2] .font-raleway font-600">
          Generation Energy
        </span>
        <div className="flex gap-4">
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="outline-none border-1 rounded text-[12px] font-raleway p-1 dark:bg-gray-600"
          >
            <option value="WAPDA 1">WAPDA 1</option>
            <option value="WAPDA 2">WAPDA 2</option>
            <option value="Solar">Solar</option>
            <option value="HT Generation">HT Generation</option>
          </select> */}
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="outline-none border-1 text-[12px] font-raleway rounded p-1 dark:bg-gray-600"
          >
            {/* <option value="today">Today</option> */}
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="cursor-pointer absolute md:relative top-[0px] right-[0px]"
            onClick={handleGenerationEnergyFullView}
          >
            {isGenerationEnergyFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>
      {/* {loading ? (
        <CustomLoader size="50px" containerHeight="15vh" />
      ) : ( */}
      <div
        id="generationEnergy"
        className={`w-full ${
          isGenerationEnergyFullView ? "h-[90%]" : "h-[12rem] pb-2 lg:h-full"
        }`}
      ></div>
      {/* )} */}
    </div>
  );
};

export default GenerationEnergy;
