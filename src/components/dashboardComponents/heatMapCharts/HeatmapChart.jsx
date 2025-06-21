"use client";

import { useEffect, useRef } from "react";

export default function HeatmapChart({
  data: propData,
  className = "",
  title = "Transformer 1 (kWh)",
  showTotal = true,
}) {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  // Default data if none provided - updated to show dates instead of weekdays
  const defaultData = [
    { hour: "1:00 AM", date: "Mon 2 Jun 2025", value: 1290 },
    { hour: "4:00 AM", date: "Mon 2 Jun 2025", value: 1120 },
    { hour: "7:00 AM", date: "Mon 2 Jun 2025", value: 1834 },
    { hour: "10:00 AM", date: "Mon 2 Jun 2025", value: 2130 },
    { hour: "1:00 PM", date: "Mon 2 Jun 2025", value: 2325 },
    { hour: "4:00 PM", date: "Mon 2 Jun 2025", value: 2219 },
    { hour: "7:00 PM", date: "Mon 2 Jun 2025", value: 1928 },
    { hour: "10:00 PM", date: "Mon 2 Jun 2025", value: 1546 },

    { hour: "1:00 AM", date: "Tue 3 Jun 2025", value: 1190 },
    { hour: "4:00 AM", date: "Tue 3 Jun 2025", value: 1320 },
    { hour: "7:00 AM", date: "Tue 3 Jun 2025", value: 1934 },
    { hour: "10:00 AM", date: "Tue 3 Jun 2025", value: 2230 },
    { hour: "1:00 PM", date: "Tue 3 Jun 2025", value: 2425 },
    { hour: "4:00 PM", date: "Tue 3 Jun 2025", value: 2319 },
    { hour: "7:00 PM", date: "Tue 3 Jun 2025", value: 2028 },
    { hour: "10:00 PM", date: "Tue 3 Jun 2025", value: 1646 },

    { hour: "1:00 AM", date: "Wed 4 Jun 2025", value: 1090 },
    { hour: "4:00 AM", date: "Wed 4 Jun 2025", value: 1220 },
    { hour: "7:00 AM", date: "Wed 4 Jun 2025", value: 1734 },
    { hour: "10:00 AM", date: "Wed 4 Jun 2025", value: 2030 },
    { hour: "1:00 PM", date: "Wed 4 Jun 2025", value: 2225 },
    { hour: "4:00 PM", date: "Wed 4 Jun 2025", value: 2119 },
    { hour: "7:00 PM", date: "Wed 4 Jun 2025", value: 1828 },
    { hour: "10:00 PM", date: "Wed 4 Jun 2025", value: 1446 },

    { hour: "1:00 AM", date: "Thu 5 Jun 2025", value: 1390 },
    { hour: "4:00 AM", date: "Thu 5 Jun 2025", value: 1520 },
    { hour: "7:00 AM", date: "Thu 5 Jun 2025", value: 2034 },
    { hour: "10:00 AM", date: "Thu 5 Jun 2025", value: 2330 },
    { hour: "1:00 PM", date: "Thu 5 Jun 2025", value: 2500 },
    { hour: "4:00 PM", date: "Thu 5 Jun 2025", value: 2419 },
    { hour: "7:00 PM", date: "Thu 5 Jun 2025", value: 2128 },
    { hour: "10:00 PM", date: "Thu 5 Jun 2025", value: 1746 },

    { hour: "1:00 AM", date: "Fri 6 Jun 2025", value: 1190 },
    { hour: "4:00 AM", date: "Fri 6 Jun 2025", value: 1320 },
    { hour: "7:00 AM", date: "Fri 6 Jun 2025", value: 1834 },
    { hour: "10:00 AM", date: "Fri 6 Jun 2025", value: 2130 },
    { hour: "1:00 PM", date: "Fri 6 Jun 2025", value: 2325 },
    { hour: "4:00 PM", date: "Fri 6 Jun 2025", value: 2219 },
    { hour: "7:00 PM", date: "Fri 6 Jun 2025", value: 1928 },
    { hour: "10:00 PM", date: "Fri 6 Jun 2025", value: 1546 },

    { hour: "1:00 AM", date: "Sat 7 Jun 2025", value: 990 },
    { hour: "4:00 AM", date: "Sat 7 Jun 2025", value: 1120 },
    { hour: "7:00 AM", date: "Sat 7 Jun 2025", value: 1634 },
    { hour: "10:00 AM", date: "Sat 7 Jun 2025", value: 1930 },
    { hour: "1:00 PM", date: "Sat 7 Jun 2025", value: 2125 },
    { hour: "4:00 PM", date: "Sat 7 Jun 2025", value: 2019 },
    { hour: "7:00 PM", date: "Sat 7 Jun 2025", value: 1728 },
    { hour: "10:00 PM", date: "Sat 7 Jun 2025", value: 1346 },

    { hour: "1:00 AM", date: "Sun 8 Jun 2025", value: 890 },
    { hour: "4:00 AM", date: "Sun 8 Jun 2025", value: 1020 },
    { hour: "7:00 AM", date: "Sun 8 Jun 2025", value: 1534 },
    { hour: "10:00 AM", date: "Sun 8 Jun 2025", value: 1830 },
    { hour: "1:00 PM", date: "Sun 8 Jun 2025", value: 2025 },
    { hour: "4:00 PM", date: "Sun 8 Jun 2025", value: 1919 },
    { hour: "7:00 PM", date: "Sun 8 Jun 2025", value: 1628 },
    { hour: "10:00 PM", date: "Sun 8 Jun 2025", value: 1246 },
  ];

  const chartData = propData || defaultData;

  // Calculate total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const initChart = async () => {
      // Dynamic imports for amCharts 5
      const am5 = await import("@amcharts/amcharts5");
      const am5xy = await import("@amcharts/amcharts5/xy");
      const am5themes_Animated = await import(
        "@amcharts/amcharts5/themes/Animated"
      );

      if (!chartRef.current) return;

      // Create root element
      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;

      // Set themes
      root.setThemes([am5themes_Animated.default.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          paddingLeft: 80,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 80,
          layout: root.verticalLayout,
        })
      );

      // Create Y axis renderer (Hours)
      const yRenderer = am5xy.AxisRendererY.new(root, {
        visible: true,
        minGridDistance: 40,
        inversed: true,
        minorGridEnabled: false,
      });

      yRenderer.grid.template.set("visible", false);
      yRenderer.labels.template.setAll({
        fontSize: 12,
        fontWeight: "400",
        fill: am5.color("#666666"),
      });

      const yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          renderer: yRenderer,
          categoryField: "hour",
        })
      );

      // Add Y-axis title
      yAxis.set(
        "title",
        am5xy.AxisLabel.new(root, {
          text: "Hours of the day",
          rotation: -90,
          fontSize: 14,
          fontWeight: "500",
          fill: am5.color("#333333"),
        })
      );

      // Create X axis renderer (Dates)
      const xRenderer = am5xy.AxisRendererX.new(root, {
        visible: true,
        minGridDistance: 80,
        opposite: false,
        minorGridEnabled: false,
      });

      xRenderer.grid.template.set("visible", false);
      xRenderer.labels.template.setAll({
        fontSize: 12,
        fontWeight: "400",
        fill: am5.color("#666666"),
        rotation: -45,
        centerX: am5.p100,
        centerY: am5.p0,
      });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: xRenderer,
          categoryField: "date",
        })
      );

      // Create series
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          calculateAggregates: true,
          stroke: am5.color(0xffffff),
          clustered: false,
          xAxis: xAxis,
          yAxis: yAxis,
          categoryXField: "date",
          categoryYField: "hour",
          valueField: "value",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{value}",
        strokeOpacity: 1,
        strokeWidth: 1,
        width: am5.percent(100),
        height: am5.percent(100),
        cornerRadiusTL: 2,
        cornerRadiusTR: 2,
        cornerRadiusBL: 2,
        cornerRadiusBR: 2,
      });

      // Add heat legend
      const heatLegend = chart.bottomAxesContainer.children.push(
        am5.HeatLegend.new(root, {
          orientation: "horizontal",
          startColor: am5.color("#0229FF"),
          endColor: am5.color("#FE0C00"),
          startValue: 800,
          endValue: 2500,
          stepCount: 18,
          marginTop: 40,
        })
      );

      // Customize legend labels
      heatLegend.startLabel.setAll({
        fontSize: 12,
        fill: am5.color("#666666"),
      });
      heatLegend.endLabel.setAll({
        fontSize: 12,
        fill: am5.color("#666666"),
      });

      // Set up pointer over event
      series.columns.template.events.on("pointerover", (event) => {
        const di = event.target.dataItem;
        if (di) {
          heatLegend.showValue(di.get("value", 0));
        }
      });

      // Set up data validation event
      series.events.on("datavalidated", () => {
        heatLegend.set("startValue", 800);
        heatLegend.set("endValue", 2500);
      });

      // Set up heat rules with custom gradient
      series.set("heatRules", [
        {
          target: series.columns.template,
          min: am5.color("#0229FF"),
          max: am5.color("#FE0C00"),
          dataField: "value",
          key: "fill",
        },
      ]);

      // Set data
      series.data.setAll(chartData);

      // Auto-populate X and Y axis category data
      const dates = [];
      const hours = [];

      am5.array.each(chartData, (row) => {
        if (dates.indexOf(row.date) === -1) {
          dates.push(row.date);
        }
        if (hours.indexOf(row.hour) === -1) {
          hours.push(row.hour);
        }
      });

      yAxis.data.setAll(hours.map((item) => ({ hour: item })));
      xAxis.data.setAll(dates.map((item) => ({ date: item })));

      // Make stuff animate on load
      chart.appear(1000, 100);
    };

    initChart();

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [chartData]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={chartRef}
        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border"
        style={{ minHeight: "500px", height: "500px" }}
      />
    </div>
  );
}
