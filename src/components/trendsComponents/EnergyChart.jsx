// components/charts/EnergyChart.tsx
"use client";
import CustomLoader from "../customLoader/CustomLoader";
import { useTrendsChart } from "../hooks/useChartData";
import ReusableTrendChart from "./ReusableTrendChart";

const EnergyChart = ({ area,startDate, endDate, isFullscreen }) => {
  const { data, loading } = useTrendsChart(area,"energy", startDate, endDate);

  

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}
      <ReusableTrendChart
        id="UNIT4LT1ENERGY"
        title="UNIT 4 LT 1 - ENERGY USAGE"
        data={data.map((item) => ({
          time: new Date(item.timestamp).getTime(),
          energyInterval: item.consumption,
          energy: item.sumEnergy,
        }))}
        xKey="time"
        xType="date"
        series={[
          {
            type: "column",
            yKey: "energyInterval",
            name: "Interval Energy",
            color: "#4682B4",
          },
          {
            type: "line",
            yKey: "energy",
            name: "Total Energy",
            color: "#008D23",
            yAxis: "right",
          },
        ]}
        yLeftTitle="kWh (Δ)"
        yRightTitle="kWh (Cum.)"
        legend
        cursor
        scrollbar
        isFullscreen={isFullscreen}
      />
    </>
  );
};

export default EnergyChart;
