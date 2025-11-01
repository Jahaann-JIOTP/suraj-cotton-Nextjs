"use client";
import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import { useTheme } from "next-themes";
import CustomLoader from "@/components/customLoader/CustomLoader";

const PowerComparison = ({ dateRange }) => {
  const [stackChartData, setStackchartData] = useState([]);

  const [timeRange, setTimeRange] = useState("hourly");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [isPowerComparisonFullView, setIsPowerComparisonFullView] =
    useState(false);
  const chartRef = useRef(null);

  const handlePowerComparisonFullView = () => {
    setIsPowerComparisonFullView((prev) => !prev);
  };

  const fetchPowerComparisonData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}/power_comparison?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}&label=${timeRange}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        const transformedData = resResult.map((item) => {
          const rawDate = new Date(item.date);
          let category;
          if (timeRange === "hourly") {
            category = rawDate.toISOString();
          } else if (timeRange === "daily") {
            category = rawDate.toISOString().split("T")[0];
          } else if (timeRange === "monthly") {
            category = `${rawDate.getFullYear()}-${String(
              rawDate.getMonth() + 1
            ).padStart(2, "0")}`;
          }

          return {
            year: category,
            HT: item.HT || 0,
            LT: item.LT || 0,
            wapda: item.wapda || 0,
            solar: item.solar || 0,
            unit4: item.unit4 || 0,
            unit5: item.unit5 || 0,
            // losses_main: item.totalConsumption || 0,
            losses: item.losses || 0,
            unaccoutable_energy: item.unaccountable_energy || 0,
            efficiency: item.efficiency,
          };
        });
        setStackchartData(transformedData);
      }
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  useEffect(() => {
    fetchPowerComparisonData();
  }, [dateRange, timeRange]);

  useEffect(() => {
    if (!chartRef.current || stackChartData.length === 0) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    const isDark = theme === "dark";
    root.interfaceColors.set("text", am5.color(isDark ? 0xffffff : 0x000000));
    root.interfaceColors.set("grid", am5.color(isDark ? 0x555555 : 0xcccccc));
    root.interfaceColors.set(
      "background",
      am5.color(isDark ? 0x111111 : 0xffffff)
    );

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        paddingBottom: isPowerComparisonFullView ? 0 : 300,
        layout: root.verticalLayout,
      })
    );

    // Legend configuration
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        layout: root.horizontalLayout,
        useDefaultMarker: true,
      })
    );

    legend.labels.template.setAll({
      fontSize: 10,
      fontWeight: 500,
      maxWidth: 30,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });
    legend.markers.template.setAll({
      width: 10,
      height: 10,
      marginRight: 2,
    });

    legend.set(
      "layout",
      am5.GridLayout.new(root, {
        columns: 8,
        fixedWidthGrid: false,
      })
    );

    const dates = stackChartData.map((d) => new Date(d.year));
    const dateRange = Math.abs(dates[dates.length - 1] - dates[0]);
    const daysInRange = dateRange / (1000 * 60 * 60 * 24);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: false,
      minGridDistance: calculateGridDistance(timeRange, daysInRange),
    });

    xRenderer.labels.template.setAll({
      fontSize: 10,
      rotation: calculateLabelRotation(timeRange, daysInRange),
      centerY: am5.p50,
      centerX: am5.p100,
    });

    xRenderer.labels.template.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return text;
      const dateValue = dataItem.get("category");
      if (!dateValue) return text;
      const date = new Date(dateValue);
      if (isNaN(date)) return text;

      switch (timeRange) {
        case "hourly":
          if (daysInRange > 1) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            if ([3, 11, 19].includes(hours) && minutes === 0) {
              return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
            } else if (hours === 0 && minutes === 0) {
              return date.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
              });
            }
            return "";
          } else {
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          }
        case "daily":
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        case "monthly":
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        default:
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
      }
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {
          labelText: getTooltipFormat(timeRange),
        }),
      })
    );
    xAxis.get("tooltip").label.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return text;
      const raw = dataItem.get("category");
      if (!raw) return text;

      const date = new Date(raw);
      if (isNaN(date)) return text;

      // Format in UTC based on timeRange
      switch (timeRange) {
        case "hourly":
          return date.toLocaleString(); // Example: "Sat, 09 Aug 2025 12:00:00 GMT"
        case "daily":
          return `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`;
        case "monthly":
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        default:
          return date.toUTCString();
      }
    });
    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(stackChartData);

    // Y-Axis configuration
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      fontSize: 10,
    });

    const CLUSTER_GROUPS = {
      SUPPLY: 0,
      UNITS: 1,
      LOSSES: 2,
    };

    // Series creation function with improved clustering
    function makeSeries(name, fieldName, color, clusterIndex, stacked = true) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: "year",
          clustered: true,
          clusterIndex,
          stacked,
        })
      );
      series.columns.template.setAll({
        tooltipText: "[fontSize: 12px]{name}: {valueY}",
        width: am5.percent(40), // Increased width to reduce gap
        fill: am5.color(color),
        stroke: am5.color(color),
        strokeWidth: 0.5,
        strokeOpacity: 0.3,
      });

      series.data.setAll(stackChartData);
      series.appear();
      legend.data.push(series);
      return series;
    }

    // Cluster 0: SUPPLY
    makeSeries("HT", "HT", "#F8B257", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("WAPDA", "wapda", "#FF714E", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("Solar", "solar", "#63F4B7", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("LT", "LT", "#B0B2B6", CLUSTER_GROUPS.SUPPLY, true);

    // Cluster 1: UNITS
    makeSeries("Unit 4", "unit4", "#60A5FA", CLUSTER_GROUPS.UNITS, false);
    makeSeries("Unit 5", "unit5", "#1D4ED8", CLUSTER_GROUPS.UNITS, true);

    // Cluster 2: LOSSES
    makeSeries("Losses", "losses", "#008B8B", CLUSTER_GROUPS.LOSSES, false);
    makeSeries(
      "Unacc. Energy",
      "unaccoutable_energy",
      "#6A7E91",
      CLUSTER_GROUPS.LOSSES,
      true
    );

    // Configure clustering spacing - remove margins to eliminate gaps
    chart.series.each((series) => {
      if (series instanceof am5xy.ColumnSeries) {
        series.set("clustered", true);
        series.columns.template.setAll({
          marginLeft: 0, // Changed from 2 to 0
          marginRight: 0, // Changed from 2 to 0
        });
      }
    });

    // Get efficiency values for axis scaling
    const efficiencyValues = stackChartData
      .map((d) => d.efficiency)
      .filter((v) => v > 0);

    // Efficiency axis and series
    const efficiencyAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min:
          efficiencyValues.length > 0
            ? Math.max(0, Math.min(...efficiencyValues) - 5)
            : 0,
        max:
          efficiencyValues.length > 0 ? Math.max(...efficiencyValues) + 5 : 100,
        renderer: am5xy.AxisRendererY.new(root, {
          opposite: true,
        }),
      })
    );

    efficiencyAxis.get("renderer").labels.template.setAll({
      fontSize: 10,
    });

    const efficiencySeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Efficiency",
        xAxis: xAxis,
        yAxis: efficiencyAxis,
        valueYField: "efficiency",
        categoryXField: "year",
        stroke: am5.color("#C20000"),
        fill: am5.color("#C20000"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "[fontSize: 12px]Efficiency: {valueY}%",
        }),
        strokeWidth: 2,
        connect: false,
      })
    );

    efficiencySeries.strokes.template.setAll({
      strokeWidth: 2,
      stroke: am5.color("#C20000"),
    });

    efficiencySeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 3,
          fill: am5.color("#C20000"),
          stroke: am5.color("#C20000"),
          strokeWidth: 1,
        }),
      })
    );

    efficiencySeries.data.setAll(stackChartData);
    efficiencySeries.appear();
    legend.data.push(efficiencySeries);

    // Add cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: efficiencyAxis,
      })
    );

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [isPowerComparisonFullView, stackChartData, theme, timeRange]);

  function calculateGridDistance(timeRange, daysInRange) {
    if (timeRange === "hourly") {
      if (daysInRange <= 1) return 20;
      if (daysInRange <= 3) return 40;
      if (daysInRange <= 7) return 60;
      return 80;
    }
    if (timeRange === "daily") {
      if (daysInRange <= 7) return 30;
      if (daysInRange <= 30) return 40;
      return 50;
    }
    return 50;
  }

  function calculateLabelRotation(timeRange, daysInRange) {
    if (timeRange === "hourly") {
      return daysInRange <= 3 ? -45 : -60;
    }
    return daysInRange <= 30 ? -10 : -45;
  }

  function getTooltipFormat(timeRange) {
    switch (timeRange) {
      case "hourly":
        return "{category}";
      case "daily":
        return "{category}";
      case "monthly":
        return "{category}";
      default:
        return "{category}";
    }
  }

  return (
    <div
      className={`${
        isPowerComparisonFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative  px-1 py-2 md:p-3 h-[19rem] md:h-[15rem] lg:h-[16.5rem] xl:h-[14.3rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md `}
    >
      {/* Header */}
      <div className="flex items-center flex-col gap-3 md:gap-auto justify-between">
        <div className="flex items-center justify-between w-full">
          <span className="text-[15px] text-[#1A68B2] .font-raleway font-600">
            Energy Balance Chart
          </span>
          {/* <button
            className="cursor-pointer"
            onClick={handlePowerComparisonFullView}
          >
            {isPowerComparisonFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button> */}
          <div className="flex items-center justify-center gap-2">
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("hourly")}
              style={{
                background: timeRange === "hourly" ? "#226ce4" : "#6FA1F3",
              }}
            >
              Hourly
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("daily")}
              style={{
                background: timeRange === "daily" ? "#23c15d" : "#55B87A",
              }}
            >
              Daily
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("monthly")}
              style={{
                background: timeRange === "monthly" ? "#ed5e3a" : "#F57F62",
              }}
            >
              Monthly
            </button>
            <button
              className="cursor-pointer"
              onClick={handlePowerComparisonFullView}
            >
              {isPowerComparisonFullView ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end w-full gap-3 flex-col md:flex-row ">
          {/* <div className="flex items-center justify-center gap-2">
            <span className="hidden xl:flex text-[12px] font-raleway font-semibold text-black dark:text-white">
              Start Date
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, "start")}
              className="text-[12px] font-raleway px-1 py-0.5 border rounded"
            />
            <span className="hidden xl:flex text-[12px] font-raleway font-semibold text-black dark:text-white">
              End Date
            </span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => handleDateChange(e, "end")}
              className="text-[12px] font-raleway px-1 py-0.5 border rounded"
            />
          </div> */}
          {/* <div className="flex items-center justify-center gap-2">
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("hourly")}
              style={{
                background: timeRange === "hourly" ? "#226ce4" : "#6FA1F3",
              }}
            >
              Hourly
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("daily")}
              style={{
                background: timeRange === "daily" ? "#23c15d" : "#55B87A",
              }}
            >
              Daily
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1`}
              onClick={() => handleTimeRangeChange("monthly")}
              style={{
                background: timeRange === "monthly" ? "#ed5e3a" : "#F57F62",
              }}
            >
              Monthly
            </button>
            <button
              className="cursor-pointer"
              onClick={handlePowerComparisonFullView}
            >
              {isPowerComparisonFullView ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div> */}
        </div>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader size="50px" />
        </div>
      )}
      {/* Empty State */}
      {!loading && stackChartData.length === 0 && (
        <div className="absolute top-19 left-0 h-[70%] w-full flex flex-col items-center justify-center rounded-md z-10">
          <img
            src="./chartPlaceholder.png"
            className={`${
              isPowerComparisonFullView ? "w-[300px]" : "w-[130px]"
            }`}
            alt=""
          />
          <span className="text-gray-400 text-[13px]">No Data Available!</span>
        </div>
      )}
      {/* Chart */}
      {!loading && stackChartData.length > 0 && (
        <div
          className={`w-full ${
            isPowerComparisonFullView ? "h-[80vh]" : "h-10rem md:h-[10.5rem]"
          } overflow-hidden`}
        >
          <div
            ref={chartRef}
            className={`${
              isPowerComparisonFullView
                ? "w-full h-[80vh]"
                : "w-full h-[490px] md:h-[455px]"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default PowerComparison;
