// "use client";
// import React, { useEffect, useRef } from "react";
// import * as echarts from "echarts";
// import { useTheme } from "next-themes";

// export default function CockpitChart({
//   outerValue = 0,
//   innerValue = 0,
//   width = "100%",
//   height = "250px",
//   showInner = true,
//   innerRadiousProp,
//   outerRadiousProp,
//   innerMinRange,
//   innerMaxRange,
//   title = "",
//   containerHeight,
//   outerMinRange,
//   outerMaxRange,
//   splitNumberRange = 10,
// }) {
//   const chartRef = useRef(null);
//   const instance = useRef(null);
//   const { theme } = useTheme();
//   const textColor = theme === "dark" ? "#ffffff" : "#000000";
//   const outerColor = "#D5AAFF";
//   const innerColor = "#67B7DC";

//   // Move the gauge calculation logic outside useEffect to avoid recreation
//   const customLabelConfig = [
//     { label: "0.5", gaugeValue: -1.0, actualValue: 0.5 },
//     { label: "0.6", gaugeValue: -0.8, actualValue: 0.6 },
//     { label: "0.7", gaugeValue: -0.6, actualValue: 0.7 },
//     { label: "0.8", gaugeValue: -0.4, actualValue: 0.8 },
//     { label: "0.9", gaugeValue: -0.2, actualValue: 0.9 },
//     { label: "1.0", gaugeValue: 0.0, actualValue: 1.0 },
//     { label: "0.9", gaugeValue: 0.2, actualValue: -0.9 },
//     { label: "0.8", gaugeValue: 0.4, actualValue: -0.8 },
//     { label: "0.7", gaugeValue: 0.6, actualValue: -0.7 },
//     { label: "0.6", gaugeValue: 0.8, actualValue: -0.6 },
//     { label: "0.5", gaugeValue: 1.0, actualValue: -0.5 },
//   ];

//   const getGaugeValue = (actualValue) => {
//     const exactMatch = customLabelConfig.find(
//       (item) => Math.abs(item.actualValue - actualValue) < 0.001
//     );
//     if (exactMatch) return exactMatch.gaugeValue;

//     if (actualValue > 1.0) actualValue = 1.0;
//     if (actualValue < -0.9) actualValue = -0.9;

//     for (let i = 0; i < customLabelConfig.length - 1; i++) {
//       const current = customLabelConfig[i];
//       const next = customLabelConfig[i + 1];

//       if (
//         actualValue >= current.actualValue &&
//         actualValue <= next.actualValue
//       ) {
//         const ratio =
//           (actualValue - current.actualValue) /
//           (next.actualValue - current.actualValue);
//         return (
//           current.gaugeValue + ratio * (next.gaugeValue - current.gaugeValue)
//         );
//       }

//       if (current.actualValue > next.actualValue) {
//         if (
//           actualValue >= current.actualValue ||
//           actualValue <= next.actualValue
//         ) {
//           let ratio;
//           if (actualValue >= current.actualValue) {
//             ratio =
//               (actualValue - current.actualValue) /
//               (1.0 - current.actualValue + (next.actualValue - -1.0));
//           } else {
//             ratio =
//               (actualValue - -1.0 + (1.0 - current.actualValue)) /
//               (1.0 - current.actualValue + (next.actualValue - -1.0));
//           }
//           return (
//             current.gaugeValue + ratio * (next.gaugeValue - current.gaugeValue)
//           );
//         }
//       }
//     }

//     return 0;
//   };

//   const createLabelMap = () => {
//     const map = {};
//     customLabelConfig.forEach((item) => {
//       map[item.gaugeValue.toFixed(1)] = item.label;
//     });
//     return map;
//   };

//   useEffect(() => {
//     // Initialize chart only once
//     if (!instance.current) {
//       instance.current = echarts.init(chartRef.current);

//       const option = {
//         backgroundColor: "transparent",
//         animation: true,
//         animationDuration: 1000,
//         animationEasing: "cubicOut",
//         series: [
//           ...(showInner
//             ? [
//                 {
//                   type: "gauge",
//                   min: -1,
//                   max: 1,
//                   startAngle: 180,
//                   endAngle: 0,
//                   radius: innerRadiousProp,
//                   axisLine: {
//                     lineStyle: {
//                       width: 6,
//                       color: [[1, innerColor]],
//                     },
//                   },
//                   axisTick: {
//                     distance: 0,
//                     length: 0,
//                     splitNumber: 10,
//                     lineStyle: { color: innerColor },
//                   },
//                   axisLabel: {
//                     distance: 10,
//                     color: textColor,
//                     fontSize: 10,
//                     formatter: function (value) {
//                       const labelMap = createLabelMap();
//                       return labelMap[value.toFixed(1)] || value.toFixed(1);
//                     },
//                   },
//                   splitLine: {
//                     distance: -4,
//                     length: 15,
//                     splitNumber: 10,
//                     lineStyle: { color: innerColor },
//                   },
//                   pointer: {
//                     show: true,
//                     length: "90%",
//                     width: 6,
//                     itemStyle: { color: innerColor },
//                   },
//                   anchor: {
//                     show: true,
//                     size: 26,
//                     itemStyle: { color: innerColor },
//                   },
//                   detail: { show: false },
//                   data: [{ value: 0 }],
//                 },
//               ]
//             : []),

