// "use client";
// import React, { useLayoutEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// import { useTheme } from "next-themes";

// export default function AnalyticsChart({
//   data = [],
//   title = "",
//   onExportReady,
//   keys = {
//     p1Harmonics: "p1Harmonics",
//     p2Harmonics: "p2Harmonics",
//     p1Max: "p1Max",
//     p1Min: "p1Min",
//     p2Max: "p2Max",
//     p2Min: "p2Min",
//   },
//   colors = {
//     p1Harmonics: "#047857",
//     p2Harmonics: "#65a30d",
//     p1Max: "#dc2626",
//     p1Min: "#1d4ed8",
//     p2Max: "#d97706",
//     p2Min: "#e879f9",
//   },
// }) {
//   const { theme } = useTheme();
//   const chartRef = useRef(null);

//   useLayoutEffect(() => {
//     if (!chartRef.current) return;

//     let root = am5.Root.new(chartRef.current);

//     // Set theme based on next-themes
//     const isDarkMode = theme === "dark";

//     if (isDarkMode) {
//       // For dark mode, set dark colors
//       root.setThemes([
//         am5themes_Animated.new(root),
//         am5.Theme.new(root, {
//           // Dark theme customization
//           background: am5.color(0x1f2937), // gray-800
//           textColor: am5.color(0xf9fafb), // gray-50
//           paneBackground: am5.color(0x1f2937),
//         }),
//       ]);
//     } else {
//       root.setThemes([am5themes_Animated.new(root)]);
//     }

//     root._logo.dispose();

//     const chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: true,
//         panY: false,
//         wheelX: "panX",
//         wheelY: "zoomX",
//         paddingLeft: 0,
//         layout: root.verticalLayout,
//       })
//     );

//     // Title with theme support
//     chart.children.unshift(
//       am5.Label.new(root, {
//         text: title,
//         fontSize: 18,
//         fontWeight: "600",
//         paddingBottom: 15,
//         centerX: am5.p50,
//         x: am5.p50,
//         fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
//       })
//     );

//     // Legend with theme support
//     const legend = chart.children.push(
//       am5.Legend.new(root, {
//         centerX: am5.p50,
//         x: am5.p50,
//         marginTop: 10,
//       })
//     );

//     // Style legend labels based on theme
//     legend.labels.template.setAll({
//       fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
//     });

//     // X Axis (Years)
//     const xAxis = chart.xAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: "year",
//         renderer: am5xy.AxisRendererX.new(root, {
//           minGridDistance: 30,
//           cellStartLocation: 0.1,
//           cellEndLocation: 0.9,
//         }),
//         tooltip: am5.Tooltip.new(root, {}),
//       })
//     );

//     // Style X-axis labels based on theme
//     xAxis.get("renderer").labels.template.setAll({
//       fill: isDarkMode ? am5.color(0xd1d5db) : undefined, // gray-300 for dark
//       fontSize: 12,
//     });

//     xAxis.data.setAll(data);

//     // Adjust label rotation and wrapping based on data count
//     if (data.length > 10) {
//       xAxis.get("renderer").labels.template.setAll({
//         rotation: -45,
//         textAlign: "end",
//         centerY: am5.p100,
//         centerX: 0,
//         paddingTop: 5,
//         maxWidth: 100,
//         oversizedBehavior: "wrap",
//         fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
//       });
//     }

//     // Left Y Axis (Harmonics) - FIXED: Label moved to appear after the axis
//     const yLeftAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         renderer: am5xy.AxisRendererY.new(root, {}),
//         numberFormat: "#.0",
//       })
//     );

//     // Add label to appear AFTER the axis (at the top)
//     yLeftAxis.children.unshift(
//       am5.Label.new(root, {
//         text: "Harmonics",
//         rotation: -90,
//         y: am5.p50, // Position at top (0%)
//         centerX: am5.p50,
//         fontWeight: "500",
//         fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
//         paddingTop: 10, // Add some padding from top
//         paddingBottom: 0,
//       })
//     );

//     // Style Y-axis labels based on theme
//     yLeftAxis.get("renderer").labels.template.setAll({
//       fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
//     });

