"use client";
import { useLayoutEffect, useRef, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { useTheme } from "next-themes";

const HeatmapChart = ({
  TransformerData,
  startRange,
  endRage,
  stepGap,
  id,
  dataKey,
  loading,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { theme } = useTheme();
  // heat map color's array
  const heatmapColors = [
    "#fe0c00",
    "#fe1200",
    "#fe1700",
    "#fe1d00",
    "#fe2200",
    "#fe2800",
    "#fd2d00",
    "#fd3300",
    "#fd3800",
    "#fd3e00",
    "#fd4400",
    "#fd4901",
    "#fd4f01",
    "#fd5401",
    "#fd5a01",
    "#fd5f01",
    "#fd6501",
    "#fc6a01",
    "#fc7001",
    "#fc7601",
    "#fc7b01",
    "#fc8101",
    "#fc8601",
    "#fc8c01",
    "#fc9101",
    "#fc9701",
    "#fc9d01",
    "#fba201",
    "#fba801",
    "#fbad01",
    "#fbb301",
    "#fbb801",
    "#fbbe01",
    "#fbc302",
    "#fbc902",
    "#fbcf02",
    "#fbd402",
    "#fbda02",
    "#fadf02",
    "#fae502",
    "#faea02",
    "#faf002",
    "#faf502",
    "#fafb02",
    "#f4fb02",
    "#eefb02",
    "#e9fb02",
    "#e3fb02",
    "#ddfb03",
    "#d7fb03",
    "#d1fb03",
    "#ccfc03",
    "#c6fc03",
    "#c0fc03",
    "#bafc03",
    "#b5fc03",
    "#affc04",
    "#a9fc04",
    "#a3fc04",
    "#9dfc04",
    "#98fc04",
    "#92fc04",
    "#8cfc04",
    "#86fc04",
    "#80fc04",
    "#7bfd05",
    "#75fd05",
    "#6ffd05",
    "#69fd05",
    "#63fd05",
    "#5efd05",
    "#58fd05",
    "#52fd05",
    "#4cfd05",
    "#46fd06",
    "#41fd06",
    "#3bfd06",
    "#35fd06",
    "#2ffd06",
    "#2afe06",
    "#24fe06",
    "#1efe06",
    "#18fe07",
    "#12fe07",
    "#0dfe07",
    "#07fe07",
    "#01fe07",
    "#01fe0d",
    "#01fe12",
    "#01fe18",
    "#01fe1e",
    "#01fe24",
    "#01fe29",
    "#01fe2f",
    "#01fe35",
    "#01fe3b",
    "#01fe40",
    "#01fd46",
    "#01fd4c",
    "#01fd52",
    "#01fd57",
    "#01fd5d",
    "#01fd63",
    "#01fd69",
    "#01fd6e",
    "#01fd74",
    "#01fd7a",
    "#01fd80",
    "#00fd85",
    "#00fd8b",
    "#00fd91",
    "#00fd97",
    "#00fd9c",
    "#00fda2",
    "#00fda8",
    "#00fdae",
    "#00fdb3",
    "#00fdb9",
    "#00fdbf",
    "#00fcc5",
    "#00fcca",
    "#00fcd0",
    "#00fcd6",
    "#00fcdc",
    "#00fce1",
    "#00fce7",
    "#00fced",
    "#00fcf3",
    "#00fcf8",
    "#00fcfe",
    "#00f7fe",
    "#00f2fe",
    "#00edfe",
    "#00e8fe",
    "#00e3fe",
    "#00dffe",
    "#00dafe",
    "#00d5fe",
    "#00d0fe",
    "#00cbfe",
    "#01c6fe",
    "#01c1fe",
    "#01bcfe",
    "#01b7fe",
    "#01b2fe",
    "#01adfe",
    "#01a9fe",
    "#01a4fe",
    "#019ffe",
    "#019afe",
    "#0195fe",
    "#0190ff",
    "#018bff",
    "#0186ff",
    "#0181ff",
    "#017cff",
    "#0178ff",
    "#0173ff",
    "#016eff",
    "#0169ff",
    "#0164ff",
    "#015fff",
    "#025aff",
    "#0255ff",
    "#0250ff",
    "#024bff",
    "#0246ff",
    "#0242ff",
    "#023dff",
    "#0238ff",
  ];

  // Initialize theme only once
  const initializeTheme = () => {
    let themeInitialized = false;
    if (!themeInitialized) {
      am4core.useTheme(am4themes_animated);
      themeInitialized = true;
    }
  };

  // Call initializeTheme at the top level
  initializeTheme();

  useLayoutEffect(() => {
    if (!chartRef.current || !TransformerData || TransformerData.length === 0)
      return;

    // Dispose existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
    }

    const chart = am4core.create(id, am4charts.XYChart);
    chartInstanceRef.current = chart;

    chart.maskBullets = false;
    chart.logo.disabled = true;

    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = "xCategory";
    yAxis.dataFields.category = "hour";

    xAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "xCategory";
    series.dataFields.categoryY = "hour";
    series.dataFields.value = "value";
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    series.columns.template.width = am4core.percent(100);
    series.columns.template.height = am4core.percent(100);

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 0;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#ffffff");

    // Enhanced tooltip to show date, time, and original value
    columnTemplate.tooltipText = "{fullDate} at {hour}: {originalValue}";

    // ✅ Light/Dark Theme Integration
    const isDarkMode = theme === "dark";

    xAxis.renderer.labels.template.fill = isDarkMode
      ? am4core.color("#f9fafb")
      : am4core.color("#111827");

    yAxis.renderer.labels.template.fill = isDarkMode
      ? am4core.color("#f9fafb")
      : am4core.color("#111827");

    // color's mapping of heatmap
    const createColorGradient = (startValue, endValue, step, colorsArray) => {
      const gradient = [];
      let currentValue = startValue;

      for (let i = 0; i < colorsArray.length; i++) {
        gradient.push({
          threshold: currentValue,
          color: colorsArray[i],
        });
        currentValue += step;
      }

      return gradient;
    };
    const heatmapGradient = createColorGradient(
      endRage,
      startRange,
      stepGap,
      heatmapColors
    );
    // Simplified color adapter
    columnTemplate.column.adapter.add("fill", (fill, target) => {
      if (target.dataItem) {
        const originalVal = target.dataItem.dataContext.originalValue;

        // Check for invalid, zero, or missing values - show gray
        if (
          !originalVal ||
          originalVal === 0 ||
          isNaN(originalVal) ||
          originalVal === null ||
          originalVal === undefined
        ) {
          return am4core.color("#9CA3AF");
        }

        // Find the appropriate color from the gradient
        for (let i = 0; i < heatmapGradient.length; i++) {
          if (originalVal >= heatmapGradient[i].threshold) {
            return am4core.color(heatmapGradient[i].color);
          }
        }

        // Default color if no threshold matches
        return am4core.color("#0238ff");
      }
      return fill;
    });

    // Utility functions
    const getUniqueDates = (apiData) => {
      const uniqueDates = [
        ...new Set(apiData.map((item) => item.date.split(" ")[0])),
      ];
      return uniqueDates.sort();
    };

    const formatDateForDisplay = (dateStr) => {
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${month}/${day}`;
    };

    const formatFullDate = (dateStr) => {
      const date = new Date(dateStr);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const getDayName = (dateStr) => {
      const date = new Date(dateStr);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return dayNames[date.getDay()];
    };

    // UPDATED: Data transformation function that starts from 6am to 6am
    const transformApiDataToHeatmap = (apiData) => {
      const uniqueDates = getUniqueDates(apiData);
      const shouldShowDayNames = uniqueDates.length <= 7;

      // Create hours from 6am to 6am next day (6-23, then 0-5)
      const dayHours = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm
      const nightHours = Array.from({ length: 6 }, (_, i) => i); // 12am to 5am
      const allHours = [...dayHours, ...nightHours];

      const completeGrid = [];

      uniqueDates.forEach((dateOnly) => {
        allHours.forEach((hour) => {
          // Look for existing data for this date-hour combination
          const existingData = apiData.find((item) => {
            const itemDate = item.date.split(" ")[0];
            const itemHour = parseInt(item.date.split(" ")[1].split(":")[0]);
            return itemDate === dateOnly && itemHour === hour;
          });

          // For hours before 6am, they technically belong to the next calendar day
          // but we want to display them as part of the current day starting from 6am
          let displayDate = dateOnly;
          let displayDayName = getDayName(dateOnly);
          let displayDateFormatted = formatDateForDisplay(dateOnly);

          if (hour < 6) {
            // For hours 0-5am, we display them as if they belong to the current day
            // but in the "overnight" section after 11pm
            displayDate = dateOnly;
          }

          let hourFormatted;
          if (hour === 0) {
            hourFormatted = "12am";
          } else if (hour < 12) {
            hourFormatted = `${hour}am`;
          } else if (hour === 12) {
            hourFormatted = "12pm";
          } else {
            hourFormatted = `${hour - 12}pm`;
          }

          let xCategory;
          if (shouldShowDayNames) {
            xCategory = hour < 6 ? getDayName(dateOnly) : getDayName(dateOnly);
          } else {
            xCategory = formatDateForDisplay(dateOnly);
          }

          let originalValue = 0;
          let scaledValue = 0;

          if (existingData) {
            originalValue = existingData[dataKey] || 0;
            if (originalValue && !isNaN(originalValue) && originalValue !== 0) {
              scaledValue = originalValue * 100;
            }
          }

          completeGrid.push({
            hour: hourFormatted,
            xCategory: xCategory,
            value: scaledValue,
            originalValue: originalValue,
            fullDate: formatFullDate(displayDate),
            originalDate: dateOnly,
            numericHour: hour,
            // Custom sort order to ensure 6am comes first, then 7am... 5am
            sortOrder: hour < 6 ? hour + 24 : hour,
          });
        });
      });

      // Sort by date and custom sort order
      return completeGrid.sort((a, b) => {
        if (a.originalDate < b.originalDate) return -1;
        if (a.originalDate > b.originalDate) return 1;
        return a.sortOrder - b.sortOrder;
      });
    };

    const transformedData = transformApiDataToHeatmap(TransformerData);
    chart.data = transformedData;

    // Configure x-axis
    const uniqueDates = getUniqueDates(TransformerData);
    const shouldShowDayNames = uniqueDates.length <= 7;

    xAxis.renderer.minGridDistance = 1;
    xAxis.renderer.labels.template.truncate = false;
    xAxis.renderer.labels.template.wrap = true;
    xAxis.renderer.labels.template.maxWidth = 70;

    if (shouldShowDayNames) {
      xAxis.renderer.labels.template.rotation = 0;
      xAxis.renderer.labels.template.fontSize = 12;
    } else {
      xAxis.renderer.labels.template.rotation = -45;
      xAxis.renderer.labels.template.fontSize = 10;
      xAxis.renderer.labels.template.adapter.add("text", (text, target) => {
        if (target.dataItem) {
          const category = target.dataItem.category;
          const dateOnly = transformedData.find(
            (d) => d.xCategory === category
          )?.originalDate;
          if (dateOnly) {
            const dateIndex = uniqueDates.indexOf(dateOnly);
            if (dateIndex % 3 !== 0) {
              return "";
            }
          }
        }
        return text;
      });
    }

    xAxis.renderer.autoScale = false;
    yAxis.renderer.labels.template.fontSize = 10;

    // Force y-axis to use our custom order
    yAxis.sortByCategory = false;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [loading, theme, TransformerData, dataKey, id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return loading ? (
    <CustomLoader size="50px" />
  ) : (
    <div ref={chartRef} id={id} className="w-full h-[270px]" />
  );
};

export default HeatmapChart;
