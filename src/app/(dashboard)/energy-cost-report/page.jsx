"use client";
import React, { useState } from "react";

const EnergyCostReportPage = () => {
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("2025-06-11");
  const [endDate, setEndDate] = useState("2025-06-18");
  const [rates, setRates] = useState("10");

  const [shoResult, setShowResult] = useState(false);
  const handleUnitChange = (unitClicked) => {
    if (unitClicked === "All") {
      setUnit("All");
    } else if (unit === "All") {
      // If "All" is currently selected, toggle off and set clicked unit
      setUnit(unitClicked);
    } else if (unit === unitClicked) {
      // Toggle off
      setUnit("");
    } else if (
      (unit === "Unit_4" && unitClicked === "Unit_5") ||
      (unit === "Unit_5" && unitClicked === "Unit_4")
    ) {
      // If user selects both manually → treat as "All"
      setUnit("All");
    } else {
      setUnit(unitClicked);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      area: unit,
      start_date: startDate,
      suffixes: ["Del_ActiveEnergy"],
      end_date: endDate,
      rates,
    });
    setShowResult(true);
  };
  return (
    <div className="bg-white dark:bg-gray-800 h-[81vh] rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      <h1 className="text-[18.22px] text-raleway font-600">
        Energy Cost Reports
      </h1>
      {!shoResult ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="flex w-full items-center md:gap-x-10 lg:gap-x-30 gap-y-5 flex-wrap">
              <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Plants Units
                </span>
                <div className="flex gap-4">
                  <label className="text-black dark:text-white flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={unit === "Unit_4" || unit === "All"}
                      onChange={() => handleUnitChange("Unit_4")}
                    />
                    Unit 4
                  </label>
                  <label className="text-black dark:text-white flex items-center gap-2 text-[13.51px] font-500 font-inter">
                    <input
                      type="checkbox"
                      checked={unit === "Unit_5" || unit === "All"}
                      onChange={() => handleUnitChange("Unit_5")}
                    />
                    Unit 5
                  </label>
                  <label className="text-black dark:text-white flex items-center gap-2 text-[13.51px] font-500 font-inter">
                    <input
                      type="checkbox"
                      checked={unit === "All"}
                      onChange={() => handleUnitChange("All")}
                    />
                    All
                  </label>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
                <label
                  htmlFor="startDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  id="startDate"
                  name="startDate"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  id="endDate"
                  name="endDate"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
                <label
                  htmlFor="unit4Spindels"
                  className="text-[13.51px] font-500 font-inter"
                >
                  Rates
                </label>
                <input
                  type="number"
                  value={rates}
                  id="rates"
                  name="rates"
                  onChange={(e) => setRates(e.target.value)}
                  placeholder="05"
                  className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
              <button
                type="submit"
                className="bg-[#1A68B2] text-white px-4 py-1 rounded"
              >
                Generate Reports
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h1>This is reports </h1>
        </div>
      )}
    </div>
  );
};

export default EnergyCostReportPage;