//           {
//             type: "gauge",
//             min: outerMinRange,
//             max: outerMaxRange,
//             startAngle: 180,
//             endAngle: 0,
//             splitNumber: splitNumberRange,
//             radius: outerRadiousProp,
//             axisLine: {
//               lineStyle: {
//                 width: showInner ? 6 : 10,
//                 color: [[1, outerColor]],
//               },
//             },
//             axisLabel: {
//               distance: -30,
//               color: textColor,
//               fontSize: 10,
//               rotate: 0,
//               align: "center",
//               verticalAlign: "middle",
//               formatter: (v) => v,
//             },
//             axisTick: {
//               distance: -10,
//               length: 0,
//               lineStyle: {
//                 color: outerColor,
//               },
//             },
//             splitLine: {
//               distance: -15,
//               length: 15,
//               lineStyle: {
//                 color: outerColor,
//               },
//             },
//             pointer: {
//               show: true,
//               length: "90%",
//               width: 6,
//               itemStyle: {
//                 color: outerColor,
//               },
//             },
//             anchor: {
//               show: true,
//               size: 20,
//               itemStyle: {
//                 borderColor: outerColor,
//                 color: outerColor,
//                 borderWidth: 2,
//               },
//             },
//             detail: {
//               show: !showInner, // Show detail only when inner gauge is hidden
//               offsetCenter: [0, "20%"],
//               valueAnimation: true,
//               formatter: function (value) {
//                 return `${value.toFixed(1)}`;
//               },
//               color: textColor,
//               fontSize: 20,
//               fontWeight: "bold",
//             },
//             data: [{ value: outerValue }],
//           },
//         ],
//         graphic: [
//           ...(showInner
//             ? [
//                 {
//                   type: "text",
//                   left: "30%",
//                   top: "45%",
//                   style: {
//                     text: "Lag",
//                     fill: textColor,
//                     fontSize: 14,
//                   },
//                 },
//                 {
//                   type: "text",
//                   right: "30%",
//                   top: "45%",
//                   style: {
//                     text: "Lead",
//                     fill: textColor,
//                     fontSize: 14,
//                   },
//                 },
//               ]
//             : [
//                 {
//                   type: "text",
//                   right: "46%",
//                   top: "25%",
//                   style: {
//                     text: "MW",
//                     fill: textColor,
//                     fontSize: 14,
//                   },
//                 },
//               ]),
//         ],
//       };

//       instance.current.setOption(option);

//       // Add resize handler
//       const resize = () => instance.current?.resize();
//       window.addEventListener("resize", resize);

//       // Cleanup function
//       return () => {
//         window.removeEventListener("resize", resize);
//         if (instance.current) {
//           instance.current.dispose();
//           instance.current = null;
//         }
//       };
//     }
//   }, [theme]); // Empty dependency array - initialize only once

//   // Update chart data when values change
//   useEffect(() => {
//     if (instance.current) {
//       // Apply clamping
//       let clampedInner = innerValue;
//       if (innerValue > 1) clampedInner = 1;
//       else if (innerValue < 0.5 && innerValue >= 0) clampedInner = 0.5;
//       else if (innerValue < 0 && innerValue > -0.5) clampedInner = -0.5;

//       const gaugeValue = getGaugeValue(clampedInner);

//       // Update only the data, not the entire chart
//       const updateOption = {
//         series: [
//           ...(showInner
//             ? [
//                 {
//                   data: [{ value: gaugeValue }],
//                 },
//               ]
//             : []),
//           {
//             data: [{ value: outerValue }],
//             detail: {
//               show: !showInner,
//             },
//           },
//         ],
//       };

//       instance.current.setOption(updateOption);
//     }
//   }, [outerValue, innerValue, showInner]); // Added showInner to dependencies

//   // Handle theme changes
//   useEffect(() => {
//     if (instance.current) {
//       const newTextColor = theme === "dark" ? "#ffffff" : "#000000";

//       const updateOption = {
//         axisLabel: {
//           color: newTextColor,
//         },
//         series: [
//           ...(showInner
//             ? [
//                 {
//                   axisLabel: {
//                     color: newTextColor,
//                   },
//                 },
//               ]
//             : []),
//           {
//             axisLabel: {
//               color: newTextColor,
//             },
//             detail: {
//               color: newTextColor,
//             },
//           },
//         ],
//         graphic: showInner
//           ? [
//               {
//                 style: {
//                   fill: newTextColor,
//                 },
//               },
//               {
//                 style: {
//                   fill: newTextColor,
//                 },
//               },
//             ]
//           : [],
//       };

//       instance.current.setOption(updateOption);
//     }
//   }, [theme, showInner]); // Added showInner to dependencies

