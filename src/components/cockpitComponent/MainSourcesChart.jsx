"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export default function MainSourcesChart({
  value,
  min = 0,
  max = 240,
  width = "100%",
  height = "400px",
  startAngle = 180,
  endAngle = 0,
  splitNumber = 12,
  unit = "MW",
  showDetail = true,
}) {
  const chartRef = useRef(null);
  const instance = useRef(null);
  const { theme } = useTheme();
  const chartColorNew = "#dc2626";

  // Generate gradient colors from green to red
  const getGradientColors = () => {
    const colors = [];
    const segments = 24; // Number of color segments

    for (let i = 0; i <= segments; i++) {
      const ratio = i / segments;

      let r, g, b;

      if (ratio < 0.5) {
        // Green to Yellow (0.0 - 0.5)
        const localRatio = ratio * 2;
        r = Math.floor(255 * localRatio);
        g = 255;
        b = 0;
      } else {
        // Yellow to Red (0.5 - 1.0)
        const localRatio = (ratio - 0.5) * 2;
        r = 255;
        g = Math.floor(255 * (1 - localRatio));
        b = 0;
      }

      colors.push([ratio, `rgb(${r}, ${g}, ${b})`]);
    }

    return colors;
  };

  // Get theme-based styles
  const getChartStyles = () => {
    const isDark = theme === "dark";
    const textColor = isDark ? "#ffffff" : "#000000";
    const mutedColor = isDark ? "#888" : "#999";
    const backgroundColor = isDark ? "#1f2937" : "#fff";
    const borderColor = isDark ? "#374151" : "#999";

    return {
      axisLabel: {
        distance: -10,
        color: textColor,
        fontSize: 15,
      },
      detail: {
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        width: "60%",
        // lineHeight: 30, // Reduced line height
        // height: 30, // Reduced height
        borderRadius: 8,
        offsetCenter: [0, "35%"], // Adjusted vertical position
        valueAnimation: true,
        formatter: function (value) {
          return `{value|${value}} {unit|${unit}}`;
        },
        rich: {
          value: {
            fontSize: 20,
            fontWeight: "bolder",
            color: textColor,
            align: "center",
            verticalAlign: "middle",
          },
          unit: {
            fontSize: 14,
            color: mutedColor,
            align: "center",
            verticalAlign: "middle",
            padding: [0, 0, 0, 5], // Small padding between value and unit
          },
        },
      },
      axisTick: {
        splitNumber: 2,
        distance: -25,
        lineStyle: {
          width: 3,
          // color: mutedColor,
          // color: "#dc2626",
          color: chartColorNew,
        },
      },
      splitLine: {
        length: 8,
        distance: -30,
        lineStyle: {
          width: 3,
          // color: mutedColor,
          color: chartColorNew,
        },
      },
    };
  };

  useEffect(() => {
    if (!instance.current) {
      instance.current = echarts.init(chartRef.current);
    }

    const styles = getChartStyles();
    // const gradientColors = getGradientColors();

    const option = {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      series: [
        {
          type: "gauge",
          startAngle,
          endAngle,
          min,
          max,
          splitNumber,

          // Progress bar removed - no bar following the needle
          progress: {
            show: false, // Set to false to hide the progress bar
          },

          // Axis line with gradient - this is the static background bar
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 18,
              // color: [[1, "#dc2626"]],
              color: [[1, chartColorNew]],
            },
          },

          // Pointer configuration
          pointer: {
            icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
            length: "90%",
            width: 11,
            offsetCenter: [0, "5%"],
            itemStyle: {
              // color: "#aa5ef7ff",
              // color: "#dc2626",
              color: chartColorNew,
            },
          },

          // Small bars for ticks
          axisTick: styles.axisTick,

          // Split lines (small bars)
          splitLine: styles.splitLine,

          // Axis labels
          axisLabel: styles.axisLabel,

          title: {
            show: false,
          },

          // Detail display
          detail: showDetail ? styles.detail : { show: false },

          data: [
            {
              value: Math.max(min, Math.min(max, value)),
            },
          ],
        },
      ],
    };

    instance.current.setOption(option);

    // Add resize handler
    const resizeChart = () => instance.current?.resize();
    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      if (instance.current) {
        instance.current.dispose();
        instance.current = null;
      }
    };
  }, [theme]);

  // Update chart when props change
  useEffect(() => {
    if (instance.current) {
      const styles = getChartStyles();
      // const gradientColors = getGradientColors();

      instance.current.setOption({
        series: [
          {
            min,
            max,
            splitNumber,
            axisLine: {
              lineStyle: {
                // color: [[1, "#dc2626"]],
                color: [[1, chartColorNew]],
              },
            },
            detail: showDetail ? styles.detail : { show: false },
            data: [
              {
                value: Math.max(min, Math.min(max, value)),
              },
            ],
          },
        ],
      });
    }
  }, [value, min, max, splitNumber, showDetail, unit, theme]);

  return (
    <div className="h-[380px]">
      <div
        ref={chartRef}
        style={{
          width,
          height,
          display: "block",
          lineHeight: 0,
        }}
        className="transition-all"
      />
    </div>
  );
}
