"use client";
import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useTheme } from "next-themes";

am4core.useTheme(am4themes_animated);

const ChartComponent = ({
  data,
  selectedTimePeriod,
  chartId,
  isFullView,
  theme,
  loading = false,
}) => {
  const { theme: nextTheme } = useTheme();
  const chartRef = useRef(null);

  // Use prop theme or fallback to next-themes theme
  const currentTheme = theme || nextTheme;

  useEffect(() => {
    if (!loading && data && data.length > 0) {
      updateChart(data, selectedTimePeriod);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [data, selectedTimePeriod, isFullView, currentTheme, loading]);

  const formatTimeLabel = (value, index, dataItems) => {
    if (selectedTimePeriod !== "today") return value;

    try {
      const [datePart, timePart] = value.split(" ");
      const [y, m, d] = datePart.split("-");
      const [hh, mm] = timePart.split(":");

      const date = new Date(y, m - 1, d, hh, mm);
      if (isNaN(date)) return value;

      const isFirst = index === 0;
      const isLast = index === dataItems.length - 1;

      if (isFirst || isLast) {
        const dd = date.getDate().toString().padStart(2, "0");
        const mon = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${dd}/${mon}`;
      }

      return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
    } catch {
      return value;
    }
  };

  const updateChart = (chartData) => {
    const isDark = currentTheme === "dark";

    // Dispose previous chart if exists
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    // Create new chart
    const chart = am4core.create(chartId, am4charts.XYChart);
    chartRef.current = chart;

    if (chart.logo) chart.logo.disabled = true;
    // zoom
    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = "zoomX"; // zoom on drag
    // chart.cursor.lineY.disabled = true;

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

    let xField, series1Field, series2Field, series1Name, series2Name;

    // Determine fields based on time period
    if (selectedTimePeriod === "today") {
      xField = "Time";
      series1Field = "Yesterday";
      series2Field = "Today";
      series1Name = "Yesterday (kWh)";
      series2Name = "Today (kWh)";
    } else if (selectedTimePeriod === "week") {
      xField = "Day";
      series1Field = "Last Week";
      series2Field = "This Week";
      series1Name = "Last Week (kWh)";
      series2Name = "This Week (kWh)";
    } else if (selectedTimePeriod === "month") {
      xField = "Weeks";
      series1Field = "Last Month";
      series2Field = "This Month";
      series1Name = "Last Month (kWh)";
      series2Name = "This Month (kWh)";
    } else if (selectedTimePeriod === "year") {
      xField = "Month";
      series1Field = "Previous Year";
      series2Field = "Current Year";
      series1Name = "Previous Year (kWh)";
      series2Name = "Current Year (kWh)";
    }

    chart.data = chartData;

    // ✅ X Axis
    // const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // xAxis.dataFields.category = xField;
    // xAxis.renderer.labels.template.fill = am4core.color(
    //   isDark ? "#ffffff" : "#000000"
    // );
    // xAxis.renderer.labels.template.fontSize = 12;
    // xAxis.renderer.cellStartLocation = 0.1;
    // xAxis.renderer.cellEndLocation = 0.9;
    // ✅ X Axis
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xField;
    xAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    xAxis.renderer.labels.template.fontSize = 12;
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;

    // Apply custom label formatting for "today" period
    if (selectedTimePeriod === "today") {
      xAxis.renderer.labels.template.adapter.add("text", (text, target) => {
        if (target.dataItem && target.dataItem.index !== undefined) {
          const rawValue = target.dataItem.category; // <-- FIX
          const dataItems = xAxis.dataItems.values;
          return formatTimeLabel(rawValue, target.dataItem.index, dataItems);
        }
        return text;
      });
    }

    // ✅ Y Axis
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.labels.template.fill = am4core.color(
      isDark ? "#ffffff" : "#000000"
    );
    yAxis.renderer.labels.template.fontSize = 12;

    // Function to create series
    const createSeries = (field, name, color) => {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = xField;
      series.name = name;

      // ✅ Tooltip
      // series.columns.template.tooltipText = "{name}: {valueY}";
      series.columns.template.tooltipHTML = `<div style="font-size:12px;">
      <strong>{categoryX}</strong><br>
      {name}: <strong>{valueY}</strong>
   </div>`;
      series.tooltip.label.fontSize = 12;

      // ✅ Styling
      series.columns.template.width = am4core.percent(70);
      series.columns.template.fill = am4core.color(color);
      series.columns.template.strokeOpacity = 0;

      return series;
    };

    // Create both series
    createSeries(series1Field, series1Name, "#11A8D7"); // previous period
    createSeries(series2Field, series2Name, "#00378A"); // current period
  };

  return <div id={chartId} className="w-full h-full" />;
};

export default ChartComponent;

//////////////////////////////////////////////////////////=============================================

// "use client";
// import React, { useEffect, useRef } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { useTheme } from "next-themes";

// am4core.useTheme(am4themes_animated);

// const ChartComponent = ({
//   data,
//   selectedTimePeriod,
//   chartId,
//   theme,
//   loading = false,
// }) => {
//   const { theme: nextTheme } = useTheme();
//   const chartRef = useRef(null);

//   // Use prop theme or fallback to next-themes theme
//   const currentTheme = theme || nextTheme;

//   useEffect(() => {
//     if (!loading && data && data.length > 0) {
//       updateChart(data, selectedTimePeriod);
//     }

//     return () => {
//       if (chartRef.current) {
//         chartRef.current.dispose();
//       }
//     };
//   }, [data, selectedTimePeriod, currentTheme, loading]);

//   const formatTimeLabel = (value, index, dataItems) => {
//     if (selectedTimePeriod !== "today") return value;

//     try {
//       const [datePart, timePart] = value.split(" ");
//       const [y, m, d] = datePart.split("-");
//       const [hh, mm] = timePart.split(":");

//       const date = new Date(y, m - 1, d, hh, mm);
//       if (isNaN(date)) return value;

//       const isFirst = index === 0;
//       const isLast = index === dataItems.length - 1;

//       if (isFirst || isLast) {
//         const dd = date.getDate().toString().padStart(2, "0");
//         const mon = (date.getMonth() + 1).toString().padStart(2, "0");
//         return `${dd}/${mon}`;
//       }

//       return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
//     } catch {
//       return value;
//     }
//   };

//   const updateChart = (chartData) => {
//     const isDark = currentTheme === "dark";

//     // Dispose previous chart if exists
//     if (chartRef.current) {
//       chartRef.current.dispose();
//     }

//     // Create new chart
//     const chart = am4core.create(chartId, am4charts.XYChart);
//     chartRef.current = chart;

//     if (chart.logo) chart.logo.disabled = true;
//     // zoom
//     chart.cursor = new am4charts.XYCursor();
//     chart.cursor.behavior = "zoomX"; // zoom on drag
//     chart.cursor.lineY.disabled = true;

//     // ✅ Legend setup
//     chart.legend = new am4charts.Legend();
//     chart.legend.position = "bottom";
//     chart.legend.labels.template.fontSize = 12;
//     chart.legend.labels.template.fontWeight = "500";
//     chart.legend.labels.template.fill = am4core.color(
//       isDark ? "#ffffff" : "#000000"
//     );
//     chart.legend.markers.template.width = 12;
//     chart.legend.markers.template.height = 12;

//     let xField, series1Field, series2Field, series1Name, series2Name;

//     // Determine fields based on time period
//     if (selectedTimePeriod === "today") {
//       xField = "Time";
//       series1Field = "Yesterday";
//       series2Field = "Today";
//       series1Name = "Yesterday (kWh)";
//       series2Name = "Today (kWh)";
//     } else if (selectedTimePeriod === "week") {
//       xField = "Day";
//       series1Field = "Last Week";
//       series2Field = "This Week";
//       series1Name = "Last Week (kWh)";
//       series2Name = "This Week (kWh)";
//     } else if (selectedTimePeriod === "month") {
//       xField = "Weeks";
//       series1Field = "Last Month";
//       series2Field = "This Month";
//       series1Name = "Last Month (kWh)";
//       series2Name = "This Month (kWh)";
//     } else if (selectedTimePeriod === "year") {
//       xField = "Month";
//       series1Field = "Previous Year";
//       series2Field = "Current Year";
//       series1Name = "Previous Year (kWh)";
//       series2Name = "Current Year (kWh)";
//     }

//     chart.data = chartData;

//     // ✅ X Axis
//     const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//     xAxis.dataFields.category = xField;
//     xAxis.renderer.labels.template.fill = am4core.color(
//       isDark ? "#ffffff" : "#000000"
//     );
//     xAxis.renderer.labels.template.fontSize = 12;
//     xAxis.renderer.cellStartLocation = 0.1;
//     xAxis.renderer.cellEndLocation = 0.9;

//     // Apply custom label formatting for "today" period
//     if (selectedTimePeriod === "today") {
//       xAxis.renderer.labels.template.adapter.add("text", (text, target) => {
//         if (target.dataItem && target.dataItem.index !== undefined) {
//           const rawValue = target.dataItem.category; // <-- FIX
//           const dataItems = xAxis.dataItems.values;
//           return formatTimeLabel(rawValue, target.dataItem.index, dataItems);
//         }
//         return text;
//       });
//     }

//     // ✅ Y Axis
//     const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     yAxis.renderer.labels.template.fill = am4core.color(
//       isDark ? "#ffffff" : "#000000"
//     );
//     yAxis.renderer.labels.template.fontSize = 12;

//     // Function to create series
//     const createSeries = (field, name, color) => {
//       const series = chart.series.push(new am4charts.ColumnSeries());
//       series.dataFields.valueY = field;
//       series.dataFields.categoryX = xField;
//       series.name = name;

//       // ✅ Tooltip
//       series.columns.template.tooltipText = "{name}: {valueY}";
//       series.tooltip.label.fontSize = 12;

//       // ✅ Styling
//       series.columns.template.width = am4core.percent(70);
//       series.columns.template.fill = am4core.color(color);
//       series.columns.template.strokeOpacity = 0;

//       return series;
//     };

//     // Create both series
//     createSeries(series1Field, series1Name, "#11A8D7"); // previous period
//     createSeries(series2Field, series2Name, "#00378A"); // current period
//     chart.cursor = new am4charts.XYCursor();
//     chart.cursor.behavior = "zoomX";
//     chart.cursor.lineY.disabled = true;

//     chart.cursor.events.on("cursorpositionchanged", function (ev) {
//       const dataItem = xAxis.getSeriesDataItem(
//         chart.series.values[0],
//         xAxis.toAxisPosition(ev.target.xPosition),
//         true
//       );

//       if (dataItem) {
//         const category = dataItem.category;

//         let tooltipText = `[bold]${category}[/]\n`;

//         chart.series.each((series) => {
//           const value = series.dataItems.getIndex(dataItem.index).valueY;
//           tooltipText += `${series.name}: ${value}\n`;
//         });

//         chart.tooltip.label.text = tooltipText;
//         chart.tooltip.show();
//       }
//     });
//   };

//   return <div id={chartId} className="w-full h-full" />;
// };

// export default ChartComponent;
