"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

/**
 * Props:
 *  - data: [{ date: "YYYY-MM-DD HH:mm", Trafo1: 1428.24 }, ...]
 *  - meter: string e.g. "Trafo1" (default "Trafo1")
 */
export default function HeatmapTrafo({
  data = [],
  meter = "Trafo1",
  loading = false,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // init echarts once
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    return () => chartInstance.current?.dispose();
  }, []);

  // color mapping function (smooth gradients) + gray for 0
  function getHeatColor(value) {
    if (value === 0 || value === null || typeof value === "undefined")
      return "#D3D3D3"; // gray for zero or missing

    // ranges with RGB arrays
    const ranges = [
      { min: 600, max: 1000, start: [0, 0, 255], end: [0, 191, 255] }, // blue -> sky
      { min: 1000, max: 1400, start: [0, 191, 255], end: [0, 255, 0] }, // sky -> green
      { min: 1400, max: 1700, start: [0, 255, 0], end: [255, 255, 0] }, // green -> yellow
      { min: 1700, max: 2100, start: [255, 255, 0], end: [255, 165, 0] }, // yellow -> orange
      { min: 2100, max: 2500, start: [255, 165, 0], end: [255, 0, 0] }, // orange -> red
    ];

    for (const r of ranges) {
      if (value >= r.min && value <= r.max) {
        const p = (value - r.min) / (r.max - r.min);
        const R = Math.round(r.start[0] + (r.end[0] - r.start[0]) * p);
        const G = Math.round(r.start[1] + (r.end[1] - r.start[1]) * p);
        const B = Math.round(r.start[2] + (r.end[2] - r.start[2]) * p);
        return `rgb(${R}, ${G}, ${B})`;
      }
    }

    // clamp
    if (value < 600) return `rgb(0, 0, 255)`; // blue
    return `rgb(255, 0, 0)`; // red for >2500
  }

  useEffect(() => {
    if (!chartInstance.current) return;

    // if no data, clear chart
    if (!data || data.length === 0) {
      chartInstance.current.setOption({ series: [] });
      return;
    }

    // ---------- Parse input timestamps ----------
    // helper: parse "YYYY-MM-DD HH:mm" to Date reliably
    const parseDate = (s) => {
      // replace space with 'T' to make an ISO-like string; assume local time
      // if your incoming timestamps are UTC, adapt accordingly.
      return new Date(s.replace(" ", "T"));
    };

    // build array of records with their Date and meter value
    const records = data.map((row) => {
      const dt = parseDate(row.date);
      return {
        originalDateStr: row.date,
        dt,
        value: row[meter],
      };
    });

    // ---------- Determine C-units (columns) ----------
    // The C-unit columns are based on dates in the dataset.
    // We will determine the min and max dates present (by calendar day),
    // then create columns for each day in [minDate .. maxDate].
    const allDates = records.map((r) => r.dt.toISOString().split("T")[0]); // YYYY-MM-DD
    const minDateStr = allDates.reduce((a, b) => (a < b ? a : b));
    const maxDateStr = allDates.reduce((a, b) => (a > b ? a : b));

    const minDate = new Date(minDateStr + "T00:00:00");
    const maxDate = new Date(maxDateStr + "T00:00:00");

    // Build daily start dates list from minDate to maxDate (inclusive).
    // Each column Ck will start at date_i 06:00 and end at date_i+1 05:59:59
    const dayStarts = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      dayStarts.push(new Date(d)); // copy
    }

    // We'll create one extra column (the next day) if records exist after the last day's 06:00
    // But per your requirement, columns: C1 for minDate, C2 minDate+1, ... up to maxDate (as start)
    // So columns are dayStarts (min .. max).
    const columnCount = dayStarts.length; // C1..Cn where Cn starts at maxDate 06:00

    // ---------- Build mapping of column windows ----------
    // For each column index i: windowStart = dayStarts[i] at 06:00:00
    // windowEnd = dayStarts[i] + 1 day at 05:59:59 (we will use < next day 06:00)
    const colWindows = dayStarts.map((ds) => {
      const start = new Date(ds);
      start.setHours(6, 0, 0, 0);
      const end = new Date(ds);
      end.setDate(end.getDate() + 1);
      end.setHours(6, 0, 0, 0); // exclusive end
      return { start, end };
    });

    // ---------- Prepare day index map (start date -> col index) ----------
    const startDateStrs = dayStarts.map((d) => d.toISOString().split("T")[0]);
    const dayIndexMap = {};
    startDateStrs.forEach((s, i) => (dayIndexMap[s] = i));

    // ---------- Y axis hours labels 6AM -> 5AM (24 rows) ----------
    const yHours = [];
    for (let i = 6; i < 30; i++) {
      const hr = i % 24;
      const ampm = hr >= 12 ? "pm" : "am";
      const hour12 = hr % 12 === 0 ? 12 : hr % 12;
      yHours.push(`${hour12}${ampm}`);
    }
    const showHourLabel = (idx) => idx % 3 === 0;

    // ---------- Map records to (colIndex, hourIndex) ----------
    // We'll create a grid map keyed by `${col}-${hour}`
    const grid = {}; // store realDateTime for tooltip and value
    records.forEach((rec) => {
      // find the column whose window contains this timestamp
      const dt = rec.dt;
      // find column index i where colWindows[i].start <= dt < colWindows[i].end
      let foundIndex = -1;
      for (let i = 0; i < colWindows.length; i++) {
        const w = colWindows[i];
        if (dt >= w.start && dt < w.end) {
          foundIndex = i;
          break;
        }
      }
      // If timestamp is earlier than first window start but same day? skip
      // If foundIndex == -1 and dt >= last window.start and dt < last window.end (should be covered)
      // If not foundIndex, ignore (out of range)
      if (foundIndex === -1) return;

      // compute hour index: 0 = 6AM, ... 23 = 5AM next day
      const hour = dt.getHours();
      let hourIndex = hour - 6;
      if (hourIndex < 0) hourIndex += 24;

      const key = `${foundIndex}-${hourIndex}`;
      // if multiple readings fall in same hour slot, we can choose latest or average.
      // Here we keep the last value (you can change to average if needed).
      grid[key] = {
        value: rec.value,
        realDateTime: rec.originalDateStr,
      };
    });

    // ---------- Build final heatmap data: ensure every col x every hour exists ----------
    const heatmapData = [];
    for (let col = 0; col < columnCount; col++) {
      for (let hourIdx = 0; hourIdx < 24; hourIdx++) {
        const key = `${col}-${hourIdx}`;
        if (grid[key]) {
          const val = grid[key].value;
          heatmapData.push({
            value: [col, hourIdx, val],
            realDateTime: grid[key].realDateTime,
            itemStyle: { color: getHeatColor(val) },
          });
        } else {
          // No data — show gray (value 0)
          heatmapData.push({
            value: [col, hourIdx, 0],
            realDateTime: "",
            itemStyle: { color: "#D3D3D3" },
          });
        }
      }
    }

    // ---------- X-axis labels: show start date (day number) for each column ----------
    // As you requested: label = day of column start (e.g., 13 for 13 Nov)
    const dayRangeCount = dayStarts.length;

    const xLabels = dayStarts.map((d) => {
      if (dayRangeCount <= 8) {
        // show day name e.g. Mon, Tue
        return d.toLocaleDateString("en-US", { weekday: "short" });
      }

      if (dayRangeCount <= 31) {
        // show dd/mm
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        return `${dd}/${mm}`;
      }

      // default fallback (same as original) — only day number
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      // return String(d.getDate()).padStart(2, "0");
      return `${dd}/${mm}`;
    });

    // ---------- ECharts option ----------
    const option = {
      tooltip: {
        position: "top",
        enterable: true,
        formatter: (p) => {
          // p.data.realDateTime might be empty for no-data cells
          if (p.data && p.data.realDateTime) {
            return `${p.data.realDateTime} ${meter}: <b>${p.value[2]}</b>`;
          }
          return "Upcoming data fields";
        },
      },

      grid: { top: "6%", bottom: "6%", height: "78%", width: "100%" },

      // required hidden visualMap for heatmap
      visualMap: { show: false, min: 0, max: 2500 },

      xAxis: {
        type: "category",
        data: xLabels,
        axisLabel: { fontSize: 12 },
        splitArea: { show: true },
      },

      yAxis: {
        type: "category",
        data: yHours,
        axisLabel: {
          formatter: (_, idx) => (showHourLabel(idx) ? yHours[idx] : ""),
        },
        splitArea: { show: true },
      },

      series: [
        {
          name: meter,
          type: "heatmap",
          data: heatmapData,
          label: { show: false },
          itemStyle: {
            borderWidth: 0.5,
            borderColor: "rgba(255,255,255,0.7)", // thin white
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 8,
              shadowColor: "rgba(0,0,0,0.3)",
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // responsive
    const onResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [data, meter]);

  // return loading === true ? (
  //   <CustomLoader />
  // ) : (
  //   <div ref={chartRef} style={{ width: "100%", height: "520px" }} />
  // );
  return (
    // <div className="w-full">
    //   {loading === true ? (
    //     <div
    //       className=""
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "start",
    //       }}
    //     >
    //       <CustomLoader size="50px" />
    //     </div>
    //   ) : (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "270px",
        transition: "opacity 0.3s ease",
      }}
    />
    //   )}
    // </div>
  );
}
