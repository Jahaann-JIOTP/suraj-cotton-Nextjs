// pages/dashboard.js
"use client";
import React, { useState } from "react";
import GenericAmChart from "../../../components/trendsComponents/GenericAmChart";

// mock data
const now = new Date();
const hours = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(now);
  d.setHours(i, 0, 0, 0);
  return {
    time: d,
    interval: `${String(i).padStart(2, "0")}:00`,
    energy: 27000 + Math.random() * 800,
    energyInterval: 400 + Math.random() * 200,
    power: 650 + (Math.random() - 0.5) * 120,
    voltage: 405 + (Math.random() - 0.5) * 8,
    current: 1400 + (Math.random() - 0.5) * 300,
  };
});

export default function Dashboard() {
  const [startDate, setStartDate] = useState(hours[0].time);
  const [endDate, setEndDate] = useState(hours[hours.length - 1].time);

  const onIntervalChange = (s, e) => {
    if (s) setStartDate(s);
    if (e) setEndDate(e);
  };

  return (
    // Let the document scroll; no fixed height or overflow here
   <div className="h-[81vh] overflow-y-auto bg-none relative">

      <div className="grid gap-6 md:grid-cols-1">
        {/* 1) Energy Usage */}
        <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - ENERGY USAGE"
            data={hours}
            xKey="time"
            xType="date"
            series={[
              { type: "column", yKey: "energyInterval", name: "Energy Usage Interval", color: "#4682B4" },
              { type: "line", yKey: "energy", name: "Active Energy (kWh)", color: "#008D23", yAxis: "right", strokeWidth: 3 },
            ]}
            yLeftTitle="kWh (Δ)"
            yRightTitle="kWh (Cum.)"
            legend
            cursor
            exportMenu
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>

        {/* 2) Real Power */}
        <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - ACTIVE DEMAND (HISTORICAL)"
            data={hours}
            xKey="time"
            xType="date"
            series={[{ type: "line", yKey: "power", name: "Real Power", color: "#249FFF",strokeWidth: 3 }]}
            yLeftTitle="kW"
            legend
            cursor
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>

        {/* 3) Voltage */}
        <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - MAIN VOLTAGE"
            data={hours}
            xKey="time"
            xType="date"
            series={[{ type: "line", yKey: "voltage", name: "Avg Voltage", color: "#3D5AFE",strokeWidth: 3 }]}
            yLeftTitle="Volts"
            legend={false}
            cursor
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>

        {/* 4) Current */}
        <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - MAIN CURRENT"
            data={hours}
            xKey="time"
            xType="date"
            series={[{ type: "line", yKey: "current", name: "Avg Current", color: "#FF9500", strokeWidth: 3 }]}
            yLeftTitle="Amps"
            legend
            cursor
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>
        <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - REACTIVE POWER AND PF"
            data={hours}
            xKey="time"
            xType="date"
            series={[{ type: "line", yKey: "current", name: "Reactive Power", color: "#FC9C03", strokeWidth: 3 },
              { type: "line", yKey: "power", name: "Power Factor", color: "#986BC5", strokeWidth: 3 }
            ]}
            yLeftTitle="VAR"
             yRightTitle="PF"
            legend
            cursor
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>
         <div className="relative w-full px-4 py-4 h-[40vh] bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md">
          <GenericAmChart
            title="PLANT - VOLTAGE HARMONIC REDUCTION"
            data={hours}
            xKey="time"
            xType="date"
            series={[{ type: "line", yKey: "current", name: "THD Voltage", color: "#009826", strokeWidth: 3 }]}
            yLeftTitle="THD V"
            legend
            cursor
            startDate={startDate}
            endDate={endDate}
            onIntervalChange={onIntervalChange}
            showToolbar
            showInterval
            showFullscreen
          />
        </div>
      </div>
    </div>
  );
}
