"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";

const PowerComparison = () => {
  const [isPowerComparisonFullView, setIsPowerComparisonFullView] =
    useState(false);

  const chartRef = useRef(null);
  const handlePowerComparisonFullView = () => {
    setIsPowerComparisonFullView((prev) => !prev);
  };

  useEffect(() => {
    if (!chartRef.current) return;

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
    // chart.set("paddingBottom", isPowerComparisonFullView === false ? 300 : 0);

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

    const data = [
      {
        year: "2021",
        supply_ht: 2.5,
        supply_lt: 1.5,
        supply_wapda: 1.2,
        supply_solar: 0.8,
        units_unit4: 3.2,
        units_unit5: 2.8,
        losses_main: 0.5,
        losses_unacc: 0.3,
        efficiency: 3,
      },
      {
        year: "2022",
        supply_ht: 2.6,
        supply_lt: 1.6,
        supply_wapda: 1.3,
        supply_solar: 0.9,
        units_unit4: 3.3,
        units_unit5: 2.9,
        losses_main: 0.6,
        losses_unacc: 0.4,
        efficiency: 4,
      },
      {
        year: "2023",
        supply_ht: 2.8,
        supply_lt: 1.8,
        supply_wapda: 1.5,
        supply_solar: 1.1,
        units_unit4: 3.5,
        units_unit5: 3.1,
        losses_main: 0.8,
        losses_unacc: 0.6,
        efficiency: 1,
      },
    ];

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.7,
      minorGridEnabled: true,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

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

      series.data.setAll(data);
      series.appear();
      // this code is for show label  of values on bars
      // series.bullets.push(function () {
      //   return am5.Bullet.new(root, {
      //     locationY: 0.5,
      //     sprite: am5.Label.new(root, {
      //       text: "",
      //       fill: root.interfaceColors.get("alternativeText"),
      //       centerY: am5.percent(30),
      //       centerX: am5.percent(30),
      //       populateText: true,
      //     }),
      //   });
      // });

      legend.data.push(series);
    }

    // Cluster 0: SUPPLY
    makeSeries("HT", "supply_ht", "#F8B257", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("WAPDA", "supply_wapda", "#FF714E", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("Solar", "supply_solar", "#63F4B7", CLUSTER_GROUPS.SUPPLY, true);
    makeSeries("LT", "supply_lt", "#B0B2B6", CLUSTER_GROUPS.SUPPLY, true);

    // Cluster 1: UNITS
    makeSeries("Unit 4", "units_unit4", "#60A5FA", CLUSTER_GROUPS.UNITS, false);
    makeSeries("Unit 5", "units_unit5", "#1D4ED8", CLUSTER_GROUPS.UNITS, true);

    // Cluster 2: LOSSES
    makeSeries(
      "Losses",
      "losses_main",
      "#008B8B",
      CLUSTER_GROUPS.LOSSES,
      false
    );
    makeSeries(
      "Unacc. energy",
      "losses_unacc",
      "#6A7E91",
      CLUSTER_GROUPS.LOSSES,
      true
    );

    // ➕ Line Series for Efficiency
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
        valueYField: "efficiency",
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

    efficiencySeries.data.setAll(data);
    legend.data.push(efficiencySeries);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [isPowerComparisonFullView]);

  return (
    <div
      className={`${
        isPowerComparisonFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[96%] m-auto h-[96vh]"
          : "relative  px-1 py-2 md:p-3 h-[14.8rem]"
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
        <div className="flex items-center justify-end w-full gap-2">
          <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
            Start Date
          </span>
          <input
            type="date"
            className="text-[12px] font-raleway px-1 py-0.5 border rounded"
          />
          <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
            End Date
          </span>
          <input
            type="date"
            className="text-[12px] font-raleway px-1 py-0.5 border rounded"
          />
          <button className="bg-[#55B87A] text-white rounded w-[4rem] text-[12px] py-1 ">
            Daily
          </button>
          <button className="bg-[#6FA1F3] text-white rounded w-[4rem] text-[12px] py-1 ">
            Weekly
          </button>
          <button className="bg-[#F57F62] text-white rounded w-[4rem] text-[12px] py-1 ">
            Monthly
          </button>
        </div>
      </div>
      <div className="w-full">
        <div
          ref={chartRef}
          className={`${
            isPowerComparisonFullView === true
              ? "w-full h-[80vh]"
              : "w-full h-[490px]"
          }`}
        />
      </div>
    </div>
  );
};

export default PowerComparison;
