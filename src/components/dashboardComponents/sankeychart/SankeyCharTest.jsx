import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function SankeyCharTest({ data }) {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Create root element
    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create series
    const series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        paddingRight: 50,
        paddingLeft: 50,
        paddingTop: 20,
        paddingBottom: 20,
      })
    );

    // Set node colors
    series.nodes.get("colors")?.set("step", 2);

    // Configure node labels
    series.nodes.labels.template.setAll({
      fontSize: 12,
      fontWeight: "500",
    });

    // Set data
    series.data.setAll(data);

    // Make stuff animate on load
    series.appear(1000, 100);

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Energy Flow Distribution
        </h2>
        <p className="text-gray-600">
          Power distribution from sources to various equipment and processes
        </p>
      </div>
      <div
        ref={chartRef}
        className="w-full h-[500px] border border-gray-200 rounded"
      />
    </div>
  );
}