//     // Right Y Axis (Min/Max) - FIXED: Label moved to appear after the axis
//     const yRightAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
//       })
//     );

//     // Add label to appear AFTER the axis (at the top)
//     yRightAxis.children.unshift(
//       am5.Label.new(root, {
//         text: "Min / Max",
//         rotation: 90,
//         y: am5.p50, // Position at top (0%)
//         centerX: am5.p50,
//         fontWeight: "500",
//         fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
//         paddingTop: 10, // Add some padding from top
//         paddingBottom: 0,
//         marginRight: -50,
//       })
//     );

//     // Style right Y-axis labels based on theme
//     yRightAxis.get("renderer").labels.template.setAll({
//       fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
//     });

//     // 🔹 ADD CURSOR for tooltip functionality
//     const cursor = chart.set(
//       "cursor",
//       am5xy.XYCursor.new(root, {
//         behavior: "none",
//         xAxis: xAxis,
//       })
//     );

//     // Style cursor line based on theme
//     cursor.lineY.set("stroke", isDarkMode ? am5.color(0x4b5563) : undefined); // gray-600
//     cursor.lineX.set("stroke", isDarkMode ? am5.color(0x4b5563) : undefined);

//     // Style grid lines based on theme
//     xAxis.get("renderer").grid.template.setAll({
//       stroke: isDarkMode ? am5.color(0x374151) : undefined, // gray-700
//       strokeOpacity: 0.3,
//     });

//     yLeftAxis.get("renderer").grid.template.setAll({
//       stroke: isDarkMode ? am5.color(0x374151) : undefined,
//       strokeOpacity: 0.3,
//     });

//     yRightAxis.get("renderer").grid.template.setAll({
//       stroke: isDarkMode ? am5.color(0x374151) : undefined,
//       strokeOpacity: 0.3,
//     });

//     // 🔹 Helper to create Column Series
//     const makeColumn = (name, field, color) => {
//       const series = chart.series.push(
//         am5xy.ColumnSeries.new(root, {
//           name,
//           xAxis,
//           yAxis: yLeftAxis,
//           valueYField: field,
//           categoryXField: "year",
//           clustered: true,
//           fill: am5.color(color),
//           tooltip: am5.Tooltip.new(root, {
//             labelText: "{name}: {valueY}",
//           }),
//         })
//       );

//       // Adjust column width based on data count
//       const columnWidth = data.length > 15 ? 70 : 90;

//       series.columns.template.setAll({
//         width: am5.percent(columnWidth),
//         fillOpacity: 0.8,
//         strokeOpacity: 0,
//         fill: am5.color(color),
//       });

//       series.data.setAll(data);
//       legend.data.push(series);
//       return series;
//     };

//     // 🔹 Helper to create Line Series
//     const makeLine = (name, field, color) => {
//       // Create a custom tooltip with the series color
//       const tooltip = am5.Tooltip.new(root, {
//         labelText: "{name}: {valueY}",
//         getFillFromSprite: false,
//         autoTextColor: false,
//       });

//       // Set tooltip background color to match line color
//       tooltip.get("background").setAll({
//         fill: am5.color(color),
//         fillOpacity: 0.9,
//       });

//       // Calculate text color based on background brightness
//       const colorHex = color.replace("#", "");
//       const r = parseInt(colorHex.substr(0, 2), 16);
//       const g = parseInt(colorHex.substr(2, 2), 16);
//       const b = parseInt(colorHex.substr(4, 2), 16);
//       const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//       const textColor =
//         brightness > 128 ? am5.color(0x000000) : am5.color(0xffffff);

//       tooltip.label.setAll({
//         fill: textColor,
//       });

//       const series = chart.series.push(
//         am5xy.LineSeries.new(root, {
//           name,
//           xAxis,
//           yAxis: yRightAxis,
//           valueYField: field,
//           categoryXField: "year",
//           stroke: am5.color(color),
//           tooltip: tooltip,
//         })
//       );

//       series.strokes.template.setAll({
//         strokeWidth: 2,
//         stroke: am5.color(color),
//       });

