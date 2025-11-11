"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

/**
 * DynamicEChart Component
 * @param {Array} data - Array of objects with Date and multiple meter keys
 * @param {String} param - Y-axis label text
 * @example
 * <DynamicEChart data={yourData} param="Power (kW)" />
 */
export default function DynamicEChart({ data = [], param = "Value" }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Cleanup old chart
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // ✅ Prepare data
    const timestamps = data.map((item) => new Date(item.Date).getTime());
    const keys = Object.keys(data[0]).filter(
      (k) => k !== "Date" && k !== "Time"
    );

    // ✅ Build series dynamically
    const series = keys.map((key) => ({
      name: key,
      type: "line",
      showSymbol: false,
      smooth: true,
      data: data.map((d) => [new Date(d.Date).getTime(), d[key]]),
    }));

    // ✅ Dynamic Y-axis padding
    const longestLabel =
      Math.max(
        ...data.map((d) =>
          Math.max(...Object.values(d).map((v) => String(v).length))
        )
      ) || 4;
    const yLabelGap = Math.min(80, longestLabel * 6 + 40);

    // ✅ Define chart options
    const option = {
      backgroundColor: "#fff",
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const date = new Date(params[0].value[0]);
          const dateStr = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const timeStr = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          let content = `<div style="font-weight:bold;margin-bottom:4px">${dateStr} ${timeStr}</div>`;
          params.forEach((p) => {
            content += `
              <div>
                <span style="display:inline-block;width:10px;height:10px;background:${
                  p.color
                };margin-right:6px;border-radius:50%"></span>
                ${p.seriesName}: <b>${p.value[1]?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</b>
              </div>`;
          });
          return content;
        },
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        bottom: 0,
        textStyle: { color: "#333" },
        type: "scroll",
      },
      grid: {
        left: yLabelGap,
        right: 20,
        top: 60,
        bottom: 80,
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
          height: 25,
          bottom: 50,
        },
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          formatter: (value, index) => {
            // Show time only when zoomed in enough
            const range = chart.getModel()?.getComponent("dataZoom")?.option;
            const zoomSpan = range ? range.end - range.start : 100;
            const date = new Date(value);

            // If zoomed out (wide range) → show date only
            if (zoomSpan > 20) {
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              });
            }

            // Zoomed in (narrow range) → show time only
            return date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });
          },
          color: "#333",
          rotate: 30,
        },
        axisLine: { lineStyle: { color: "#999" } },
      },
      yAxis: {
        type: "value",
        name: param,
        nameLocation: "middle",
        nameGap: 45,
        nameTextStyle: {
          color: "#1F5897",
          fontWeight: "bold",
        },
        axisLabel: { color: "#333" },
        splitLine: {
          lineStyle: { type: "dashed", color: "#ddd" },
        },
      },
      series,
      color: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
      ],
    };

    chart.setOption(option);

    // ✅ Responsive resize
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, param]);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={chartRef}
        className="w-full h-[450px] bg-white rounded-2xl shadow-md border border-gray-200"
      />
    </div>
  );
}
