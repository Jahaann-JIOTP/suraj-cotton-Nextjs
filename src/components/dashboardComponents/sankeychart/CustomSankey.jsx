// "use client";
// import React from "react";
// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import { sankey, sankeyLinkHorizontal, sankeyCenter } from "d3-sankey";
// import { useRouter } from "next/navigation";

// const CustomSankey = () => {
//   const svgRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const router = useRouter();
//   const [svgHeight, setSvgHeight] = useState(50);

//   const nodeColors = [
//     "#DC8C67",
//     "#DC6788",
//     "#DC67CE",
//     "#DC6788",
//     "#DC67CE",
//     "#A367DC",
//     "#A367DC",
//     "#6771DC",
//     "#67B7DC",
//     "#67DCBB",
//     "#67DC75",
//     "#67DC75",
//     "#A0DC67",
//     "#A0DC67",
//     "#DCD267",
//     "#DCD267",
//     "#DC8C67",
//   ];

//   const mainSankeyData = [
//     {
//       from: "TF #1",
//       to: "TotalLT3",
//       value: 26808,
//     },
//     {
//       from: "Solar 1184.55 Kw",
//       to: "TotalLT3",
//       value: 3061.75,
//     },
//     {
//       from: "From U4LT 1 (Ring 21–24)",
//       to: "TotalLT3",
//       value: 1952.4,
//     },
//     {
//       from: "From U4LT 2 (Card1–8 & Card9–14+1B)",
//       to: "TotalLT3",
//       value: 2090.56,
//     },
//     {
//       from: "TotalLT3",
//       to: "Ring 1-3",
//       value: 6291.5,
//     },
//     {
//       from: "TotalLT3",
//       to: "AC Supply Fan",
//       value: 2388.75,
//     },
//     {
//       from: "TotalLT3",
//       to: "Blow Room L1",
//       value: 1538,
//     },
//     {
//       from: "TotalLT3",
//       to: "Ring Frames 4-6",
//       value: 6140,
//     },
//     {
//       from: "TotalLT3",
//       to: "A/C Plant Blowing",
//       value: 1182,
//     },
//     {
//       from: "TotalLT3",
//       to: "MLDB1 Blower room card",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "PF Panel",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "Comber MCS 1-14",
//       value: 1044.06,
//     },
//     {
//       from: "TotalLT3",
//       to: "AC Return Fan",
//       value: 1885.06,
//     },
//     {
//       from: "TotalLT3",
//       to: "Water Chiller",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "Card M/C 8-14",
//       value: 1046.5,
//     },
//     {
//       from: "TotalLT3",
//       to: "Auto Con 1-9",
//       value: 1952.4,
//     },
//     {
//       from: "TotalLT3",
//       to: "Card M/C 1-7",
//       value: 1963.5,
//     },
//     {
//       from: "TotalLT3",
//       to: "AC Plant winding",
//       value: 957,
//     },
//     {
//       from: "TotalLT3",
//       to: "Simplex M/C 1~6 + 1~5 Breaker Machines",
//       value: 1280,
//     },
//     {
//       from: "TotalLT3",
//       to: "Spare 2",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "Draw Frame Finish 1~8",
//       value: 400.44,
//     },
//     {
//       from: "TotalLT3",
//       to: "PDBCD1 → U4LT2 (Card1–8)",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "PDBCD2 → U4LT2 (Card9–14+1B)",
//       value: 0,
//     },
//     {
//       from: "TotalLT3",
//       to: "Unaccounted Energy",
//       value: 5843.5,
//     },
//   ];

//   useEffect(() => {
//     const width = 900;
//     const nodePadding = 40;
//     const nodeHeight = 20;

//     const nodes = Array.from(
//       new Set([
//         ...mainSankeyData.map((d) => d.from),
//         ...mainSankeyData.map((d) => d.to),
//       ])
//     ).map((name) => ({ name }));

//     const estimatedHeight = Math.max(
//       50,
//       nodes.length * (nodeHeight + nodePadding) + 10
//     );
//     setSvgHeight(estimatedHeight);