//       // Add bullets for better tooltip interaction
//       series.bullets.push(function () {
//         const bulletCircle = am5.Circle.new(root, {
//           radius: 4,
//           fill: am5.color(color),
//           stroke: root.interfaceColors.get("background"),
//           strokeWidth: 2,
//         });

//         // Style bullet stroke based on theme
//         if (isDarkMode) {
//           bulletCircle.set("stroke", am5.color(0x1f2937)); // gray-800 for dark mode
//         }

//         return am5.Bullet.new(root, {
//           sprite: bulletCircle,
//         });
//       });

//       series.data.setAll(data);
//       legend.data.push(series);
//       return series;
//     };

//     // Columns (cluster)
//     makeColumn("P1 Harmonics", keys.p1Harmonics, colors.p1Harmonics);
//     makeColumn("P2 Harmonics", keys.p2Harmonics, colors.p2Harmonics);

//     // Lines (min/max)
//     makeLine("P1 Max", keys.p1Max, colors.p1Max);
//     makeLine("P1 Min", keys.p1Min, colors.p1Min);
//     makeLine("P2 Max", keys.p2Max, colors.p2Max);
//     makeLine("P2 Min", keys.p2Min, colors.p2Min);

//     chart.appear(1000, 100);
//     // 🔥 AUTO EXPORT AFTER RENDER
//     // 🔥 ENABLE EXPORTING (REQUIRED)
//     const exporting = am5exporting.Exporting.new(root, {
//       filePrefix: title.replace(/\s+/g, "_"),
//     });

//     // 🔥 WAIT UNTIL CHART IS ACTUALLY RENDERED
//     const exportTimeout = setTimeout(() => {
//       exporting
//         .export("png", {
//           quality: 0.95,
//           scale: 2,
//         })
//         .then((pngBase64) => {
//           if (onExportReady && pngBase64) {
//             onExportReady(pngBase64); // ✅ send single image
//           }
//         })
//         .catch(console.error);
//     }, 1400); // ⏱ MUST be after appear()

//     return () => {
//       clearTimeout(exportTimeout);
//       root.dispose();
//     };
//   }, [data, keys, title, colors, theme]); // Added theme to dependencies

//   return (
//     <div className="w-full p-4">
//       <div ref={chartRef} className="w-full h-[500px]" />
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
"use client";
import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { useTheme } from "next-themes";

