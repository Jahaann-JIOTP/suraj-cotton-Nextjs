"use client";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

const SankeyChart = ({
  data,
  navigateLinks = {},
  padRight,
  isGray = false,
}) => {
  const chartRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(
      chartRef.current,
      resolvedTheme === "dark" ? "dark" : undefined
    );

    const nodeColors = [
      "#DC8C67",
      "#67B7DC",
      "#6771DC",
      "#67DCBB",
      "#6771DC",
      "#DC6788",
      "#DC67CE",
      "#A367DC",
      "#67DC75",
      "#A0DC67",
      "#DCD267",
      "#DC8C67",
      "#DC6788",
      "#DC67CE",
      "#A367DC",
      "#67B7DC",
      "#67DCBB",
      "#67DC75",
    ];

    // Helper: lighten or darken color
    const lightenColor = (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)}`;
    };

    // Collect all unique nodes
    const allNodes = new Set();
    const links = [];
    const unaccountedEnergyNode = "Unaccounted Energy";

    data.forEach((item) => {
      allNodes.add(item.from);
      allNodes.add(item.to);
    });

    const nodeNames = Array.from(allNodes);
    const nodes = nodeNames.map((name, index) => {
      const colorIndex = index % nodeColors.length;
      const baseColor = nodeColors[colorIndex];

      if (isGray && name === unaccountedEnergyNode) {
        return {
          name,
          itemStyle: {
            color: "#9ca3af",
            borderColor: "#6b7280",
            borderWidth: 1,
          },
        };
      }

      return {
        name,
        itemStyle: { color: baseColor },
      };
    });

    // Build links with gradient
    data.forEach((item) => {
      const isUnaccounted =
        item.to === unaccountedEnergyNode ||
        item.from === unaccountedEnergyNode;
      const isZeroValue = item.value === 0;

      let lineStyle = {};

      if ((isGray && isUnaccounted) || isZeroValue) {
        lineStyle = {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#d1d5db" },
              { offset: 1, color: "#9ca3af" },
            ],
          },
          opacity: 0.7,
        };
      } else {
        const sourceNode = nodes.find((n) => n.name === item.from);
        const targetNode = nodes.find((n) => n.name === item.to);
        const sourceColor = sourceNode?.itemStyle?.color || "#3b82f6";
        const targetColor = targetNode?.itemStyle?.color || "#8b5cf6";
        const lightSourceColor = lightenColor(sourceColor, 30);
        const lightTargetColor = lightenColor(targetColor, 30);

        lineStyle = {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: lightSourceColor },
              { offset: 1, color: lightTargetColor },
            ],
          },
          opacity: 0.9,
        };
      }

      links.push({
        source: item.from,
        target: item.to,
        value: item.value,
        lineStyle,
      });
    });

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          console.log("Params->", { Name: params.name, value: params.value });
          if (params.dataType === "node") {
            return `${params.name}: ${
              params.value
                ? params.value.toLocaleString() + " kWh"
                : params.value === 0
                ? "0 kWh"
                : params.value < 0
                ? "Negative"
                : "N/A"
            }`;
          } else if (params.dataType === "edge") {
            return `${params.data.source} → ${
              params.data.target
            }<br/>Value: ${params.data.value.toLocaleString()} kWh`;
          }
          return "";
        },
      },
      series: [
        {
          type: "sankey",
          layout: "none",
          emphasis: {
            focus: "none",
            itemStyle: {
              color: (params) => {
                const baseColor = params?.data?.itemStyle?.color || "#6b7280";
                return lightenColor(baseColor, -20);
              },
              opacity: 1,
              borderWidth: 2,
              borderColor: "#fff",
            },
          },
          data: nodes,
          links,
          lineStyle: {
            curveness: 0.5,
            opacity: 0.9,
            color: "gradient",
          },
          label: {
            show: true,
            formatter: (params) => {
              const incomingValue = links
                .filter((link) => link.target === params.name)
                .reduce((sum, link) => sum + link.value, 0);

              const outgoingValue = links
                .filter((link) => link.source === params.name)
                .reduce((sum, link) => sum + link.value, 0);

              const totalValue = Math.max(incomingValue, outgoingValue);
              return `${params.name} (${totalValue.toLocaleString()} kWh)`;
            },
            fontSize: 11,
            color: resolvedTheme === "dark" ? "#ffffffff" : "#1E2939",
          },
          nodeAlign: "left",
          nodeWidth: 16,
          nodeGap: 10,
          right: padRight,
          draggable: true,
          focusNodeAdjacency: true,
          blurState: {
            itemStyle: { opacity: 1 },
            lineStyle: { opacity: 1 },
            label: { opacity: 1 },
          },
          itemStyle: {
            borderWidth: 0,
            borderColor: "#fff",
            opacity: 0.9,
          },
        },
      ],
    };

    chart.setOption(option);

    // Handle node click
    chart.on("click", (params) => {
      if (params.componentType === "series" && params.dataType === "node") {
        const nodeName = params.data.name;
        const url = navigateLinks[nodeName];
        if (url) window.location.href = url;
      }
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, navigateLinks, resolvedTheme, isGray]);

  return (
    <div
      ref={chartRef}
      style={{ background: "transparent", height: "55vh", width: "100%" }}
    />
  );
};

export default SankeyChart;
