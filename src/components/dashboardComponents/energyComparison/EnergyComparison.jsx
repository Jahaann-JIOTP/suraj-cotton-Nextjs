"use client";

import React, { useState, useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";

const EnergyComparison = () => {
  const [startDate, setStartDate] = useState("");
  const [isEnergyComparisonFullView, setEnergyComparisonFullView] =
    useState(false);
  const [endDate, setEndDate] = useState("");
  const { theme } = useTheme();
  const chartDivRef = useRef(null);
  const rootRef = useRef(null);
  const handleEnergyComparisonFullView = () => {
    setEnergyComparisonFullView((prev) => !prev);
  };

  useEffect(() => {
    if (!chartDivRef.current) return;

    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    const root = am5.Root.new(chartDivRef.current);
    rootRef.current = root;
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    if (theme === "dark") {
      root.interfaceColors.set("text", am5.color(0xffffff));
      root.interfaceColors.set("grid", am5.color(0x444444));
      root.interfaceColors.set("background", am5.color(0x1e1e1e));
    } else {
      root.interfaceColors.set("text", am5.color(0x000000));
      root.interfaceColors.set("grid", am5.color(0xcccccc));
      root.interfaceColors.set("background", am5.color(0xffffff));
    }

    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout,
        paddingTop: 0,
        paddingBottom: 20,
        paddingLeft: 50,
        paddingRight: 0,
      })
    );

    // Main Pie Chart
    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: true,
      })
    );

    const colorMap = {
      Solar: "#63F4B7",
      "LT Generations": "#FF714E",
      "HT Generations": "#F8B257",
      WAPDA: "#B0B2B6",
    };

    series.slices.template.adapters.add("fill", (fill, target) => {
      const category = target.dataItem?.dataContext?.category;
      return am5.color(colorMap[category] || 0xcccccc);
    });

    series.labels.template.setAll({
      text: "{category}: {value} kWh",
      radius: 10,
      inside: false,
      fontSize: "[fontSize: 8px]",
    });

    series.ticks.template.set("visible", false);
    series.slices.template.set("tooltipText", ""); // close tooltip for main pie chart
    series.slices.template.set("toggleKey", "none");

    // Sub Pie Chart
    const subChart = container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(50),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const subSeries = subChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    // ✅ Hide labels and ticks on sub pie chart
    subSeries.labels.template.setAll({
      visible: false,
    });
    subSeries.ticks.template.setAll({
      visible: false,
    });

    // ✅ SubChart Legend at bottom center horizontally
    const legend = root.container.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(93),
        layout: root.horizontalLayout,
        marginTop: 0,
      })
    );

    legend.labels.template.setAll({
      fontSize: 12,
      fontWeight: "500",
    });

    // Add this to hide the values in legend
    legend.valueLabels.template.set("forceHidden", true);

    let selectedSlice;

    const line0 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [5, 5],
      })
    );
    const line1 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [5, 5],
      })
    );

    const chartData = [
      {
        category: "Solar",
        value: 780,
        subData: [{ category: "HT", value: 300 }],
      },
      {
        category: "LT Generations",
        value: 50,
        subData: [
          { category: "HT", value: 150 },
          { category: "WAPDA", value: 100 },
        ],
      },
      {
        category: "HT Generations",
        value: 20,
        subData: [
          { category: "Solar", value: 90 },
          { category: "WAPDA", value: 110 },
        ],
      },
      {
        category: "WAPDA",
        value: 180,
        subData: [
          { category: "Solar", value: 100 },
          { category: "HT", value: 80 },
        ],
      },
    ];

    function updateLines() {
      if (selectedSlice) {
        const startAngle = selectedSlice.get("startAngle");
        const arc = selectedSlice.get("arc");
        const radius = selectedSlice.get("radius");

        const x00 = radius * am5.math.cos(startAngle);
        const y00 = radius * am5.math.sin(startAngle);
        const x10 = radius * am5.math.cos(startAngle + arc);
        const y10 = radius * am5.math.sin(startAngle + arc);

        const subRadius = subSeries.slices.getIndex(0)?.get("radius") || 0;

        const point00 = series.toGlobal({ x: x00, y: y00 });
        const point10 = series.toGlobal({ x: x10, y: y10 });
        const point01 = subSeries.toGlobal({ x: 0, y: -subRadius });
        const point11 = subSeries.toGlobal({ x: 0, y: subRadius });

        line0.set("points", [point00, point01]);
        line1.set("points", [point10, point11]);
      }
    }

    function selectSlice(slice) {
      selectedSlice = slice;
      const dataContext = slice.dataItem?.dataContext;
      const category = dataContext?.category;

      if (dataContext) {
        const baseColor = am5.color(colorMap[category] || 0xcccccc);

        const subData = dataContext.subData.map((d, i) => ({
          ...d,
          fill: am5.Color.brighten(baseColor, i * 2),
        }));

        subSeries.data.setAll(subData);
        legend.data.setAll(subSeries.dataItems);
        legend.labels.template.adapters.add("text", (text, target) => {
          return target.dataItem?.dataContext?.category || "";
        });

        // ✅ Set sub-pie slice colors from computed shades
        subSeries.slices.each((slice, index) => {
          const fillColor = subData[index]?.fill;
          if (fillColor) {
            slice.set("fill", fillColor);
            slice.set("stroke", am5.color(fillColor));
            slice.set("strokeWidth", 1);
          }
        });
      }

      const middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
      const firstAngle = series.dataItems[0].get("slice").get("startAngle");

      series.animate({
        key: "startAngle",
        to: firstAngle - middleAngle,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });
      series.animate({
        key: "endAngle",
        to: firstAngle - middleAngle + 360,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });

      updateLines();
    }

    subSeries.slices.template.set("tooltipText", ""); // close tooltip for subpie chart
    series.slices.template.events.on("click", function (e) {
      selectSlice(e.target);
    });

    series.on("startAngle", updateLines);
    container.events.on("boundschanged", () => {
      root.events.once("frameended", updateLines);
    });

    series.data.setAll(chartData);

    series.events.on("datavalidated", () => {
      selectSlice(series.slices.getIndex(2)); // Select HT Generations by default
    });

    container.appear(1000, 10);

    return () => {
      root.dispose();
    };
  }, [theme]);

  return (
    <div
      className={`${
        isEnergyComparisonFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[96%] m-auto h-[96vh]"
          : "relative  px-1 py-2 md:p-3 h-[14.8rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md `}
    >
      {/* Header */}
      <div className="flex items-center flex-col md:flex-row gap-3 md:gap-auto justify-between">
        <span className="font-raleway text-[#3978A8] font-600 text-[15px]">
          Energy Comparison
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
            Select Interval
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-[12px] font-raleway px-1 py-0.5 border rounded"
          />
          <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
            to
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-[12px] font-raleway px-1 py-0.5 border rounded"
          />
          <button
            className="cursor-pointer"
            onClick={handleEnergyComparisonFullView}
          >
            {isEnergyComparisonFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div
        className={`flex justify-end ${
          isEnergyComparisonFullView
            ? "h-[90%] flex items-center justify-center"
            : "md:h-[12.5rem]"
        } relative`}
      >
        <div
          ref={chartDivRef}
          className={`w-full ${
            isEnergyComparisonFullView ? "h-[70%]" : "h-[11rem]"
          }  right-0`}
        />
      </div>
    </div>
  );
};

export default EnergyComparison;
