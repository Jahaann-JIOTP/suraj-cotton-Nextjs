"use client";
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const HeatmapChart = ({ TransformerData }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.maskBullets = false;
    chart.logo.disabled = true;

    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = "weekday";
    yAxis.dataFields.category = "hour";

    xAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;

    yAxis.renderer.inversed = true;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "weekday";
    series.dataFields.categoryY = "hour";
    series.dataFields.value = "value";
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;
    series.columns.template.width = am4core.percent(100);
    series.columns.template.height = am4core.percent(100);

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 0;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#ffffff");
    columnTemplate.tooltipText =
      "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";

    columnTemplate.column.adapter.add("fill", (fill, target) => {
      if (target.dataItem) {
        const val = target.dataItem.value;

        if (val >= 2500) return am4core.color("#fe0c00");
        else if (val >= 2490) return am4core.color("#fe1200");
        else if (val >= 2480) return am4core.color("#fe1700");
        else if (val >= 2470) return am4core.color("#fe1d00");
        else if (val >= 2460) return am4core.color("#fe2200");
        else if (val >= 2450) return am4core.color("#fe2800");
        else if (val >= 2440) return am4core.color("#fd2d00");
        else if (val >= 2430) return am4core.color("#fd3300");
        else if (val >= 2420) return am4core.color("#fd3800");
        else if (val >= 2410) return am4core.color("#fd3e00");
        else if (val >= 2390) return am4core.color("#fd4400");
        else if (val >= 2380) return am4core.color("#fd4901");
        else if (val >= 2370) return am4core.color("#fd4f01");
        else if (val >= 2360) return am4core.color("#fd5401");
        else if (val >= 2350) return am4core.color("#fd5a01");
        else if (val >= 2340) return am4core.color("#fd5f01");
        else if (val >= 2330) return am4core.color("#fd6501");
        else if (val >= 2320) return am4core.color("#fc6a01");
        else if (val >= 2310) return am4core.color("#fc7001");
        else if (val >= 2300) return am4core.color("#fc7601");
        else if (val >= 2290) return am4core.color("#fc7b01");
        else if (val >= 2280) return am4core.color("#fc8101");
        else if (val >= 2270) return am4core.color("#fc8601");
        else if (val >= 2260) return am4core.color("#fc8c01");
        else if (val >= 2250) return am4core.color("#fc9101");
        else if (val >= 2240) return am4core.color("#fc9701");
        else if (val >= 2230) return am4core.color("#fc9d01");
        else if (val >= 2220) return am4core.color("#fba201");
        else if (val >= 2210) return am4core.color("#fba801");
        else if (val >= 2200) return am4core.color("#fbad01");
        else if (val >= 2190) return am4core.color("#fbb301");
        else if (val >= 2180) return am4core.color("#fbb801");
        else if (val >= 2170) return am4core.color("#fbbe01");
        else if (val >= 2160) return am4core.color("#fbc302");
        else if (val >= 2150) return am4core.color("#fbc902");
        else if (val >= 2140) return am4core.color("#fbcf02");
        else if (val >= 2130) return am4core.color("#fbd402");
        else if (val >= 2120) return am4core.color("#fbda02");
        else if (val >= 2110) return am4core.color("#fadf02");
        else if (val >= 2100) return am4core.color("#fae502");
        else if (val >= 2090) return am4core.color("#faea02");
        else if (val >= 2080) return am4core.color("#faf002");
        else if (val >= 2070) return am4core.color("#faf502");
        else if (val >= 2060) return am4core.color("#fafb02");
        else if (val >= 2050) return am4core.color("#f4fb02");
        else if (val >= 2040) return am4core.color("#eefb02");
        else if (val >= 2030) return am4core.color("#e9fb02");
        else if (val >= 2020) return am4core.color("#e3fb02");
        else if (val >= 2010) return am4core.color("#ddfb03");
        else if (val >= 2000) return am4core.color("#d7fb03");
        else if (val >= 1990) return am4core.color("#d1fb03");
        else if (val >= 1980) return am4core.color("#ccfc03");
        else if (val >= 1970) return am4core.color("#c6fc03");
        else if (val >= 1960) return am4core.color("#c0fc03");
        else if (val >= 1950) return am4core.color("#bafc03");
        else if (val >= 1940) return am4core.color("#b5fc03");
        else if (val >= 1930) return am4core.color("#affc04");
        else if (val >= 1920) return am4core.color("#a9fc04");
        else if (val >= 1910) return am4core.color("#a3fc04");
        else if (val >= 1900) return am4core.color("#9dfc04");
        else if (val >= 1890) return am4core.color("#98fc04");
        else if (val >= 1880) return am4core.color("#92fc04");
        else if (val >= 1870) return am4core.color("#8cfc04");
        else if (val >= 1860) return am4core.color("#86fc04");
        else if (val >= 1850) return am4core.color("#80fc04");
        else if (val >= 1840) return am4core.color("#7bfd05");
        else if (val >= 1830) return am4core.color("#75fd05");
        else if (val >= 1820) return am4core.color("#6ffd05");
        else if (val >= 1810) return am4core.color("#69fd05");
        else if (val >= 1800) return am4core.color("#63fd05");
        else if (val >= 1790) return am4core.color("#5efd05");
        else if (val >= 1780) return am4core.color("#58fd05");
        else if (val >= 1770) return am4core.color("#52fd05");
        else if (val >= 1760) return am4core.color("#4cfd05");
        else if (val >= 1750) return am4core.color("#46fd06");
        else if (val >= 1740) return am4core.color("#41fd06");
        else if (val >= 1730) return am4core.color("#3bfd06");
        else if (val >= 1720) return am4core.color("#35fd06");
        else if (val >= 1710) return am4core.color("#2ffd06");
        else if (val >= 1700) return am4core.color("#2afe06");
        else if (val >= 1690) return am4core.color("#24fe06");
        else if (val >= 1680) return am4core.color("#1efe06");
        else if (val >= 1670) return am4core.color("#18fe07");
        else if (val >= 1660) return am4core.color("#12fe07");
        else if (val >= 1650) return am4core.color("#0dfe07");
        else if (val >= 1640) return am4core.color("#07fe07");
        else if (val >= 1630) return am4core.color("#01fe07");
        else if (val >= 1620) return am4core.color("#01fe0d");
        else if (val >= 1610) return am4core.color("#01fe12");
        else if (val >= 1600) return am4core.color("#01fe18");
        else if (val >= 1590) return am4core.color("#01fe1e");
        else if (val >= 1580) return am4core.color("#01fe24");
        else if (val >= 1570) return am4core.color("#01fe29");
        else if (val >= 1560) return am4core.color("#01fe2f");
        else if (val >= 1550) return am4core.color("#01fe35");
        else if (val >= 1540) return am4core.color("#01fe3b");
        else if (val >= 1530) return am4core.color("#01fe40");
        else if (val >= 1520) return am4core.color("#01fd46");
        else if (val >= 1510) return am4core.color("#01fd4c");
        else if (val >= 1500) return am4core.color("#01fd52");
        else if (val >= 1490) return am4core.color("#01fd57");
        else if (val >= 1480) return am4core.color("#01fd5d");
        else if (val >= 1470) return am4core.color("#01fd63");
        else if (val >= 1460) return am4core.color("#01fd69");
        else if (val >= 1450) return am4core.color("#01fd6e");
        else if (val >= 1440) return am4core.color("#01fd74");
        else if (val >= 1430) return am4core.color("#01fd7a");
        else if (val >= 1420) return am4core.color("#01fd80");
        else if (val >= 1410) return am4core.color("#00fd85");
        else if (val >= 1400) return am4core.color("#00fd8b");
        else if (val >= 1390) return am4core.color("#00fd91");
        else if (val >= 1380) return am4core.color("#00fd97");
        else if (val >= 1370) return am4core.color("#00fd9c");
        else if (val >= 1360) return am4core.color("#00fda2");
        else if (val >= 1350) return am4core.color("#00fda8");
        else if (val >= 1340) return am4core.color("#00fdae");
        else if (val >= 1330) return am4core.color("#00fdb3");
        else if (val >= 1320) return am4core.color("#00fdb9");
        else if (val >= 1310) return am4core.color("#00fdbf");
        else if (val >= 1300) return am4core.color("#00fcc5");
        else if (val >= 1290) return am4core.color("#00fcca");
        else if (val >= 1280) return am4core.color("#00fcd0");
        else if (val >= 1270) return am4core.color("#00fcd6");
        else if (val >= 1260) return am4core.color("#00fcdc");
        else if (val >= 1250) return am4core.color("#00fce1");
        else if (val >= 1240) return am4core.color("#00fce7");
        else if (val >= 1230) return am4core.color("#00fced");
        else if (val >= 1220) return am4core.color("#00fcf3");
        else if (val >= 1210) return am4core.color("#00fcf8");
        else if (val >= 1200) return am4core.color("#00fcfe");
        else if (val >= 1190) return am4core.color("#00f7fe");
        else if (val >= 1180) return am4core.color("#00f2fe");
        else if (val >= 1170) return am4core.color("#00edfe");
        else if (val >= 1160) return am4core.color("#00e8fe");
        else if (val >= 1150) return am4core.color("#00e3fe");
        else if (val >= 1140) return am4core.color("#00dffe");
        else if (val >= 1130) return am4core.color("#00dafe");
        else if (val >= 1120) return am4core.color("#00d5fe");
        else if (val >= 1110) return am4core.color("#00d0fe");
        else if (val >= 1100) return am4core.color("#00cbfe");
        else if (val >= 1090) return am4core.color("#01c6fe");
        else if (val >= 1080) return am4core.color("#01c1fe");
        else if (val >= 1070) return am4core.color("#01bcfe");
        else if (val >= 1060) return am4core.color("#01b7fe");
        else if (val >= 1050) return am4core.color("#01b2fe");
        else if (val >= 1040) return am4core.color("#01adfe");
        else if (val >= 1030) return am4core.color("#01a9fe");
        else if (val >= 1020) return am4core.color("#01a4fe");
        else if (val >= 1010) return am4core.color("#019ffe");
        else if (val >= 1000) return am4core.color("#019afe");
        else if (val >= 990) return am4core.color("#0195fe");
        else if (val >= 980) return am4core.color("#0190ff");
        else if (val >= 970) return am4core.color("#018bff");
        else if (val >= 960) return am4core.color("#0186ff");
        else if (val >= 950) return am4core.color("#0181ff");
        else if (val >= 940) return am4core.color("#017cff");
        else if (val >= 930) return am4core.color("#0178ff");
        else if (val >= 920) return am4core.color("#0173ff");
        else if (val >= 910) return am4core.color("#016eff");
        else if (val >= 900) return am4core.color("#0169ff");
        else if (val >= 890) return am4core.color("#0164ff");
        else if (val >= 880) return am4core.color("#015fff");
        else if (val >= 870) return am4core.color("#025aff");
        else if (val >= 860) return am4core.color("#0255ff");
        else if (val >= 850) return am4core.color("#0250ff");
        else if (val >= 840) return am4core.color("#024bff");
        else if (val >= 830) return am4core.color("#0246ff");
        else if (val >= 820) return am4core.color("#0242ff");
        else if (val >= 810) return am4core.color("#023dff");
        else if (val >= 800) return am4core.color("#0238ff");
        else return am4core.color("#FE0C00");
      }
      return fill;
    });

    chart.data = TransformerData;
    xAxis.renderer.minGridDistance = 1; // Force closest spacing

    xAxis.renderer.labels.template.truncate = false;
    xAxis.renderer.labels.template.wrap = true;
    xAxis.renderer.labels.template.maxWidth = 70; // or smaller if needed
    xAxis.renderer.labels.template.rotation = -90; // 45 for diagonal if preferred
    xAxis.renderer.autoScale = false;
    xAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.labels.template.fontSize = 10;

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-[270px]" />;
};

export default HeatmapChart;
