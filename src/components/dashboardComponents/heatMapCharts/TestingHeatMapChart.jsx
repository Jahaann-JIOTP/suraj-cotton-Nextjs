"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export default function HeatmapTrafo({
  data = [],
  meter = "Trafo1",
  startRange = 600,
  endRange = 2500,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { theme } = useTheme();

  /* -----------------------------------------------
      INIT
  ------------------------------------------------ */
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, null, {
      renderer: "canvas",
    });

    return () => chartInstance.current?.dispose();
  }, []);
  function rgbToHex(rgb) {
    // extract numbers from "rgb(255,190,90)"
    const match = rgb.match(/\d+/g);
    if (!match) return "#000000";

    let [r, g, b] = match.map(Number);

    const toHex = (n) => n.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /* -----------------------------------------------
      UTILITY: COLOR GRADIENT
  ------------------------------------------------ */
  function interpolateColor(c1, c2, p) {
    const R = Math.round(c1[0] + (c2[0] - c1[0]) * p);
    const G = Math.round(c1[1] + (c2[1] - c1[1]) * p);
    const B = Math.round(c1[2] + (c2[2] - c1[2]) * p);
    return `rgb(${R}, ${G}, ${B})`;
  }

  /* -----------------------------------------------
      GET HEAT COLOR FROM DYNAMIC RANGES
  ------------------------------------------------ */
  function getHeatColor(value) {
    // Zero → gray
    if (value === 0 || value === null || value === undefined)
      return theme === "light" ? "#BFBFBF" : "#374151";

    // Under start → solid blue
    if (value > 0 && value < startRange) return "rgb(0,0,255)";

    // Above end → solid red
    if (value > endRange) return "rgb(255,0,0)";

    // Otherwise interpolate across 5 equal segments
    const segmentSize = (endRange - startRange) / 5;

    const gradientColors = [
      [0, 0, 255], // blue
      [0, 191, 255], // sky
      [0, 255, 0], // green
      [255, 255, 0], // yellow
      [255, 165, 0], // orange
      [255, 0, 0], // red
    ];

    for (let i = 0; i < 5; i++) {
      const min = startRange + i * segmentSize;
      const max = startRange + (i + 1) * segmentSize;

      if (value >= min && value <= max) {
        const p = (value - min) / (max - min);
        return interpolateColor(gradientColors[i], gradientColors[i + 1], p);
      }
    }

    return "rgb(255,0,0)";
  }
  /* -----------------------------------------------
      MAIN CHART EFFECT
  ------------------------------------------------ */
  useEffect(() => {
    if (!chartInstance.current) return;

    if (!data || data.length === 0) {
      chartInstance.current.setOption({ series: [] });
      return;
    }

    const parseDate = (s) => new Date(s.replace(" ", "T"));

    /* -----------------------------------------------
        MAP RECORDS
    ------------------------------------------------ */
    const records = data.map((row) => ({
      dt: parseDate(row.date),
      originalDateString: row.date,
      value: row[meter],
    }));

    const allDates = records.map((r) => r.dt.toISOString().split("T")[0]);
    const minDateStr = allDates.reduce((a, b) => (a < b ? a : b));
    const maxDateStr = allDates.reduce((a, b) => (a > b ? a : b));

    const minDate = new Date(minDateStr + "T00:00:00");
    const maxDate = new Date(maxDateStr + "T00:00:00");

    const dayStarts = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      dayStarts.push(new Date(d));
    }

    const windowDefs = dayStarts.map((day) => {
      const start = new Date(day);
      start.setHours(6, 0, 0, 0);

      const end = new Date(day);
      end.setDate(end.getDate() + 1);
      end.setHours(6, 0, 0, 0);

      return { start, end };
    });

    const yHours = [];
    for (let i = 8; i < 30; i++) {
      const h = i % 24;
      const hour12 = h % 12 || 12;
      const ampm = h >= 12 ? "pm" : "am";
      yHours.push(`${hour12}${ampm}`);
    }
    const showHour = (i) => i % 3 === 0;

    /* -----------------------------------------------
        GRID BUILD (col-hour)
    ------------------------------------------------ */
    const grid = {};
    records.forEach((r) => {
      for (let col = 0; col < windowDefs.length; col++) {
        const w = windowDefs[col];
        if (r.dt >= w.start && r.dt < w.end) {
          let hour = r.dt.getHours();
          let idx = hour - 6;
          if (idx < 0) idx += 24;

          grid[`${col}-${idx}`] = r;
          break;
        }
      }
    });

    /* -----------------------------------------------
        HEATMAP DATA
    ------------------------------------------------ */
    const heatmapData = [];
    for (let col = 0; col < dayStarts.length; col++) {
      for (let h = 0; h < 24; h++) {
        const key = `${col}-${h}`;
        const rec = grid[key];

        const val = rec ? rec.value : 0;

        heatmapData.push({
          value: [col, h, val],
          realDateTime: rec ? rec.originalDateString : "",
          itemStyle: { color: getHeatColor(val) },
        });
      }
    }

    /* -----------------------------------------------
        LABELS
    ------------------------------------------------ */
    // const xLabels = dayStarts.map((d) => {
    //   return d.toLocaleDateString("en-US", {
    //     day: "2-digit",
    //     month: "2-digit",
    //   });
    // });
    const xLabels = dayStarts.map((d) => {
      const dayRange = dayStarts.length;

      // 1) If 8 or less → weekday name
      if (dayRange <= 8) {
        return d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, Wed
      }

      // 2) If 31 or less → DD/MM
      if (dayRange <= 31) {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        return `${dd}/${mm}`;
      }

      // 3) If more than 31 → Month name
      return d.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb, Mar
    });

    /* -----------------------------------------------
        THEME COLORS
    ------------------------------------------------ */
    const textColor = theme === "dark" ? "#E5E5E5" : "#333";
    const axisLineColor = theme === "dark" ? "#777" : "#CCC";

    /* -----------------------------------------------
        OPTION
    ------------------------------------------------ */
    const option = {
      backgroundColor: "transparent",
      tooltip: {
        position: "right",
        formatter: (p) =>
          p.data && p.data.realDateTime
            ? `${p.data.realDateTime}<br>${meter}: <b>${p.value[2]}</b>`
            : "Upcoming Data",
      },
      grid: { top: "6%", bottom: "6%", height: "80%" },
      visualMap: { show: false, min: 0, max: endRange },
      xAxis: {
        type: "category",
        data: xLabels,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: axisLineColor } },
      },
      yAxis: {
        type: "category",
        data: yHours,
        axisLabel: {
          color: textColor,
          formatter: (_, idx) => (showHour(idx) ? yHours[idx] : ""),
        },
        axisLine: { lineStyle: { color: axisLineColor } },
      },
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          itemStyle: {
            borderWidth: 0.5,
            borderColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "#fff",
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
    chartInstance.current.resize();

    const onResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [data, meter, startRange, endRange, theme]);

  /* -----------------------------------------------
      RENDER
  ------------------------------------------------ */
  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "270px",
        background: "transparent",
      }}
    />
  );
}
