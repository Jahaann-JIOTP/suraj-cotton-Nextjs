"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "next-themes";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SankeyChart = ({ data, id, nodeClickMap }) => {
  const chartRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("SankeyChart: No data provided");
      return;
    }

    const container = document.getElementById(id);
    if (!container || !(container instanceof HTMLElement)) {
      console.error("SankeyChart: Container not found");
      return;
    }

    // Dispose old chart
    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
    }

    let root;
    let series;

    try {
      // Initialize chart root
      root = am5.Root.new(container);
      chartRef.current = root;

      // Remove logo if exists
      if (root._logo) {
        root._logo.dispose();
      }

      root.setThemes([am5themes_Animated.new(root)]);

      const isDark = resolvedTheme === "dark";
      const isSmallDevice = window.innerWidth <= 768;

      // Set background
      root.container.setAll({
        background: am5.Rectangle.new(root, {
          fill: am5.color(isDark ? 0x1e293b : 0xffffff),
          fillOpacity: 1,
        }),
      });

      root.interfaceColors.set("text", am5.color(isDark ? 0xffffff : 0x000000));
      root.interfaceColors.set("grid", am5.color(isDark ? 0x444444 : 0xcccccc));

      // Create Sankey chart
      series = root.container.children.push(
        am5flow.Sankey.new(root, {
          sourceIdField: "from",
          targetIdField: "to",
          valueField: "value",
          paddingRight: isSmallDevice ? 0 : 220,
          paddingLeft: isSmallDevice ? 0 : 30,
        })
      );

      // Verify series was created
      if (!series) {
        throw new Error("Failed to create Sankey series");
      }

      // --- COMPLETELY DISABLE DEFAULT NODE BEHAVIOR ---
      if (series.nodes && series.nodes.template) {
        // Disable all default interactions
        series.nodes.template.setAll({
          interactive: false,
          focusable: false,
          clickable: false,
        });

        // Remove any existing event listeners
        series.nodes.template.events.off("click");
        series.nodes.template.events.off("pointerclick");

        // Disable the end label toggle functionality
        series.nodes.template.set("toggle", false);
      }

      // Links tooltip setup
      if (series.links && series.links.template) {
        series.links.template.setAll({
          tooltipText: "{sourceId} → {targetId}: {value} kWh",
          fillOpacity: 0.4,
        });

        series.links.template.states.create("hover", { fillOpacity: 0.8 });

        // Format tooltip text
        series.links.template.adapters.add("tooltipText", (text, target) => {
          const d = target.dataItem?.dataContext;
          if (!d) return text;
          const from = capitalizeWords(d.from || "");
          const to = capitalizeWords(d.to || "");
          const val = d.value?.toLocaleString() || "0";
          return `${from} → ${to}: ${val} kWh`;
        });
      }

      // Labels after validation
      series.events.once("datavalidated", () => {
        if (
          series.nodes &&
          series.nodes.labels &&
          series.nodes.labels.template
        ) {
          series.nodes.labels.template.setAll({
            fontSize: isSmallDevice ? 0 : 10,
            visible: !isSmallDevice,
            oversizedBehavior: "wrap",
          });
        }
      });

      // Label text formatting
      if (series.nodes && series.nodes.labels && series.nodes.labels.template) {
        series.nodes.labels.template.adapters.add("text", (text, target) => {
          const di = target.dataItem;
          if (!di) return "";
          const name = capitalizeWords(di.get("name"));
          const incoming = di.get("sumIncoming") || 0;
          const outgoing = di.get("sumOutgoing") || 0;
          const val = incoming > 0 ? incoming : outgoing;
          return `${name} (${val.toLocaleString()} kWh)`;
        });
      }

      // Adjust color palette step
      if (series.nodes && series.nodes.get("colors")) {
        series.nodes.get("colors").set("step", 2);
      }

      // --- CUSTOM CLICK HANDLER FOR NAVIGATION ONLY ---
      series.events.on("datavalidated", () => {
        try {
          if (!series.nodes) return;

          // Iterate through all nodes using values() instead of each()
          const nodes = series.nodes.values;
          for (let node of nodes) {
            const nodeName = node.dataItem?.get("name");
            const route = nodeClickMap?.[nodeName];

            if (route) {
              // Enable interaction only for this specific node
              node.setAll({
                interactive: true,
                cursorOverStyle: "pointer",
              });

              // Remove any existing click handlers
              node.events.off("click");
              node.events.off("pointerclick");

              // Add custom click handler for navigation
              node.events.on("click", (ev) => {
                ev.stopPropagation();
                ev.stopImmediatePropagation();

                // Visual feedback
                node
                  .animate({
                    key: "scale",
                    to: 1.05,
                    duration: 150,
                    easing: am5.ease.out(am5.ease.cubic),
                  })
                  .events.once("animationended", () => {
                    node.set("scale", 1);
                    router.push(route);
                  });
              });

              // Also handle the end label if it exists
              const sprite = node.get("sprite");
              if (sprite) {
                // Find the end label element within the sprite
                const children = sprite.children.values;
                for (let child of children) {
                  // End labels are usually text elements with "+" or "-"
                  if (child instanceof am5.Text) {
                    const text = child.get("text");
                    if (text === "+" || text === "-") {
                      child.setAll({
                        interactive: true,
                        cursorOverStyle: "pointer",
                      });

                      child.events.off("click");
                      child.events.on("click", (ev) => {
                        ev.stopPropagation();
                        ev.stopImmediatePropagation();

                        // Visual feedback for end label click
                        child
                          .animate({
                            key: "scale",
                            to: 1.2,
                            duration: 150,
                            easing: am5.ease.out(am5.ease.cubic),
                          })
                          .events.once("animationended", () => {
                            child.set("scale", 1);
                            router.push(route);
                          });
                      });
                    }
                  }
                }
              }
            } else {
              // For nodes without routes, ensure they're not interactive
              node.setAll({
                interactive: false,
                cursorOverStyle: "default",
              });
            }
          }

          // Iterate nodes to set gray for Unaccounted Energy
          const allNodes = series.nodes.values;
          for (let node of allNodes) {
            const nodeName = node.dataItem?.get("name");
            if (nodeName?.toLowerCase() === "unaccounted energy") {
              node.setAll({
                fill: am5.color(0x9ca3af), // Tailwind gray-400
                stroke: am5.color(0x9ca3af),
              });
            }
          }
        } catch (err) {
          console.error("Error in Sankey node setup:", err);
        }
      });

      // Apply data
      series.data.setAll(data);
      series.appear(1000, 100);
    } catch (error) {
      console.error("Error initializing Sankey chart:", error);
      if (root) {
        root.dispose();
      }
      return;
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [data, id, resolvedTheme, nodeClickMap, router]);

  return <div className="w-full h-[60vh]" id={id} />;
};

