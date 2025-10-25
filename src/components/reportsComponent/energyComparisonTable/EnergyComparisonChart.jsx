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
  const unit4Data = data
    .filter((d) => d.u4Consumption !== undefined)
    .map((d) => ({
      label: d.name,
      value: d.u4Consumption,
    }));

  useEffect(() => {
    const disposeRoot = (id) => {
      am5.registry.rootElements.forEach((root) => {
        if (root.dom.id === id) root.dispose();
      });
    };

    const createChart = (id, chartData, unitName) => {
      disposeRoot(id);
      const root = am5.Root.new(id);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          innerRadius: am5.percent(10),
        })
      );

      const bgColor = root.interfaceColors.get("background");

      // ✅ Updated: Dynamic center calculation and improved label placement
      const createCurvedLabel = (
        svg,
        text,
        centerX,
        centerY,
        radius,
        startAngle,
        arc
      ) => {
        const pathId = `path-${Math.random().toString(36).substr(2, 9)}`;
        const defs =
          svg.querySelector("defs") ||
          document.createElementNS("http://www.w3.org/2000/svg", "defs");
        if (!svg.querySelector("defs")) svg.appendChild(defs);

        const endAngle = startAngle + arc;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        // Adjusted: place curve further OUTSIDE
        const outerRadius = radius + 120;

        const x1 = centerX + outerRadius * Math.cos(startRad);
        const y1 = centerY + outerRadius * Math.sin(startRad);
        const x2 = centerX + outerRadius * Math.cos(endRad);
        const y2 = centerY + outerRadius * Math.sin(endRad);

        const largeArc = arc > 180 ? 1 : 0;
        const sweep = 1;

        const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweep} ${x2} ${y2}`;

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("id", pathId);
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        defs.appendChild(path);

        // ✅ Label text styling
        const textElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textElement.setAttribute("font-size", "12");
        textElement.setAttribute("font-weight", "600");
        textElement.setAttribute("fill", "#333");
        textElement.setAttribute("text-anchor", "middle");

        const textPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "textPath"
        );
        textPath.setAttribute("href", `#${pathId}`);
        textPath.setAttribute("startOffset", "50%");
        textPath.textContent = text;

        textElement.appendChild(textPath);
        svg.appendChild(textElement);
      };

      // 🌀 Helper to create ring
      const makeRing = (inner, outer, ringData, ringIndex) => {
        const series = chart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "label",
            alignLabels: true,
            radius: am5.percent(outer),
            innerRadius: am5.percent(inner),
          })
        );

        series.slices.template.setAll({
          stroke: bgColor,
          strokeWidth: 2,
          tooltipText: `${unitName}\n{category}: {valuePercentTotal.formatNumber('0.00')}% ({value})`,
        });

        // Disable default labels and ticks
        series.labels.template.setAll({ disabled: false });
        series.ticks.template.setAll({ disabled: false });

        series.data.setAll(ringData);
        series.appear(800 + ringIndex * 300, 100);

        // ✅ On validated, draw labels outside
        series.events.on("datavalidated", () => {
          const svg = root.dom.querySelector("svg");
          if (svg) {
            series.slices.each((slice) => {
              const dataItem = slice.dataItem;
              if (dataItem) {
                const startAngle = slice.get("startAngle");
                const arc = slice.get("arc");
                const category = dataItem.get("category");
                const value = dataItem.get("value");
                const total = ringData.reduce((sum, d) => sum + d.value, 0);
                const percent = ((value / total) * 150).toFixed(1);

                // Label text shows name + actual value
                const labelText = `${category}: ${value.toFixed(
                  1
                )} (${percent}%)`;

                // Center and radius positioning
                const bbox = svg.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                const radius = (outer / 150) * (bbox.width / 2);

                createCurvedLabel(
                  svg,
                  labelText,
                  centerX,
                  centerY,
                  radius,
                  startAngle,
                  arc
                );
              }
            });
          }
        });
      };

      const splitIntoRings = (arr) => {
        const rings = [];
        const perRing = Math.ceil(arr.length / 4);
        for (let i = 0; i < 4; i++) {
          const start = i * perRing;
          const end = start + perRing;
          const slice = arr.slice(start, end);
          if (slice.length) rings.push(slice);
        }
        return rings;
      };

      const rings = splitIntoRings(chartData);
      const radii = [
        [30, 55],
        [55, 75],
        [75, 95],
        [95, 115],
      ];

      rings.forEach((ringData, i) =>
        makeRing(radii[i][0], radii[i][1], ringData, i)
      );

      // --- Center content: date range and totals ---
      try {
        const startDate = intervalsObj?.startDate || "";
        const endDate = intervalsObj?.endDate || "";

        const centerLines = [];
        if (startDate || endDate) centerLines.push(`${startDate} - ${endDate}`);

        // Use safe accessors for unit4 totals
        const u4TotalVal = unit4Total?.unit4Total ?? unit4Total ?? 0;
        const u4Lt1 = unit4Total?.unit4Lt1total ?? 0;
        const u4Lt2 = unit4Total?.unit4Lt2total ?? 0;

        centerLines.push(`Unit 4 = ${Number(u4TotalVal).toFixed(1)}`);
        centerLines.push(`Unit 4 lt 1 = ${Number(u4Lt1).toFixed(1)}`);
        centerLines.push(`Unit 4 lt 2 = ${Number(u4Lt2).toFixed(1)}`);

        const centerContainer = chart.seriesContainer.children.push(
          am5.Container.new(root, {
            width: am5.percent(100),
            centerX: am5.percent(50),
            centerY: am5.percent(50),
            layout: root.verticalLayout,
            valign: "middle",
          })
        );

        centerLines.forEach((line, idx) => {
          centerContainer.children.push(
            am5.Label.new(root, {
              text: line,
              fontSize: idx === 0 ? 14 : 12,
              fontWeight: idx === 0 ? "700" : "600",
              fill: am5.color(0x333333),
              textAlign: "center",
              centerX: am5.percent(50),
            })
          );
        });
      } catch (e) {
        // ignore center rendering errors to avoid breaking chart
        // console.warn(e);
      }

      return () => root.dispose();
    };

    createChart("unit4-donut-chart", unit4Data, "Unit 4");
  }, [data]);

  return (
    <div>
      <h3
        style={{
          textAlign: "center",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        Unit 4
      </h3>
      <div
        id="unit4-donut-chart"
        style={{ width: "100%", height: "60rem" }}
      ></div>
    </div>
  );
};

export default EnergyComparisonChart;
