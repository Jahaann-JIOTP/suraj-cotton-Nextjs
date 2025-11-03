"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import { getDateRangeFromString } from "@/utils/dateRangeForReports";
import EnergyComparisonReport from "@/components/reportsComponent/energyComparisonTable/EnergyComparisonReport";

const EnergyComparisonPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usageReportTimePeriod, setUsageReportTimePeriod] =
    useState("Yesterday");
  const dropdownRef = useRef(null);
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fetched, setFetched] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [resData, setResData] = useState([]);
  const intervalsObj = {
    unit,
    startDate,
    endDate,
    startTime,
    endTime,
    usageReportTimePeriod,
  };

  const toMinutes = (time) => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  useEffect(() => {
    const today = new Date();
    const hour = today.getHours().toString().padStart(2, "0");
    const minutes = today.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hour}:${minutes}`;
    if (usageReportTimePeriod !== "Custom Date") {
      const { startDate, endDate } = getDateRangeFromString(
        usageReportTimePeriod
      );
      setStartDate(startDate);
      setEndDate(endDate);
      setStartTime("06:00");

      if (startDate === endDate) {
        setEndTime(currentTime);
      } else {
        setEndTime("06:00");
      }
    }
  }, [usageReportTimePeriod]);
  useEffect(() => {
    if (startDate === endDate && endTime) {
      let startMins = toMinutes(startTime);
      let endMins = toMinutes(endTime);
      const diff = endMins - startMins;

      if (endMins <= startMins || diff < 30) {
        Swal.fire({
          title: "Confirm Time",
          html: `
          End Time must be at least 30 minutes greater than Start Time for the same date.
        `,
          icon: "question",
          confirmButtonText: "OK",
          confirmButtonColor: "#1A68B2",
        });
        setEndTime("");
      }
    }
  }, [startTime, endTime, startDate, endDate]);

  //  handle minimum end time
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
        // `${config.BASE_URL}${config.REPORTS.ENERGY_USAGE_REPORTS}`,
        `${config.BASE_URL}/energy-consumption-report`,
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
              // setUnit("");
              // setStartDate("");
              // setEndDate("");
              // setStartTime("");
              // setEndTime("");
              // setUnit4Spindle(null);
              // setUnit5Spindle(null);
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
              <div className="w-full flex items-center gap-4 justify-between">
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

                {/* Time Period Dropdown */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label className="text-[13.51px] font-500 font-inter">
                    Interval
                  </label>
                  <select
                    value={usageReportTimePeriod}
                    onChange={(e) => setUsageReportTimePeriod(e.target.value)}
                    className="w-full outline-none border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded px-4 py-2"
                  >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Custom Date">Custom Date</option>
                  </select>
                </div>
              </div>
              {/* start date selector */}
              <div className="w-full flex items-center gap-4 justify-between">
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="startDate"
                    className={`text-[13.51px] font-500 font-inter ${
                      usageReportTimePeriod !== "Custom Date" &&
                      "text-gray-300 dark:text-gray-700"
                    }`}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    id="startDate"
                    name="startDate"
                    required={true}
                    readOnly={usageReportTimePeriod !== "Custom Date"}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full outline-none border-1 rounded px-4 py-2 ${
                      usageReportTimePeriod === "Custom Date"
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-150 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                    }`}
                  />
                </div>
                {/* end date selector */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="endDate"
                    className={`text-[13.51px] font-500 font-inter ${
                      usageReportTimePeriod !== "Custom Date" &&
                      "text-gray-300 dark:text-gray-700"
                    }`}
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
                    readOnly={usageReportTimePeriod !== "Custom Date"}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full outline-none border-1 rounded px-4 py-2 ${
                      usageReportTimePeriod === "Custom Date"
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-150 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                    }`}
                  />
                </div>
              </div>
              {/* start Time Selector */}
              <div className="w-full flex items-center gap-4 justify-between">
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="startDate"
                    className={`text-[13.51px] font-500 font-inter ${
                      usageReportTimePeriod !== "Custom Date" &&
                      "text-gray-300 dark:text-gray-700"
                    }`}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    id="startTime"
                    name="startTime"
                    required={true}
                    readOnly={usageReportTimePeriod !== "Custom Date"}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full outline-none border-1 rounded px-4 py-2 ${
                      usageReportTimePeriod === "Custom Date"
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-150 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                    }`}
                  />
                </div>
                {/* end Time selector */}
                <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                  <label
                    htmlFor="endDate"
                    className={`text-[13.51px] font-500 font-inter ${
                      usageReportTimePeriod !== "Custom Date" &&
                      "text-gray-300 dark:text-gray-700"
                    }`}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    id="endTime"
                    name="endTime"
                    required={true}
                    readOnly={usageReportTimePeriod !== "Custom Date"}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full outline-none border-1 rounded px-4 py-2 ${
                      usageReportTimePeriod === "Custom Date"
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-150 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
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
            </div>
          </form>
        </div>
      ) : showResults ? (
        <EnergyComparisonReport rawData={resData} intervalsObj={intervalsObj} />
      ) : null}
    </div>
  );
};

export default EnergyComparisonPage;
