"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { useTheme } from "next-themes";

const ReusableTrendChart = ({
  id,
  title,
  data = [],
  xKey = "time",
  xType = "category",
  dateFormat = "yyyy-MM-dd HH:mm",
  series = [],
  legend = true,
  cursor = true,
  scrollbarX = false,
  exportMenu = false,
  yLeftTitle,
  yRightTitle,
  minGridDistance = 40,
  showToolbar = false,
  showInterval = false,
  showFullscreen = false,
  startDate,
  endDate,
  onIntervalChange,
}) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();

  // Format date for input fields
  const toDateOnly = (d) => {
    if (!d) return "";
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.toISOString().slice(0, 10);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose of previous chart if it exists
    if (rootRef.current) {
      rootRef.current.dispose();
    }

    // Create root element
    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    
    // Set themes based on current theme
    if (theme === "dark") {
      root.setThemes([
        am5themes_Animated.new(root),
        am5themes_Dark.new(root)
      ]);
    } else {
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
    }
    
    root._logo?.dispose();

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout
      })
    );

    // Create axes
    let xAxis;
    if (xType === "date") {
      xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "minute", count: 1 },
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: minGridDistance
          }),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueX}"
          })
        })
      );
    } else {
      xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: minGridDistance
          }),
          categoryField: xKey
        })
      );
    }

    // Create Y axes
    const leftYAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    if (yLeftTitle) {
      leftYAxis.set("title", am5.Label.new(root, {
        text: yLeftTitle,
        fontSize: 12
      }));
    }

    let rightYAxis;
    if (series.some(s => s.yAxis === "right")) {
      rightYAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            opposite: true
          })
        })
      );

      if (yRightTitle) {
        rightYAxis.set("title", am5.Label.new(root, {
          text: yRightTitle,
          fontSize: 12
        }));
      }
    }

    // Add series
    series.forEach(seriesConfig => {
      let chartSeries;
      const yAxis = seriesConfig.yAxis === "right" ? rightYAxis : leftYAxis;
      
      if (seriesConfig.type === "line") {
        chartSeries = am5xy.LineSeries.new(root, {
          name: seriesConfig.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesConfig.yKey,
          valueXField: xKey,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name}: {valueY}"
          })
        });
        
        if (seriesConfig.color) {
          chartSeries.strokes.template.set("stroke", am5.color(seriesConfig.color));
        }
        
        if (seriesConfig.strokeWidth) {
          chartSeries.strokes.template.set("strokeWidth", seriesConfig.strokeWidth);
        }
      } else if (seriesConfig.type === "column") {
        chartSeries = am5xy.ColumnSeries.new(root, {
          name: seriesConfig.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesConfig.yKey,
          valueXField: xKey,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name}: {valueY}"
          })
        });
        
        // Increase column width
        chartSeries.columns.template.setAll({
          width: am5.percent(70), // Increased from default
          cornerRadiusTL: 3,
          cornerRadiusTR: 3
        });
        
        if (seriesConfig.color) {
          chartSeries.columns.template.set("fill", am5.color(seriesConfig.color));
          chartSeries.columns.template.set("stroke", am5.color(seriesConfig.color));
        }
      }
      
      if (chartSeries) {
        chart.series.push(chartSeries);
        chartSeries.data.setAll(data);
      }
    });

    // Add legend
    if (legend) {
      const chartLegend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout
        })
      );
      chartLegend.data.setAll(chart.series.values);
      
      // Style legend based on theme
      chartLegend.labels.template.setAll({
        fill: theme === "dark" ? am5.color(0xffffff) : am5.color(0x000000)
      });
    }

    // Add cursor
    if (cursor) {
      chart.set("cursor", am5xy.XYCursor.new(root, {}));
    }

    // Add scrollbar if needed
    if (scrollbarX) {
      chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
      }));
    }

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, xKey, xType, series, legend, cursor, scrollbarX, yLeftTitle, yRightTitle, minGridDistance, theme]);

  // Handle interval changes
  const handleStartChange = (e) => {
    if (!onIntervalChange) return;
    const value = e.target.value ? new Date(e.target.value) : null;
    onIntervalChange(value, endDate);
  };

  const handleEndChange = (e) => {
    if (!onIntervalChange) return;
    const value = e.target.value ? new Date(e.target.value) : null;
    onIntervalChange(startDate, value);
  };

  const startVal = toDateOnly(startDate);
  const endVal = toDateOnly(endDate);

  return (
    <div className={`relative w-full p-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {showToolbar && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            {title}
          </span>
          <div className="flex items-center gap-2">
            {showInterval && xType === "date" && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium dark:text-gray-300">Interval:</span>
                <input
                  type="date"
                  value={startVal}
                  onChange={handleStartChange}
                  className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <span className="dark:text-gray-300">to</span>
                <input
                  type="date"
                  value={endVal}
                  min={startVal || undefined}
                  onChange={handleEndChange}
                  className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            )}

            {showFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {isFullscreen ? (
                  <MdOutlineFullscreenExit size={20} />
                ) : (
                  <MdOutlineFullscreen size={20} />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={chartRef}
        id={id}
        style={{ height: isFullscreen ? "90vh" : `12rem` }}
        className="w-full"
      />
    </div>
  );
};

export default ReusableTrendChart;