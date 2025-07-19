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

  useLayoutEffect(() => {
    initializeTheme();

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

        // Check for invalid or zero values - show gray
        if (!originalVal || originalVal === 0 || isNaN(originalVal)) {
          return am4core.color("#9CA3AF"); // Gray color for invalid/zero values
        }

        // Your existing color mapping logic
        if (originalVal >= 396) return am4core.color("#fe0803");
        else if (originalVal >= 392) return am4core.color("#fe1203");
        else if (originalVal >= 388) return am4core.color("#fe1d03");
        else if (originalVal >= 384) return am4core.color("#fe2703");
        else if (originalVal >= 380) return am4core.color("#fe3103");
        else if (originalVal >= 376) return am4core.color("#fe3b02");
        else if (originalVal >= 372) return am4core.color("#fe4602");
        else if (originalVal >= 368) return am4core.color("#fe5002");
        else if (originalVal >= 364) return am4core.color("#fe5a02");
        else if (originalVal >= 360) return am4core.color("#fe6502");
        else if (originalVal >= 356) return am4core.color("#fe6f02");
        else if (originalVal >= 352) return am4core.color("#fe7902");
        else if (originalVal >= 348) return am4core.color("#fe8402");
        else if (originalVal >= 344) return am4core.color("#fd8e01");
        else if (originalVal >= 340) return am4core.color("#fd9801");
        else if (originalVal >= 336) return am4core.color("#fdad01");
        else if (originalVal >= 332) return am4core.color("#fdb701");
        else if (originalVal >= 328) return am4core.color("#fdc101");
        else if (originalVal >= 324) return am4core.color("#fdcc01");
        else if (originalVal >= 320) return am4core.color("#fdd601");
        else if (originalVal >= 316) return am4core.color("#fde000");
        else if (originalVal >= 312) return am4core.color("#fdea00");
        else if (originalVal >= 308) return am4core.color("#fdea00");
        else if (originalVal >= 304) return am4core.color("#fdf500");
        else if (originalVal >= 300) return am4core.color("#fdff00");
        else if (originalVal >= 296) return am4core.color("#fdff00");
        else if (originalVal >= 292) return am4core.color("#f3ff00");
        else if (originalVal >= 288) return am4core.color("#e9ff00");
        else if (originalVal >= 284) return am4core.color("#dfff00");
        else if (originalVal >= 280) return am4core.color("#d5ff00");
        else if (originalVal >= 276) return am4core.color("#cbff00");
        else if (originalVal >= 272) return am4core.color("#c1ff00");
        else if (originalVal >= 268) return am4core.color("#b6ff00");
        else if (originalVal >= 264) return am4core.color("#a2ff00");
        else if (originalVal >= 260) return am4core.color("#98ff00");
        else if (originalVal >= 256) return am4core.color("#8eff00");
        else if (originalVal >= 252) return am4core.color("#84ff01");
        else if (originalVal >= 248) return am4core.color("#7aff01");
        else if (originalVal >= 244) return am4core.color("#70ff01");
        else if (originalVal >= 240) return am4core.color("#66ff01");
        else if (originalVal >= 236) return am4core.color("#5cff01");
        else if (originalVal >= 232) return am4core.color("#52ff01");
        else if (originalVal >= 228) return am4core.color("#48ff01");
        else if (originalVal >= 224) return am4core.color("#3dff01");
        else if (originalVal >= 220) return am4core.color("#33ff01");
        else if (originalVal >= 216) return am4core.color("#29ff01");
        else if (originalVal >= 212) return am4core.color("#1fff01");
        else if (originalVal >= 208) return am4core.color("#15ff01");
        else if (originalVal >= 204) return am4core.color("#0bff01");
        else if (originalVal >= 200) return am4core.color("#0bff01");
        else if (originalVal >= 196) return am4core.color("#0bfe0c");
        else if (originalVal >= 192) return am4core.color("#0bfe16");
        else if (originalVal >= 188) return am4core.color("#0afd21");
        else if (originalVal >= 184) return am4core.color("#0afc2b");
        else if (originalVal >= 180) return am4core.color("#0afc36");
        else if (originalVal >= 176) return am4core.color("#0afb40");
        else if (originalVal >= 172) return am4core.color("#09fa4b");
        else if (originalVal >= 168) return am4core.color("#09fa55");
        else if (originalVal >= 164) return am4core.color("#09f960");
        else if (originalVal >= 160) return am4core.color("#09f86a");
        else if (originalVal >= 156) return am4core.color("#08f875");
        else if (originalVal >= 152) return am4core.color("#08f77f");
        else if (originalVal >= 148) return am4core.color("#08f68a");
        else if (originalVal >= 144) return am4core.color("#08f694");
        else if (originalVal >= 140) return am4core.color("#07f59f");
        else if (originalVal >= 136) return am4core.color("#07f4a9");
        else if (originalVal >= 132) return am4core.color("#07f4b4");
        else if (originalVal >= 128) return am4core.color("#07f3be");
        else if (originalVal >= 124) return am4core.color("#06f2c9");
        else if (originalVal >= 120) return am4core.color("#06f2d3");
        else if (originalVal >= 116) return am4core.color("#06f1de");
        else if (originalVal >= 112) return am4core.color("#06f0e8");
        else if (originalVal >= 108) return am4core.color("#05f0f3");
        else if (originalVal >= 104) return am4core.color("#05effd");
        else if (originalVal >= 100) return am4core.color("#05effd");
        else if (originalVal >= 96) return am4core.color("#05e7fd");
        else if (originalVal >= 92) return am4core.color("#05dffd");
        else if (originalVal >= 88) return am4core.color("#05d6fd");
        else if (originalVal >= 84) return am4core.color("#04cefd");
        else if (originalVal >= 80) return am4core.color("#04c6fd");
        else if (originalVal >= 76) return am4core.color("#04befe");
        else if (originalVal >= 72) return am4core.color("#04b6fe");
        else if (originalVal >= 68) return am4core.color("#04adfe");
        else if (originalVal >= 64) return am4core.color("#04a5fe");
        else if (originalVal >= 60) return am4core.color("#039dfe");
        else if (originalVal >= 56) return am4core.color("#0395fe");
        else if (originalVal >= 52) return am4core.color("#038dfe");
        else if (originalVal >= 48) return am4core.color("#0384fe");
        else if (originalVal >= 44) return am4core.color("#037cfe");
        else if (originalVal >= 40) return am4core.color("#0374fe");
        else if (originalVal >= 36) return am4core.color("#026cfe");
        else if (originalVal >= 32) return am4core.color("#0263fe");
        else if (originalVal >= 28) return am4core.color("#025bff");
        else if (originalVal >= 24) return am4core.color("#0253ff");
        else if (originalVal >= 20) return am4core.color("#024bff");
        else if (originalVal >= 16) return am4core.color("#0243ff");
        else if (originalVal >= 12) return am4core.color("#013aff");
        else if (originalVal >= 4) return am4core.color("#0132ff");
        else if (originalVal >= 0) return am4core.color("#012aff");
        else return am4core.color("#012aff");
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

    // Fixed data transformation function
    const transformApiDataToHeatmap = (apiData) => {
      const uniqueDates = getUniqueDates(apiData);
      const shouldShowDayNames = uniqueDates.length <= 7;
      let datesToShow = [];

      if (shouldShowDayNames) {
        datesToShow = uniqueDates;
      } else {
        datesToShow = uniqueDates.filter((_, index) => index % 3 === 0);
      }

      return apiData.map((item) => {
        const date = new Date(item.date);
        const dateOnly = item.date.split(" ")[0];

        const hour = date.getHours();
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
          if (datesToShow.includes(dateOnly)) {
            xCategory = formatDateForDisplay(dateOnly);
          } else {
            xCategory = formatDateForDisplay(dateOnly);
          }
        }

        // Get the correct value based on the dataKey passed to component
        const originalValue = item[dataKey] || 0;
        let scaledValue = 0;

        if (originalValue && !isNaN(originalValue) && originalValue !== 0) {
          scaledValue = originalValue * 100;
        }

        return {
          hour: hourFormatted,
          xCategory: xCategory,
          value: scaledValue,
          originalValue: originalValue,
          fullDate: formatFullDate(dateOnly),
          originalDate: dateOnly,
        };
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
