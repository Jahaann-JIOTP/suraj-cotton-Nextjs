"use client";

import MultipleUnitComponent from "@/components/reportsComponent/MultipleUnitComponent/MultipleUnitComponent";
import SingleUnitComponent from "@/components/reportsComponent/SingleUnitComponent/SingleUnitComponent";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";

const FilterPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [unit4Spindle, setUnit4Spindle] = useState(null);
  const [unit5Spindle, setUnit5Spindle] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSpindle, setLoadingSpindle] = useState(false);
  const [resData, setResData] = useState([]);
  
  // Remove the blocking logic - always allow API calls
  const unit4 = unit === "Unit_4" || unit === "ALL" ? "U4" : "";
  const unit5 = unit === "Unit_5" || unit === "ALL" ? "U5" : "";
  
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
      setUnit(unitClicked);
    } else if (unit === unitClicked) {
      setUnit("");
    } else if (
      (unit === "Unit_4" && unitClicked === "Unit_5") ||
      (unit === "Unit_5" && unitClicked === "Unit_4")
    ) {
      setUnit("ALL");
    } else {
      setUnit(unitClicked);
    }
  };

  // fetch unit 4 spindles - simplified, no blocking
  const fetchU4Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      setLoadingSpindle(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U4`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resResult = await response.json();

      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setUnit4Spindle(resResult[0].totalProduction);
      } else {
        setUnit4Spindle(0); // Default to 0 if no data
      }
    } catch (error) {
      console.error(error.message);
      setUnit4Spindle(0); // Default to 0 on error
    } finally {
      setLoadingSpindle(false);
      setFetched(true);
    }
  };

  // fetch unit 5 spindles - simplified, no blocking
  const fetchU5Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      setLoadingSpindle(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resResult = await response.json();

      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setUnit5Spindle(resResult[0].totalProduction);
      } else {
        setUnit5Spindle(0); // Default to 0 if no data
      }
    } catch (error) {
      console.error(error.message);
      setUnit5Spindle(0); // Default to 0 on error
    } finally {
      setLoadingSpindle(false);
      setFetched(true);
    }
  };

  // format time to 12 hours
  const convertTo12Hour = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":").map(Number);

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  // Remove the blocking useEffect that prevented submission
  // Only show warning messages but don't block form submission
  useEffect(() => {
    if (!fetched) return;

    // Show warning messages but don't set errorMessage that blocks submission
    if (unit === "Unit_4" && unit4Spindle === 0) {
      console.warn("Warning: No Unit 4 Bags data found");
    } else if (unit === "Unit_5" && unit5Spindle === 0) {
      console.warn("Warning: No Unit 5 Bags data found");
    } else if (unit === "ALL") {
      if (unit4Spindle === 0 && unit5Spindle === 0) {
        console.warn("Warning: No Bags data found for either unit");
      } else if (unit4Spindle === 0) {
        console.warn("Warning: No Unit 4 Bags data found");
      } else if (unit5Spindle === 0) {
        console.warn("Warning: No Unit 5 Bags data found");
      }
    }
  }, [unit, unit4Spindle, unit5Spindle, fetched]);

  useEffect(() => {
    if (unit !== "" && startDate !== "" && endDate !== "") {
      fetchU4Spindles();
      fetchU5Spindles();
    }
  }, [unit, startDate, endDate]); // Added unit to dependencies

  // getting energy usage report - removed the blocking condition
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!unit || !startDate || !endDate) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.ENERGY_USAGE_REPORTS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            suffixes: ["Del_ActiveEnergy"],
            area: unit,
          }),
        }
      );
      
      if (response.ok) {
        const resResult = await response.json();
        setResData(resResult);
        setShowResults(true);
      } else {
        toast.error("Failed to generate report");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error generating report");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Helper function to get safe spindle values (default to 0 if null/undefined)
  const getSafeSpindleValue = (value) => {
    return value !== null && value !== undefined ? value : 0;
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      {/* Show warning but don't block UI */}
      {!showResults && fetched && (
        <div className="flex relative md:absolute top-0 right-0 bg-orange-500 text-[14.22px] items-center gap-3 px-5 py-1.5 rounded rounded-t-md md:rounded-tr-md text-white">
          <RiErrorWarningFill size={23} />
          Please Add Number of Bags in Production Tab First!
        </div>
      )}
      
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Energy Usage Report
        </h1>
        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
              setUnit("");
              setStartDate("");
              setEndDate("");
              setStartTime("");
              setEndTime("");
              setUnit4Spindle(null);
              setUnit5Spindle(null);
              setFetched(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center ${
              isHovered ? "justify-center" : "justify-start"
            } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
              isHovered ? "w-[90px]" : "w-[40px]"
            }`}
            style={{
              borderRadius: isHovered ? "8px" : "50%",
            }}
          >
            <ImArrowLeft2 className="text-white shrink-0" />
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              Back
            </span>
          </button>
        )}
      </div>
      <hr className="" />
      {!showResults ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="flex w-full items-center gap-5 flex-wrap">
              {/* area selector dropdown */}
              <div className="flex flex-col w-full items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Plants Units
                </span>
                <div className="relative inline-block w-full" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full bg-white dark:bg-gray-800 border cursor-pointer border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
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
              <div className="w-full flex items-center gap-4 justify-between">
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
              {/* start Time Selector */}
              <div className="w-full flex items-center gap-4 justify-between">
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="startDate"
                    className="text-[13.51px] font-500 font-inter"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    id="startTime"
                    name="startTime"
                    required={true}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
                {/* end Time selector */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="endDate"
                    className="text-[13.51px] font-500 font-inter"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    id="endTime"
                    name="endTime"
                    required={true}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
              </div>
              {/* spindle field - now shows 0 as default */}
              <div className="w-full flex items-center gap-4 justify-between">
                {unit === "Unit_4" ? (
                  <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                    <label
                      htmlFor="unit4Spindels"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      No. of Bags Unit 4
                    </label>
                    <input
                      type="number"
                      value={getSafeSpindleValue(unit4Spindle)}
                      id="rates"
                      name="rates"
                      readOnly
                      placeholder="00"
                      className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                ) : unit === "Unit_5" ? (
                  <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                    <label
                      htmlFor="unit5Spindels"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      No. of Bags Unit 5
                    </label>
                    <input
                      type="number"
                      value={getSafeSpindleValue(unit5Spindle)}
                      id="rates"
                      name="rates"
                      readOnly
                      placeholder="00"
                      className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                ) : unit === "ALL" ? (
                  <>
                    <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                      <label
                        htmlFor="unit4Spindels"
                        className="text-[13.51px] font-500 font-inter"
                      >
                        No. of Bags Unit 4
                      </label>
                      <input
                        type="number"
                        value={getSafeSpindleValue(unit4Spindle)}
                        id="rates"
                        name="rates"
                        readOnly
                        placeholder="00"
                        className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                      <label
                        htmlFor="unit5Spindels"
                        className="text-[13.51px] font-500 font-inter"
                      >
                        No. of Bags Unit 5
                      </label>
                      <input
                        type="number"
                        value={getSafeSpindleValue(unit5Spindle)}
                        id="rates"
                        name="rates"
                        readOnly
                        placeholder="00"
                        className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
              {loadingSpindle ? (
                <div className="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <CircularProgress size={16} />{" "}
                  <span>Fetching Bags...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="bg-[#1A68B2] cursor-pointer text-white px-4 py-1 rounded flex items-center justify-center gap-2"
                >
                  {loadingSubmit ? (
                    <>
                      <span>Generating</span>
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      ) : showResults && (unit === "Unit_4" || unit === "Unit_5") ? (
        <SingleUnitComponent
          unit={unit}
          startDate={startDate}
          endDate={endDate}
          unit4Spindle={getSafeSpindleValue(unit4Spindle)}
          startTime={convertTo12Hour(startTime)}
          endTime={convertTo12Hour(endTime)}
          unit5Spindle={getSafeSpindleValue(unit5Spindle)}
          resData={resData}
        />
      ) : showResults && unit === "ALL" ? (
        <MultipleUnitComponent
          unit={unit}
          unit4Spindle={getSafeSpindleValue(unit4Spindle)}
          unit5Spindle={getSafeSpindleValue(unit5Spindle)}
          startDate={startDate}
          endDate={endDate}
          startTime={convertTo12Hour(startTime)}
          endTime={convertTo12Hour(endTime)}
          resData={resData}
        />
      ) : null}
    </div>
  );
};

export default FilterPage;