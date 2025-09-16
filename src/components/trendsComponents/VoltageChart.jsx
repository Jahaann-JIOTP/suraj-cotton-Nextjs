// components/charts/EnergyChart.tsx
"use client";
import CustomLoader from "../customLoader/CustomLoader";
import { useTrendsChart } from "../hooks/useChartData";
import ReusableTrendChart from "./ReusableTrendChart";

const VoltageChart = ({ area,startDate, endDate,isFullscreen }) => {
  const { data, loading } = useTrendsChart(area,"voltage", startDate, endDate);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}
      <ReusableTrendChart
        id="UNIT4LT1AINVOLTAGE"
        // data={voltageData}
        data={data.map((item) => ({
          time: new Date(item.timestamp).getTime(), // ✅ directly valid
          voltage: item.sumVoltage,
        }))}
        xKey="time"
        xType="date"
        series={[
          {
            type: "line",
            yKey: "voltage",
            name: "Voltage",
            color: "#3D5AFE",
            strokeWidth: 3,
          },
        ]}
        yLeftTitle="Volts"
        legend={true}
        cursor={true}
          isFullscreen={isFullscreen}
      />
    </>
  );
};

export default VoltageChart;
