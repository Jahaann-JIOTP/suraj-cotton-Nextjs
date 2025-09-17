// components/charts/EnergyChart.tsx
"use client";
import CustomLoader from "../customLoader/CustomLoader";
import { useTrendsChart } from "../hooks/useChartData";
import ReusableTrendChart from "./ReusableTrendChart";

const PowerChart = ({ area,startDate, chartId, endDate,isFullscreen }) => {
  const { data, loading } = useTrendsChart(area,"activePower", startDate, endDate);

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
          power: item.sumActivePower,
        }))}
        xKey="time"
        xType="date"
        series={[
          {
            type: "line",
            yKey: "power",
            name: "Active Power",
            color: "#249FFF",
            strokeWidth: 3,
          },
        ]}
        yLeftTitle="kW"
        legend={true}
        cursor={true}
          isFullscreen={isFullscreen}
      />
    </>
  );
};

export default PowerChart;
