"use client";

import { useEffect, useRef } from "react";
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

    const grayTailIds = [
      "unit4Lt1Chart",
      "unit4Lt2Chart",
      "unit5Lt3Chart",
      "unit5Lt4Chart",
    ];

    const series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        paddingRight: isSmallDevice ? 0 : 220,
        paddingLeft: isSmallDevice ? 0 : 30,
      })
    );

    // Configure tooltips first
    series.links.template.setAll({
      tooltipText: "{sourceId}[/] → {targetId}[/]: {value}[/] kWh",
      fillOpacity: 0.4,
    });

    // Apply gray color for specific links in specified charts
    if (grayTailIds.includes(id)) {
      series.links.template.adapters.add("fill", (fill, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (
          dataContext?.from === "TotalLT3" &&
          dataContext?.to === "Unaccounted Energy"
        ) {
          return am5.color(0x808080); // Gray color
        }
        return fill;
      });
    }

    series.links.template.get("tooltip")?.setAll({
      pointerOrientation: "vertical",
    });

    series.links.template
      .get("tooltip")
      ?.adapters.add("fill", (fill, target) => {
        const link = target.sprite;
        if (link && link.get("fill")) {
          return link.get("fill");
        }
        return fill;
      });

    series.links.template.get("tooltip")?.label.setAll({
      fill: am5.color(0xffffff),
    });

    series.links.template.states.create("hover", {
      fillOpacity: 0.8,
    });

    series.links.template.adapters.add("tooltipText", (text, target) => {
      const dataContext = target.dataItem?.dataContext;
      if (!dataContext) return text;

      const source = capitalizeWords(
        dataContext.from || dataContext.sourceId || ""
      );
      const targetName = capitalizeWords(
        dataContext.to || dataContext.targetId || ""
      );

      // Check for negative value
      if (dataContext.value < 0) {
        return text
          .replace("{sourceId}", source)
          .replace("{targetId}", targetName)
          .replace("{value}", "negative");
      }

      return text
        .replace("{sourceId}", source)
        .replace("{targetId}", targetName)
        .replace("{value}", dataContext.value?.toLocaleString() || "0");
    });

    series.events.once("datavalidated", () => {
      series.nodes.labels.template.setAll({
        fontSize: isSmallDevice ? 0 : 10,
        visible: !isSmallDevice,
        oversizedBehavior: "wrap",
      });
    });

    series.nodes.labels.template.adapters.add("x", (x, lbl) => {
      const name = (lbl.dataItem?.get("name") || "").toLowerCase();
      if (name.startsWith("total")) {
        // lbl.setAll({
        //   centerX: am5.percent(100),
        //   fontSize:0,
        //   paddingLeft: 0,
        //   paddingRight: 0,
        // });
        // const GAP = 4;
        // return -GAP;
        lbl.set("visible", false);
        return x;
      }
      return x;
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

    series.nodes.get("colors").set("step", 2);
    series.data.setAll(data);
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, id, resolvedTheme]);

  return <div className="w-full h-[55vh]" id={id} />;
};

export default SankeyChart;
