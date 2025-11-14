"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import { getDateRangeFromString } from "@/utils/dateRangeForReports";
import EnergyComparisonReport from "@/components/reportsComponent/energyComparisonTable/EnergyComparisonReport";
import { to12HourFormat } from "@/utils/To12HourFormate";
import { tableRawData } from "@/data/rawData";

const EnergyComparisonPage = () => {
  const [usageReportTimePeriod, setUsageReportTimePeriod] =
    useState("Yesterday");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [resData, setResData] = useState([]);
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
            <div className="w-full grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* area selector dropdown */}

              <div className="flex flex-col w-full items-start justify-start gap-1">
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
        <EnergyComparisonReport
          rawData={resData}
          intervalsObj={intervalsObj}
          newIntervalObj={NewIntervalsObj}
        />
      ) : null}
    </div>
  );
};

export default EnergyComparisonPage;
