"use client";
import React, { useEffect, useRef, useState } from "react";

import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import ChartComponent from "./ChartComponent";

const ConsumptionEnergy = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("today");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConsumptionEnergyFullView, setConsumptionEnergyFullView] =
    useState(false);
  const { theme } = useTheme();

  const handleConsumptionEnergyFullView = () => {
    setConsumptionEnergyFullView((prev) => !prev);
  };

  const fetchConsumptionEnergyData = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_CONSUMPTION_ENERGY}${selectedTimePeriod}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const resResult = await response.json();
        if (Array.isArray(resResult) && resResult.length > 0) {
          requestAnimationFrame(() => {
            setChartData(resResult);
            setLoading(false);
          });
        } else {
          console.warn("No chart data received.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionEnergyData();
  }, [selectedTimePeriod]);

  return (
    <div
      className={`${
        isConsumptionEnergyFullView
          ? "fixed inset-0 z-50 p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative px-1 py-2 md:p-3 h-[15rem] md:h-[13.5rem] lg:h-[12rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-800 rounded-md shadow-md`}
    >
      <div className="relative flex items-center px-2 md:flex-row gap-3 md:gap-[0.7vw] justify-between">
        <span className="text-[15px] text-[#1A68B2] font-raleway font-600">
          Total Energy Input
        </span>
        <div className="flex gap-4">
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="outline-none border-1 text-[12px] font-raleway rounded p-1 dark:bg-gray-600"
            disabled={loading}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            // className="cursor-pointer absolute md:relative top-[0px] right-[0px]"
            className="cursor-pointer"
            onClick={handleConsumptionEnergyFullView}
          >
            {isConsumptionEnergyFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )}

      <ChartComponent
        data={chartData}
        selectedTimePeriod={selectedTimePeriod}
        chartId="ConsumptionChartID"
        theme={theme}
        loading={loading}
      />
    </div>
  );
};

export default ConsumptionEnergy;