//     const links = mainSankeyData.map((d) => ({
//       source: nodes.findIndex((n) => n.name === d.from),
//       target: nodes.findIndex((n) => n.name === d.to),
//       value: d.value,
//     }));

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const sankeyGenerator = sankey()
//       .nodeWidth(20)
//       .nodePadding(nodePadding)
//       .nodeAlign(sankeyCenter)
//       .extent([
//         [1, 1],
//         [width - 1, estimatedHeight - 6],
//       ]);

//     const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
//       nodes: nodes.map((d) => ({ ...d })),
//       links: links.map((d) => ({ ...d })),
//     });

//     const defs = svg.append("defs");
//     sankeyLinks.forEach((link, i) => {
//       const sourceColor = nodeColors[link.source.index % nodeColors.length];
//       const targetColor = nodeColors[link.target.index % nodeColors.length];

//       const gradient = defs
//         .append("linearGradient")
//         .attr("id", `linkGradient-${i}`)
//         .attr("x1", "0%")
//         .attr("x2", "100%")
//         .attr("y1", "0%")
//         .attr("y2", "0%");

//       gradient
//         .append("stop")
//         .attr("offset", "0%")
//         .attr("stop-color", sourceColor);
//       gradient
//         .append("stop")
//         .attr("offset", "100%")
//         .attr("stop-color", targetColor);
//     });

//     const tooltip = d3
//       .select(tooltipRef.current)
//       .style("position", "fixed")
//       .style("padding", "6px 12px")
//       .style("background", "rgba(0, 0, 0, 0.75)")
//       .style("color", "#fff")
//       .style("font-size", "13px")
//       .style("border-radius", "6px")
//       .style("pointer-events", "none")
//       .style("opacity", 0)
//       .style("white-space", "nowrap")
//       .style("z-index", "1000");

//     // Links with cursor-following tooltip
//     svg
//       .append("g")
//       .selectAll("path")
//       .data(sankeyLinks)
//       .join("path")
//       .attr("d", sankeyLinkHorizontal())
//       .attr("fill", "none")
//       .attr("stroke", (d, i) => `url(#linkGradient-${i})`)
//       .attr("stroke-opacity", 0.6)
//       .attr("stroke-width", (d) => Math.max(1, d.width))
//       .on("mouseenter", function (event, d) {
//         tooltip
//           .style("opacity", 1)
//           .html(
//             `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Value: ${d.value}`
//           );
//         d3.select(this).attr("stroke-opacity", 1);
//       })
//       .on("mousemove", (event) => {
//         tooltip
//           .style("left", event.clientX + 10 + "px")
//           .style("top", event.clientY + 10 + "px");
//       })
//       .on("mouseout", function () {
//         tooltip.style("opacity", 0);
//         d3.select(this).attr("stroke-opacity", 0.6);
//       });

//     // Nodes
//     svg
//       .append("g")
//       .selectAll("rect")
//       .data(sankeyNodes)
//       .join("rect")
//       .attr("x", (d) => d.x0)
//       .attr("y", (d) => d.y0)
//       .attr("height", (d) => d.y1 - d.y0)
//       .attr("width", (d) => d.x1 - d.x0)
//       .attr("fill", (d, i) => nodeColors[i % nodeColors.length])
//       .attr("stroke", "#333")
//       .attr("rx", 5)
//       .style("cursor", "pointer")
//       .on("mouseover", (event, d) => {
//         const nodeX = (d.x0 + d.x1) / 2;
//         const nodeY = d.y0;
//         const svgRect = svgRef.current.getBoundingClientRect();

//         tooltip
//           .style("opacity", 1)
//           .html(`<strong>${d.name}</strong>`)
//           .style("left", svgRect.left + nodeX + "px")
//           .style("top", svgRect.top + nodeY + "px");
//       })
//       .on("mouseout", () => {
//         tooltip.style("opacity", 0);
//       });

//     // Labels
//     svg
//       .append("g")
//       .selectAll("text")
//       .data(sankeyNodes)
//       .join("text")
//       .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 10 : d.x0 - 10))
//       .attr("y", (d) => (d.y1 + d.y0) / 2)
//       .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
//       .attr("alignment-baseline", "middle")
//       .attr("font-size", 14)
//       .attr("fill", "#222")
//       .text((d) => d.name);
//   }, [router]);

//   return (
//     <div className="relative w-full overflow-auto">
//       <svg
//         ref={svgRef}
//         width="100%"
//         height={svgHeight}
//         className="bg-white dark:bg-gray-900 rounded-lg shadow-md"
//       ></svg>
//       <div ref={tooltipRef}></div>
//     </div>
//   );
// };

