"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import PowerSummaryTable from "@/components/reportsComponent/powerSummaryTable/PowerSummaryTable";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import { getDateRangeFromString } from "@/utils/dateRangeForReports";

const energySummaryPage = () => {
  const [unit, setUnit] = useState("");
  const [summaryReportTimePeriod, setSummaryReportTimePeriod] =
    useState("Yesterday");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState({});
  const [unit4Spindle, setU4Spindle] = useState("");
  const [unit5Spindle, setU5Spindle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [tarifData, setTarifData] = useState({
    wapda1: "",
    wapda2: "",
    niigata: "",
    jms: "",
    gg: "",
    dg: "",
    solar1: "",
    solar2: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarifData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // restrict time equality
  const toMinutes = (time) => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    if (summaryReportTimePeriod !== "Custom Date") {
      const { startDate, endDate } = getDateRangeFromString(
        summaryReportTimePeriod
      );
      setStartDate(startDate);
      setEndDate(endDate);
      setStartTime("06:00");
      if (summaryReportTimePeriod === "Today") {
        const today = new Date();
        const hour = today.getHours().toString().padStart(2, "0");
        const minutes = today.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hour}:${minutes}`;
        setEndTime(currentTime);
      } else {
        setEndTime("06:00");
      }
    }
  }, [summaryReportTimePeriod]);
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

  //////fetching spindles
  const fetchU4Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setU4Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // fetch spindle of unit 4
  const fetchU5Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setU5Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // getting energy usage reports
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!unit || startDate.length === 0 || endDate.length === 0) {
      toast.warning("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.POWER_SUMMARY_REPORT}`,
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
      const resResult = await response.json();
      if (response.ok) {
        setResData(resResult[0]);
        fetchU4Spindles();
        fetchU5Spindles();
        setShowResults(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // formate time to 24 hours
  const convertTo12Hour = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":").map(Number);

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 to 12, 13 -> 1, etc.

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report pb-5 rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      {!showResults && errorMessage.length !== 0 && (
        <div className="flex relative md:absolute top-0 right-0 bg-[#D40000] text-[14.22px] items-center gap-3 px-5 py-1.5 rounded rounded-t-md md:rounded-tr-md text-white">
          <RiErrorWarningFill size={23} />
          {errorMessage}
        </div>
      )}
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Energy Summary Report
        </h1>
        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
              // setUnit("");
              // setStartDate("");
              // setEndDate("");
              // setTarifData({
              //   wapda1: "",
              //   wapda2: "",
              //   niigata: "",
              //   jms: "",
              //   gg: "",
              //   dg: "",
              //   solar1: "",
              //   solar2: "",
              // });
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
            <div className="flex w-full items-center justify-evenly gap-5 flex-wrap">
              {/* area slector dropdown */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Plants Units
                </span>
                <div className="flex items-center justify-between w-full lg:w-[70%]">
                  <label className="flex items-center cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                    <input
                      type="checkbox"
                      checked={unit === "Unit_4" || unit === "ALL"}
                      onChange={() => handleUnitChange("Unit_4")}
                    />
                    Unit 4
                  </label>
                  <label className="flex items-center cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                    <input
                      type="checkbox"
                      checked={unit === "Unit_5" || unit === "ALL"}
                      onChange={() => handleUnitChange("Unit_5")}
                    />
                    Unit 5
                  </label>
                  <label className="flex items-center cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                    <input
                      type="checkbox"
                      checked={unit === "ALL"}
                      onChange={() => handleUnitChange("ALL")}
                    />
                    All
                  </label>
                </div>
              </div>

              {/* Time Period Dropdown */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
                <label className="text-[13.51px] font-500 font-inter">
                  Interval
                </label>
                <select
                  value={summaryReportTimePeriod}
                  onChange={(e) => setSummaryReportTimePeriod(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 dark:bg-gray-800 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="Custom Date">Custom Date</option>
                </select>
              </div>
              {/* start date */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
                <label
                  htmlFor="startDate"
                  className={`text-[13.51px] font-500 font-inter ${
                    summaryReportTimePeriod !== "Custom Date" &&
                    "text-gray-200 dark:text-gray-700"
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
                  readOnly={summaryReportTimePeriod !== "Custom Date"}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full lg:w-[80%] outline-none border-1 ${
                    summaryReportTimePeriod !== "Custom Date"
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                      : "border-gray-300 dark:border-gray-500"
                  } rounded px-3 py-1`}
                />
              </div>
              {/* end date selector */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className={`text-[13.51px] font-500 font-inter ${
                    summaryReportTimePeriod !== "Custom Date" &&
                    "text-gray-200 dark:text-gray-700"
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
                  readOnly={summaryReportTimePeriod !== "Custom Date"}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full lg:w-[80%] outline-none border-1 ${
                    summaryReportTimePeriod !== "Custom Date"
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                      : "border-gray-300 dark:border-gray-500"
                  } rounded px-3 py-1`}
                />
              </div>
              {/* start Time */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
                <label
                  htmlFor="startTime"
                  className={`text-[13.51px] font-500 font-inter ${
                    summaryReportTimePeriod !== "Custom Date" &&
                    "text-gray-200 dark:text-gray-700"
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
                  readOnly={summaryReportTimePeriod !== "Custom Date"}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full lg:w-[80%] outline-none border-1 ${
                    summaryReportTimePeriod !== "Custom Date"
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                      : "border-gray-300 dark:border-gray-500"
                  } rounded px-3 py-1`}
                />
              </div>
              {/* end Time */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
                <label
                  htmlFor="endTime"
                  className={`text-[13.51px] font-500 font-inter ${
                    summaryReportTimePeriod !== "Custom Date" &&
                    "text-gray-200 dark:text-gray-700"
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
                  readOnly={summaryReportTimePeriod !== "Custom Date"}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full lg:w-[80%] outline-none border-1 ${
                    summaryReportTimePeriod !== "Custom Date"
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-700"
                      : "border-gray-300 dark:border-gray-500"
                  } rounded px-3 py-1`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-start lg:pl-5">
              <h2 className="text-[18.5px] font-500 font-inter">
                Tarrif Rates
              </h2>
              <span className="text-[12.6px] font-400 text-[#919191] font-inter">
                Enter Tarrif Rates for the following:
              </span>
            </div>
            <div className="flex w-full items-center lg:pl-5  gap-5 flex-wrap">
              {(unit === "Unit_4" || unit === "ALL") && (
                <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                  <label
                    htmlFor="startDate"
                    className="text-[13.51px] font-500 font-inter"
                  >
                    WAPDA IC
                  </label>
                  <input
                    type="number"
                    value={tarifData.wapda1}
                    id="wapda1"
                    name="wapda1"
                    required={true}
                    placeholder="00"
                    onChange={handleChange}
                    className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
              )}
              {(unit === "Unit_5" || unit === "Unit_4" || unit === "ALL") && (
                <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                  <label
                    htmlFor="endDate"
                    className="text-[13.51px] font-500 font-inter"
                  >
                    WAPDA 2
                  </label>
                  <input
                    type="number"
                    value={tarifData.wapda2}
                    id="wapda2"
                    name="wapda2"
                    required={true}
                    placeholder="00"
                    onChange={handleChange}
                    className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                  />
                </div>
              )}
              {(unit === "Unit_5" || unit === "Unit_4" || unit === "ALL") && (
                <>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      JMS
                    </label>
                    <input
                      type="number"
                      value={tarifData.jms}
                      id="jms"
                      name="jms"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      Niigata
                    </label>
                    <input
                      type="number"
                      value={tarifData.niigata}
                      id="niigata"
                      name="niigata"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                </>
              )}
              {(unit === "Unit_4" || unit === "ALL") && (
                <>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      Diesel+JGS Incomming
                    </label>
                    <input
                      type="number"
                      value={tarifData.gg}
                      id="gg"
                      name="gg"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      Diesel+JGS Incomming
                    </label>
                    <input
                      type="number"
                      value={tarifData.dg}
                      id="dg"
                      name="dg"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                </>
              )}
              {(unit === "Unit_5" || unit === "ALL") && (
                <>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      Solar 1236.39 Kw
                    </label>
                    <input
                      type="number"
                      value={tarifData.solar1}
                      id="solar1"
                      name="solar1"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-[31%] lg:w-[32%] items-start justify-start gap-1">
                    <label
                      htmlFor="endDate"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      Solar 1017 Kw
                    </label>
                    <input
                      type="number"
                      value={tarifData.solar2}
                      id="solar2"
                      name="solar2"
                      required={true}
                      placeholder="00"
                      onChange={handleChange}
                      className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                </>
              )}
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
          tarifData={tarifData}
          resData={resData}
          unit4Spindle={unit4Spindle}
          unit5Spindle={unit5Spindle}
          startTime={convertTo12Hour(startTime)}
          endTime={convertTo12Hour(endTime)}
        />
      )}
    </div>
  );
};

export default energySummaryPage;
