// components/charts/EnergyChart.tsx
"use client";
import CustomLoader from "../customLoader/CustomLoader";
import { useTrendsChart } from "../hooks/useChartData";
import ReusableTrendChart from "./ReusableTrendChart";

const PowerFactorChart = ({ area,chartId,startDate, endDate,isFullscreen }) => {
  const { data, loading } = useTrendsChart(area,"powerfactor", startDate, endDate);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}
      <ReusableTrendChart
        id={`${area}-${chartId}`}
        data={data.map((item) => ({
          time: new Date(item.timestamp).getTime(), // ✅ directly valid
          sumpowerfactor: item.sumpowerfactor,
          sumRecEnergy: item.sumRecEnergy,
        }))}
        xKey="time"
        xType="date"
        series={[
          {
            type: "line",
            yKey: "sumpowerfactor",
            name: "Power Factor",
            color: "#8400F2",
            strokeWidth: 3,
          },
          {
            type: "line",
            yKey: "sumRecEnergy",
            name: "Reactive Energy",
            color: "#05C2FF",
            strokeWidth: 3,
          },
        ]}
        yLeftTitle="Powerfactor"
        legend={true}
        cursor={true}
          isFullscreen={isFullscreen}
      />
    </>
  );
};

export default PowerFactorChart;
