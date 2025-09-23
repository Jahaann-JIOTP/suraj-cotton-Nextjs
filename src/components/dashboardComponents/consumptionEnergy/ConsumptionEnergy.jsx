"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

am4core.useTheme(am4themes_animated);

const ConsumptionEnergy = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("today");
  const [loading, setLoading] = useState(false);
  const [isConsumptionEnergyFullView, setConsumptionEnergyFullView] =
    useState(false);
  const { theme } = useTheme(); // Light or dark
  const chartRef = useRef(null);

  const handleConsumptionEnergyFullView = () => {
    setConsumptionEnergyFullView((prev) => !prev);
  };

  const fetchConsumptionEnergyData = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_CONSUMPTION_ENERGY}${selectedTimePeriod}`,
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
          requestAnimationFrame(() => {
            updateChart(resResult, selectedTimePeriod);
            setLoading(false);
          });
        } else {
          console.warn("No chart data received.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionEnergyData();
  }, [selectedTimePeriod]);

  const updateChart = (data, value) => {
    const isDark = theme === "dark";

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const chart = am4core.create("consumptionEnergyChart", am4charts.XYChart);
    chartRef.current = chart;

    if (chart.logo) chart.logo.disabled = true;

    // ✅ Legend setup
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.labels.template.fontSize = 12;
    chart.legend.labels.template.fontWeight = "500";
    chart.legend.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    chart.legend.markers.template.width = 12;
    chart.legend.markers.template.height = 12;

    let xField,
      series1Field,
      series2Field,
      series1Name,
      series2Name;
      

    if (value === "today") {
      xField = "Time";
      series1Field = "Yesterday";
      series2Field = "Today";
      series1Name = "Yesterday (kWh)";
      series2Name = "Today (kWh)";
    } else if (value === "week") {
      xField = "Day";
      series1Field = "Last Week";
      series2Field = "This Week";
      series1Name = "Last Week (kWh)";
      series2Name = "This Week (kWh)";
    } else if (value === "month") {
      xField = "Weeks";
      series1Field = "Last Month";
      series2Field = "This Month";
      series1Name = "Last Month (kWh)";
      series2Name = "This Month (kWh)";
    } else if (value === "year") {
      xField = "Month";
      series1Field = "Previous Year";
      series2Field = "Current Year";
      series1Name = "Previous Year (kWh)";
      series2Name = "Current Year (kWh)";
    }
    chart.data = data;
    // ✅ X Axis
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xField;
    xAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    xAxis.renderer.labels.template.fontSize = 12;
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    
    // ✅ Y Axis
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    yAxis.renderer.labels.template.fontSize = 12;
    function createSeries(field, name, color) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = xField;
      series.name = name;
      // ✅ Tooltip
  series.columns.template.tooltipText =
    "{name}, {categoryX}: {valueY}";
  series.tooltip.label.fontSize = 12; 
      // ✅ Styling
      series.columns.template.width = am4core.percent(70);
      series.columns.template.fill = am4core.color(color);
      series.columns.template.strokeOpacity = 0;
      return series;
    }
    createSeries(series1Field, series1Name, "#11A8D7"); // previous
    createSeries(series2Field, series2Name, "#00378A"); // current
  };
useEffect(() => {
  if (chartRef.current && !loading) {
    updateChart(chartRef.current.data || [], selectedTimePeriod);
  }
}, [theme, selectedTimePeriod]);
  return (
    <div
      className={`${
        isConsumptionEnergyFullView
          ? "fixed inset-0 z-50 p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative px-1 py-2 md:p-3 h-[15rem] md:h-[13.5rem] lg:h-[12rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md`}
    >
      <div className="relative flex items-center flex-col md:flex-row gap-3 md:gap-[0.7vw] justify-between">
        <span className="text-[15px] text-[#1A68B2] font-raleway font-600">
          Consumption Energy
        </span>
        <div className="flex gap-4">
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="outline-none border-1 text-[12px] font-raleway rounded p-1 dark:bg-gray-600"
            disabled={loading}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="cursor-pointer absolute md:relative top-[0px] right-[0px]"
            onClick={handleConsumptionEnergyFullView}
          >
            {isConsumptionEnergyFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}

      <div
        id="consumptionEnergyChart"
        className={`w-full ${
          isConsumptionEnergyFullView
            ? "h-[90%]"
            : "h-[12rem lg:h-full"
        }`}
      />
    </div>
  );
};

export default ConsumptionEnergy;
