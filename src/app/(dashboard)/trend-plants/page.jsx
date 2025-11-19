"use client";
import { ChartCard } from "@/components/trendsComponents/ChartCard";
import CurrentChart from "@/components/trendsComponents/CurrentChart";
import EnergyChart from "@/components/trendsComponents/EnergyChart";
import HarmonicsChart from "@/components/trendsComponents/HarmonicsChart";
import PowerChart from "@/components/trendsComponents/PowerChart";
import PowerFactorChart from "@/components/trendsComponents/PowerFactor";
import VoltageChart from "@/components/trendsComponents/VoltageChart";

import { useState } from "react";

const Plants = () => {
  const today = new Date().toISOString().split("T")[0];
  const [chartStates, setChartStates] = useState({
    energy: { start: today, end: today, fullscreen: false },
    power: { start: today, end: today, fullscreen: false },
    voltage: { start: today, end: today, fullscreen: false },
    current: { start: today, end: today, fullscreen: false },
    powerFactor: { start: today, end: today, fullscreen: false },
    harmonics: { start: today, end: today, fullscreen: false },
  });

  const updateChartState = (key, field, value) => {
    setChartStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const charts = [
    { id: "energy", title: "PLANTS - ENERGY USAGE", Chart: EnergyChart },
    {
      id: "power",
      title: "PLANTS - ACTIVE DEMAND (HISTORICAL)",
      Chart: PowerChart,
    },
    { id: "voltage", title: "PLANTS - MAIN VOLTAGE", Chart: VoltageChart },
    { id: "current", title: "PLANTS - MAIN CURRENT", Chart: CurrentChart },
    {
      id: "powerFactor",
      title: "PLANTS - REACTIVE POWER AND PF",
      Chart: PowerFactorChart,
    },
    {
      id: "harmonics",
      title: "PLANTS - VOLTAGE HARMONIC REDUCTION",
      Chart: HarmonicsChart,
    },
  ];

  return (
    <div className="h-[81vh] py-[1px] overflow-y-auto space-y-3">
      {charts.map(({ id, title, Chart }) => (
        <ChartCard
          area="Plants"
          key={id}
          id={id}
          chartId={id}
          title={title}
          ChartComponent={Chart}
          state={chartStates[id]}
          onChange={updateChartState}
        />
      ))}
    </div>
  );
};

export default Plants;