export default SankeyChart;

//==============================-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=========
// "use client";

// import { useEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5flow from "@amcharts/amcharts5/flow";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import { useTheme } from "next-themes";

// const capitalizeWords = (str) => {
//   if (!str) return "";
//   return str.replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const SankeyChart = ({ data, id }) => {
//   const chartRef = useRef(null);
//   const { resolvedTheme } = useTheme();

//   useEffect(() => {
//     const container = document.getElementById(id);
//     if (!container || !(container instanceof HTMLElement)) return;
//     if (chartRef.current) {
//       chartRef.current.dispose();
//       chartRef.current = null;
//     }

//     const root = am5.Root.new(container);
//     chartRef.current = root;
//     root._logo?.dispose();
//     root.setThemes([am5themes_Animated.new(root)]);

//     const isDark = resolvedTheme === "dark";
//     root.interfaceColors.set("text", am5.color(isDark ? 0xffffff : 0x000000));
//     root.interfaceColors.set("grid", am5.color(isDark ? 0x444444 : 0xcccccc));
//     const isSmallDevice = window.innerWidth <= 768;

//     root.container.setAll(
//       "background",
//       am5.color(isDark ? 0x1e293b : 0xffffff)
//     );

//     const series = root.container.children.push(
//       am5flow.Sankey.new(root, {
//         sourceIdField: "from",
//         targetIdField: "to",
//         valueField: "value",
//         paddingRight: isSmallDevice ? 0 : 220,
//         paddingLeft: isSmallDevice ? 0 : 30,
//       })
//     );

//     // Configure tooltips first
//     series.links.template.setAll({
//       tooltipText: "{sourceId}[/] → {targetId}[/]: {value}[/] kWh",
//       fillOpacity: 0.4,
//     });

//     series.links.template.get("tooltip")?.setAll({
//       pointerOrientation: "vertical",
//     });

//     series.links.template
//       .get("tooltip")
//       ?.adapters.add("fill", (fill, target) => {
//         const link = target.sprite;
//         if (link && link.get("fill")) {
//           return link.get("fill");
//         }
//         return fill;
//       });

//     series.links.template.get("tooltip")?.label.setAll({
//       fill: am5.color(0xffffff),
//     });

//     series.links.template.states.create("hover", {
//       fillOpacity: 0.8,
//     });

//     series.links.template.adapters.add("tooltipText", (text, target) => {
//       const dataContext = target.dataItem?.dataContext;
//       if (!dataContext) return text;

//       const source = capitalizeWords(
//         dataContext.from || dataContext.sourceId || ""
//       );
//       const targetName = capitalizeWords(
//         dataContext.to || dataContext.targetId || ""
//       );

//       return text
//         .replace("{sourceId}", source)
//         .replace("{targetId}", targetName)
//         .replace("{value}", dataContext.value?.toLocaleString() || "0");
//     });

//     series.events.once("datavalidated", () => {
//       series.nodes.labels.template.setAll({
//         fontSize: isSmallDevice ? 0 : 10,
//         visible: !isSmallDevice,
//         oversizedBehavior: "wrap",
//       });
//     });

//     series.nodes.labels.template.adapters.add("x", (x, lbl) => {
//       const name = (lbl.dataItem?.get("name") || "").toLowerCase();
//       if (name.startsWith("total")) {
//         // lbl.setAll({
//         //   centerX: am5.percent(100),
//         //   fontSize:0,
//         //   paddingLeft: 0,
//         //   paddingRight: 0,
//         // });
//         // const GAP = 4;
//         // return -GAP;
//         lbl.set("visible", false);
//         return x;
//       }
//       return x;
//     });

//     series.nodes.labels.template.adapters.add("text", (text, target) => {
//       const dataItem = target.dataItem;
//       if (!dataItem) return "";
//       const name = capitalizeWords(dataItem.get("name"));

//       const incoming = dataItem.get("sumIncoming");
//       const outgoing = dataItem.get("sumOutgoing");

//       if (incoming > 0) {
//         return `${name} (${incoming.toLocaleString()} kWh)`;
//       } else {
//         return `${name} (${outgoing.toLocaleString()} kWh)`;
//       }
//     });

//     series.nodes.get("colors").set("step", 2);
//     series.data.setAll(data);
//     series.appear(1000, 100);

//     return () => {
//       root.dispose();
//     };
//   }, [data, id, resolvedTheme]);

//   return <div className="w-full h-[60vh]" id={id} />;
// };

// export default SankeyChart;