// export default CustomSankey;
///////////////=========================================-----------------------------
"use client";
import React, { useEffect, useRef } from "react";

const CustomSankey = ({ data, chartId, nodeLinkRoute = {} }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  // Gray tail IDs
  const grayTailIds = [
    "unit4Lt1Chart",
    "unit4Lt2Chart",
    "unit5Lt3Chart",
    "unit5Lt4Chart",
  ];

  useEffect(() => {
    let root;
    let chart;

    const createChart = async () => {
      // Clean up previous chart
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }

      // Import amCharts
      const am5 = await import("@amcharts/amcharts5");
      const am5flow = await import("@amcharts/amcharts5/flow");
      const am5percent = await import("@amcharts/amcharts5/percent");

      // Create root
      root = am5.Root.new(chartRef.current);
      rootRef.current = root;

      // Create chart
      chart = root.container.children.push(
        am5flow.Sankey.new(root, {
          sourceIdField: "from",
          targetIdField: "to",
          valueField: "value",
          orientation: "horizontal",
        })
      );

      // Prepare data - ensure Unaccounted Energy is at the end for gray tail charts
      let chartData = [...data];
      if (grayTailIds.includes(chartId)) {
        const unaccountedIndex = chartData.findIndex(
          (item) => item.to === "Unaccounted Energy"
        );
        if (unaccountedIndex > -1) {
          const unaccountedItem = chartData.splice(unaccountedIndex, 1)[0];
          chartData.push(unaccountedItem);
        }
      }

      // Set data
      chart.data.setAll(chartData);

      // Configure nodes - make them non-interactive to prevent collapse
      chart.nodes.template.setAll({
        width: 20,
        tooltipText: "{name}: {value}",
        interactive: false, // This prevents collapse/expand
      });

      // Configure node template with custom settings
      chart.nodes.template.adapters.add("fill", (fill, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (dataContext) {
          // Handle negative values
          if (dataContext.value < 0) {
            return am5.color(0xff0000); // Red for negative
          }
        }
        return fill;
      });

      // Configure links
      const linkTemplate = chart.links.template;

      // Make links interactive
      linkTemplate.set("interactive", true);
      linkTemplate.set("tooltipText", "{sourceId} → {targetId}: {value}");

      // Style links based on conditions
      linkTemplate.adapters.add("fill", (fill, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (dataContext) {
          // Gray color for Unaccounted Energy in specific charts
          if (
            dataContext.to === "Unaccounted Energy" &&
            grayTailIds.includes(chartId)
          ) {
            return am5.color(0x808080); // Gray
          }

          // Red for negative values
          if (dataContext.value < 0) {
            return am5.color(0xff0000); // Red
          }
        }
        return fill;
      });

      // Add click event to links
      linkTemplate.events.on("click", (ev) => {
        const dataItem = ev.target.dataItem;
        if (dataItem && dataItem.dataContext) {
          const targetName = dataItem.dataContext.to;

          // Check if we have a route for this target node
          if (nodeLinkRoute[targetName]) {
            // Navigate to the route
            window.location.href = nodeLinkRoute[targetName];
            return;
          }

          // Also check source node for routes
          const sourceName = dataItem.dataContext.from;
          if (nodeLinkRoute[sourceName]) {
            window.location.href = nodeLinkRoute[sourceName];
          }
        }
      });

      // Customize tooltips for negative values
      linkTemplate.adapters.add("tooltipText", (text, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (dataContext && dataContext.value < 0) {
          return `${dataContext.from} → ${dataContext.to}: Negative`;
        }
        return text;
      });

      // Also customize node tooltips for negative values
      chart.nodes.template.adapters.add("tooltipText", (text, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (dataContext && dataContext.value < 0) {
          return `${dataContext.name}: Negative`;
        }
        return text;
      });

      // Force a refresh to apply all adapters
      chart.links.each((link) => {
        // This ensures adapters are applied
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      createChart();
    }, 100);

    // Cleanup
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [data, chartId, nodeLinkRoute]);

  return (
    <div className="sankey-chart-container">
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "600px",
          backgroundColor: "#fafafa",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
};

export default CustomSankey;
