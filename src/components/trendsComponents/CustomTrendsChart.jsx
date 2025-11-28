"use client";

import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { useTheme } from "next-themes";
import { FileImage } from "lucide-react";
import { Tooltip } from "@mui/material";

const predefinedColors = [
  "#c2410c",
  "#1f77b4",
  "#5B9486",
  // "#4d7c0f",
  "#2ca02c",
  "#134e4a",
  "#b91c1c",
  "#FFB000",
  "#6b21a8",
];

const CustomTrendChart = ({ data = [], yAxisLabel = "" }) => {
  const { theme } = useTheme();
  const chartRef = useRef(null);
  const exportBtnRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const root = am5.Root.new(chartRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const myColors = predefinedColors.map((c) => am5.color(c));
    const myColorSet = am5.ColorSet.new(root, {
      colors: myColors,
      reuse: false,
      step: 1,
    });
    // ✅ Set theme-related UI colors (text, grid, bg)
    root.interfaceColors.setAll({
      text: theme === "dark" ? am5.color("#fff") : am5.color("#000"),
      grid: theme === "dark" ? am5.color("#444") : am5.color("#ccc"),
      background: theme === "dark" ? am5.color("#0f172a") : am5.color("#fff"),
    });

    // ✅ Chart container
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout,
        // colors: myColorSet, // ✅ this is where colorSet belongs!
      })
    );

    // ✅ Cursor
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "zoomX" })
    );
    cursor.lineY.set("visible", false);
    // cursor.set("snapToSeries", chart.series?.values || []);
    // cursor.set("snapToSeriesBy", "x");

    // ✅ Format Data
    const formattedData = data.map((d) => ({
      ...d,
      Date: new Date(d.Date).getTime(),
    }));

    // calculate minimum and maximum data
    let globalMin = Infinity;
    let globalMax = -Infinity;

    // ✅ X Axis
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 15 },
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 60 }),
      })
    );

    // ✅ Y Axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: yAxisLabel,
        y: am5.p50,
        centerX: am5.p50,
        fill: theme === "dark" ? am5.color("#fff") : am5.color("#000"),
      })
    );

    // ✅ Series setup
    const keys = Object.keys(data[0]).filter(
      (k) => k !== "Date" && k !== "Time"
    );
    data.forEach((item) => {
      keys.forEach((key) => {
        const value = item[key];
        if (typeof value === "number") {
          globalMin = Math.min(globalMin, value);
          globalMax = Math.max(globalMax, value);
        }
      });
    });

    keys.forEach((key, index) => {
      // const color = am5.color(myColors[index % myColors.length]);
      const color = am5.color(
        predefinedColors[index % predefinedColors.length]
      );

      const tooltip = am5.Tooltip.new(root, {
        pointerOrientation: "left", // <<< ALIGN LEFT
        forceHidden: false,
        keepTargetHover: true,
        labelText: `{valueX.formatDate("dd-MM-yyyy")}:{valueX.formatDate("HH:mm")} [bold]{name}:[/] {valueY}`,
        getFillFromSprite: false,
        getStrokeFromSprite: false,
        autoTextColor: false,
      });

      tooltip.get("background").setAll({
        fill: color,
        stroke: color,
        fillOpacity: 1,
      });
      tooltip.label.setAll({ fill: am5.color("#fff") });

      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: key,
          xAxis,
          yAxis,
          valueYField: key,
          valueXField: "Date",
          strokeWidth: 2,
          stroke: color,
          fill: color,
          tooltip,
          connect: true,
        })
      );
      // Bind tooltip to series
      series.set("tooltip", tooltip);

      // Ensure tooltip shows ANYWHERE on hover
      // cursor.set("snapToSeries", [series]);
      series.strokes.template.setAll({
        stroke: color,
        strokeWidth: 2,
      });
      series.fills.template.setAll({ fillOpacity: 0, visible: false });
      series.setAll({ locationX: 0 });

      series.data.setAll(formattedData);
      series.appear(1000);
    });
    // cursor.set("snapMode", "nearest");
    // cursor.set("snapToSeries", chart.series.values);
    // cursor.set("snapToSeriesBy", "x");

    // ✅ Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 20,
      })
    );
    legend.data.setAll(chart.series.values);

    // ✅ Scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

    // ✅ Export
    const exporting = am5exporting.Exporting.new(root, {
      filePrefix: "dynamic_chart",
      dataSource: formattedData,
    });

    if (exportBtnRef.current) {
      exportBtnRef.current.onclick = () => exporting.download("png");
    }

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data, yAxisLabel, theme]);

  return (
    <div className="relative w-full bg-transparent">
      {/* ✅ Export Button */}
      {data.length !== 0 && (
        <Tooltip
          title={"Export PNG"}
          arrow
          placement="bottom-end"
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "#025697",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 500,
              },
            },
            arrow: {
              sx: {
                color: "#025697",
              },
            },
          }}
        >
          <button
            ref={exportBtnRef}
            className="absolute top-[-12px] right-3 z-10 p-1 rounded bg-gray-300 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FileImage className="w-5 h-5 text-[#025697]" />
          </button>
        </Tooltip>
      )}

      {/* ✅ Chart container */}
      <div className="mt-5">
        <div ref={chartRef} className="w-full h-[58vh]" />
      </div>
    </div>
  );
};

export default CustomTrendChart;
