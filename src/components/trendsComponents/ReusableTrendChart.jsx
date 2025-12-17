"use client";
import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

import { useTheme } from "next-themes";

const ReusableTrendChart = ({
  id,
  data = [],
  xKey = "time",
  xType = "category",
  series = [],
  legend = true,
  cursor = true,
  scrollbarX = false,
  yLeftTitle = "",
  yRightTitle = "",
  minGridDistance = 80,
  isFullscreen = false,
}) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const { theme } = useTheme();
  const convertTimestampToISO = (data) => {
    return data.map((item) => ({
      ...item,
      time: new Date(item.time).toISOString(),
    }));
  };
  // const convertedData = convertTimestampToISO(originalTimestampData);
  // console.log(convertedData);
  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose of previous chart with the same ID if it exists
    if (rootRef.current && rootRef.current.id === id) {
      rootRef.current.root.dispose();
      rootRef.current = null;
    }

    // Create root element
    const root = am5.Root.new(chartRef.current);
    rootRef.current = { root, id }; // Store both root and id

    // Set themes based on current theme
    if (theme === "dark") {
      root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);
    } else {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    root._logo?.dispose();

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        // wheelX: "panX",
        // wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout,
      })
    );

    // Create axes
    let xAxis;
    if (xType === "date") {
      xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "minute", count: 1 },
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: minGridDistance,
          }),
          // tooltip: am5.Tooltip.new(root, {
          //   labelText: "{valueX}",
          // }),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueX.formatDate('dd/MM/yyyy - HH:mm')}",
          }),
        })
      );
      xAxis.set(
        "tooltip",
        am5.Tooltip.new(root, {
          labelText: "{valueX.formatDate('dd/MM/yyyy - HH:mm')}",
        })
      );
    } else {
      xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: minGridDistance,
          }),
          categoryField: xKey,
        })
      );

      // Set category data for category axis
      xAxis.data.setAll(data);
    }

    // Create Y axes
    const leftYAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    if (yLeftTitle) {
      leftYAxis.children.unshift(
        am5.Label.new(root, {
          text: yLeftTitle,
          rotation: -90,
          y: am5.p50,
          centerX: am5.p50,
          centerY: am5.p50,
          fontSize: 12,
          fontWeight: "bold",
          fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000),
        })
      );
    }

    let rightYAxis;
    if (series.some((s) => s.yAxis === "right")) {
      rightYAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            opposite: true,
          }),
        })
      );

      if (yRightTitle) {
        rightYAxis.children.unshift(
          am5.Label.new(root, {
            text: yRightTitle,
            rotation: 90,
            y: am5.p50,
            x: 130,
            centerX: am5.p50,
            centerY: am5.p50,
            fontSize: 12,
            fontWeight: "bold",
            fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000),
          })
        );
      }
    }

    // Add series
    series.forEach((seriesConfig) => {
      let chartSeries;
      const yAxis = seriesConfig.yAxis === "right" ? rightYAxis : leftYAxis;

      if (seriesConfig.type === "line") {
        chartSeries = am5xy.LineSeries.new(root, {
          name: seriesConfig.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesConfig.yKey,
          categoryXField: xType === "category" ? xKey : undefined,
          valueXField: xType === "date" ? xKey : undefined,
          tooltip: am5.Tooltip.new(root, {
            // pointerOrientation: "horizontal",
            // labelText: "{name}: {valueY}",
            pointerOrientation: "horizontal",
            getFillFromSprite: true,
            getStrokeFromSprite: true,
            autoTextColor: false,
            labelText: "{name}: {valueY}",
          }),
        });
        console.log("axis", xAxis);
        if (seriesConfig.color) {
          const lineColor = am5.color(seriesConfig.color);
          chartSeries.strokes.template.setAll({
            stroke: lineColor,
            strokeWidth: seriesConfig.strokeWidth || 2,
          });
          chartSeries.fills.template.setAll({
            fill: lineColor,
            fillOpacity: 0.1,
          });
          chartSeries.set("fill", lineColor);
          chartSeries.set("stroke", lineColor);
        }

        if (seriesConfig.strokeWidth) {
          chartSeries.strokes.template.set(
            "strokeWidth",
            seriesConfig.strokeWidth
          );
        }
      } else if (seriesConfig.type === "column") {
        chartSeries = am5xy.ColumnSeries.new(root, {
          name: seriesConfig.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesConfig.yKey,
          categoryXField: xType === "category" ? xKey : undefined,
          valueXField: xType === "date" ? xKey : undefined,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name}: {valueY}",
          }),
        });

        chartSeries.columns.template.setAll({
          width: am5.percent(70),
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
        });

        if (seriesConfig.color) {
          const columnColor = am5.color(seriesConfig.color);
          chartSeries.columns.template.setAll({
            fill: columnColor,
            stroke: columnColor,
          });
          chartSeries.set("fill", columnColor);
          chartSeries.set("stroke", columnColor);
        }
      }

      if (chartSeries) {
        chart.series.push(chartSeries);
        chartSeries.data.setAll(data);

        if (seriesConfig.color) {
          const seriesColor = am5.color(seriesConfig.color);
          chartSeries.set("fill", seriesColor);
          if (seriesConfig.type === "line") {
            chartSeries.strokes.template.set("stroke", seriesColor);
          }
        }
      }
    });

    // Add legend
    if (legend) {
      const chartLegend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout,
        })
      );
      chartLegend.data.setAll(chart.series.values);

      chartLegend.labels.template.setAll({
        fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000),
      });
    }

    // Add cursor
    // if (cursor) {
    //   const chartCursor = chart.set(
    //     "cursor",
    //     am5xy.XYCursor.new(root, {
    //       behavior: "zoomX",
    //     })
    //   );
    //   chartCursor.set("snapToSeries", chart.series.values);

    //   chartCursor.lineY.set("visible", true);
    //   xAxis.set("cursorTooltipEnabled", true); // enable tooltip on cursor

    //   xAxis.get("tooltip").label.set(
    //     "text",
    //     "{valueX.formatDate('dd/MM/yyyy - HH:mm')}" // format cursor tooltip
    //   );
    // }

    if (cursor) {
      const chartCursor = chart.set(
        "cursor",
        am5xy.XYCursor.new(root, { behavior: "zoomX" })
      );
      chartCursor.set("snapToSeries", chart.series.values);
      chartCursor.lineY.set("visible", true);

      if (xAxis && xType === "date") {
        xAxis
          .get("tooltip")
          .label.set("text", "{valueX.formatDate('dd/MM/yyyy - HH:mm')}");
      }
    }
    xAxis.set(
      "tooltip",
      am5.Tooltip.new(root, {
        forceHidden: false,
      })
    );

    // Add scrollbar if needed
    if (scrollbarX) {
      chart.set(
        "scrollbarX",
        am5.Scrollbar.new(root, {
          orientation: "horizontal",
        })
      );
    }

    // Cleanup function - dispose only if this is the same chart
    return () => {
      if (rootRef.current && rootRef.current.id === id) {
        rootRef.current.root.dispose();
        rootRef.current = null;
      }
    };
  }, [
    id,
    data,
    xKey,
    xType,
    series,
    isFullscreen,
    legend,
    cursor,
    scrollbarX,
    yLeftTitle,
    yRightTitle,
    minGridDistance,
    theme,
  ]);

  return (
    <div className="w-full">
      <div
        ref={chartRef}
        id={id}
        style={{ height: isFullscreen ? "90vh" : `33vh` }}
        className="w-full"
      />
    </div>
  );
};

export default ReusableTrendChart;
