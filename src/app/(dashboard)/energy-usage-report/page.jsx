"use client";

import MultipleUnitComponent from "@/components/reportsComponent/MultipleUnitComponent/MultipleUnitComponent";
import SingleUnitComponent from "@/components/reportsComponent/SingleUnitComponent/SingleUnitComponent";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";

const FilterPage = () => {
  const [units, setUnits] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unit4Spindle, setUnit4Spindle] = useState("");
  const [unit5Spindle, setUnit5Spindle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false); // ← controls form vs results
  const spindles = Number(unit4Spindle) + Number(unit5Spindle);

  const handleUnitChange = (unit) => {
    if (unit === "all") {
      setUnits(["unit4", "unit5"]);
    } else {
      setUnits((prev) =>
        prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
      );
    }
  };

  useEffect(() => {
    if (unit4Spindle.length === 0 && unit5Spindle.length === 0) {
      setErrorMessage(
        "Add Unit 4 and Unit 5 spindles first in Spindle Production Tab"
      );
    } else if (unit4Spindle.length === 0) {
      setErrorMessage("Add Unit 4 spindles first in Spindle Production Tab");
    } else if (unit5Spindle.length === 0) {
      setErrorMessage("Add Unit 5 spindles first in Spindle Production Tab");
    } else {
      setErrorMessage("");
    }
  }, [unit4Spindle, unit5Spindle]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      units === 0 ||
      startDate.length === 0 ||
      endDate.length === 0 ||
      unit4Spindle.length === 0 ||
      unit5Spindle.length === 0
    ) {
      toast.warning("please fill the form");
      return;
    } else if (units.length === 0) {
      toast.warning("Please select at least one unit.");
      return;
    }

    setShowResults(true); // Switch to result view
  };

  return (
    <div className="relative   w-full h-full rounded-md border-t-3 border-[#1A68B2] bg-white dark:bg-gray-800 mx-auto">
      {!showResults && errorMessage.length !== 0 && (
        <div className="flex relative md:absolute top-0 right-0 bg-[#D40000] text-[14.22px] items-center gap-3 px-5 py-1.5 rounded rounded-t-md md:rounded-tr-md text-white">
          <RiErrorWarningFill size={23} />
          {errorMessage}
        </div>
      )}
      {!showResults ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
          <h2 className="text-[18.22px] text-raleway font-600">
            Energy Usage Report
          </h2>

          <div className="flex w-full items-center md:gap-x-10 lg:gap-x-30 gap-y-5 flex-wrap">
            <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
              <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                Select Plants Units
              </span>
              <div className="flex gap-4">
                <label className="text-black dark:text-white flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={units.includes("unit4")}
                    onChange={() => handleUnitChange("unit4")}
                  />
                  Unit 4
                </label>
                <label className="text-black dark:text-white flex items-center gap-2 text-[13.51px] font-500 font-inter">
                  <input
                    type="checkbox"
                    checked={units.includes("unit5")}
                    onChange={() => handleUnitChange("unit5")}
                  />
                  Unit 5
                </label>
                <label className="text-black dark:text-white flex items-center gap-2 text-[13.51px] font-500 font-inter">
                  <input
                    type="checkbox"
                    checked={units.includes("unit4") && units.includes("unit5")}
                    onChange={() => handleUnitChange("all")}
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
                No. of Spindles Unit 4
              </label>
              <input
                type="number"
                value={unit4Spindle}
                id="unit4Spindels"
                name="unit4Spindels"
                onChange={(e) => setUnit4Spindle(e.target.value)}
                placeholder="1200"
                className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
              />
            </div>
            <div className="flex flex-col w-full md:w-[45%] lg:w-[23%] items-start justify-start gap-1">
              <label
                htmlFor="unit5Spindels"
                className="text-[13.51px] font-500 font-inter"
              >
                No. of Spindles Unit 5
              </label>
              <input
                type="number"
                value={unit5Spindle}
                id="unit5Spindels"
                name="unit5Spindels"
                onChange={(e) => setUnit5Spindle(e.target.value)}
                placeholder="Spindle"
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
      ) : units.length === 1 ? (
        <SingleUnitComponent
          unit={units[0]}
          startDate={startDate}
          endDate={endDate}
          spindles={spindles}
        />
      ) : (
        <MultipleUnitComponent
          units={units}
          startDate={startDate}
          endDate={endDate}
          unit4Spindle={unit4Spindle}
          unit5Spindle={unit5Spindle}
        />
      )}
    </div>
  );
};

export default FilterPage;
