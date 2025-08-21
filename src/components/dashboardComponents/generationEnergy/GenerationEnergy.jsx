"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

export default function GenerationEnergy() {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const { theme } = useTheme();

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");
  const [loading, setLoading] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [chartData, setChartData] = useState([]);

  const toggleFullView = () => setIsFullView((prev) => !prev);

  const fetchGenerationEnergyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_GENERATION_ENERGY}${selectedTimePeriod}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const resResult = await response.json();
        if (Array.isArray(resResult) && resResult.length > 0) {
          setChartData(resResult);
        } else {
          console.warn("No chart data received.");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const createChart = (data, value) => {
    if (!chartRef.current) return;

    // Dispose old chart
    if (rootRef.current) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    root._logo?.dispose();

    // ✅ Theme setup
    root.setThemes([
      am5themes_Animated.new(root),
      am5.Theme.new(root, {
        rule: (target) => {
          // Global font size
          if (
            target instanceof am5.Label &&
            (target.get("themeTags")?.includes("axis") ||
              target.get("themeTags")?.includes("legend"))
          ) {
            return true;
          }
          return false;
        },
        applyOnClones: true,
        settings: { fontSize: 12 },
      }),
    ]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
      })
    );

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        layout: root.horizontalLayout,
      })
    );

    // ✅ Legend font + marker size
    legend.labels.template.setAll({ fontSize: 12,fill:theme==="dark"?"#ffffff":"#000000" });
    legend.markers.template.setAll({
      width: 12,
      height: 12,
    });

    let xField,
      series1Field,
      series2Field,
      series1Name,
      series2Name;

    switch (value) {
      case "today":
        xField = "Time";
        series1Field = "Yesterday";
        series2Field = "Today";
        series1Name = "Yesterday (kWh)";
        series2Name = "Today (kWh)";
        break;
      case "week":
        xField = "Day";
        series1Field = "Last Week";
        series2Field = "This Week";
        series1Name = "Last Week (kWh)";
        series2Name = "This Week (kWh)";
        break;
      case "month":
        xField = "Weeks";
        series1Field = "Last Month";
        series2Field = "This Month";
        series1Name = "Last Month (kWh)";
        series2Name = "This Month (kWh)";
        break;
      case "year":
        xField = "Month";
        series1Field = "Previous Year";
        series2Field = "Current Year";
        series1Name = "Previous Year (kWh)";
        series2Name = "Current Year (kWh)";
        break;
      default:
        console.warn("Invalid time period selected:", value);
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No data provided for chart");
      return;
    }

    // X Axis
    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: xField,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.get("renderer").labels.template.setAll({ fontSize: 12, fill:theme==="dark"?"#ffffff":"#000000" });
    xAxis.data.setAll(data);

    // Y Axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );
    yAxis.get("renderer").labels.template.setAll({ fontSize: 12,fill:theme==="dark"?"#ffffff":"#000000" });

    // Series
    const makeSeries = (name, fieldName, color) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: xField,
        })
      );
      series.columns.template.setAll({
        tooltipText: "[fontSize: 12px]{name}, {categoryX}: {valueY}",
        fontSize:12,
        width: am5.percent(70),
        strokeOpacity: 0,
        fill: am5.color(color),
      });
      series.data.setAll(data);

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerX: am5.p50,
            centerY: 0,
            fontSize: 10,
          }),
        })
      );

      series.appear();
      legend.data.push(series);
    };

    makeSeries(series1Name, series1Field, "#11A8D7");
    makeSeries(series2Name, series2Field, "#00378A");

    chart.appear(1000, 100);
  };

  useEffect(() => {
    fetchGenerationEnergyData();
  }, [selectedTimePeriod]);

  useEffect(() => {
    if (chartData.length > 0) {
      createChart(chartData, selectedTimePeriod);
    }
    return () => {
      if (rootRef.current) rootRef.current.dispose();
    };
  }, [theme, chartData, selectedTimePeriod]);

  return (
    <div
      className={`${
        isFullView
          ? "fixed inset-0 z-50 p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative px-1 py-2 md:p-3 h-[15rem] md:h-[13.5rem] lg:h-[12rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md`}
    >
      <div className="relative flex items-center flex-col md:flex-row gap-3 md:gap-[0.7vw] justify-between">
        <span className="text-[15px] text-[#1A68B2] font-raleway font-600">
          Generation Energy
        </span>
        <div className="flex gap-4">
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="outline-none border-1 text-[12px] font-raleway rounded p-1 dark:bg-gray-600"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="cursor-pointer absolute md:relative top-[0px] right-[0px]"
            onClick={toggleFullView}
          >
            {isFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}

      <div
        ref={chartRef}
        className={`w-full ${
          isFullView ? "h-[90%]" : "h-[12rem] pb-2 lg:h-full"
        }`}
      />
    </div>
  );
}
