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
// console.log("chart3",trendsData.energy.data)
// console.log("chart2",trendsData.activePower.data)
// console.log("chart4",trendsData.current.data)
// console.log("chart1",trendsData.voltage.data)
//////////////////////
  // console.log("chart5",trendsData.powerFactor.data)
  console.log("chart6",trendsData.harmonics.data)
  //===================fetch unit 4 lt 1 charts data=========================
  const fetchU4Lt1Trends = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}/plants-trends/unit5-lt2?startDate=2025-09-11&endDate=2025-09-11&type=energy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setU4Lt1Data(resResult);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

 

  const powerData = formatChartData(generatePowerData());
  const voltageData = formatChartData(generateVoltageData());
  
  const handleIntervalChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     const chartTypes = []
  //     const data = await fetchStaticTrendsData("voltage", "2025-09-11", "2025-09-11");
  //     setTrendsData(data);
  //     setLoading(false);
  //   };

  //   loadData();
  // }, []);
console.log("this is dummy ",voltageData)
  useEffect(() => {
    fetchU4Lt1Trends();
  }, [startDate]);
  return (
    <div className="grid grid-cols-1 gap-6 p-6 h-[81vh] overflow-y-auto">
      {/* 1) Energy Usage */}
      <div className=" w-full px-4 py-4 h-[40vh]">
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
              name: "Energy Usage Interval",
              color: "#4682B4",
            },
            {
              type: "line",
              yKey: "energy",
              name: "Active Energy (kWh)",
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

      {/* 2) Real Power */}
      <div className="relative w-full px-4 py-4 h-[40vh]">
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
              name: "Real Power",
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
      <div className="relative w-full px-4 py-4 h-[40vh]">
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
              name: "Avg Voltage",
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
      <div className="relative w-full px-4 py-4 h-[40vh]">
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
              name: "Avg Voltage",
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
      
       {/* 5) main power factor */}
      <div className="relative w-full px-4 py-4 h-[40vh]">
        <ReusableTrendChart
          title="UNIT 4 LT 1 - REACTIVE POWER AND PF"
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
              name: "Power Factor",
              color: "#1C03FF",
              strokeWidth: 3,
            },
          ]}
          yLeftTitle="Power Factor"
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
      <div className="relative w-full px-4 py-4 h-[40vh]">
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
