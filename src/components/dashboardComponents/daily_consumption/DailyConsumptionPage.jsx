"use client";
import React, { useEffect, useRef, useState } from "react";
import DailyConsumptionTimePeriod from "../timePeriodSelector/DailyConsumptionTimePeriod";
import { HiChevronDown } from "react-icons/hi2";
import Card from "./cards";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";

const ITEMS_PER_PAGE = 8;

const DailyConsumptionPage = ({ pageTitle, data, loading, onRangeChange }) => {
  const [dailyConsumptionTimePeriod, setDailyConsumptionTimePeriod] =
    useState("today");
  const [isOpenDptDropdonw, setIsOpenDptDropdonw] = useState(false);
  const [selectDpt, setSelectDpt] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const today = new Date();
  const formateDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: formateDate(today),
    endDate: formateDate(today),
    startTime: "06:00",
    endTime: "06:00",
  });

  const dropdownRef = useRef(null);

  let startDate = null;
  let endDate = null;

  if (dailyConsumptionTimePeriod !== "custom") {
    ({ startDate, endDate } = getDateRangeFromString(
      dailyConsumptionTimePeriod
    ));
  }

  // 👉 build unified range
  const finalRange =
    dailyConsumptionTimePeriod === "custom"
      ? intervalPeriod
      : { startDate, endDate };

  const metersData = data.meters ?? [];

  // filter arra on the basis of dept
  const filteredData =
    selectDpt === "All"
      ? metersData
      : metersData.filter((dept) => dept.deptname === selectDpt);

  // get param name from tag
  const normalizeData = filteredData.map((item) => {
    const newObj = {};
    Object.entries(item).forEach(([key, value]) => {
      if (key.includes("_")) {
        const parts = key.split("_");
        if (parts.length > 2) {
          const newKey = parts.slice(2).join("_");
          newObj[newKey] = value;
        } else {
          newObj[key] = value;
        }
      } else {
        newObj[key] = value;
      }
    });
    return newObj;
  });

  // --- Pagination ---
  const totalPages = Math.ceil(normalizeData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = normalizeData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  // ---------handle input field change---------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntervalPeriod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // remove duplicate dept names
  const uniqueDepartments = Array.from(
    new Set(metersData?.map((item) => item.deptname))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenDptDropdonw(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    onRangeChange(finalRange);
  }, [dailyConsumptionTimePeriod, intervalPeriod, startDate, endDate]);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectDpt]);
  return (
    <div>
      {/* Header */}
      <div
        className={`flex items-center justify-between gap-2 flex-col 
    ${dailyConsumptionTimePeriod !== "custom" ? "md:flex-row" : "md:flex-col"}`}
      >
        <div className="w-full">
          <h1 className="font-inter text-[20px] font-600 flex flex-col md:flex-row">
            Daily Consumption-
            <span className=" text-[#025697] font-inter">{pageTitle}</span>
          </h1>
        </div>
        <div
          className={`flex w-full items-start xl:items-center flex-col lg:flex-row gap-5 ${
            dailyConsumptionTimePeriod === "custom"
              ? "justify-start"
              : "justify-end"
          }`}
        >
          {/* Dropdown */}
          <div className="flex items-start flex-col gap-3 md:flex-row">
            {/* select dept dropdown start */}
            <div
              ref={dropdownRef}
              className="relative inline-block text-left md:w-auto"
            >
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[13.22px] font-raleway font-600">
                  Select Department:
                </span>
                <button
                  onClick={() => setIsOpenDptDropdonw(!isOpenDptDropdonw)}
                  className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
                  style={{ width: "10rem" }}
                >
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      {selectDpt.replace(/_/g, " ")}
                      <HiChevronDown
                        className={`transition-transform ${
                          isOpenDptDropdonw ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>
              </div>

              {isOpenDptDropdonw && (
                <div className="absolute right-0 z-50 mt-1 w-[10rem] rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
                  <div className="py-1">
                    {["All", ...uniqueDepartments].map((option) => {
                      return (
                        <label
                          key={option}
                          className="text-[11.39px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <input
                            type="radio"
                            name="department"
                            value={option}
                            checked={selectDpt === option}
                            onChange={() => {
                              setSelectDpt(option);
                              setIsOpenDptDropdonw(false);
                            }}
                            className="mr-2"
                          />
                          {option.replace(/_/g, " ")}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Time Period Selector */}
            <DailyConsumptionTimePeriod
              selected={dailyConsumptionTimePeriod}
              setSelected={setDailyConsumptionTimePeriod}
            />
          </div>

          {/* Custom Date/Time Inputs */}
          {dailyConsumptionTimePeriod === "custom" && (
            <div className="flex items-start lg:items-center flex-col md:flex-row justify-center gap-5">
              <div className="flex items-start md:items-center flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startDate"
                    className="fonte-raleway font-600 text-[13.22px]"
                  >
                    Interval:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    style={{ width: "9rem" }}
                    className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                    onChange={handleChange}
                    value={intervalPeriod.startDate}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startDate"
                    className="fonte-raleway font-600 text-[13.22px]"
                  >
                    To
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    style={{ width: "9rem" }}
                    className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px] "
                    min={intervalPeriod.startDate}
                    onChange={handleChange}
                    value={intervalPeriod.endDate}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="startDate"
                    className="fonte-raleway font-600 text-[13.22px]"
                  >
                    Time:
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    style={{ width: "7.3rem" }}
                    className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                    min={intervalPeriod.startTime}
                    onChange={handleChange}
                    value={intervalPeriod.startTime}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startDate"
                    className="fonte-raleway font-600 text-[13.22px]"
                  >
                    To:
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    style={{ width: "7.3rem" }}
                    className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                    min={intervalPeriod.endTime}
                    onChange={handleChange}
                    value={intervalPeriod.endTime}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <CustomLoader />
      ) : currentData.length <= 0 ? (
        <div
          style={{ height: "60vh" }}
          className="flex w-full flex-col items-center justify-center flex-1 py-10"
        >
          <img
            src="/empty_cards.svg" // must be in /public
            alt="No data illustration"
            width={300}
            className="h-auto opacity-90 dark:opacity-80"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">
            No data available for the selected criteria.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {currentData.map((meter, index) => {
              return (
                <Card
                  key={meter.metername + index}
                  title={meter.metername}
                  machines={meter.MCS}
                  loadConnected={meter.installedLoad}
                  consumption={meter.energy_consumption}
                  averagePower={meter.avgPower}
                  averagePowerFactor={meter.avgPowerFactor}
                  averageVoltage={meter.avgVoltage}
                />
              );
            })}
          </div>
          {normalizeData.length > 8 && (
            <div className="flex justify-center items-center mt-6 gap-3">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                //   className={`px-3 py-1 ${currentPage === 1 ? "cursor-default" : "cursor-pointer"} rounded cursor-pointer bg-gray-200 dark:bg-gray-600 disabled:opacity-50`}
                className={`px-3 py-2 disabled:cursor-default !disabled:cursor-pointer rounded bg-gray-200 dark:bg-gray-600 disabled:opacity-50`}
              >
                <MdOutlineChevronLeft />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 cursor-pointer rounded ${
                      currentPage === page
                        ? "bg-[#025697] text-white font-semibold"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded ${
                  currentPage === totalPages
                    ? "cursor-default"
                    : "cursor-pointer"
                } bg-gray-200 dark:bg-gray-600 disabled:opacity-50`}
              >
                <MdOutlineChevronRight />
              </button>
            </div>
          )}
          {/* Pagination Controls */}
        </>
      )}
    </div>
  );
};

export default DailyConsumptionPage;
