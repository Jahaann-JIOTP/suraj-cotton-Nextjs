"use client";
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const HeatmapChart = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.maskBullets = false;

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
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#ffffff");
    columnTemplate.tooltipText =
      "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";

    // columnTemplate.column.adapter.add("fill", (fill, target) => {
    //   if (target.dataItem) {
    //     const val = target.dataItem.value;
    //     if (val >= 2019) return am4core.color("#0f0");
    //     else if (val >= 4000) return am4core.color("#ff0");
    //     else return am4core.color("#f00");
    //   }
    //   return fill;
    // });

    // const legend = new am4charts.Legend();
    // legend.parent = chart.chartContainer;
    // legend.data = [
    //   { name: ">= 6000", fill: am4core.color("#0f0") },
    //   { name: ">= 4000", fill: am4core.color("#ff0") },
    //   { name: "< 4000", fill: am4core.color("#f00") },
    // ];
    ////////////////////////////////
    // columnTemplate.column.adapter.add("fill", (fill, target) => {
    //   if (target.dataItem) {
    //     const val = target.dataItem.value;

    //     if (val >= 12492) return am4core.color("#FE0C00"); // red
    //     else if (val >= 10143) return am4core.color("#FAFB02"); // yellow
    //     else if (val >= 7435) return am4core.color("#01FE07"); // green
    //     else if (val >= 4727) return am4core.color("#00FCFE"); // cyan
    //     else if (val >= 2019) return am4core.color("#0229FF"); // blue
    //     else return am4core.color("#FE0C00"); // fallback
    //   }
    //   return fill;
    // });
    // ///////////----------------------------------------
    columnTemplate.column.adapter.add("fill", (fill, target) => {
      if (target.dataItem) {
        const val = target.dataItem.value;

        if (val >= 2500) return am4core.color("#fe0c00"); // red
        else if (val >= 2490) return am4core.color("#fe1200"); // yellow
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
        else if (val >= 2320) return am4core.color("#fc6a01"); // yellow
        else if (val >= 2310) return am4core.color("#fc7001"); // green
        else if (val >= 2300) return am4core.color("#fc7601"); // green
        else if (val >= 2290) return am4core.color("#fc7b01"); // cyan
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
        else if (val >= 1180) return am4core.color("#00f2fe"); // blue
        else if (val >= 1170) return am4core.color("#00edfe"); // blue
        else if (val >= 1160) return am4core.color("#00e8fe"); // blue
        else if (val >= 1150) return am4core.color("#00e3fe"); // blue
        else if (val >= 1140) return am4core.color("#00dffe"); // blue
        else if (val >= 1130) return am4core.color("#00dafe"); // blue
        else if (val >= 1120) return am4core.color("#00d5fe"); // blue
        else if (val >= 1110) return am4core.color("#00d0fe"); // blue
        else if (val >= 1100) return am4core.color("#00cbfe"); // blue
        else if (val >= 1090) return am4core.color("#01c6fe"); // blue
        else if (val >= 1080) return am4core.color("#01c1fe"); // blue
        else if (val >= 1070) return am4core.color("#01bcfe"); // blue
        else if (val >= 1060) return am4core.color("#01b7fe"); // blue
        else if (val >= 1050) return am4core.color("#01b2fe"); // blue
        else if (val >= 1040) return am4core.color("#01adfe"); // blue
        else if (val >= 1030) return am4core.color("#01a9fe"); // blue
        else if (val >= 1020) return am4core.color("#01a4fe"); // blue
        else if (val >= 1010) return am4core.color("#019ffe"); // blue
        else if (val >= 1000) return am4core.color("#019afe"); // blue
        else if (val >= 990) return am4core.color("#0195fe"); // blue
        else if (val >= 980) return am4core.color("#0190ff"); // blue
        else if (val >= 970) return am4core.color("#018bff"); // blue
        else if (val >= 960) return am4core.color("#0186ff"); // blue
        else if (val >= 950) return am4core.color("#0181ff"); // blue
        else if (val >= 940) return am4core.color("#017cff"); // blue
        else if (val >= 930) return am4core.color("#0178ff"); // blue
        else if (val >= 920) return am4core.color("#0173ff"); // blue
        else if (val >= 910) return am4core.color("#016eff"); // blue
        else if (val >= 900) return am4core.color("#0169ff"); // blue
        else if (val >= 890) return am4core.color("#0164ff"); // blue
        else if (val >= 880) return am4core.color("#015fff"); // blue
        else if (val >= 870) return am4core.color("#025aff"); // blue
        else if (val >= 860) return am4core.color("#0255ff"); // blue
        else if (val >= 850) return am4core.color("#0250ff"); // blue
        else if (val >= 840) return am4core.color("#024bff"); // blue
        else if (val >= 830) return am4core.color("#0246ff"); // blue
        else if (val >= 820) return am4core.color("#0242ff"); // blue
        else if (val >= 810) return am4core.color("#023dff"); // blue
        else if (val >= 800) return am4core.color("#0238ff"); // blue
        else return am4core.color("#FE0C00"); // fallback
      }
      return fill;
    });
    // ///////////----------------------------------------

    const legend = new am4charts.Legend();
    legend.parent = chart.chartContainer;
    legend.data = [
      { name: ">= 12492", fill: am4core.color("#FE0C00") },
      { name: ">= 10143", fill: am4core.color("#FAFB02") },
      { name: ">= 7435", fill: am4core.color("#01FE07") },
      { name: ">= 4727", fill: am4core.color("#00FCFE") },
      { name: ">= 2019", fill: am4core.color("#0229FF") },
    ];
    ////////////////////////////////

    chart.data = [
      {
        hour: "12pm",
        weekday: "Sun",
        value: 1046,
      },
      {
        hour: "1am",
        weekday: "Sun",
        value: 800,
      },
      {
        hour: "2am",
        weekday: "Sun",
        value: 808,
      },
      {
        hour: "3am",
        weekday: "Sun",
        value: 2500,
      },
      {
        hour: "4am",
        weekday: "Sun",
        value: 813,
      },
      {
        hour: "5am",
        weekday: "Sun",
        value: 800,
      },
      {
        hour: "6am",
        weekday: "Sun",
        value: 805,
      },
      {
        hour: "7am",
        weekday: "Sun",
        value: 1445,
      },
      {
        hour: "8am",
        weekday: "Sun",
        value: 819,
      },
      {
        hour: "9am",
        weekday: "Sun",
        value: 830,
      },
      {
        hour: "10am",
        weekday: "Sun",
        value: 841,
      },
      {
        hour: "11am",
        weekday: "Sun",
        value: 847,
      },
      {
        hour: "12am",
        weekday: "Sun",
        value: 855,
      },
      {
        hour: "1pm",
        weekday: "Sun",
        value: 856,
      },
      {
        hour: "2pm",
        weekday: "Sun",
        value: 866,
      },
      {
        hour: "3pm",
        weekday: "Sun",
        value: 872,
      },
      {
        hour: "4pm",
        weekday: "Sun",
        value: 887,
      },
      {
        hour: "5pm",
        weekday: "Sun",
        value: 882,
      },
      {
        hour: "6pm",
        weekday: "Sun",
        value: 867,
      },
      {
        hour: "7pm",
        weekday: "Sun",
        value: 864,
      },
      {
        hour: "8pm",
        weekday: "Sun",
        value: 863,
      },
      {
        hour: "9pm",
        weekday: "Sun",
        value: 865,
      },
      {
        hour: "10pm",
        weekday: "Sun",
        value: 871,
      },
      {
        hour: "11pm",
        weekday: "Sun",
        value: 866,
      },
      {
        hour: "12pm",
        weekday: "Mon",
        value: 867,
      },
      {
        hour: "1am",
        weekday: "Mon",
        value: 837,
      },
      {
        hour: "2am",
        weekday: "Mon",
        value: 853,
      },
      {
        hour: "3am",
        weekday: "Mon",
        value: 901,
      },
      {
        hour: "4am",
        weekday: "Mon",
        value: 940,
      },
      {
        hour: "5am",
        weekday: "Mon",
        value: 916,
      },
      {
        hour: "6am",
        weekday: "Mon",
        value: 955,
      },
      {
        hour: "7am",
        weekday: "Mon",
        value: 1053,
      },
      {
        hour: "8am",
        weekday: "Mon",
        value: 1176,
      },
      {
        hour: "9am",
        weekday: "Mon",
        value: 1293,
      },
      {
        hour: "10am",
        weekday: "Mon",
        value: 1355,
      },
      {
        hour: "11am",
        weekday: "Mon",
        value: 1462,
      },
      {
        hour: "12am",
        weekday: "Mon",
        value: 1425,
      },
      {
        hour: "1pm",
        weekday: "Mon",
        value: 1369,
      },
      {
        hour: "2pm",
        weekday: "Mon",
        value: 1370,
      },
      {
        hour: "3pm",
        weekday: "Mon",
        value: 1360,
      },
      {
        hour: "4pm",
        weekday: "Mon",
        value: 1388,
      },
      {
        hour: "5pm",
        weekday: "Mon",
        value: 1307,
      },
      {
        hour: "6pm",
        weekday: "Mon",
        value: 1203,
      },
      {
        hour: "7pm",
        weekday: "Mon",
        value: 1091,
      },
      {
        hour: "8pm",
        weekday: "Mon",
        value: 1033,
      },
      {
        hour: "9pm",
        weekday: "Mon",
        value: 1018,
      },
      {
        hour: "10pm",
        weekday: "Mon",
        value: 976,
      },
      {
        hour: "11pm",
        weekday: "Mon",
        value: 951,
      },
      {
        hour: "12pm",
        weekday: "Tue",
        value: 921,
      },
      {
        hour: "1am",
        weekday: "Tue",
        value: 842,
      },
      {
        hour: "2am",
        weekday: "Tue",
        value: 873,
      },
      {
        hour: "3am",
        weekday: "Tue",
        value: 902,
      },
      {
        hour: "4am",
        weekday: "Tue",
        value: 920,
      },
      {
        hour: "5am",
        weekday: "Tue",
        value: 913,
      },
      {
        hour: "6am",
        weekday: "Tue",
        value: 955,
      },
      {
        hour: "7am",
        weekday: "Tue",
        value: 1025,
      },
      {
        hour: "8am",
        weekday: "Tue",
        value: 1176,
      },
      {
        hour: "9am",
        weekday: "Tue",
        value: 1263,
      },
      {
        hour: "10am",
        weekday: "Tue",
        value: 1316,
      },
      {
        hour: "11am",
        weekday: "Tue",
        value: 1450,
      },
      {
        hour: "12am",
        weekday: "Tue",
        value: 1420,
      },
      {
        hour: "1pm",
        weekday: "Tue",
        value: 1316,
      },
      {
        hour: "2pm",
        weekday: "Tue",
        value: 1313,
      },
      {
        hour: "3pm",
        weekday: "Tue",
        value: 1337,
      },
      {
        hour: "4pm",
        weekday: "Tue",
        value: 1346,
      },
      {
        hour: "5pm",
        weekday: "Tue",
        value: 1343,
      },
      {
        hour: "6pm",
        weekday: "Tue",
        value: 1276,
      },
      {
        hour: "7pm",
        weekday: "Tue",
        value: 1269,
      },
      {
        hour: "8pm",
        weekday: "Tue",
        value: 1403,
      },
      {
        hour: "9pm",
        weekday: "Tue",
        value: 1442,
      },
      {
        hour: "10pm",
        weekday: "Tue",
        value: 1347,
      },
      {
        hour: "11pm",
        weekday: "Tue",
        value: 1301,
      },
      {
        hour: "12pm",
        weekday: "Wed",
        value: 1260,
      },
      {
        hour: "1am",
        weekday: "Wed",
        value: 1192,
      },
      {
        hour: "2am",
        weekday: "Wed",
        value: 1053,
      },
      {
        hour: "3am",
        weekday: "Wed",
        value: 1135,
      },
      {
        hour: "4am",
        weekday: "Wed",
        value: 1251,
      },
      {
        hour: "5am",
        weekday: "Wed",
        value: 1285,
      },
      {
        hour: "6am",
        weekday: "Wed",
        value: 1379,
      },
      {
        hour: "7am",
        weekday: "Wed",
        value: 1429,
      },
      {
        hour: "8am",
        weekday: "Wed",
        value: 1605,
      },
      {
        hour: "9am",
        weekday: "Wed",
        value: 1722,
      },
      {
        hour: "10am",
        weekday: "Wed",
        value: 1379,
      },
      {
        hour: "11am",
        weekday: "Wed",
        value: 1857,
      },
      {
        hour: "12am",
        weekday: "Wed",
        value: 1403,
      },
      {
        hour: "1pm",
        weekday: "Wed",
        value: 1316,
      },
      {
        hour: "2pm",
        weekday: "Wed",
        value: 1309,
      },
      {
        hour: "3pm",
        weekday: "Wed",
        value: 1319,
      },
      {
        hour: "4pm",
        weekday: "Wed",
        value: 1302,
      },
      {
        hour: "5pm",
        weekday: "Wed",
        value: 1243,
      },
      {
        hour: "6pm",
        weekday: "Wed",
        value: 1103,
      },
      {
        hour: "7pm",
        weekday: "Wed",
        value: 1005,
      },
      {
        hour: "8pm",
        weekday: "Wed",
        value: 938,
      },
      {
        hour: "9pm",
        weekday: "Wed",
        value: 915,
      },
      {
        hour: "10pm",
        weekday: "Wed",
        value: 876,
      },
      {
        hour: "11pm",
        weekday: "Wed",
        value: 842,
      },
      {
        hour: "12pm",
        weekday: "Thu",
        value: 818,
      },
      {
        hour: "1am",
        weekday: "Thu",
        value: 842,
      },
      {
        hour: "2am",
        weekday: "Thu",
        value: 1162,
      },
      {
        hour: "3am",
        weekday: "Thu",
        value: 1120,
      },
      {
        hour: "4am",
        weekday: "Thu",
        value: 1184,
      },
      {
        hour: "5am",
        weekday: "Thu",
        value: 1152,
      },
      {
        hour: "6am",
        weekday: "Thu",
        value: 1138,
      },
      {
        hour: "7am",
        weekday: "Thu",
        value: 1251,
      },
      {
        hour: "8am",
        weekday: "Thu",
        value: 1295,
      },
      {
        hour: "9am",
        weekday: "Thu",
        value: 1292,
      },
      {
        hour: "10am",
        weekday: "Thu",
        value: 1321,
      },
      {
        hour: "11am",
        weekday: "Thu",
        value: 1392,
      },
      {
        hour: "12am",
        weekday: "Thu",
        value: 1357,
      },
      {
        hour: "1pm",
        weekday: "Thu",
        value: 1251,
      },
      {
        hour: "2pm",
        weekday: "Thu",
        value: 1259,
      },
      {
        hour: "3pm",
        weekday: "Thu",
        value: 1276,
      },
      {
        hour: "4pm",
        weekday: "Thu",
        value: 1263,
      },
      {
        hour: "5pm",
        weekday: "Thu",
        value: 1205,
      },
      {
        hour: "6pm",
        weekday: "Thu",
        value: 1091,
      },
      {
        hour: "7pm",
        weekday: "Thu",
        value: 1005,
      },
      {
        hour: "8pm",
        weekday: "Thu",
        value: 948,
      },
      {
        hour: "9pm",
        weekday: "Thu",
        value: 921,
      },
      {
        hour: "10pm",
        weekday: "Thu",
        value: 896,
      },
      {
        hour: "11pm",
        weekday: "Thu",
        value: 842,
      },
      {
        hour: "12pm",
        weekday: "Fri",
        value: 843,
      },
      {
        hour: "1am",
        weekday: "Fri",
        value: 842,
      },
      {
        hour: "2am",
        weekday: "Fri",
        value: 863,
      },
      {
        hour: "3am",
        weekday: "Fri",
        value: 880,
      },
      {
        hour: "4am",
        weekday: "Fri",
        value: 886,
      },
      {
        hour: "5am",
        weekday: "Fri",
        value: 884,
      },
      {
        hour: "6am",
        weekday: "Fri",
        value: 912,
      },
      {
        hour: "7am",
        weekday: "Fri",
        value: 973,
      },
      {
        hour: "8am",
        weekday: "Fri",
        value: 1103,
      },
      {
        hour: "9am",
        weekday: "Fri",
        value: 1183,
      },
      {
        hour: "10am",
        weekday: "Fri",
        value: 1198,
      },
      {
        hour: "11am",
        weekday: "Fri",
        value: 1279,
      },
      {
        hour: "12am",
        weekday: "Fri",
        value: 1243,
      },
      {
        hour: "1pm",
        weekday: "Fri",
        value: 1190,
      },
      {
        hour: "2pm",
        weekday: "Fri",
        value: 1176,
      },
      {
        hour: "3pm",
        weekday: "Fri",
        value: 1183,
      },
      {
        hour: "4pm",
        weekday: "Fri",
        value: 1184,
      },
      {
        hour: "5pm",
        weekday: "Fri",
        value: 1140,
      },
      {
        hour: "6pm",
        weekday: "Fri",
        value: 1031,
      },
      {
        hour: "7pm",
        weekday: "Fri",
        value: 943,
      },
      {
        hour: "8pm",
        weekday: "Fri",
        value: 906,
      },
      {
        hour: "9pm",
        weekday: "Fri",
        value: 872,
      },
      {
        hour: "10pm",
        weekday: "Fri",
        value: 842,
      },
      {
        hour: "11pm",
        weekday: "Fri",
        value: 841,
      },
      {
        hour: "12pm",
        weekday: "Sat",
        value: 824,
      },
      {
        hour: "1am",
        weekday: "Sat",
        value: 809,
      },
      {
        hour: "2am",
        weekday: "Sat",
        value: 808,
      },
      {
        hour: "3am",
        weekday: "Sat",
        value: 800,
      },
      {
        hour: "4am",
        weekday: "Sat",
        value: 2500,
      },
      {
        hour: "5am",
        weekday: "Sat",
        value: 805,
      },
      {
        hour: "6am",
        weekday: "Sat",
        value: 815,
      },
      {
        hour: "7am",
        weekday: "Sat",
        value: 827,
      },
      {
        hour: "8am",
        weekday: "Sat",
        value: 832,
      },
      {
        hour: "9am",
        weekday: "Sat",
        value: 844,
      },
      {
        hour: "10am",
        weekday: "Sat",
        value: 2500,
      },
      {
        hour: "11am",
        weekday: "Sat",
        value: 842,
      },
      {
        hour: "12am",
        weekday: "Sat",
        value: 2500,
      },
      {
        hour: "1pm",
        weekday: "Sat",
        value: 844,
      },
      {
        hour: "2pm",
        weekday: "Sat",
        value: 845,
      },
      {
        hour: "3pm",
        weekday: "Sat",
        value: 838,
      },
      {
        hour: "4pm",
        weekday: "Sat",
        value: 835,
      },
      {
        hour: "5pm",
        weekday: "Sat",
        value: 842,
      },
      {
        hour: "6pm",
        weekday: "Sat",
        value: 830,
      },
      {
        hour: "7pm",
        weekday: "Sat",
        value: 826,
      },
      {
        hour: "8pm",
        weekday: "Sat",
        value: 834,
      },
      {
        hour: "9pm",
        weekday: "Sat",
        value: 826,
      },
      {
        hour: "10pm",
        weekday: "Sat",
        value: 818,
      },
      {
        hour: "11pm",
        weekday: "Sat",
        value: 807,
      },
    ];

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-[500px]" />;
};

export default HeatmapChart;
