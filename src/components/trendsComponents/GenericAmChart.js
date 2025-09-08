"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";

const GenericAmChart = ({
  id,
  title,
  height = 300,
  data = [],
  xKey = "time",
  xType = "category", // "category" | "date"
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
  const chartWrapperRef = useRef(null);
  const chartDivRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Helpers
  const toDateOnly = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

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

  // --- Chart init
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

      const isDark = theme === "dark";
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
      xAxis.renderer.labels.template.fontSize = 12;
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

        if (s.color) {
          S.stroke = am4core.color(s.color);
          if (!isLine) S.fill = am4core.color(s.color);
        }

        S.strokeWidth = s.strokeWidth ?? (isLine ? 2 : 1.5);
        if (!isLine) S.columns.template.width = am4core.percent(70);

        S.tooltipText = s.tooltip || makeTooltip(S.name, s.yKey);
        S.tooltip.getFillFromObject = true;
        S.tooltip.background.strokeWidth = 0;
        S.tooltip.label.fill = am4core.color("white");

        chart.series.push(S);
      });

      if (legend) {
        chart.legend = new am4charts.Legend();
        chart.legend.itemContainers.template.paddingTop = 2;
        chart.legend.itemContainers.template.paddingBottom = 2;
        chart.legend.position = "bottom";
        chart.legend.marginTop = 0;
        chart.legend.fontSize = 10;

        chart.legend.itemContainers.template.height = 18;
        chart.legend.markers.template.width = 10;
        chart.legend.markers.template.height = 10;
        // chart.legend.labels.template.wrap = true;
        // chart.legend.labels.template.truncate = true;
        chart.legend.labels.template.maxWidth = 260;
        chart.legend.labels.template.fill = am4core.color(isDark ? "#fff" : "#000");
      }

      chart.logo.disabled = true;
      if (cursor) chart.cursor = new am4charts.XYCursor();
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
    theme,
  ]);

  // --- Interval input handlers
  const handleStartChange = (e) => {
    if (!onIntervalChange) return;
    const v = e.target.value ? new Date(e.target.value) : null;
    onIntervalChange(v, endDate);
  };

  const handleEndChange = (e) => {
    if (!onIntervalChange) return;
    const v = e.target.value ? new Date(e.target.value) : null;
    onIntervalChange(startDate, v);
  };

  const startVal = startDate
    ? toDateOnly(startDate).toISOString().slice(0, 10)
    : "";
  const endVal = endDate
    ? toDateOnly(endDate).toISOString().slice(0, 10)
    : "";

  return (
    <div
      ref={chartWrapperRef}
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 p-4 bg-white dark:bg-gray-800"
          : "relative"
      } w-full rounded-md shadow-md`}
    >
      {showToolbar && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            {title}
          </span>
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
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
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
        ref={chartDivRef}
        id={id}
        style={{ width: "100%", height: isFullscreen ? "90vh" : `${height}px` }}
        className="rounded-[12px]"
      />
    </div>
  );
};

export default GenericAmChart;
