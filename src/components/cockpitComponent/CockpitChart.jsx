"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export default function CockpitChart({
  outerValue = 0,
  innerValue = 0,
  width = "100%",
  height = "250px",
  innerRadiousProp,
  outerRadiousProp,
  innerMinRange,
  innerMaxRange,
  title = "",
  containerHeight,
  outerMinRange,
  outerMaxRange,
}) {
  const chartRef = useRef(null);
  const instance = useRef(null);
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#ffffff" : "#000000";
  const outerColor = "#D5AAFF";
  const innerColor = "#67B7DC";

  useEffect(() => {
    if (!instance.current) {
      instance.current = echarts.init(chartRef.current);
    }

    // Updated label configuration for the range: 0.5 to 1.0 to -0.9 to -0.5
    const customLabelConfig = [
      { label: "0.5", gaugeValue: -1.0, actualValue: 0.5 },
      { label: "0.6", gaugeValue: -0.8, actualValue: 0.6 },
      { label: "0.7", gaugeValue: -0.6, actualValue: 0.7 },
      { label: "0.8", gaugeValue: -0.4, actualValue: 0.8 },
      { label: "0.9", gaugeValue: -0.2, actualValue: 0.9 },
      { label: "1.0", gaugeValue: 0.0, actualValue: 1.0 },

      { label: "0.9", gaugeValue: 0.2, actualValue: -0.9 },
      { label: "0.8", gaugeValue: 0.4, actualValue: -0.8 },
      { label: "0.7", gaugeValue: 0.6, actualValue: -0.7 },
      { label: "0.6", gaugeValue: 0.8, actualValue: -0.6 },
      { label: "0.5", gaugeValue: 1.0, actualValue: -0.5 },
    ];

    // Convert actual value to gauge position with proper interpolation
    const getGaugeValue = (actualValue) => {
      const exactMatch = customLabelConfig.find(
        (item) => Math.abs(item.actualValue - actualValue) < 0.001
      );
      if (exactMatch) return exactMatch.gaugeValue;

      if (actualValue > 1.0) actualValue = 1.0;
      if (actualValue < -0.9) actualValue = -0.9;

      for (let i = 0; i < customLabelConfig.length - 1; i++) {
        const current = customLabelConfig[i];
        const next = customLabelConfig[i + 1];

        if (
          actualValue >= current.actualValue &&
          actualValue <= next.actualValue
        ) {
          const ratio =
            (actualValue - current.actualValue) /
            (next.actualValue - current.actualValue);
          return (
            current.gaugeValue + ratio * (next.gaugeValue - current.gaugeValue)
          );
        }

        if (current.actualValue > next.actualValue) {
          if (
            actualValue >= current.actualValue ||
            actualValue <= next.actualValue
          ) {
            let ratio;
            if (actualValue >= current.actualValue) {
              ratio =
                (actualValue - current.actualValue) /
                (1.0 - current.actualValue + (next.actualValue - -1.0));
            } else {
              ratio =
                (actualValue - -1.0 + (1.0 - current.actualValue)) /
                (1.0 - current.actualValue + (next.actualValue - -1.0));
            }
            return (
              current.gaugeValue +
              ratio * (next.gaugeValue - current.gaugeValue)
            );
          }
        }
      }

      return 0;
    };

    // Create label map for formatter
    const createLabelMap = () => {
      const map = {};
      customLabelConfig.forEach((item) => {
        map[item.gaugeValue.toFixed(1)] = item.label;
      });
      return map;
    };

    // ----------------------------------------------------
    // ✅ Apply clamping so needle never goes below limits
    // ----------------------------------------------------
    // Corrected clamping rules
    let clampedInner = innerValue;

    // If value > 1 → clamp to 1
    if (innerValue > 1) clampedInner = 1;
    // If value < 0.5 and >= 0 → always clamp to 0.5
    else if (innerValue < 0.5 && innerValue >= 0) clampedInner = 0.5;
    // If value is between -0.5 and -0.01 → clamp to -0.5
    else if (innerValue < 0 && innerValue > -0.5) clampedInner = -0.5;
    // If value < -0.5 → stay at -0.5 (hard minimum)
    else if (innerValue <= -0.5) clampedInner;

    // ----------------------------------------------------

    const option = {
      backgroundColor: "transparent",

      series: [
        {
          type: "gauge",
          min: -1,
          max: 1,
          startAngle: 180,
          endAngle: 0,
          radius: innerRadiousProp,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [[1, innerColor]],
            },
          },
          axisTick: {
            distance: 0,
            length: 0,
            splitNumber: 10,
            lineStyle: {
              color: innerColor,
            },
          },
          axisLabel: {
            distance: 10,
            color: textColor,
            fontSize: 10,
            formatter: function (value) {
              const labelMap = createLabelMap();
              return labelMap[value.toFixed(1)] || value.toFixed(1);
            },
          },
          splitLine: {
            distance: -4,
            length: 15,
            splitNumber: 10,
            lineStyle: {
              color: innerColor,
            },
          },
          pointer: {
            show: true,
            length: "90%",
            width: 6,
            itemStyle: {
              color: innerColor,
            },
          },
          anchor: {
            show: true,
            size: 26,
            itemStyle: {
              color: innerColor,
            },
          },
          detail: {
            show: false,
          },
          data: [{ value: getGaugeValue(clampedInner) }],
        },
        {
          type: "gauge",
          min: outerMinRange,
          max: outerMaxRange,
          startAngle: 180,
          endAngle: 0,
          splitNumber: 10,
          radius: outerRadiousProp,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [[1, outerColor]],
            },
          },
          axisLabel: {
            distance: -30,
            color: textColor,
            fontSize: 10,
            rotate: 0,
            align: "center",
            verticalAlign: "middle",
            formatter: (v) => v,
          },
          axisTick: {
            distance: -10,
            length: 0,
            lineStyle: {
              color: outerColor,
            },
          },
          splitLine: {
            distance: -15,
            length: 15,
            lineStyle: {
              color: outerColor,
            },
          },
          pointer: {
            show: true,
            length: "90%",
            width: 6,
            itemStyle: {
              color: outerColor,
            },
          },
          anchor: {
            show: true,
            size: 20,
            itemStyle: {
              borderColor: outerColor,
              color: outerColor,
              borderWidth: 2,
            },
          },
          detail: {
            show: false,
          },
          data: [{ value: outerValue }],
        },
      ],
      graphic: [
        {
          type: "text",
          left: "30%",
          top: "45%",
          style: {
            text: "Lag",
            fill: textColor,
            fontSize: 14,
          },
        },
        {
          type: "text",
          right: "30%",
          top: "45%",
          style: {
            text: "Lead",
            fill: textColor,
            fontSize: 14,
          },
        },
      ],
    };

    instance.current.setOption(option);

    const resize = () => instance.current.resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      instance.current.dispose();
      instance.current = null;
    };
  }, [outerValue, innerValue, theme]);

  return (
    <div
      style={{
        height: containerHeight,
      }}
    >
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
