"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

const PowerComparison = () => {
  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const [stackChartData, setStackchartData] = useState([]);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [timeRange, setTimeRange] = useState("daily");
  const [loading, setLoading] = useState(false);

  const [isPowerComparisonFullView, setIsPowerComparisonFullView] =
    useState(false);
  const chartRef = useRef(null);

  const handlePowerComparisonFullView = () => {
    setIsPowerComparisonFullView((prev) => !prev);
  };

  const fetchPowerComparisonData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}/power_comparison?start_date=${startDate}&end_date=${endDate}&label=${timeRange}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        // Transform the API data to match the expected format
        const transformedData = resResult.map((item) => ({
          year: item.date,
          HT: item.HT,
          LT: item.LT,
          wapda: item.wapda,
          solar: item.solar,
          unit4: item.unit4,
          unit5: item.unit5,
          losses_main: item.totalConsumption,
          unaccoutable_energy: item.unaccountable_energy,
          total_generation: item.Efficiency,
        }));
        setStackchartData(transformedData);
      }
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPowerComparisonData();
  }, [startDate, endDate, timeRange]);

  useEffect(() => {
    if (!chartRef.current || stackChartData.length === 0) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

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

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        centerX: am5.percent(50),
        layout: root.horizontalLayout,
        useDefaultMarker: true,
      })
    );

    legend.labels.template.setAll({
      fontSize: 10,
      fontWeight: 500,
      maxWidth: 100,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });

    legend.markers.template.setAll({
      width: 10,
      height: 10,
      marginRight: 2,
      marginLeft: 0,
    });

    legend.itemContainers.template.setAll({
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 0,
      gap: 0,
      spacing: 0,
    });

    legend.set(
      "layout",
      am5.GridLayout.new(root, {
        columns: 20,
        fixedWidthGrid: false,
      })
    );

    legend.itemContainers.template.adapters.add("dx", () => {
      return 0;
    });

    // const xRenderer = am5xy.AxisRendererX.new(root, {
    //   cellStartLocation: 0.1,
    //   cellEndLocation: 0.7,
    //   minorGridEnabled: true,
    // });
    // xRenderer.labels.template.setAll({
    //   fontSize: 10, // or any smaller size you prefer
    // });
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 50,
    });
    xRenderer.labels.template.setAll({
      fontSize: 10,
      rotation: -10,
      centerY: am5.p50,
      centerX: am5.p100,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(stackChartData);

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
        tooltipText: "{name}: {valueY}",
        width: am5.percent(70),
        fill: am5.color(color),
        stroke: am5.color(color),
      });

      series.data.setAll(stackChartData);
      series.appear();

      legend.data.push(series);
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
    // makeSeries(
    //   "Losses",
    //   "losses_main",
    //   "#008B8B",
    //   CLUSTER_GROUPS.LOSSES,
    //   false
    // );
    makeSeries(
      "Unacc. energy",
      "unaccoutable_energy",
      "#6A7E91",
      CLUSTER_GROUPS.LOSSES,
      true
    );

    // Line Series for Efficiency
    const efficiencyAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          opposite: true,
        }),
      })
    );

    const efficiencySeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Efficiency",
        xAxis: xAxis,
        yAxis: efficiencyAxis,
        valueYField: "total_generation",
        categoryXField: "year",
        stroke: am5.color("#C20000"),
        fill: am5.color("#C20000"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Efficiency: {valueY}%",
        }),
      })
    );

    efficiencySeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 3,
          fill: am5.color("#C20000"),
          stroke: am5.color("#C20000"),
          strokeWidth: 0,
        }),
      })
    );

    efficiencySeries.data.setAll(stackChartData);
    legend.data.push(efficiencySeries);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [isPowerComparisonFullView, stackChartData]);

  const handleDateChange = (e, type) => {
    const value = e.target.value;
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div
      className={`${
        isPowerComparisonFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative  px-1 py-2 md:p-3 h-[17rem] md:h-[15rem] lg:h-[16.5rem] xl:h-[14.3rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md `}
    >
      {/* Header */}
      <div className="flex items-center flex-col gap-3 md:gap-auto justify-between">
        <div className="flex items-center justify-between w-full">
          <span className="font-raleway text-[#3978A8] font-600 text-[15px]">
            Power Comparison
          </span>
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
        <div className="flex items-center justify-end w-full gap-3 flex-col xl:flex-row ">
          <div className="flex items-center justify-center gap-2">
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
              onChange={(e) => handleDateChange(e, "end")}
              className="text-[12px] font-raleway px-1 py-0.5 border rounded"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1 bg-[#6FA1F3]`}
              onClick={() => handleTimeRangeChange("hourly")}
            >
              Hourly
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1 bg-[#55B87A]`}
              onClick={() => handleTimeRangeChange("daily")}
            >
              Daily
            </button>
            <button
              className={`cursor-pointer text-white rounded w-[4rem] text-[12px] py-1 bg-[#F57F62]`}
              onClick={() => handleTimeRangeChange("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>
      <div
        className={`w-full ${
          isPowerComparisonFullView ? "h-[80vh]" : "h-[9rem]"
        }  overflow-hidden`}
      >
        {/* {loading === true ? (
          <CustomLoader size="40px" />
        ) : ( */}
        <div
          ref={chartRef}
          className={`${
            isPowerComparisonFullView === true
              ? "w-full h-[80vh]"
              : "w-full h-[440px]"
          } `}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default PowerComparison;
