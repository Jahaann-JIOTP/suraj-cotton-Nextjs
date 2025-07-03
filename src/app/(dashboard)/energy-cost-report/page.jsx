"use client";
import EnergyCostReportsTable from "@/components/reportsComponent/energyCostReportsTabel/EnergyCostReportsTable";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const EnergyCostReportPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rates, setRates] = useState("");
  const [loading, setLoading] = useState(false);
  const [energycostReportData, SetEnergyCostReportData] = useState([]);
  const [shoResult, setShowResult] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUnitChange = (unitClicked) => {
    if (unitClicked === "ALL") {
      setUnit("ALL");
    } else if (unit === "ALL") {
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
      setUnit("ALL");
    } else {
      setUnit(unitClicked);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unit) {
      alert("Please select a unit before generating report.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/energy-cost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            area: unit,
            start_date: startDate,
            end_date: endDate,
            suffixes: ["Del_ActiveEnergy"],
          }),
        }
      );
      const resResult = await response.json();

      if (response.ok) {
        SetEnergyCostReportData(resResult);
        setLoading(false);
        setShowResult(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 h-full md:h-[81vh] rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Energy Cost Report
        </h1>
        {shoResult && (
          <button
            onClick={() => {
              setShowResult(false);
              setUnit("");
              setStartDate("");
              setEndDate("");
              setRates("");
            }}
            className="bg-gray-800 dark:bg-gray-500 cursor-pointer text-white flex items-center justify-center text-center  w-[30px] h-[30px] rounded-full text-[14.22px] font-500 font-inter"
          >
            <FaChevronLeft />
          </button>
        )}
      </div>
      <hr className="" />
      {!shoResult ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="flex w-full items-center gap-5 flex-wrap">
              {/* area slector dropdown */}
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col w-full md:w-[46%] items-start justify-center gap-1">
                  <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                    Select Plants Units
                  </span>
                  <div
                    className="relative inline-block w-full"
                    ref={dropdownRef}
                  >
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
                    >
                      {unit === "ALL"
                        ? "All Units"
                        : unit === "Unit_4"
                        ? "Unit 4"
                        : unit === "Unit_5"
                        ? "Unit 5"
                        : "Select Area"}
                    </button>

                    {isOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
                        <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                          <input
                            type="checkbox"
                            checked={unit === "Unit_4" || unit === "ALL"}
                            onChange={() => handleUnitChange("Unit_4")}
                          />
                          Unit 4
                        </label>
                        <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                          <input
                            type="checkbox"
                            checked={unit === "Unit_5" || unit === "ALL"}
                            onChange={() => handleUnitChange("Unit_5")}
                          />
                          Unit 5
                        </label>
                        <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                          <input
                            type="checkbox"
                            checked={unit === "ALL"}
                            onChange={() => handleUnitChange("ALL")}
                          />
                          All
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                {/* rate field field */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
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
                    required={true}
                    onChange={(e) => setRates(e.target.value)}
                    placeholder="05"
                    className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                {/* start date selector */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
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
                    required={true}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
                {/* end date selector */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
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
                    required={true}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
              <button
                type="submit"
                className="bg-[#1A68B2] cursor-pointer text-white px-4 py-1 rounded flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span>Generating</span>
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                        top: "50%",
                        left: "50%",
                      }}
                    />
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <EnergyCostReportsTable
            setShowResult={setShowResult}
            startDate={startDate}
            endDate={endDate}
            energycostReportData={energycostReportData}
            rates={rates}
          />
        </div>
      )}
    </div>
  );
};

export default EnergyCostReportPage;
