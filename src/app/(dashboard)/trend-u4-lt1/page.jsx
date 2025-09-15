"use client";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { fetchStaticTrendsData, useTrendsChart } from "@/components/hooks/useChartData";
import {
  comboChartConfig,
  doubleLineConfig,
  singleColumnConfig,
  singleLineConfig,
} from "@/components/trendsComponents/chart-config";
import ReusableTrendChart from "@/components/trendsComponents/ReusableTrendChart";
import { createDynamicChart } from "@/components/trendsComponents/ReusableTrendChart";
import config from "@/constant/apiRouteList";
import {
  formatChartData,
  generateEnergyData,
  generatePowerData,
  generateVoltageData,
} from "@/data/chart-data";
import React, { useEffect, useState } from "react";
// Example hourly line data

const TrendU4Lt1 = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [u4Lt1Data, setU4Lt1Data] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
 
  //==============fetch for voltage================
  
const trendsData = {
  voltage: useTrendsChart("voltage", "2025-09-11", "2025-09-11"),
  activePower: useTrendsChart("activePower", "2025-09-10", "2025-09-10"),
  energy: useTrendsChart("energy", "2025-09-09", "2025-09-09"),
  current: useTrendsChart("current", "2025-09-08", "2025-09-08"),
  powerFactor: useTrendsChart("powerfactor", "2025-09-07", "2025-09-07"),
  harmonics: useTrendsChart("harmonics", "2025-09-06", "2025-09-06"),
};

  const handleIntervalChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    // <div className="grid grid-cols-1 gap-3 h-[81vh] overflow-y-auto">
    <div className="h-[81vh] overflow-y-auto space-y-3">
      {/* 1) Energy Usage */}
      <div className="w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffc5] dark:bg-gray-700/50 rounded-md z-10">
            <CustomLoader />
          </div>
        )}
        <ReusableTrendChart
          title="PLANT - ENERGY USAGE"
          data={trendsData.energy.data.map((item) => ({
            time: new Date(item.timestamp).getTime(), // ✅ directly valid
            energyInterval: item.consumption,
            energy: item.sumEnergy,
          }))}
          // data={formattedEnergyData}
          xKey="time"
          xType="date"
          series={[
            {
              type: "column",
              yKey: "energyInterval",
              name: "Interval Del-Active Energy",
              color: "#4682B4",
            },
            {
              type: "line",
              yKey: "energy",
              name: "Del-Active Energy (kWh)",
              color: "#008D23",
              yAxis: "right",
              strokeWidth: 3,
            },
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

      {/* 2) Active Power */}
      <div className="w-full">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - ACTIVE DEMAND (HISTORICAL)"
          // data={powerData}
          data={trendsData.activePower.data.map((item) => ({
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
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>

      {/* 3) Voltage */}
      <div className="w-full">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - MAIN VOLTAGE"
          // data={voltageData}
           data={trendsData.voltage.data.map((item) => ({
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
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>

       {/* 4) main current */}
      <div className="w-full">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - MAIN CURRENT"
           data={trendsData.current.data.map((item) => ({
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
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>
      
       {/* 5) main power factor */}
      <div className="w-full">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - REACTIVE POWER AND PF"
           data={trendsData.powerFactor.data.map((item) => ({
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
          startDate={startDate}
          endDate={endDate}
          onIntervalChange={handleIntervalChange}
          showToolbar={true}
          showInterval={true}
          showFullscreen={true}
        />
      </div>

       {/* 6) main horm */}
      <div className="w-full">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - VOLTAGE HARMONIC REDUCTION"
           data={trendsData.harmonics.data.map((item) => ({
            time: new Date(item.timestamp).getTime(), // ✅ directly valid
            hormonics: item.sumHarmonics,
          }))}
          xKey="time"
          xType="date"
          series={[
            {
              type: "line",
              yKey: "hormonics",
              name: "Hormonics",
              color: "#2DDE04",
              strokeWidth: 3,
            },
          ]}
          yLeftTitle="Volts"
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
    </div>
  );
};

export default TrendU4Lt1;
