"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, sankeyCenter } from "d3-sankey";
import { useRouter } from "next/navigation";

const CustomSankey = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const width = 900;
    const height = 500;

    const mainSankeyData = [
      { from: "Wapda", to: "Unit 5", value: 500 },
      { from: "LT", to: "Unit 5", value: 500 },
      { from: "HT", to: "Unit 5", value: 500 },
      { from: "Unit 5", to: "LT 1", value: 500 },
      { from: "Unit 5", to: "LT 2", value: 100 },
    ];

    const nodeClickMap = {
      "LT 1": "/unit-5-lt-1",
      "LT 2": "/unit-5-lt-2",
    };

    const nodes = Array.from(
      new Set([
        ...mainSankeyData.map((d) => d.from),
        ...mainSankeyData.map((d) => d.to),
      ])
    ).map((name) => ({ name }));

    const links = mainSankeyData.map((d) => ({
      source: nodes.findIndex((n) => n.name === d.from),
      target: nodes.findIndex((n) => n.name === d.to),
      value: d.value,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(40)
      .nodeAlign(sankeyCenter)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });

    // Gradient Definition
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "sankeyGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#7B189F");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#FF3CAC");

    // Tooltip Setup
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("padding", "6px 12px")
      .style("background", "rgba(0, 0, 0, 0.75)")
      .style("color", "#fff")
      .style("font-size", "13px")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // --- Links
    svg
      .append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", "url(#sankeyGradient)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Value: ${d.value}`
          );
        d3.select(this).attr("stroke-opacity", 1);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("stroke-opacity", 0.6);
      });

    // --- Nodes
    svg
      .append("g")
      .selectAll("rect")
      .data(sankeyNodes)
      .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", "url(#sankeyGradient)")
      .attr("stroke", "#333")
      .attr("rx", 5)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        const route = nodeClickMap[d.name];
        if (route) {
          router.push(route);
        }
      })
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 1).html(`<strong>${d.name}</strong>`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // --- Labels
    svg
      .append("g")
      .selectAll("text")
      .data(sankeyNodes)
      .join("text")
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 10 : d.x0 - 10))
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
      .attr("alignment-baseline", "middle")
      .attr("font-size", 14)
      .attr("fill", "#222")
      .text((d) => d.name);
  }, [router]);

  return (
    <div className="relative w-full h-[500px]">
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        className="bg-white dark:bg-gray-900 rounded-lg shadow-md"
      ></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default CustomSankey;
