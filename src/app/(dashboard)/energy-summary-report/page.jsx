"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import PowerSummaryTable from "@/components/reportsComponent/powerSummaryTable/PowerSummaryTable";

const energySummaryPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState([]);

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

  // getting energy usage reports
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unit || startDate.length === 0 || endDate.length === 0) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    setShowResults(true);
    setLoading(false);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      {!showResults && errorMessage.length !== 0 && (
        <div className="flex relative md:absolute top-0 right-0 bg-[#D40000] text-[14.22px] items-center gap-3 px-5 py-1.5 rounded rounded-t-md md:rounded-tr-md text-white">
          <RiErrorWarningFill size={23} />
          {errorMessage}
        </div>
      )}
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Power Summary Report
        </h1>
        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
              setUnit("");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-gray-800 dark:bg-gray-500 cursor-pointer text-white flex items-center justify-center text-center  w-[30px] h-[30px] rounded-full text-[14.22px] font-500 font-inter"
          >
            <FaChevronLeft />
          </button>
        )}
      </div>
      <hr className="" />
      {!showResults ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="flex w-full items-center gap-5 flex-wrap">
              {/* area slector dropdown */}
              <div className="flex flex-col w-full items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Plants Units
                </span>
                <div className="relative inline-block w-full" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full bg-white cursor-pointer dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
                  >
                    {unit === "ALL"
                      ? "ALL Units"
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

              {/* start date selector */}
              <div className="w-full flex items-center justify-between">
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
        <PowerSummaryTable
          unit={unit}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
};

export default energySummaryPage;
