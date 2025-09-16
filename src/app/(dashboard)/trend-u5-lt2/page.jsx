"use client";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { useTrendsChart } from "@/components/hooks/useChartData";
import CurrentChart from "@/components/trendsComponents/CurrentChart";
import EnergyChart from "@/components/trendsComponents/EnergyChart";
import HarmonicsChart from "@/components/trendsComponents/HarmonicsChart";
import PowerChart from "@/components/trendsComponents/PowerChart";
import PowerFactorChart from "@/components/trendsComponents/PowerFactor";
import ReusableTrendChart from "@/components/trendsComponents/ReusableTrendChart";
import VoltageChart from "@/components/trendsComponents/VoltageChart";
// import { useTrendsChart } from "@/hooks/useTrendsChart"

// import ReusableTrendChart from "@/components/ReusableTrendChart"

import { useState } from "react";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
// Example hourly line data

const TrendU5Lt2 = () => {
  const today = new Date().toISOString().split("T")[0];

  // dates started
  const [energyStartDate, setStartEnergyDate] = useState(today);
  const [energyEndDate, setEndEnergyDate] = useState(today);
  const [powerStartDate, setPowerStartDate] = useState(today);
  const [powerEndDate, setPowerEndDate] = useState(today);
  const [voltageStartDate, setVoltageStartDate] = useState(today);
  const [voltageEndDate, setVoltageEndDate] = useState(today);
  const [currentStartDate, setCurrentStartDate] = useState(today);
  const [currentEndDate, setCurrentEndDate] = useState(today);
  const [powerFactorStartDate, setPowerFactorStartDate] = useState(today);
  const [powerFactorEndDate, setPowerFactorEndDate] = useState(today);
  const [hormonicsStartDate, setHormonicsStartDate] = useState(today);
  const [hormonicsEndDate, setHormonicsEndDate] = useState(today);
  // dates ended

  const [energyFullscreen, setEnergyFullscreen] = useState(false);
  const [powerFullscreen, setPowerFullscreen] = useState(false);
  const [voltageFullscreen, setVoltageFullscreen] = useState(false);
  const [currentFullscreen, setCurrentFullscreen] = useState(false);
  const [powerFactorFullscreen, setPowerFactorFullscreen] = useState(false);
  const [hormonicsFullscreen, setHormonicsFullscreen] = useState(false);

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
const area = "unit5-lt2"

  //==============fetch for voltage================

  const trendsData = {
    energy: useTrendsChart("energy", energyStartDate, energyEndDate),
    activePower: useTrendsChart("activePower", powerStartDate, powerEndDate),
    voltage: useTrendsChart("voltage", voltageStartDate, voltageEndDate),
    current: useTrendsChart("current", currentStartDate, currentEndDate),
    powerFactor: useTrendsChart(
      "powerfactor",
      powerFactorStartDate,
      powerFactorEndDate
    ),
    harmonics: useTrendsChart(
      "harmonics",
      hormonicsStartDate,
      hormonicsEndDate
    ),
  };

  return (
    <div className="h-[81vh] py-[1px] overflow-y-auto space-y-3">
      {/* 1) Energy Usage */}
      <div
        className={`w-full p-4 ${
          energyFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - ENERGY USAGE
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={energyStartDate}
                onChange={(e) => setStartEnergyDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={energyEndDate}
                min={energyStartDate}
                onChange={(e) => setEndEnergyDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setEnergyFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {energyFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <EnergyChart
          startDate={energyStartDate}
          endDate={energyEndDate}
          isFullscreen={energyFullscreen}
          area={area}
        />
      </div>

      {/* 2) Active Power */}
      <div
        className={`w-full p-4 ${
          powerFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - ACTIVE DEMAND (HISTORICAL)
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={powerStartDate}
                onChange={(e) => setPowerStartDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={powerEndDate}
                min={powerStartDate}
                onChange={(e) => setPowerEndDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setPowerFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {powerFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <PowerChart
          startDate={powerStartDate}
          endDate={powerEndDate}
          isFullscreen={powerFullscreen}
          area={area}
        />
      </div>

      {/* 3) Voltage */}
      <div
        className={`w-full p-4 ${
          voltageFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - MAIN VOLTAGE
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={voltageStartDate}
                onChange={(e) => setVoltageStartDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={voltageEndDate}
                min={voltageStartDate}
                onChange={(e) => setVoltageEndDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setVoltageFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {voltageFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <VoltageChart
          startDate={voltageStartDate}
          endDate={voltageEndDate}
          isFullscreen={voltageFullscreen}
          area={area}
        />
      </div>

      {/* 4) main current */}
      <div
        className={`w-full p-4 ${
          currentFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - MAIN CURRENT
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={currentStartDate}
                onChange={(e) => setCurrentStartDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={currentEndDate}
                min={currentStartDate}
                onChange={(e) => setCurrentEndDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setCurrentFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {currentFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <CurrentChart
          startDate={currentStartDate}
          endDate={currentEndDate}
          isFullscreen={currentFullscreen}
          area={area}
        />
      </div>

      {/* 5) main power factor */}
      <div
        className={`w-full p-4 ${
          powerFactorFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - REACTIVE POWER AND PF
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={powerFactorStartDate}
                onChange={(e) => setPowerFactorStartDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={powerFactorEndDate}
                min={powerFactorStartDate}
                onChange={(e) => setPowerFactorEndDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setPowerFactorFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {powerFactorFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <PowerFactorChart
          startDate={powerFactorStartDate}
          endDate={powerFactorEndDate}
          isFullscreen={powerFactorFullscreen}
          area={area}
        />
      </div>

      {/* 6) main horm */}
      <div
        className={`w-full p-4 ${
          hormonicsFullscreen ? "absolute top-0 left-0 z-50" : "relative"
        }  bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
            UNIT 5 LT 2 - VOLTAGE HARMONIC REDUCTION
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium dark:text-gray-300">Interval:</span>
              <input
                type="date"
                value={hormonicsStartDate}
                onChange={(e) => setHormonicsStartDate(e.target.value)}
                placeholder="Date"
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-gray-300">to</span>
              <input
                type="date"
                value={hormonicsEndDate}
                min={hormonicsStartDate}
                onChange={(e) => setHormonicsEndDate(e.target.value)}
                className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              onClick={() => setHormonicsFullscreen((prev) => !prev)}
              className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {hormonicsFullscreen ? (
                <MdOutlineFullscreenExit size={20} />
              ) : (
                <MdOutlineFullscreen size={20} />
              )}
            </button>
          </div>
        </div>
        <HarmonicsChart
          startDate={hormonicsStartDate}
          endDate={hormonicsEndDate}
          isFullscreen={hormonicsFullscreen}
          area={area}
        />
      </div>
    </div>
  );
};

export default TrendU5Lt2;