//   return (
//     <div
//       style={{
//         height: containerHeight,
//       }}
//     >
//       <div
//         ref={chartRef}
//         style={{
//           width,
//           height,
//           display: "block",
//           lineHeight: 0,
//         }}
//         className="transition-all"
//       />
//     </div>
//   );
// }
/////////////==============================================
"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

export default function CockpitChart({
  outerValue = 0,
  innerValue = 0,
  width = "100%",
  height = "250px",
  showInner = true,
  outerlineWidth = 6,
  innerRadiousProp,
  outerRadiousProp,
  innerMinRange,
  innerMaxRange,
  outerSplitNumberRange = 10,
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

  // Move the gauge calculation logic outside useEffect to avoid recreation
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

  // Fix the createLabelMap function
  const createLabelMap = () => {
    const map = {};
    customLabelConfig.forEach((item) => {
      // Use the exact gaugeValue as key, not rounded
      map[item.gaugeValue] = item.label;
    });
    return map;
  };

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
            current.gaugeValue + ratio * (next.gaugeValue - current.gaugeValue)
          );
        }
      }
    }

    return 0;
  };

  useEffect(() => {
    // Initialize chart only once
    if (!instance.current) {
      instance.current = echarts.init(chartRef.current);

      const labelMap = createLabelMap();

      const option = {
        backgroundColor: "transparent",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        series: [
          // Conditionally include inner gauge series
          ...(showInner
            ? [
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
                    lineStyle: { color: innerColor },
                  },
                  axisLabel: {
                    distance: 10,
                    color: textColor,
                    fontSize: 10,
                    formatter: function (value) {
                      // Find the closest matching gauge value
                      const closest = customLabelConfig.reduce((prev, curr) => {
                        return Math.abs(curr.gaugeValue - value) <
                          Math.abs(prev.gaugeValue - value)
                          ? curr
                          : prev;
                      });
                      return closest.label;
                    },
                  },
                  splitLine: {
                    distance: -4,
                    length: 15,
                    splitNumber: 10,
                    lineStyle: { color: innerColor },
                  },
                  pointer: {
                    show: true,
                    length: "90%",
                    width: 6,
                    itemStyle: { color: innerColor },
                  },
                  anchor: {
                    show: true,
                    size: 26,
                    itemStyle: { color: innerColor },
                  },
                  detail: { show: false },
                  data: [{ value: 0 }],
                },
              ]
            : []),
          {
            type: "gauge",
            min: outerMinRange,
            max: outerMaxRange,
            startAngle: 180,
            endAngle: 0,
            splitNumber: outerSplitNumberRange,
            radius: outerRadiousProp,
            axisLine: {
              lineStyle: {
                width: outerlineWidth,
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
          // Conditionally show Lag/Lead labels or other graphics
          ...(showInner
            ? [
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
              ]
            : [
                {
                  type: "text",
                  right: "46%",
                  top: "25%",
                  style: {
                    text: "MW",
                    fill: textColor,
                    fontSize: 14,
                  },
                },
              ]),
        ],
      };

      instance.current.setOption(option);

      // Add resize handler
      const resize = () => instance.current?.resize();
      window.addEventListener("resize", resize);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", resize);
        if (instance.current) {
          instance.current.dispose();
          instance.current = null;
        }
      };
    }
  }, []); // Empty dependency array - initialize only once

  // Update chart data when values change
  useEffect(() => {
    if (instance.current) {
      // Apply clamping
      let clampedInner = innerValue;
      if (innerValue > 1) clampedInner = 1;
      else if (innerValue < 0.5 && innerValue >= 0) clampedInner = 0.5;
      else if (innerValue < 0 && innerValue > -0.5) clampedInner = -0.5;

      const gaugeValue = getGaugeValue(clampedInner);

      // Update only the data, not the entire chart
      const updateOption = {
        series: [
          // Conditionally update inner gauge data
          ...(showInner
            ? [
                {
                  data: [{ value: gaugeValue }],
                },
              ]
            : []),
          {
            data: [{ value: outerValue }],
          },
        ],
      };

      instance.current.setOption(updateOption);
    }
  }, [outerValue, innerValue, showInner]);

  // Handle theme changes
  useEffect(() => {
    if (instance.current) {
      const newTextColor = theme === "dark" ? "#ffffff" : "#000000";

      const updateOption = {
        series: [
          // Conditionally update inner gauge styles
          ...(showInner
            ? [
                {
                  axisLabel: { color: newTextColor },
                  splitLine: { lineStyle: { color: "#67B7DC" } },
                  axisTick: { lineStyle: { color: "#67B7DC" } },
                },
              ]
            : []),
          {
            axisLabel: { color: newTextColor },
            splitLine: { lineStyle: { color: "#D5AAFF" } },
            axisTick: { lineStyle: { color: "#D5AAFF" } },
          },
        ],
        graphic: showInner
          ? [
              { style: { fill: newTextColor } },
              { style: { fill: newTextColor } },
            ]
          : [{ style: { fill: newTextColor } }],
      };

      instance.current.setOption(updateOption);
    }
  }, [theme, showInner]);

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
