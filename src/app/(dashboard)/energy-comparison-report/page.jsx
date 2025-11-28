"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import { getDateRangeFromString } from "@/utils/dateRangeForReports";
import DatePicker from "react-datepicker";
import { to12HourFormat } from "@/utils/To12HourFormate";
import { tableRawData, tableRawData2 } from "@/data/rawData";
import { IoChevronDownOutline } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import EnergyComparisonReport from "@/components/reportsComponent/energyComparisonTable/EnergyComparisonReport";
import { FaRegCalendarAlt } from "react-icons/fa";

const intervalOptions = [
  {
    id: 0,
    label: "Today Over Yesterday",
    value: "Today",
  },
  {
    id: 2,
    label: "This Week Over Previous Week",
    value: "This Week",
  },
  {
    id: 3,
    label: "This Month Over Previous Month",
    value: "This Month",
  },
  {
    id: 4,
    label: "Custom Range",
    value: "Custom Date",
  },
];

const UsageReport = () => {
  // const [usageReportTimePeriod] = useState("Custom Date");
  const [usageReportTimePeriod, setUsageReportTimePeriod] = useState("Today");
  const [isOpen, setIsOpen] = useState(false);
  const [intervalDropdown, setIntervalDropdown] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [unit, setUnit] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [timeIntervals, setTimeIntervals] = useState({
    p1startTime: "06:00",
    p1endTime: "06:00",
    p2startTime: "06:00",
    p2endTime: "06:00",
  });
  const [resData, setResData] = useState([]);
  const [resData2, setResData2] = useState([]);

  const period1Ref = useRef(null);
  const period2Ref = useRef(null);
  const dropdownRef = useRef(null);
  const intervalDropdownRef = useRef(null);
  const [period1, setPeriod1] = useState([null, null]); // [start, end]
  const [period2, setPeriod2] = useState([null, null]); // [start, end]

  const NewIntervalsObj = {
    "Selected Period": usageReportTimePeriod,
    "Start Date":
      startDate + (startTime ? " " + to12HourFormat(startTime) : ""),
    "End Date": endDate + (endTime ? " " + to12HourFormat(endTime) : ""),
    "Selected Timezone": "(UTC+05:00) Asia Karachi",
  };
  //========================handle date range selection========================
  const openPeriod1Calendar = () => {
    if (period1Ref.current) {
      period1Ref.current.setOpen(true);
    }
  };

  const openPeriod2Calendar = () => {
    if (period2Ref.current) {
      period2Ref.current.setOpen(true);
    }
  };
  // /=============================================================================
  const fixKarachiOffset = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(d.getHours()); // add 5 hours to prevent shifting backward
    return d;
  };

  const normalizeLocalDate = (date) => {
    if (!date) return null;
    const d = fixKarachiOffset(date);
    d.setHours(0, 0, 0, 0); // set midnight after offset fix
    return d;
  };
  const dateRanges = {
    period1: {
      start: normalizeLocalDate(period1[0]),
      end: normalizeLocalDate(period1[1]),
    },
    period2: {
      start: normalizeLocalDate(period2[0]),
      end: normalizeLocalDate(period2[1]),
    },
  };

  const toLocalISODate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [p2PreviewRange, setP2PreviewRange] = useState([]); // highlight days
  const isPeriod1Complete = period1[0] && period1[1];
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const generateNextDays = (start, totalDays) => {
    const arr = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  };

  const handlePeriod1Change = (dates) => {
    const [start, end] = dates.map((d) => normalizeLocalDate(d));

    if (start && end) {
      if (!isToday(start) && start.getTime() === end.getTime()) {
        Swal.fire({
          title: "Invalid Range",
          text: "You must select at least 2 days.",
          icon: "error",
        });
        return;
      }

      const days = calculateDays(start, end);
      Swal.fire({
        title: `${days} Day(s) Selected`,
        text: "Please select the same number of days in Period 2.",
        icon: "info",
      });
    }

    setPeriod1([start, end]);
  };

  const handlePeriod2Change = (dates) => {
    const [rawStart, rawEnd] = dates;

    const start = normalizeLocalDate(rawStart);
    const end = normalizeLocalDate(rawEnd);

    const [p1Start, p1End] = period1.map((d) => normalizeLocalDate(d));

    const p1Days = calculateDays(p1Start, p1End);

    if (start && !end && p1Days > 0) {
      setP2PreviewRange(generateNextDays(start, p1Days));
    } else {
      setP2PreviewRange([]);
    }

    if (start && end) {
      if (!isToday(start) && start.getTime() === end.getTime()) {
        Swal.fire({
          title: "Invalid Range",
          text: "You must select at least 2 days.",
          icon: "error",
        });
        return;
      }

      const p2Days = calculateDays(start, end);

      if (p2Days !== p1Days) {
        Swal.fire({
          title: "Invalid Date Range",
          text: `Period 2 must be exactly ${p1Days} day(s).`,
          icon: "error",
        });
        return;
      }
    }

    setPeriod2([start, end]);
  };

  //========================handle period changes based on preset time period========================
  useEffect(() => {
    const now = new Date();

    const setToday = () => {
      const today = normalizeLocalDate(now);
      const yesterday = normalizeLocalDate(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      );

      setPeriod1([today, today]);
      setPeriod2([yesterday, today]);
    };

    const setThisWeek = () => {
      const today = normalizeLocalDate(now);

      const currentDay = now.getDay(); // 0=Sun, 1=Mon...
      const mondayThisWeek = normalizeLocalDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
        )
      );

      const mondayPrevWeek = normalizeLocalDate(
        new Date(
          mondayThisWeek.getFullYear(),
          mondayThisWeek.getMonth(),
          mondayThisWeek.getDate() - 7
        )
      );

      const sameDayPrevWeek = normalizeLocalDate(
        new Date(
          mondayPrevWeek.getFullYear(),
          mondayPrevWeek.getMonth(),
          mondayPrevWeek.getDate() + (now.getDate() - mondayThisWeek.getDate())
        )
      );

      setPeriod1([mondayThisWeek, today]);
      setPeriod2([mondayPrevWeek, sameDayPrevWeek]);
    };

    const setThisMonth = () => {
      const today = normalizeLocalDate(now);

      const firstThisMonth = normalizeLocalDate(
        new Date(now.getFullYear(), now.getMonth(), 1)
      );
      const firstPrevMonth = normalizeLocalDate(
        new Date(now.getFullYear(), now.getMonth() - 1, 1)
      );

      const sameDatePrevMonth = normalizeLocalDate(
        new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      );

      setPeriod1([firstThisMonth, today]);
      setPeriod2([firstPrevMonth, sameDatePrevMonth]);
    };

    if (usageReportTimePeriod === "Today") {
      setToday();
    } else if (usageReportTimePeriod === "This Week") {
      setThisWeek();
    } else if (usageReportTimePeriod === "This Month") {
      setThisMonth();
    }
    // Custom Date → DO NOTHING
  }, [usageReportTimePeriod]);

  //============================handle time change=========================
  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const currentTime = formatCurrentTime();

    let p1Start = "06:00";
    let p1End = "06:00";
    let p2Start = "06:00";
    let p2End = "06:00";

    // ----- PERIOD 1 -----
    if (period1[0] && period1[1]) {
      const sameDay =
        period1[0].getFullYear() === period1[1].getFullYear() &&
        period1[0].getMonth() === period1[1].getMonth() &&
        period1[0].getDate() === period1[1].getDate();

      if (sameDay) {
        p1Start = "06:00";
        p1End = currentTime;
      }
    }

    // ----- PERIOD 2 -----
    if (period2[0] && period2[1]) {
      const sameDay =
        period2[0].getFullYear() === period2[1].getFullYear() &&
        period2[0].getMonth() === period2[1].getMonth() &&
        period2[0].getDate() === period2[1].getDate();

      if (sameDay) {
        p2Start = "06:00";
        p2End = currentTime;
      }
    }

    setTimeIntervals({
      p1startTime: p1Start,
      p1endTime: p1End,
      p2startTime: p2Start,
      p2endTime: p2End,
    });
  }, [period1, period2]);
  // /=============================================================================

  //==================handle unit change===================
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

  // ///////===============================Handle all data processing start=================================

  const intervalObj = {
    Range: { p1: "Range 1", p2: "Range 2" },
    "Start Date": {
      p1: toLocalISODate(dateRanges.period1.start),
      p2: toLocalISODate(dateRanges.period2.start),
    },
    "End Date": {
      p1: toLocalISODate(dateRanges.period1.end),
      p2: toLocalISODate(dateRanges.period2.end),
    },
  };
  const HTside1 = resData?.HTside || {};
  const HTside2 = resData2?.HTside || {};
  // fomate ht side function
  function mergeHTSideData(ht1, ht2) {
    const finalObj = {
      Period: {
        p1: "Range 1",
        p2: "Range 2",
      },
    };
    Object.keys(ht1).forEach((key) => {
      finalObj[key] = {
        p1: ht1[key],
        p2: ht2[key],
      };
    });
    return finalObj;
  }
  const mergedHTSideFinalData = mergeHTSideData(HTside1, HTside2);
  // ///////////////losses summary data ////////////////////
  const lossesSummary1 = resData?.lossesSummary || {};
  const lossesSummary2 = resData2?.lossesSummary || {};
  function mergeLossesObjects(loss1, loss2) {
    const deltaKey = "Δ Generation / Consumption";

    const mergedSummary = {
      Period: { p1: "Range 1", p2: "Range 2" },
    };

    Object.keys(loss1).forEach((key) => {
      // Skip delta key here
      if (key !== deltaKey) {
        mergedSummary[key] = {
          p1: loss1[key],
          p2: loss2[key],
        };
      }
    });

    // delta-only object
    const deltaOnly = {
      [deltaKey]: {
        p1: loss1[deltaKey],
        p2: loss2[deltaKey],
      },
    };

    return { mergedSummary, deltaOnly };
  }

  const { mergedSummary, deltaOnly } = mergeLossesObjects(
    lossesSummary1,
    lossesSummary2
  );

  // low voltage side summary
  const lowVoltageSideSummary1 = Array.isArray(resData?.dailyConsumption)
    ? resData.dailyConsumption
    : [];
  const lowVoltageSideSummary2 = Array.isArray(resData2?.dailyConsumption)
    ? resData2.dailyConsumption
    : [];
  function mergeLowVoltageData(arr1, arr2) {
    const map = new Map();

    // Insert P1 values
    arr1.forEach((item) => {
      map.set(item.Unit, { unit: item.Unit });

      Object.keys(item).forEach((key) => {
        if (key !== "Unit") {
          if (!map.get(item.Unit)[key]) {
            map.get(item.Unit)[key] = {};
          }
          map.get(item.Unit)[key].p1 = item[key];
        }
      });
    });

    // Insert P2 values
    arr2.forEach((item) => {
      if (!map.has(item.Unit)) {
        map.set(item.Unit, { unit: item.Unit });
      }

      Object.keys(item).forEach((key) => {
        if (key !== "Unit") {
          if (!map.get(item.Unit)[key]) {
            map.get(item.Unit)[key] = {};
          }
          map.get(item.Unit)[key].p2 = item[key];
        }
      });
    });

    // Convert map to array
    return Array.from(map.values());
  }

  const merged = mergeLowVoltageData(
    lowVoltageSideSummary1,
    lowVoltageSideSummary2
  );
  //  total row
  const { totalIcg, totalConsumptionValue, UnaccountedEnergyTotal } =
    merged.reduce(
      (
        acc,
        { Total_I_C_G = {}, Total_Consumption = {}, Unaccounted_Energy = {} }
      ) => {
        acc.totalIcg.p1 += Number(Total_I_C_G.p1) || 0;
        acc.totalIcg.p2 += Number(Total_I_C_G.p2) || 0;

        acc.totalConsumptionValue.p1 += Number(Total_Consumption.p1) || 0;
        acc.totalConsumptionValue.p2 += Number(Total_Consumption.p2) || 0;

        acc.UnaccountedEnergyTotal.p1 += Number(Unaccounted_Energy.p1) || 0;
        acc.UnaccountedEnergyTotal.p2 += Number(Unaccounted_Energy.p2) || 0;

        return acc;
      },
      {
        totalIcg: { p1: 0, p2: 0 },
        totalConsumptionValue: { p1: 0, p2: 0 },
        UnaccountedEnergyTotal: { p1: 0, p2: 0 },
      }
    );
  const totalRowLowvoltageSummary = {
    totalIcg,
    totalConsumptionValue,
    UnaccountedEnergyTotal,
  };
  // Utilization data mapping
  const utilization1 = Array.isArray(resData?.utilization)
    ? resData.utilization
    : [];
  const utilization2 = Array.isArray(resData2?.utilization)
    ? resData2.utilization
    : [];
  function mergeUtilization(arr1, arr2) {
    const map = new Map();

    // Insert P1 values
    arr1.forEach((item) => {
      map.set(item.Unit, { unit: item.Unit });

      Object.keys(item).forEach((key) => {
        if (key !== "Unit") {
          if (!map.get(item.Unit)[key]) {
            map.get(item.Unit)[key] = {};
          }
          map.get(item.Unit)[key].p1 = item[key];
        }
      });
    });

    // Insert P2 values
    arr2.forEach((item) => {
      if (!map.has(item.Unit)) {
        map.set(item.Unit, { unit: item.Unit });
      }

      Object.keys(item).forEach((key) => {
        if (key !== "Unit") {
          if (!map.get(item.Unit)[key]) {
            map.get(item.Unit)[key] = {};
          }
          map.get(item.Unit)[key].p2 = item[key];
        }
      });
    });

    // Convert map to array
    return Array.from(map.values());
  }

  const mergedUtilization = mergeUtilization(utilization1, utilization2);
  // merge production summary
  const productionSummary1 = Array.isArray(resData?.productionSummary)
    ? resData.productionSummary
    : [];
  const productionSummary2 = Array.isArray(resData2?.productionSummary)
    ? resData2.productionSummary
    : [];

  const mergedProduction = mergeUtilization(
    productionSummary1,
    productionSummary2
  );

  console.log("productionSummary1", mergedProduction);

  // ///////===============================Handle all data processing end=================================

  //  handle minimum end time
  // ===============handle submit of first range=====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.ENERGY_COMPARISON}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: toLocalISODate(dateRanges.period1.start),
            end_date: toLocalISODate(dateRanges.period1.end),
            start_time: timeIntervals.p1startTime,
            end_time: timeIntervals.p1endTime,
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
  // =========================handle submit of second range=====================
  const handleSubmit2 = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.ENERGY_COMPARISON}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: toLocalISODate(dateRanges.period2.start),
            end_date: toLocalISODate(dateRanges.period2.end),
            start_time: timeIntervals.p2startTime,
            end_time: timeIntervals.p2endTime,
            suffixes: ["Del_ActiveEnergy"],
            area: unit,
          }),
        }
      );

      if (response.ok) {
        const resResult = await response.json();
        setResData2(resResult);
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
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!unit) {
      toast.warning("Please Select Plant Unit.");
      return;
    }
    handleSubmit(e);
    handleSubmit2(e);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Energy Comparison Report
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
          <form onSubmit={handleFinalSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="grid grid-cols-2 gap-8">
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

              {/* Period 1 */}
              <div className="">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  First Range
                </span>

                <div
                  className="flex items-center justify-between px-4 w-full border rounded cursor-pointer"
                  onClick={openPeriod1Calendar}
                >
                  <DatePicker
                    ref={period1Ref}
                    selectsRange
                    startDate={period1[0]}
                    endDate={period1[1]}
                    onChange={handlePeriod1Change}
                    disabled={usageReportTimePeriod !== "Custom Date"}
                    className="w-full flex  py-2 rounded-md text-sm outline-none cursor-pointer"
                    placeholderText="Select date range"
                    onClick={(e) => e.stopPropagation()} // prevent recursion
                  />

                  <FaRegCalendarAlt className="pointer-events-none" />
                </div>
              </div>

              {/* Period 2 */}
              <div className="">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Second Range
                </span>

                <div
                  className="flex items-center justify-between px-4 w-full border rounded cursor-pointer"
                  onClick={openPeriod2Calendar}
                >
                  <DatePicker
                    ref={period2Ref}
                    selectsRange
                    startDate={period2[0]}
                    endDate={period2[1]}
                    onChange={handlePeriod2Change}
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom":
                          p2PreviewRange,
                      },
                    ]}
                    disabled={
                      !isPeriod1Complete ||
                      usageReportTimePeriod !== "Custom Date"
                    }
                    className="w-full py-2 rounded-md text-sm outline-none cursor-pointer"
                    placeholderText={
                      !isPeriod1Complete
                        ? "Select Period 1 first"
                        : "Select matching date range"
                    }
                    onClick={(e) => e.stopPropagation()}
                  />

                  <FaRegCalendarAlt className="pointer-events-none" />
                </div>
              </div>
            </div>
            {/* // here code will be pasted */}

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
          rawData={tableRawData}
          rawData2={tableRawData2}
          intervalObj={intervalObj}
          htSideData={mergedHTSideFinalData}
          lowVoltageSide={merged}
          lowVoltageTotla={totalRowLowvoltageSummary}
          utilizationData={mergedUtilization}
          mergedProduction={mergedProduction}
          unit={unit}
          mergedSummary={mergedSummary}
          deltaOnly={deltaOnly}
        />
      ) : null}
    </div>
  );
};
export default UsageReport;
