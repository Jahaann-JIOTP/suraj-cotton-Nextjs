"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { useTheme } from "next-themes";
import { FileImage } from "lucide-react";
import { Tooltip } from "@mui/material";

const predefinedColors = [
  "#b4801fff",
  "#1f77b4",
  "#5B9486",
  "#ff7f0e",
  "#2ca02c",
  "#B0C01A",
  "#d62727ff",
  "#FFB000",
  "#8b043cff",
];

const SimpleAm4Chart = ({ data = [], yAxisLabel = "" }) => {
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
      reuse: true,
      step: 0,
    });

    root.setThemes([am5themes_Animated.new(root)]);
    root.interfaceColors.setAll({
      text: theme === "dark" ? am5.color("#fff") : am5.color("#000"),
      grid: theme === "dark" ? am5.color("#444") : am5.color("#ccc"),
      background: theme === "dark" ? am5.color("#0f172a") : am5.color("#fff"),
    });

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout,
        colors: myColorSet,
      })
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "zoomX" })
    );
    cursor.lineY.set("visible", false);

    const formattedData = data.map((d) => ({
      ...d,
      Date: new Date(d.Date).getTime(),
    }));

    const dates = formattedData.map((d) => d.Date);
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRangeMs = maxDate - minDate;
    const dateRangeDays = dateRangeMs / (1000 * 60 * 60 * 24);

    const shouldShowDate = dateRangeDays > 1;

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 15 },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 60,
        }),
        tooltip: am5.Tooltip.new(root, {}),
        startLocation: 0,
        endLocation: 0,
        strictMinMax: true, // strictMinMax: true to ensure full range is shown
        min: minDate,
        max: maxDate,
        dateFormats: {
          minute: shouldShowDate ? "HH:mm" : "HH:mm",
          hour: shouldShowDate ? "HH:mm" : "HH:mm",
          day: shouldShowDate ? "MMM dd" : "HH:mm",
        },
        periodChangeDateFormats: {
          day: "MMM dd",
          month: "MMM yyyy",
        },
      })
    );

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

    const keys = Object.keys(data[0]).filter(
      (k) => k !== "Date" && k !== "Time"
    );

    keys.forEach((key, index) => {
      const colorIndex = index % myColors.length;
      const color = myColors[colorIndex];

      const tooltip = am5.Tooltip.new(root, {
        labelText: `[bold]{name}:[/] {valueY}`,
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
          tooltip,
          connect: true,
        })
      );

      series.strokes.template.setAll({
        stroke: color,
        strokeWidth: 2,
      });
      series.fills.template.setAll({ fillOpacity: 0, visible: false });
      series.setAll({ locationX: 0 });

      series.data.setAll(formattedData);
      series.appear(1000);
    });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 20,
      })
    );
    legend.data.setAll(chart.series.values);

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

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
        <div ref={chartRef} className="w-full h-[58vh]" />
      </div>
    </div>
  );
};

export default SimpleAm4Chart;
