'use client'
import { comboChartConfig, doubleLineConfig, singleColumnConfig, singleLineConfig } from "@/components/trendsComponents/chart-config";
import ReusableTrendChart from "@/components/trendsComponents/ReusableTrendChart";
import { createDynamicChart } from "@/components/trendsComponents/ReusableTrendChart";
import { columnChartData, formatChartData, generateEnergyData, generatePowerData, generateVoltageData, lineChartData, sampleData } from "@/data/chart-data";
import React, { useState } from "react";
// Example hourly line data
const lineData = [
  { date: new Date(2025, 8, 1).getTime(), value: 50 },
  { date: new Date(2025, 8, 2).getTime(), value: 60 },
  { date: new Date(2025, 8, 3).getTime(), value: 70 },
];

// Example daily bar data
const barData = [
  { date: new Date(2025, 8, 1).getTime(), value: 5 },
  { date: new Date(2025, 8, 2).getTime(), value: 6 },
  { date: new Date(2025, 8, 3).getTime(), value: 7 },
];

const TrendU4Lt1 = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Generate sample data
  const energyData = formatChartData(generateEnergyData());
  const powerData = formatChartData(generatePowerData());
  const voltageData = formatChartData(generateVoltageData());
  
  console.log(energyData)
  // Handle interval change
  const handleIntervalChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  
  return (
    <div className="grid grid-cols-1 gap-6 p-6 h-[81vh] overflow-y-auto">
      {/* 1) Energy Usage */}
      <div className="relative w-full px-4 py-4 h-[40vh]">
        <ReusableTrendChart
          title="PLANT - ENERGY USAGE"
          data={energyData}
          xKey="time"
          xType="date"
          series={[
            { type: "column", yKey: "energyInterval", name: "Energy Usage Interval", color: "#4682B4" },
            { type: "line", yKey: "energy", name: "Active Energy (kWh)", color: "#008D23", yAxis: "right", strokeWidth: 3 },
          ]}
          yLeftTitle="kWh (Δ)"
          yRightTitle="kWh (Cum.)"
          legend={true}
          cursor={true}
          exportMenu={true}
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>

      {/* 2) Real Power */}
      <div className="relative w-full px-4 py-4 h-[40vh]">
        <ReusableTrendChart
          title="PLANT - ACTIVE DEMAND (HISTORICAL)"
          data={powerData}
          xKey="time"
          xType="date"
          series={[{ type: "line", yKey: "power", name: "Real Power", color: "#249FFF", strokeWidth: 3 }]}
          yLeftTitle="kW"
          legend={true}
          cursor={true}
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>

      {/* 3) Voltage */}
      <div className="relative w-full px-4 py-4 h-[40vh]">
        <ReusableTrendChart
          title="PLANT - MAIN VOLTAGE"
          data={voltageData}
          xKey="time"
          xType="date"
          series={[{ type: "line", yKey: "voltage", name: "Avg Voltage", color: "#3D5AFE", strokeWidth: 3 }]}
          yLeftTitle="Volts"
          legend={false}
          cursor={true}
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>
    </div>
  );

};

export default TrendU4Lt1;
