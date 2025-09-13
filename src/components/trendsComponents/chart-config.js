// Configuration presets for different chart types

// Combo chart with line and column series (like your original example)
export const comboChartConfig = {
  dateFormatter: true,
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX: true,
  hideYCursor: true,
  series: [
    {
      type: "line",
      dataKey: "hourlyData",
      strokeWidth: 2,
      color: "#3b82f6",
      hideXAxis: true,
      hideYAxis: true,
      baseInterval: { timeUnit: "hour", count: 1 },
      tooltipDateFormat: "MMM d, hh:00",
      minorGridEnabled: true,
    },
    {
      type: "column",
      dataKey: "dailyData",
      color: "#10b981",
      unshift: true,
      baseInterval: { timeUnit: "day", count: 1 },
      tooltipDateFormat: "MMM d",
    },
  ],
}

// Single line chart configuration
export const singleLineConfig = {
  dateFormatter: true,
  series: [
    {
      type: "line",
      dataKey: "lineData",
      strokeWidth: 3,
      color: "#8b5cf6",
      baseInterval: { timeUnit: "day", count: 1 },
      tooltipDateFormat: "MMM d, yyyy",
    },
  ],
}

// Double line chart configuration
export const doubleLineConfig = {
  dateFormatter: true,
  series: [
    {
      type: "line",
      dataKey: "line1Data",
      strokeWidth: 2,
      color: "#ef4444",
      baseInterval: { timeUnit: "day", count: 1 },
      tooltipDateFormat: "MMM d, yyyy",
      tooltipText: "Series 1: {valueY}",
    },
    {
      type: "line",
      dataKey: "line2Data",
      strokeWidth: 2,
      color: "#06b6d4",
      baseInterval: { timeUnit: "day", count: 1 },
      tooltipDateFormat: "MMM d, yyyy",
      tooltipText: "Series 2: {valueY}",
    },
  ],
}

// Single column/bar chart configuration
export const singleColumnConfig = {
  dateFormatter: true,
  series: [
    {
      type: "column",
      dataKey: "columnData",
      color: "#f59e0b",
      baseInterval: { timeUnit: "day", count: 1 },
      tooltipDateFormat: "MMM d, yyyy",
    },
  ],
}

// Custom chart with different styling
export const customStyledConfig = {
  dateFormatter: true,
  chartSettings: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  series: [
    {
      type: "line",
      dataKey: "customData",
      strokeWidth: 4,
      color: "#dc2626",
      baseInterval: { timeUnit: "hour", count: 6 },
      tooltipDateFormat: "MMM d, HH:mm",
      seriesSettings: {
        strokeDasharray: [5, 5], // Dashed line
      },
    },
  ],
}
