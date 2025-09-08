import React, { useEffect, useMemo, useRef } from "react";

const GenericAmChart = ({
  id,
  height = 300,

  // data & x-axis
  data = [],
  xKey = "time",
  xType = "category", // "category" | "date"
  dateFormat = "yyyy-MM-dd HH:mm",

  // series: [{ type: "line"|"column", yKey, name, color?, yAxis?: "left"|"right", strokeWidth?, tooltip? }]
  series = [],

  // chart options
  // title,  // <-- no chart title
  legend = true,
  cursor = true,
  scrollbarX = false,
  exportMenu = false,

  // axes options
  yLeftTitle,
  yRightTitle,
  minGridDistance = 40,

  // toolbar / interval / fullscreen
  showToolbar = false,
  showInterval = false,
  showFullscreen = false,
  startDate,
  endDate,
  onIntervalChange,
}) => {
  const chartWrapperRef = useRef(null);   // chart-only wrapper (for fullscreen)
  const chartDivRef = useRef(null);
  const chartRef = useRef(null);

  // --- Helpers
  const toDateOnly = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  // --- Filter data for date axis when interval is provided
  const filteredData = useMemo(() => {
    if (xType !== "date" || !Array.isArray(data)) return data;

    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;

    return data.filter((row) => {
      const t = new Date(row[xKey]);
      if (Number.isNaN(t.getTime())) return false;
      const okS = s ? t >= s : true;
      const okE = e ? t <= e : true;
      return okS && okE;
    });
  }, [data, xKey, xType, startDate, endDate]);

  // --- Build / rebuild chart when options change
  useEffect(() => {
    let am4core, am4charts, am4themes_animated;
    let chart;

    async function load() {
  const coreMod = await import("@amcharts/amcharts4/core");
  const chartsMod = await import("@amcharts/amcharts4/charts");
  const animatedMod = await import("@amcharts/amcharts4/themes/animated");

  am4core = coreMod;
  am4charts = chartsMod;
  am4themes_animated = animatedMod.default;
  am4core.useTheme(am4themes_animated);

  chart = am4core.create(chartDivRef.current, am4charts.XYChart);
  chartRef.current = chart;

  // detect dark mode (Tailwind convention)
  const isDark = document.documentElement.classList.contains("dark");

  const axisLabelColor = isDark
    ? am4core.color("white")
    : am4core.color("rgba(0,0,0,0.50)");

  const gridColor = am4core.color("rgba(128,128,128,0.4)");

  // --- X Axis
  let xAxis;
  if (xType === "date") {
    xAxis = chart.xAxes.push(new am4charts.DateAxis());
    xAxis.renderer.minGridDistance = minGridDistance;
    xAxis.tooltipDateFormat = dateFormat;
    chart.dateFormatter.inputDateFormat = dateFormat;
  } else {
    xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xKey;
    xAxis.renderer.minGridDistance = minGridDistance;
  }
  xAxis.title.fontSize = 12;
  xAxis.title.fill = axisLabelColor;
  xAxis.renderer.labels.template.fill = axisLabelColor;
  xAxis.renderer.grid.template.stroke = gridColor;

  // --- Y Axis (Left)
  const leftAxis = chart.yAxes.push(new am4charts.ValueAxis());
  if (yLeftTitle) leftAxis.title.text = yLeftTitle;
  leftAxis.title.fontSize = 12;
  leftAxis.title.fill = axisLabelColor;
  leftAxis.renderer.labels.template.fill = axisLabelColor;
  leftAxis.renderer.grid.template.stroke = gridColor;

  // --- Y Axis (Right)
  let rightAxis = null;
  if (series.some((s) => s.yAxis === "right")) {
    rightAxis = chart.yAxes.push(new am4charts.ValueAxis());
    rightAxis.renderer.opposite = true;
    if (yRightTitle) rightAxis.title.text = yRightTitle;
    rightAxis.title.fontSize = 12;
    rightAxis.title.fill = axisLabelColor;
    rightAxis.renderer.labels.template.fill = axisLabelColor;
    rightAxis.renderer.grid.template.stroke = gridColor;
  }

  // --- Series
  const makeTooltip = (name, yKey) => `${name}: [bold]{${yKey}}[/]`;

  series.forEach((s) => {
    const isLine = s.type === "line";
    const S = isLine
      ? new am4charts.LineSeries()
      : new am4charts.ColumnSeries();

    if (xType === "date") S.dataFields.dateX = xKey;
    else S.dataFields.categoryX = xKey;

    S.dataFields.valueY = s.yKey;
    S.name = s.name || s.yKey;
    S.yAxis = s.yAxis === "right" && rightAxis ? rightAxis : leftAxis;

    // color
    if (s.color) {
      S.stroke = am4core.color(s.color);
      if (!isLine) S.fill = am4core.color(s.color);
    }

    S.strokeWidth = s.strokeWidth ?? (isLine ? 2 : 1.5);
    if (!isLine) S.columns.template.width = am4core.percent(70);

    // --- Tooltip styling
    S.tooltipText = s.tooltip || makeTooltip(S.name, s.yKey);
    S.tooltip.getFillFromObject = true;      // get color from series
    S.tooltip.background.strokeWidth = 0;
    S.tooltip.label.fill = am4core.color("white");

  

    chart.series.push(S);
  });

  // --- Legend
  if (legend) {
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.labels.template.fontSize = 12;
    chart.legend.valueLabels.template.fontSize = 12;
    chart.legend.labels.template.fill = axisLabelColor;
    chart.legend.valueLabels.template.fill = axisLabelColor;
  }

  if (cursor) {
    chart.cursor = new am4charts.XYCursor();
    if (xType === "date") chart.cursor.xAxis = chart.xAxes.values[0];
  }
  if (scrollbarX) chart.scrollbarX = new am4core.Scrollbar();
  if (exportMenu) chart.exporting.menu = new am4core.ExportMenu();

  chart.data = filteredData;
}


    load();

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [
    xKey,
    xType,
    dateFormat,
    series,
    legend,
    cursor,
    scrollbarX,
    exportMenu,
    yLeftTitle,
    yRightTitle,
    minGridDistance,
    filteredData,
  ]);

  // --- Update dataset on interval or data change (no full rebuild)
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = filteredData;
    }
  }, [filteredData]);

  // --- Fullscreen (chart area only)
  const handleFullscreen = async () => {
    const el = chartWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else if (document.fullscreenElement === el) {
      await document.exitFullscreen();
    }
  };

  // --- Interval input handlers (native date pickers)
  const handleStartChange = (e) => {
    if (!onIntervalChange) return;
    const v = e.target.value ? new Date(e.target.value) : null;
    if (v && startDate)
      v.setHours(
        new Date(startDate).getHours(),
        new Date(startDate).getMinutes(),
        0,
        0
      );
    onIntervalChange(v, endDate);
  };

  const handleEndChange = (e) => {
    if (!onIntervalChange) return;
    const v = e.target.value ? new Date(e.target.value) : null;
    if (v && endDate)
      v.setHours(
        new Date(endDate).getHours(),
        new Date(endDate).getMinutes(),
        59,
        999
      );
    onIntervalChange(startDate, v);
  };

  const startVal = startDate ? toDateOnly(startDate).toISOString().slice(0, 10) : "";
  const endVal = endDate ? toDateOnly(endDate).toISOString().slice(0, 10) : "";

  return (
    <div className="w-full">
      {/* Toolbar (no chart title) */}
      {showToolbar && (
        <div className="mb-2 flex items-center justify-end">
          <div className="flex items-center gap-2">
            {showInterval && xType === "date" && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Interval:</span>
                <input
                  type="date"
                  value={startVal}
                  onChange={handleStartChange}
                  className="border rounded px-1 py-0.5"
                />
                <span>to</span>
                <input
                  type="date"
                  value={endVal}
                  min={startVal || undefined}
                  onChange={handleEndChange}
                  className="border rounded px-1 py-0.5"
                />
              </div>
            )}

            {showFullscreen && (
              <button
                onClick={handleFullscreen}
                title="Toggle fullscreen"
                className="px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                  <path d="M6.21448 13.7935H4.28027V18.6291H9.1158V16.6949H6.21448V13.7935ZM4.28027 9.92513H6.21448V7.02381H9.1158V5.0896H4.28027V9.92513ZM15.8855 16.6949H12.9842V18.6291H17.8197V13.7935H15.8855V16.6949ZM12.9842 5.0896V7.02381H15.8855V9.92513H17.8197V5.0896H12.9842Z" fill="#7B849A"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chart area */}
      <div ref={chartWrapperRef} className="w-full">
        <div
          id={id}
          ref={chartDivRef}
          style={{ width: "100%", height: `${height}px` }}
          className="rounded-[12px]"
        />
      </div>
    </div>
  );
};

export default GenericAmChart;