export default function AnalyticsChart({
  data = [],
  title = "",
  onExportReady,
  keys = {
    p1Harmonics: "p1Harmonics",
    p2Harmonics: "p2Harmonics",
    p1Max: "p1Max",
    p1Min: "p1Min",
    p2Max: "p2Max",
    p2Min: "p2Min",
  },
  colors = {
    p1Harmonics: "#047857",
    p2Harmonics: "#65a30d",
    p1Max: "#dc2626",
    p1Min: "#1d4ed8",
    p2Max: "#d97706",
    p2Min: "#e879f9",
  },
}) {
  const { theme } = useTheme();
  const chartRef = useRef(null);
  const exportRootRef = useRef(null); // Separate root for exporting

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    let root = am5.Root.new(chartRef.current);
    let exportRoot = null;

    // Set theme based on next-themes
    const isDarkMode = theme === "dark";

    if (isDarkMode) {
      // For dark mode, set dark colors
      root.setThemes([
        am5themes_Animated.new(root),
        am5.Theme.new(root, {
          // Dark theme customization
          background: am5.color(0x1f2937), // gray-800
          textColor: am5.color(0xf9fafb), // gray-50
          paneBackground: am5.color(0x1f2937),
        }),
      ]);
    } else {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    root._logo.dispose();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    // Title with theme support
    chart.children.unshift(
      am5.Label.new(root, {
        text: title,
        fontSize: 18,
        fontWeight: "600",
        paddingBottom: 15,
        centerX: am5.p50,
        x: am5.p50,
        fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
      })
    );

    // Legend with theme support
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 10,
      })
    );

    // Style legend labels based on theme
    legend.labels.template.setAll({
      fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
    });

    // X Axis (Years)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Style X-axis labels based on theme
    xAxis.get("renderer").labels.template.setAll({
      fill: isDarkMode ? am5.color(0xd1d5db) : undefined, // gray-300 for dark
      fontSize: 12,
    });

    xAxis.data.setAll(data);

    // Adjust label rotation and wrapping based on data count
    if (data.length > 10) {
      xAxis.get("renderer").labels.template.setAll({
        rotation: -45,
        textAlign: "end",
        centerY: am5.p100,
        centerX: 0,
        paddingTop: 5,
        maxWidth: 100,
        oversizedBehavior: "wrap",
        fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
      });
    }

    // Left Y Axis (Harmonics)
    const yLeftAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        numberFormat: "#.0",
      })
    );

    // Add label to appear AFTER the axis (at the top)
    yLeftAxis.children.unshift(
      am5.Label.new(root, {
        text: "Harmonics",
        rotation: -90,
        y: am5.p50, // Position at top (0%)
        centerX: am5.p50,
        fontWeight: "500",
        fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
        paddingTop: 10, // Add some padding from top
        paddingBottom: 0,
      })
    );

    // Style Y-axis labels based on theme
    yLeftAxis.get("renderer").labels.template.setAll({
      fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
    });

    // Right Y Axis (Min/Max)
    const yRightAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
      })
    );

    // Add label to appear AFTER the axis (at the top)
    yRightAxis.children.unshift(
      am5.Label.new(root, {
        text: "Min / Max",
        rotation: 90,
        y: am5.p50, // Position at top (0%)
        centerX: am5.p50,
        fontWeight: "500",
        fill: isDarkMode ? am5.color(0xf9fafb) : undefined,
        paddingTop: 10, // Add some padding from top
        paddingBottom: 0,
        marginRight: -50,
      })
    );

    // Style right Y-axis labels based on theme
    yRightAxis.get("renderer").labels.template.setAll({
      fill: isDarkMode ? am5.color(0xd1d5db) : undefined,
    });

    // 🔹 ADD CURSOR for tooltip functionality
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
      })
    );

    // Style cursor line based on theme
    cursor.lineY.set("stroke", isDarkMode ? am5.color(0x4b5563) : undefined); // gray-600
    cursor.lineX.set("stroke", isDarkMode ? am5.color(0x4b5563) : undefined);

    // Style grid lines based on theme
    xAxis.get("renderer").grid.template.setAll({
      stroke: isDarkMode ? am5.color(0x374151) : undefined, // gray-700
      strokeOpacity: 0.3,
    });

    yLeftAxis.get("renderer").grid.template.setAll({
      stroke: isDarkMode ? am5.color(0x374151) : undefined,
      strokeOpacity: 0.3,
    });

    yRightAxis.get("renderer").grid.template.setAll({
      stroke: isDarkMode ? am5.color(0x374151) : undefined,
      strokeOpacity: 0.3,
    });

    // 🔹 Helper to create Column Series
    const makeColumn = (name, field, color) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis: yLeftAxis,
          valueYField: field,
          categoryXField: "year",
          clustered: true,
          fill: am5.color(color),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}",
          }),
        })
      );

      // Adjust column width based on data count
      const columnWidth = data.length > 15 ? 70 : 90;

      series.columns.template.setAll({
        width: am5.percent(columnWidth),
        fillOpacity: 0.8,
        strokeOpacity: 0,
        fill: am5.color(color),
      });

      series.data.setAll(data);
      legend.data.push(series);
      return series;
    };

    // 🔹 Helper to create Line Series
    const makeLine = (name, field, color) => {
      // Create a custom tooltip with the series color
      const tooltip = am5.Tooltip.new(root, {
        labelText: "{name}: {valueY}",
        getFillFromSprite: false,
        autoTextColor: false,
      });

      // Set tooltip background color to match line color
      tooltip.get("background").setAll({
        fill: am5.color(color),
        fillOpacity: 0.9,
      });

      // Calculate text color based on background brightness
      const colorHex = color.replace("#", "");
      const r = parseInt(colorHex.substr(0, 2), 16);
      const g = parseInt(colorHex.substr(2, 2), 16);
      const b = parseInt(colorHex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const textColor =
        brightness > 128 ? am5.color(0x000000) : am5.color(0xffffff);

      tooltip.label.setAll({
        fill: textColor,
      });

      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis: yRightAxis,
          valueYField: field,
          categoryXField: "year",
          stroke: am5.color(color),
          tooltip: tooltip,
        })
      );

      series.strokes.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(color),
      });

      // Add bullets for better tooltip interaction
      series.bullets.push(function () {
        const bulletCircle = am5.Circle.new(root, {
          radius: 4,
          fill: am5.color(color),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
        });

        // Style bullet stroke based on theme
        if (isDarkMode) {
          bulletCircle.set("stroke", am5.color(0x1f2937)); // gray-800 for dark mode
        }

        return am5.Bullet.new(root, {
          sprite: bulletCircle,
        });
      });

      series.data.setAll(data);
      legend.data.push(series);
      return series;
    };

    // Columns (cluster)
    makeColumn("P1 Harmonics", keys.p1Harmonics, colors.p1Harmonics);
    makeColumn("P2 Harmonics", keys.p2Harmonics, colors.p2Harmonics);

    // Lines (min/max)
    makeLine("P1 Max", keys.p1Max, colors.p1Max);
    makeLine("P1 Min", keys.p1Min, colors.p1Min);
    makeLine("P2 Max", keys.p2Max, colors.p2Max);
    makeLine("P2 Min", keys.p2Min, colors.p2Min);

    chart.appear(1000, 100);

    // Create a function to export chart in light mode
    const exportChartInLightMode = () => {
      // Create a temporary div for the export chart
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "1000px";
      tempDiv.style.height = "600px";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);

      // Create a new root for exporting with light theme
      exportRoot = am5.Root.new(tempDiv);
      exportRoot.setThemes([am5themes_Animated.new(exportRoot)]);
      exportRoot._logo.dispose();

      const exportChart = exportRoot.container.children.push(
        am5xy.XYChart.new(exportRoot, {
          panX: true,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft: 0,
          layout: exportRoot.verticalLayout,
        })
      );
      exportChart.set(
        "background",
        am5.Rectangle.new(exportRoot, {
          fill: am5.color(0xffffff), // White
          fillOpacity: 1,
        })
      );

      // Title
      exportChart.children.unshift(
        am5.Label.new(exportRoot, {
          text: title,
          fontSize: 18,
          fontWeight: "600",
          paddingBottom: 15,
          centerX: am5.p50,
          x: am5.p50,
        })
      );

      // Legend
      const exportLegend = exportChart.children.push(
        am5.Legend.new(exportRoot, {
          centerX: am5.p50,
          x: am5.p50,
          marginTop: 10,
        })
      );

      // X Axis (Years)
      const exportXAxis = exportChart.xAxes.push(
        am5xy.CategoryAxis.new(exportRoot, {
          categoryField: "year",
          renderer: am5xy.AxisRendererX.new(exportRoot, {
            minGridDistance: 30,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
          }),
          tooltip: am5.Tooltip.new(exportRoot, {}),
        })
      );

      exportXAxis.data.setAll(data);

      if (data.length > 10) {
        exportXAxis.get("renderer").labels.template.setAll({
          rotation: -45,
          textAlign: "end",
          centerY: am5.p100,
          centerX: 0,
          paddingTop: 5,
          maxWidth: 100,
          oversizedBehavior: "wrap",
        });
      }

      // Left Y Axis (Harmonics)
      const exportYLeftAxis = exportChart.yAxes.push(
        am5xy.ValueAxis.new(exportRoot, {
          renderer: am5xy.AxisRendererY.new(exportRoot, {}),
          numberFormat: "#.0",
        })
      );

      exportYLeftAxis.children.unshift(
        am5.Label.new(exportRoot, {
          text: "Harmonics",
          rotation: -90,
          y: am5.p50,
          centerX: am5.p50,
          fontWeight: "500",
          paddingTop: 10,
          paddingBottom: 0,
        })
      );

      // Right Y Axis (Min/Max)
      const exportYRightAxis = exportChart.yAxes.push(
        am5xy.ValueAxis.new(exportRoot, {
          renderer: am5xy.AxisRendererY.new(exportRoot, { opposite: true }),
        })
      );

      exportYRightAxis.children.unshift(
        am5.Label.new(exportRoot, {
          text: "Min / Max",
          rotation: 90,
          y: am5.p50,
          centerX: am5.p50,
          fontWeight: "500",
          paddingTop: 10,
          paddingBottom: 0,
          marginRight: -50,
        })
      );

      // Helper functions for export chart
      const makeExportColumn = (name, field, color) => {
        const series = exportChart.series.push(
          am5xy.ColumnSeries.new(exportRoot, {
            name,
            xAxis: exportXAxis,
            yAxis: exportYLeftAxis,
            valueYField: field,
            categoryXField: "year",
            clustered: true,
            fill: am5.color(color),
          })
        );

        const columnWidth = data.length > 15 ? 70 : 90;

        series.columns.template.setAll({
          width: am5.percent(columnWidth),
          fillOpacity: 0.8,
          strokeOpacity: 0,
          fill: am5.color(color),
        });

        series.data.setAll(data);
        exportLegend.data.push(series);
        return series;
      };

      const makeExportLine = (name, field, color) => {
        const series = exportChart.series.push(
          am5xy.LineSeries.new(exportRoot, {
            name,
            xAxis: exportXAxis,
            yAxis: exportYRightAxis,
            valueYField: field,
            categoryXField: "year",
            stroke: am5.color(color),
          })
        );

        series.strokes.template.setAll({
          strokeWidth: 2,
          stroke: am5.color(color),
        });

        series.bullets.push(function () {
          const bulletCircle = am5.Circle.new(exportRoot, {
            radius: 4,
            fill: am5.color(color),
            stroke: exportRoot.interfaceColors.get("background"),
            strokeWidth: 2,
          });

          return am5.Bullet.new(exportRoot, {
            sprite: bulletCircle,
          });
        });

        series.data.setAll(data);
        exportLegend.data.push(series);
        return series;
      };

      // Create series for export chart
      makeExportColumn("P1 Harmonics", keys.p1Harmonics, colors.p1Harmonics);
      makeExportColumn("P2 Harmonics", keys.p2Harmonics, colors.p2Harmonics);
      makeExportLine("P1 Max", keys.p1Max, colors.p1Max);
      makeExportLine("P1 Min", keys.p1Min, colors.p1Min);
      makeExportLine("P2 Max", keys.p2Max, colors.p2Max);
      makeExportLine("P2 Min", keys.p2Min, colors.p2Min);

      // Export from the light mode chart
      setTimeout(() => {
        const exporting = am5exporting.Exporting.new(exportRoot, {
          filePrefix: title.replace(/\s+/g, "_"),
        });

        exporting
          .export("png", {
            quality: 0.95,
            scale: 2,
          })
          .then((pngBase64) => {
            if (onExportReady && pngBase64) {
              onExportReady(pngBase64);
            }

            // Cleanup
            if (exportRoot) {
              exportRoot.dispose();
            }
            document.body.removeChild(tempDiv);
            exportRootRef.current = null;
          })
          .catch((error) => {
            console.error("Export error:", error);
            // Cleanup even on error
            if (exportRoot) {
              exportRoot.dispose();
            }
            if (tempDiv.parentNode) {
              document.body.removeChild(tempDiv);
            }
            exportRootRef.current = null;
          });
      }, 500);
    };

    // Export after chart appears
    setTimeout(exportChartInLightMode, 1400);

    return () => {
      if (exportRootRef.current) {
        exportRootRef.current.dispose();
        exportRootRef.current = null;
      }
      root.dispose();
    };
  }, [data, keys, title, colors, theme]);

  return (
    <div className="w-full p-4">
      <div ref={chartRef} className="w-[99%] h-[500px]" />
    </div>
  );
}
