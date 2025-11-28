"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import { getDateRangeFromString } from "@/utils/dateRangeForReports";
import { to12HourFormat } from "@/utils/To12HourFormate";
import EnergyUsageReport from "@/components/reportsComponent/energyComparisonTable/EnergyUsageReport";
import { IoChevronDownOutline } from "react-icons/io5";
const intervalOptions = [
  {
    id: 0,
    label: "Today",
    value: "Today",
  },
  {
    id: 1,
    label: "Yesterday",
    value: "Yesterday",
  },
  {
    id: 2,
    label: "This Week",
    value: "This Week",
  },
  {
    id: 3,
    label: "This Month",
    value: "This Month",
  },
  {
    id: 4,
    label: "Custom Date",
    value: "Custom Date",
  },
];
const DeptWiseReport = () => {
  const [usageReportTimePeriod, setUsageReportTimePeriod] =
    useState("Yesterday");
  const [intervalDropdown, setIntervalDropdown] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [unit, setUnit] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [resData, setResData] = useState([]);
  const intervalDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const intervalsObj = {
    startDate,
    endDate,
    startTime,
    endTime,
    usageReportTimePeriod,
  };
  const NewIntervalsObj = {
    "Selected Period": usageReportTimePeriod,
    "Start Date":
      startDate + (startTime ? " " + to12HourFormat(startTime) : ""),
    "End Date": endDate + (endTime ? " " + to12HourFormat(endTime) : ""),
    "Selected Timezone": "(UTC+05:00) Asia Karachi",
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
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleIntervalDropdown = () => setIntervalDropdown(!intervalDropdown);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        intervalDropdownRef.current &&
        !intervalDropdownRef.current.contains(event.target)
      ) {
        setIntervalDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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

  const handleUnitChange = (unitClicked) => {
    if (unitClicked === "All") {
      setUnit("All");
    } else if (unit === "All") {
      setUnit(unitClicked);
    } else if (unit === unitClicked) {
      setUnit("");
    } else if (
      (unit === "Unit4" && unitClicked === "Unit5") ||
      (unit === "Unit5" && unitClicked === "Unit4")
    ) {
      setUnit("All");
    } else {
      setUnit(unitClicked);
    }
  };

  //  handle minimum end time

  //=====================submit form handler========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    if (!startDate || !endDate) {
      toast.warning("Please Complete Date Intervals.");
      return;
    }
    if (!startTime || !endTime) {
      toast.warning("Please Complete Time Intervals.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.ENERGY_CONSUMPTION}`,
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
            area: "ALL",
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
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Energy Usage Report
        </h1>
        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
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
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* unit selector dropdonw */}
              <div className="flex flex-col w-full items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Plants Units
                </span>
                <div className="relative inline-block w-full" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border cursor-pointer border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
                  >
                    {unit === "ALL"
                      ? "ALL Units"
                      : unit === "Unit_4"
                      ? "Unit 4"
                      : unit === "Unit_5"
                      ? "Unit 5"
                      : "Select Area"}
                    <IoChevronDownOutline
                      className={`transition-all duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
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
              {/* Interval selector dropdown */}
              <div className="flex flex-col w-full items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Interval
                </span>
                <div
                  className="relative inline-block w-full"
                  ref={intervalDropdownRef}
                >
                  <button
                    type="button"
                    onClick={toggleIntervalDropdown}
                    className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border cursor-pointer border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
                  >
                    {/* Find and display the label instead of the value */}
                    {intervalOptions.find(
                      (option) => option.value === usageReportTimePeriod
                    )?.label || usageReportTimePeriod}
                    <IoChevronDownOutline
                      className={`transition-all duration-300 ${
                        intervalDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {intervalDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
                      {intervalOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white"
                        >
                          <input
                            type="radio"
                            checked={usageReportTimePeriod === option.value}
                            value={option.value}
                            onChange={(e) => {
                              setIntervalDropdown(false);
                              setUsageReportTimePeriod(e.target.value);
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* start date selector */}

              <div className="flex flex-col w-full items-start justify-start gap-1">
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

              <div className="flex flex-col w-full items-start justify-start gap-1">
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

              {/* start Time Selector */}

              <div className="flex flex-col w-full items-start justify-start gap-1">
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

              <div className="flex flex-col w-full items-start justify-start gap-1">
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
                  readOnly={usageReportTimePeriod !== "Custom Date"}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full outline-none border-1 rounded px-4 py-2 ${
                    usageReportTimePeriod === "Custom Date"
                      ? "border-gray-300 dark:border-gray-600"
                      : "border-gray-150 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                  }`}
                />
              </div>
              {/* </div> */}
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
        <EnergyUsageReport
          rawData={resData}
          intervalsObj={intervalsObj}
          newIntervalObj={NewIntervalsObj}
        />
      ) : null}
    </div>
  );
};

export default DeptWiseReport;
