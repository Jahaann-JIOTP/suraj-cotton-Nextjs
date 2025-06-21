import React from "react";

import HeatMap from "@/components/dashboardComponents/heatMapCharts/HeatMapCharts";
import HeatmapChart from "@/components/dashboardComponents/heatMapCharts/HeatmapChart";
import HeatMapChart from "@/components/dashboardComponents/heatMapCharts/HeatMapCharts";
import HeatmapChartThird from "@/components/dashboardComponents/heatMapCharts/heatMatThir";
const sampleData = [
  { hour: "12 AM", weekday: "Mon", value: 10 },
  { hour: "1 AM", weekday: "Mon", value: 15 },
  { hour: "4 AM", weekday: "Mon", value: 20 },
  { hour: "7 AM", weekday: "Mon", value: 25 },
  { hour: "10 AM", weekday: "Mon", value: 30 },
  { hour: "1 PM", weekday: "Mon", value: 35 },
  { hour: "4 PM", weekday: "Mon", value: 40 },
  { hour: "7 PM", weekday: "Mon", value: 45 },
  { hour: "10 PM", weekday: "Mon", value: 50 },
  { hour: "12 AM", weekday: "Tue", value: 50 },
  { hour: "1 AM", weekday: "Tue", value: 50 },
  { hour: "4 AM", weekday: "Tue", value: 40 },
  { hour: "7 AM", weekday: "Tue", value: 60 },
  { hour: "10 PM", weekday: "Tue", value: 10 },
  { hour: "1 PM", weekday: "Tue", value: 30 },
  { hour: "4 PM", weekday: "Tue", value: 56 },
  { hour: "7 PM", weekday: "Tue", value: 30 },
  { hour: "10 PM", weekday: "Tue", value: 40 },
  // Add more data points as needed
];
const TranformersPage = () => {
  return (
    <>
      <div className="bg-[#0f0]"></div>
      <div className="bg-[#0f0]"></div>
      <div className="bg-[#0f0]"></div>
      <div className="bg-[#0f0]"></div>
      <div className="bg-[#0f0]"></div>
      <div className="flex items-center justify-center gap-3">
        <div className="w-[49.3%]">
          <HeatmapChart title="Transformer Load Analysis" className="my-4" />
        </div>
        <div className="w-[49.3%]">
          <HeatmapChart title="Transformer Load Analysis" className="my-4" />
        </div>
      </div>
      <div>
        <HeatMapChart />
      </div>
      <div>
        <HeatmapChartThird />
      </div>
    </>
  );
};

export default TranformersPage;
