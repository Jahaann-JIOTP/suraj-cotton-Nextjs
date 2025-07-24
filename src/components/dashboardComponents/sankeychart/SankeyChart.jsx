"use client";

import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "next-themes";
const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
const SankeyChart = ({ data, id }) => {
  const chartRef = useRef(null);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const container = document.getElementById(id);
    if (!container || !(container instanceof HTMLElement)) return;
    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
    }
    const root = am5.Root.new(container);
    chartRef.current = root;
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);
    const isDark = resolvedTheme === "dark";
    root.interfaceColors.set("text", am5.color(isDark ? 0xffffff : 0x000000));
    root.interfaceColors.set("grid", am5.color(isDark ? 0x444444 : 0xcccccc));
    const isSmallDevice = window.innerWidth <= 768;

    root.container.setAll(
      "background",
      am5.color(isDark ? 0x1e293b : 0xffffff)
    );
    const series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        paddingRight: isSmallDevice ? 0 : 220,
        paddingLeft: isSmallDevice ? 0 : 30,
      })
    );

    series.events.once("datavalidated", () => {
      series.nodes.labels.template.setAll({
        fontSize: isSmallDevice ? 0 : 10,
        visible: !isSmallDevice,
        oversizedBehavior: "wrap",
      });
    });
    series.nodes.labels.template.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return "";
      const name = capitalizeWords(dataItem.get("name"));

      const incoming = dataItem.get("sumIncoming");
      const outgoing = dataItem.get("sumOutgoing");

      if (incoming > 0) {
        return `${name} (${incoming.toLocaleString()} kWh)`;
      } else {
        return `${name} (${outgoing.toLocaleString()} kWh)`;
      }
    });
    series.links.template.setAll({
      fillOpacity: 0.4,
      fill: am5.color(isDark ? 0x999999 : 0x444444),
    });
    series.nodes.get("colors").set("step", 2);
    series.data.setAll(data);
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, id, resolvedTheme]);

  return <div className="w-full h-[60vh] md:h-[70vh] lg:h-[70vh]" id={id} />;
};

export default SankeyChart;
