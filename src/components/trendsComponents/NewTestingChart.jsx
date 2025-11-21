"use client";

import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { Tooltip } from "@mui/material";
import { FileImage } from "lucide-react";
import { useTheme } from "next-themes";

const predefinedColors = [
  "#b4801fff",
  "#1f77b4",
  "#5B9486",
  "#ff7f0e",
  "#2ca02c",
  "#B0C01A",
  "#9b0202ff",
  "#FFB000",
  "#50048bff",
];

export default function SimpleAm4Chart({ data = [], yAxisTitle = "" }) {
  const chartRef = useRef(null);
  const exportBtnRef = useRef(null);
  const { theme } = useTheme();

  console.log(yAxisTitle);
  useEffect(() => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((d) => ({
      ...d,
      Date: new Date(d.Date).getTime(),
    }));

    const seriesKeys = Object.keys(data[0]).filter(
      (k) => k !== "Date" && k !== "Time"
    );

    const root = am5.Root.new(chartRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const isDark = theme === "dark";
    root.interfaceColors.set(
      "background",
      isDark ? am5.color(0x121212) : am5.color(0xffffff)
    );
    root.interfaceColors.set(
      "grid",
      isDark ? am5.color(0x444444) : am5.color(0xe0e0e0)
    );
    root.interfaceColors.set(
      "text",
      isDark ? am5.color(0xffffff) : am5.color(0x000000)
    );

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        panX: false,
        wheelX: "zoomX",
        pinchZoomX: true,
      })
    );

    /* -----------------------------
     * SCROLLBAR (SIMPLE GREY)
     * ----------------------------- */
    const scrollbar = am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 20,
    });

    scrollbar.get("background").setAll({
      fill: am5.color("#e0e0e0"),
      fillOpacity: 1,
      strokeOpacity: 0,
      cornerRadius: 10,
    });

    scrollbar.chart.set("visible", false);

    chart.set("scrollbarX", scrollbar);
    chart.topAxesContainer.children.push(scrollbar);

    /* -----------------------------
     * X & Y AXES
     * ----------------------------- */
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 15 },
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 60 }),
      })
    );

    const yAxisRenderer = am5xy.AxisRendererY.new(root, { opposite: false });
    yAxisRenderer.labels.template.setAll({ paddingRight: 10 }); // fix label cut off

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yAxisRenderer,
      })
    );

    // Y-axis title properly
    if (yAxisTitle) {
      yAxis.get("renderer").labels.template.setAll({
        paddingRight: 10,
      });

      yAxis.children.unshift(
        am5.Label.new(root, {
          text: yAxisTitle,
          rotation: -90,
          fontSize: 14,
          fill: root.interfaceColors.get("text"),
          centerX: am5.p50,
          centerY: am5.p50,
          y: am5.p50,
          x: am5.p50,
        })
      );
    }

    /* -----------------------------
     * CURSOR (snap + drag zoom)
     * ----------------------------- */
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "zoomX" })
    );
    cursor.lineY.set("visible", false);

    /* -----------------------------
     * SERIES + TOOLTIP
     * ----------------------------- */
    const seriesList = [];

    /* -----------------------------
     * SERIES + TOOLTIP  (FROM FIRST CODE)
     * ----------------------------- */
    seriesKeys.forEach((key, index) => {
      const color = am5.color(
        predefinedColors[index % predefinedColors.length]
      );

      // Use a series-attached tooltip so amCharts can snap and align them
      const tooltip = am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{name}: {valueY}",
        getFillFromSprite: true,
        getStrokeFromSprite: true,
        autoTextColor: false,
      });

      // ---- Line series ----
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: key,
          xAxis,
          yAxis,
          valueXField: "Date",
          valueYField: key,
          stroke: color,
          tooltip,
          strokeWidth: 2,
          connect: true,
        })
      );

      series.strokes.template.setAll({
        stroke: color,
        strokeWidth: 2,
      });

      series.fills.template.setAll({
        fillOpacity: 0,
        visible: false,
      });

      series.data.setAll(formattedData);
      series.appear(1000);
      // Register series so cursor can snap to them
      seriesList.push(series);
    });

    cursor.set("snapToSeries", seriesList);
    // Let amCharts handle showing/hiding and aligning tooltips when
    // `snapToSeries` is set on the cursor.

    /* -----------------------------
     * LEGEND
     * ----------------------------- */
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );
    legend.data.setAll(chart.series.values);
    // ✅ Export
    const exporting = am5exporting.Exporting.new(root, {
      filePrefix: "custom_trends_chart",
      dataSource: formattedData,
    });

    if (exportBtnRef.current) {
      exportBtnRef.current.onclick = () => exporting.download("png");
    }

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data, yAxisTitle, theme]);

  return (
    <div>
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
      <div className="mt-5">
        <div ref={chartRef} style={{ width: "100%", height: "60vh" }} />
      </div>
    </div>
  );
}
