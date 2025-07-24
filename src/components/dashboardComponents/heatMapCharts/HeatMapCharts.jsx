"use client";
import { useLayoutEffect, useRef, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import CustomLoader from "@/components/customLoader/CustomLoader";

const HeatmapChart = ({ TransformerData, id, dataKey, loading }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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

    columnTemplate.column.adapter.add("fill", (fill, target) => {
      if (target.dataItem) {
        const val = target.dataItem.value;
        const originalVal = target.dataItem.dataContext.originalValue;

        // Check for invalid, zero, or missing values - show gray
        if (
          !originalVal ||
          originalVal === 0 ||
          isNaN(originalVal) ||
          originalVal === null ||
          originalVal === undefined
        ) {
          return am4core.color("#9CA3AF"); // Gray color for invalid/zero/missing values
        }

        if (originalVal >= 2500) return am4core.color("#fe0c00");
        else if (originalVal >= 2490) return am4core.color("#fe1200");
        else if (originalVal >= 2480) return am4core.color("#fe1700");
        else if (originalVal >= 2470) return am4core.color("#fe1d00");
        else if (originalVal >= 2460) return am4core.color("#fe2200");
        else if (originalVal >= 2450) return am4core.color("#fe2800");
        else if (originalVal >= 2440) return am4core.color("#fd2d00");
        else if (originalVal >= 2430) return am4core.color("#fd3300");
        else if (originalVal >= 2420) return am4core.color("#fd3800");
        else if (originalVal >= 2410) return am4core.color("#fd3e00");
        else if (originalVal >= 2390) return am4core.color("#fd4400");
        else if (originalVal >= 2380) return am4core.color("#fd4901");
        else if (originalVal >= 2370) return am4core.color("#fd4f01");
        else if (originalVal >= 2360) return am4core.color("#fd5401");
        else if (originalVal >= 2350) return am4core.color("#fd5a01");
        else if (originalVal >= 2340) return am4core.color("#fd5f01");
        else if (originalVal >= 2330) return am4core.color("#fd6501");
        else if (originalVal >= 2320) return am4core.color("#fc6a01");
        else if (originalVal >= 2310) return am4core.color("#fc7001");
        else if (originalVal >= 2300) return am4core.color("#fc7601");
        else if (originalVal >= 2290) return am4core.color("#fc7b01");
        else if (originalVal >= 2280) return am4core.color("#fc8101");
        else if (originalVal >= 2270) return am4core.color("#fc8601");
        else if (originalVal >= 2260) return am4core.color("#fc8c01");
        else if (originalVal >= 2250) return am4core.color("#fc9101");
        else if (originalVal >= 2240) return am4core.color("#fc9701");
        else if (originalVal >= 2230) return am4core.color("#fc9d01");
        else if (originalVal >= 2220) return am4core.color("#fba201");
        else if (originalVal >= 2210) return am4core.color("#fba801");
        else if (originalVal >= 2200) return am4core.color("#fbad01");
        else if (originalVal >= 2190) return am4core.color("#fbb301");
        else if (originalVal >= 2180) return am4core.color("#fbb801");
        else if (originalVal >= 2170) return am4core.color("#fbbe01");
        else if (originalVal >= 2160) return am4core.color("#fbc302");
        else if (originalVal >= 2150) return am4core.color("#fbc902");
        else if (originalVal >= 2140) return am4core.color("#fbcf02");
        else if (originalVal >= 2130) return am4core.color("#fbd402");
        else if (originalVal >= 2120) return am4core.color("#fbda02");
        else if (originalVal >= 2110) return am4core.color("#fadf02");
        else if (originalVal >= 2100) return am4core.color("#fae502");
        else if (originalVal >= 2090) return am4core.color("#faea02");
        else if (originalVal >= 2080) return am4core.color("#faf002");
        else if (originalVal >= 2070) return am4core.color("#faf502");
        else if (originalVal >= 2060) return am4core.color("#fafb02");
        else if (originalVal >= 2050) return am4core.color("#f4fb02");
        else if (originalVal >= 2040) return am4core.color("#eefb02");
        else if (originalVal >= 2030) return am4core.color("#e9fb02");
        else if (originalVal >= 2020) return am4core.color("#e3fb02");
        else if (originalVal >= 2010) return am4core.color("#ddfb03");
        else if (originalVal >= 2000) return am4core.color("#d7fb03");
        else if (originalVal >= 1990) return am4core.color("#d1fb03");
        else if (originalVal >= 1980) return am4core.color("#ccfc03");
        else if (originalVal >= 1970) return am4core.color("#c6fc03");
        else if (originalVal >= 1960) return am4core.color("#c0fc03");
        else if (originalVal >= 1950) return am4core.color("#bafc03");
        else if (originalVal >= 1940) return am4core.color("#b5fc03");
        else if (originalVal >= 1930) return am4core.color("#affc04");
        else if (originalVal >= 1920) return am4core.color("#a9fc04");
        else if (originalVal >= 1910) return am4core.color("#a3fc04");
        else if (originalVal >= 1900) return am4core.color("#9dfc04");
        else if (originalVal >= 1890) return am4core.color("#98fc04");
        else if (originalVal >= 1880) return am4core.color("#92fc04");
        else if (originalVal >= 1870) return am4core.color("#8cfc04");
        else if (originalVal >= 1860) return am4core.color("#86fc04");
        else if (originalVal >= 1850) return am4core.color("#80fc04");
        else if (originalVal >= 1840) return am4core.color("#7bfd05");
        else if (originalVal >= 1830) return am4core.color("#75fd05");
        else if (originalVal >= 1820) return am4core.color("#6ffd05");
        else if (originalVal >= 1810) return am4core.color("#69fd05");
        else if (originalVal >= 1800) return am4core.color("#63fd05");
        else if (originalVal >= 1790) return am4core.color("#5efd05");
        else if (originalVal >= 1780) return am4core.color("#58fd05");
        else if (originalVal >= 1770) return am4core.color("#52fd05");
        else if (originalVal >= 1760) return am4core.color("#4cfd05");
        else if (originalVal >= 1750) return am4core.color("#46fd06");
        else if (originalVal >= 1740) return am4core.color("#41fd06");
        else if (originalVal >= 1730) return am4core.color("#3bfd06");
        else if (originalVal >= 1720) return am4core.color("#35fd06");
        else if (originalVal >= 1710) return am4core.color("#2ffd06");
        else if (originalVal >= 1700) return am4core.color("#2afe06");
        else if (originalVal >= 1690) return am4core.color("#24fe06");
        else if (originalVal >= 1680) return am4core.color("#1efe06");
        else if (originalVal >= 1670) return am4core.color("#18fe07");
        else if (originalVal >= 1660) return am4core.color("#12fe07");
        else if (originalVal >= 1650) return am4core.color("#0dfe07");
        else if (originalVal >= 1640) return am4core.color("#07fe07");
        else if (originalVal >= 1630) return am4core.color("#01fe07");
        else if (originalVal >= 1620) return am4core.color("#01fe0d");
        else if (originalVal >= 1610) return am4core.color("#01fe12");
        else if (originalVal >= 1600) return am4core.color("#01fe18");
        else if (originalVal >= 1590) return am4core.color("#01fe1e");
        else if (originalVal >= 1580) return am4core.color("#01fe24");
        else if (originalVal >= 1570) return am4core.color("#01fe29");
        else if (originalVal >= 1560) return am4core.color("#01fe2f");
        else if (originalVal >= 1550) return am4core.color("#01fe35");
        else if (originalVal >= 1540) return am4core.color("#01fe3b");
        else if (originalVal >= 1530) return am4core.color("#01fe40");
        else if (originalVal >= 1520) return am4core.color("#01fd46");
        else if (originalVal >= 1510) return am4core.color("#01fd4c");
        else if (originalVal >= 1500) return am4core.color("#01fd52");
        else if (originalVal >= 1490) return am4core.color("#01fd57");
        else if (originalVal >= 1480) return am4core.color("#01fd5d");
        else if (originalVal >= 1470) return am4core.color("#01fd63");
        else if (originalVal >= 1460) return am4core.color("#01fd69");
        else if (originalVal >= 1450) return am4core.color("#01fd6e");
        else if (originalVal >= 1440) return am4core.color("#01fd74");
        else if (originalVal >= 1430) return am4core.color("#01fd7a");
        else if (originalVal >= 1420) return am4core.color("#01fd80");
        else if (originalVal >= 1410) return am4core.color("#00fd85");
        else if (originalVal >= 1400) return am4core.color("#00fd8b");
        else if (originalVal >= 1390) return am4core.color("#00fd91");
        else if (originalVal >= 1380) return am4core.color("#00fd97");
        else if (originalVal >= 1370) return am4core.color("#00fd9c");
        else if (originalVal >= 1360) return am4core.color("#00fda2");
        else if (originalVal >= 1350) return am4core.color("#00fda8");
        else if (originalVal >= 1340) return am4core.color("#00fdae");
        else if (originalVal >= 1330) return am4core.color("#00fdb3");
        else if (originalVal >= 1320) return am4core.color("#00fdb9");
        else if (originalVal >= 1310) return am4core.color("#00fdbf");
        else if (originalVal >= 1300) return am4core.color("#00fcc5");
        else if (originalVal >= 1290) return am4core.color("#00fcca");
        else if (originalVal >= 1280) return am4core.color("#00fcd0");
        else if (originalVal >= 1270) return am4core.color("#00fcd6");
        else if (originalVal >= 1260) return am4core.color("#00fcdc");
        else if (originalVal >= 1250) return am4core.color("#00fce1");
        else if (originalVal >= 1240) return am4core.color("#00fce7");
        else if (originalVal >= 1230) return am4core.color("#00fced");
        else if (originalVal >= 1220) return am4core.color("#00fcf3");
        else if (originalVal >= 1210) return am4core.color("#00fcf8");
        else if (originalVal >= 1200) return am4core.color("#00fcfe");
        else if (originalVal >= 1190) return am4core.color("#00f7fe");
        else if (originalVal >= 1180) return am4core.color("#00f2fe");
        else if (originalVal >= 1170) return am4core.color("#00edfe");
        else if (originalVal >= 1160) return am4core.color("#00e8fe");
        else if (originalVal >= 1150) return am4core.color("#00e3fe");
        else if (originalVal >= 1140) return am4core.color("#00dffe");
        else if (originalVal >= 1130) return am4core.color("#00dafe");
        else if (originalVal >= 1120) return am4core.color("#00d5fe");
        else if (originalVal >= 1110) return am4core.color("#00d0fe");
        else if (originalVal >= 1100) return am4core.color("#00cbfe");
        else if (originalVal >= 1090) return am4core.color("#01c6fe");
        else if (originalVal >= 1080) return am4core.color("#01c1fe");
        else if (originalVal >= 1070) return am4core.color("#01bcfe");
        else if (originalVal >= 1060) return am4core.color("#01b7fe");
        else if (originalVal >= 1050) return am4core.color("#01b2fe");
        else if (originalVal >= 1040) return am4core.color("#01adfe");
        else if (originalVal >= 1030) return am4core.color("#01a9fe");
        else if (originalVal >= 1020) return am4core.color("#01a4fe");
        else if (originalVal >= 1010) return am4core.color("#019ffe");
        else if (originalVal >= 1000) return am4core.color("#019afe");
        else if (originalVal >= 990) return am4core.color("#0195fe");
        else if (originalVal >= 980) return am4core.color("#0190ff");
        else if (originalVal >= 970) return am4core.color("#018bff");
        else if (originalVal >= 960) return am4core.color("#0186ff");
        else if (originalVal >= 950) return am4core.color("#0181ff");
        else if (originalVal >= 940) return am4core.color("#017cff");
        else if (originalVal >= 930) return am4core.color("#0178ff");
        else if (originalVal >= 920) return am4core.color("#0173ff");
        else if (originalVal >= 910) return am4core.color("#016eff");
        else if (originalVal >= 900) return am4core.color("#0169ff");
        else if (originalVal >= 890) return am4core.color("#0164ff");
        else if (originalVal >= 880) return am4core.color("#015fff");
        else if (originalVal >= 870) return am4core.color("#025aff");
        else if (originalVal >= 860) return am4core.color("#0255ff");
        else if (originalVal >= 850) return am4core.color("#0250ff");
        else if (originalVal >= 840) return am4core.color("#024bff");
        else if (originalVal >= 830) return am4core.color("#0246ff");
        else if (originalVal >= 820) return am4core.color("#0242ff");
        else if (originalVal >= 810) return am4core.color("#023dff");
        else if (originalVal >= 800) return am4core.color("#0238ff");
        else if (originalVal >= 790) return am4core.color("#0238ff");
        else if (originalVal >= 780) return am4core.color("#0238ff");
        else if (originalVal >= 770) return am4core.color("#0238ff");
        else if (originalVal >= 760) return am4core.color("#0238ff");
        else if (originalVal >= 750) return am4core.color("#0238ff");
        else if (originalVal >= 740) return am4core.color("#0238ff");
        else if (originalVal >= 730) return am4core.color("#0238ff");
        else if (originalVal >= 720) return am4core.color("#0238ff");
        else if (originalVal >= 710) return am4core.color("#0238ff");
        else if (originalVal >= 700) return am4core.color("#0238ff");
        else if (originalVal >= 690) return am4core.color("#0238ff");
        else if (originalVal >= 680) return am4core.color("#0238ff");
        else if (originalVal >= 670) return am4core.color("#0238ff");
        else if (originalVal >= 660) return am4core.color("#0238ff");
        else if (originalVal >= 650) return am4core.color("#0238ff");
        else if (originalVal >= 640) return am4core.color("#0238ff");
        else if (originalVal >= 630) return am4core.color("#0238ff");
        else if (originalVal >= 620) return am4core.color("#0238ff");
        else if (originalVal >= 610) return am4core.color("#0238ff");
        else if (originalVal >= 600) return am4core.color("#0238ff");
        else return am4core.color("#0238ff");
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

    // Enhanced data transformation function that fills missing slots
    const transformApiDataToHeatmap = (apiData) => {
      const uniqueDates = getUniqueDates(apiData);
      const shouldShowDayNames = uniqueDates.length <= 7;

      // Generate all possible hours (0-23)
      const allHours = Array.from({ length: 24 }, (_, i) => i);

      // Create a complete grid of all date-hour combinations
      const completeGrid = [];

      uniqueDates.forEach((dateOnly) => {
        allHours.forEach((hour) => {
          // Look for existing data for this date-hour combination
          const existingData = apiData.find((item) => {
            const itemDate = item.date.split(" ")[0];
            const itemHour = new Date(item.date).getHours();
            return itemDate === dateOnly && itemHour === hour;
          });

          const hourFormatted =
            hour === 0
              ? "12am"
              : hour < 12
              ? `${hour}am`
              : hour === 12
              ? "12pm"
              : `${hour - 12}pm`;

          let xCategory;
          if (shouldShowDayNames) {
            xCategory = getDayName(dateOnly);
          } else {
            xCategory = formatDateForDisplay(dateOnly);
          }

          let originalValue = 0; // Default to 0 for missing data
          let scaledValue = 0;

          if (existingData) {
            // Use existing data
            originalValue = existingData[dataKey] || 0;
            if (originalValue && !isNaN(originalValue) && originalValue !== 0) {
              scaledValue = originalValue * 100;
            }
          }
          // If no existing data, originalValue stays 0 and will get gray color

          completeGrid.push({
            hour: hourFormatted,
            xCategory: xCategory,
            value: scaledValue,
            originalValue: originalValue,
            fullDate: formatFullDate(dateOnly),
            originalDate: dateOnly,
          });
        });
      });

      return completeGrid;
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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [loading]);

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
