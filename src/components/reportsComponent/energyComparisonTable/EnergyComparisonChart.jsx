"use client";
import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const EnergyComparisonChart = ({
  data = [],
  unit5Total = {},
  unit4Total = {},
  intervalsObj,
}) => {
  const colorArray = [
    "#00C5CD",
    "#01868B",
    "#65CDAA",
    "#458B73",
    "#010080",
    "#EE5A40",
    "#EF9A49",
    "#CD4F39",
    "#EF9A49",
    "#81007F",
    "#EE8420",
    "#8483EB",
    "#008001",
    "#CDAF95",
    "#8A7766",
    "#9C6D27",
    "#800000",
    "#8B5900",
    "#F7BF82",
    "#808080",
    "#CD5D5C",
    "#F0807F",
    "#6F2C01",
    "#9A32CD",
    "#0000FE",
    "#00FF01",
    "#FE0000",
    "#F778A1",
  ];

  // ✅ Prepare data for Unit 4 and Unit 5 separately
  const unit4Data = data
    .filter((d) => d.u4Consumption !== undefined)
    .map((d, i) => ({
      label: d.name,
      value: d.u4Consumption,
      color: colorArray[i % colorArray.length],
    }));

  const unit5Data = data
    .filter((d) => d.u5Consumption !== undefined)
    .map((d, i) => ({
      label: d.name,
      value: d.u5Consumption,
      color: colorArray[i % colorArray.length],
    }));

  // ✅ Utility to draw one donut chart (used for both Unit 4 & 5)
  const drawDonutChart = (chartId, chartData, totals, title) => {
    // Cleanup old chart
    am5.registry.rootElements.forEach((root) => {
      if (root.dom.id === chartId) root.dispose();
    });

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    // --- MAIN CONTAINER (Legend Left, Chart Right) ---
    const mainContainer = root.container.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        width: am5.percent(100),
        height: am5.percent(100),
      })
    );

    // --- LEGEND (LEFT SIDE) ---
    const legendContainer = mainContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(35),
        height: am5.percent(100),
        layout: root.verticalLayout,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 10,
        y: am5.p50,
        centerY: am5.p50,
      })
    );

    // Add custom legend items
    chartData.forEach((item) => {
      const legendItem = legendContainer.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          centerY: am5.p50,
          marginBottom: 4, // ✅ Reduced spacing between items
        })
      );

      legendItem.children.push(
        am5.Rectangle.new(root, {
          width: 14,
          height: 14,
          fill: am5.color(item.color),
          stroke: am5.color(0x000000),
          strokeWidth: 0.5,
          cornerRadiusTL: 2,
          cornerRadiusTR: 2,
          cornerRadiusBL: 2,
          cornerRadiusBR: 2,
          centerY: am5.p50,
        })
      );

      legendItem.children.push(
        am5.Label.new(root, {
          text: `${item.label}: ${item.value.toFixed(1)}`,
          fontSize: 13,
          fill: am5.color(0x333333),
          marginLeft: 5, // ✅ Slightly reduced gap between square and label
          centerY: am5.p50,
        })
      );
    });

    // --- CHART AREA (RIGHT SIDE) ---
    const chartContainer = mainContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(65),
        height: am5.percent(100),
      })
    );

    const chart = chartContainer.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(20),
        layout: root.verticalLayout,
      })
    );

    const bgColor = root.interfaceColors.get("background");

    // --- CREATE MULTIPLE RINGS ---
    const makeRing = (inner, outer, ringData, ringIndex) => {
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "label",
          radius: am5.percent(outer),
          innerRadius: am5.percent(inner),
        })
      );

      series.slices.template.adapters.add("fill", (fill, target) => {
        const dataItem = target.dataItem;
        if (dataItem && dataItem.dataContext?.color) {
          return am5.color(dataItem.dataContext.color);
        }
        return fill;
      });

      series.slices.template.setAll({
        stroke: bgColor,
        strokeWidth: 2,
        tooltipText:
          "{category}: {value.formatNumber('0.0')} ({valuePercentTotal.formatNumber('0.0')}%)",
      });

      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);
      series.data.setAll(ringData);
      series.appear(800 + ringIndex * 300, 100);
    };

    // --- Split data into rings ---
    const splitIntoRings = (arr) => {
      const rings = [];
      const perRing = Math.ceil(arr.length / 4);
      for (let i = 0; i < 4; i++) {
        const slice = arr.slice(i * perRing, (i + 1) * perRing);
        if (slice.length) rings.push(slice);
      }
      return rings;
    };

    const rings = splitIntoRings(chartData);
    const radii = [
      [30, 55],
      [55, 80],
      [80, 105],
      [105, 130],
    ];
    rings.forEach((r, i) => makeRing(radii[i][0], radii[i][1], r, i));

    // --- CENTER TEXT ---
    const centerContainer = chart.seriesContainer.children.push(
      am5.Container.new(root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        layout: root.verticalLayout,
      })
    );

    const startDate = intervalsObj?.startDate || "";
    const endDate = intervalsObj?.endDate || "";
    const totalVal = totals?.unit4Total ?? totals?.unit5Total ?? 0;
    const lt1 = totals?.unit4Lt1total ?? totals?.unit5Lt1total ?? 0;
    const lt2 = totals?.unit4Lt2total ?? totals?.unit5Lt2total ?? 0;

    const lines = [
      `${startDate} - ${endDate}`,
      `${title} = ${totalVal.toFixed(1)}`,
      `LT1 = ${lt1.toFixed(1)}`,
      `LT2 = ${lt2.toFixed(1)}`,
    ];

    lines.forEach((line, i) => {
      centerContainer.children.push(
        am5.Label.new(root, {
          text: line,
          fontSize: i === 0 ? 14 : 12,
          fontWeight: i === 0 ? "700" : "600",
          fill: am5.color(0x333333),
          textAlign: "center",
        })
      );
    });

    return () => root.dispose();
  };

  // --- Run Effect ---
  useEffect(() => {
    if (unit4Data.length > 0) {
      drawDonutChart("unit4-donut-chart", unit4Data, unit4Total, "Unit 4");
    }
    if (unit5Data.length > 0) {
      drawDonutChart("unit5-donut-chart", unit5Data, unit5Total, "Unit 5");
    }
  }, [data, unit4Total, unit5Total, intervalsObj]);

  return (
    <div className="my-10 space-y-20">
      {unit4Data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Unit 4 Energy Comparison
          </h2>
          <div
            id="unit4-donut-chart"
            style={{ width: "100%", height: "50rem" }}
          />
        </div>
      )}

      {unit5Data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Unit 5 Energy Comparison
          </h2>
          <div
            id="unit5-donut-chart"
            style={{ width: "100%", height: "50rem" }}
          />
        </div>
      )}
    </div>
  );
};

export default EnergyComparisonChart;
