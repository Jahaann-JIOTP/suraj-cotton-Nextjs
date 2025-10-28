"use client";
import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const EnergyComparisonChart = ({
  data = [],
  unit5Total = {},
  unit4Total = {},
  intervalsObj,
  onChartReady,
}) => {
  const [chartImages, setChartImages] = useState({ unit4: "", unit5: "" });

  const colorArray = [
    "#1F77B4",
    "#2E8B57",
    "#8B0000",
    "#4B0082",
    "#556B2F",
    "#8B4513",
    "#483D8B",
    "#2F4F4F",
    "#800000",
    "#008080",
    "#6A5ACD",
    "#3B5323",
    "#9932CC",
    "#5D478B",
    "#191970",
    "#CD853F",
    "#2E4053",
    "#1C1C1C",
    "#006400",
    "#708090",
    "#800080",
    "#8B4513",
    "#483C32",
    "#4682B4",
    "#A0522D",
    "#5F9EA0",
    "#556B2F",
    "#3A3A3A",
    "#00008B",
  ];

  // Assign colors sequentially across the full dataset
  const unit4Data = [];
  const unit5Data = [];

  let colorIndex = 0; // global sequential color tracker

  data.forEach((d) => {
    const color = colorArray[colorIndex % colorArray.length];
    if (d.u4Consumption !== undefined) {
      unit4Data.push({
        label: d.name,
        value: d.u4Consumption,
        color,
      });
    }
    if (d.u5Consumption !== undefined) {
      unit5Data.push({
        label: d.name,
        value: d.u5Consumption,
        color,
      });
    }
    colorIndex++;
  });

  const drawDonutChart = (chartId, chartData, totals, title, key) => {
    am5.registry.rootElements.forEach((root) => {
      if (root.dom.id === chartId) root.dispose();
    });

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    // 🟣 Add chart title (this will appear *inside* the image)
    const chartTitle = root.container.children.push(
      am5.Label.new(root, {
        text: `${title}`,
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        x: am5.p50,
        centerX: am5.p50,
        marginBottom: 10,
        fill: am5.color(0x333333),
      })
    );

    const mainContainer = root.container.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        width: am5.percent(100),
        height: am5.percent(100),
      })
    );

    const legendContainer = mainContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(35),
        layout: root.verticalLayout,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 10,
      })
    );

    chartData.forEach((item) => {
      const legendItem = legendContainer.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          marginBottom: 4,
        })
      );

      legendItem.children.push(
        am5.Rectangle.new(root, {
          width: 14,
          height: 14,
          fill: am5.color(item.color),
          stroke: am5.color(0x000000),
          strokeWidth: 0.5,
        })
      );

      legendItem.children.push(
        am5.Label.new(root, {
          text: `${item.label}: ${item.value.toFixed(1)}`,
          fontSize: 13,
          fill: am5.color(0x333333),
          marginLeft: 5,
        })
      );
    });

    const chartContainer = mainContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(65),
        height: am5.percent(100),
      })
    );

    const chart = chartContainer.children.push(
      am5percent.PieChart.new(root, { innerRadius: am5.percent(20) })
    );

    const bgColor = root.interfaceColors.get("background");

    const makeRing = (inner, outer, ringData, ringIndex) => {
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "label",
          radius: am5.percent(outer),
          innerRadius: am5.percent(inner),
        })
      );

      series.slices.template.adapters.add("fill", (fill, target) =>
        target.dataItem?.dataContext?.color
          ? am5.color(target.dataItem.dataContext.color)
          : fill
      );

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

    // ✅ Proper exporting (chart + embedded title)
    const exporting = am5exporting.Exporting.new(root, {
      filePrefix: title.replace(" ", "_"),
      pngOptions: { quality: 1, maintainPixelRatio: true },
    });

    setTimeout(async () => {
      try {
        const blob = await exporting.export("png", { returnType: "blob" });
        if (blob) {
          setChartImages((prev) => {
            const updated = { ...prev, [key]: blob };
            onChartReady?.(updated);
            return updated;
          });
        }
      } catch (err) {
        console.error("Error capturing chart image:", err);
      }
    }, 2000);
  };

  useEffect(() => {
    if (unit4Data.length > 0)
      drawDonutChart(
        "unit4-donut-chart",
        unit4Data,
        unit4Total,
        "Unit 4",
        "unit4"
      );
    if (unit5Data.length > 0)
      drawDonutChart(
        "unit5-donut-chart",
        unit5Data,
        unit5Total,
        "Unit 5",
        "unit5"
      );
  }, [data]);

  return (
    <div
      className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
      aria-hidden="true"
    >
      {unit4Data.length > 0 && (
        <div>
          <div
            id="unit4-donut-chart"
            style={{ width: "1200px", height: "1200px" }}
          />
        </div>
      )}
      {unit5Data.length > 0 && (
        <div>
          <div
            id="unit5-donut-chart"
            style={{ width: "1200px", height: "1200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default EnergyComparisonChart;
