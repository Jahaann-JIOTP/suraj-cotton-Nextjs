// components/charts/EnergyChart.tsx
"use client";
import CustomLoader from "../customLoader/CustomLoader";
import { useTrendsChart } from "../hooks/useChartData";
import ReusableTrendChart from "./ReusableTrendChart";

const CurrentChart = ({area, startDate, endDate,isFullscreen }) => {
  const { data, loading } = useTrendsChart(area,"current", startDate, endDate);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}
      <ReusableTrendChart
        id="UNIT4LT1MAINCURRENT"
        data={data.map((item) => ({
          time: new Date(item.timestamp).getTime(), // ✅ directly valid
          current: item.sumCurrent,
        }))}
        xKey="time"
        xType="date"
        series={[
          {
            type: "line",
            yKey: "current",
            name: "Current",
            color: "#FA8B02",
            strokeWidth: 3,
          },
        ]}
        yLeftTitle="Current"
        legend={true}
        cursor={true}
          isFullscreen={isFullscreen}
      />
    </>
  );
};

export default CurrentChart;
