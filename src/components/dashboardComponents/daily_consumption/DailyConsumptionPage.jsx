"use client";
import React, { useEffect, useRef, useState } from "react";
import DailyConsumptionTimePeriod from "../timePeriodSelector/DailyConsumptionTimePeriod";
import { HiChevronDown } from "react-icons/hi2";
import Card from "./cards";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

const options = [
  { label: "BLOW", value: "BLOW" },
  { label: "CARD", value: "CARD" },
  { label: "COMBER", value: "COMBER" },
  { label: "UNI", value: "UNI" },
  { label: "DRAWING", value: "DRAWING" },
  { label: "DRAWING", value: "DRAWING" },
  { label: "SPEED", value: "SPEED" },
  { label: "RING", value: "RING" },
];

const ITEMS_PER_PAGE = 8;

const DailyConsumptionPage = ({ pageTitle, data,actualData }) => {
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("today");
  const [isOpenDptDropdonw, setIsOpenDptDropdonw] = useState(false);
  const [selectDpt, setSelectDpt] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const dropdownRef = useRef(null);
  console.log(selectDpt)
  
  const metersData = actualData.meters??[]
 

  // --- Pagination ---
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  return (
    <div>
      {/* Header */}
      <div
        className={`flex items-start xl:items-center justify-between flex-col xl:flex-row`}
      >
        <h1 className="font-inter text-[20px] font-600">
          Daily Consumption-
          <span className=" text-[#025697] font-inter">{pageTitle}</span>
        </h1>
        <div className="flex w-full items-center flex-col lg:flex-row gap-5">
          {/* Dropdown */}
          <div className="flex flex-col gap-2 md:flex-row">
            <div
              ref={dropdownRef}
              className="relative inline-block text-left md:w-auto"
            >
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[15.49px] font-raleway font-600">
                  Select Department:
                </span>
                <button
                  onClick={() => setIsOpenDptDropdonw(!isOpenDptDropdonw)}
                  className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
                  style={{ width: "7rem" }}
                >
                  {uniqueDepartments.find((o) => o === selectDpt)}
                  <HiChevronDown
                    className={`transition-transform ${
                      isOpenDptDropdonw ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {isOpenDptDropdonw && (
                <div className="absolute right-0 z-50 mt-1 w-35 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
                  <div className="py-1">
                    {uniqueDepartments.map((option) => {
                      return(
                        // <h1>{option.deptName}</h1>
                      <label
                        key={option}
                        className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <input
                          type="radio"
                          name="theme"
                          value={option}
                          checked={selectDpt === option}
                          onChange={() => {
                            setSelectDpt(option);
                            setIsOpenDptDropdonw(false);
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    )})}
                  </div>
                </div>
              )}
            </div>

            {/* Time Period Selector */}
            <DailyConsumptionTimePeriod
              selected={dashboardTimePeriod}
              setSelected={setDashboardTimePeriod}
            />
          </div>

          {/* Custom Date/Time Inputs */}
          {dashboardTimePeriod === "custom" && (
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
                    to
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
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
                    style={{ width: "6rem" }}
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
                    style={{ width: "6rem" }}
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

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {currentData.map((meter, index) => (
          <Card
            key={meter.title + index}
            title={meter.title}
            machines={meter.machines}
            loadConnected={meter.loadConnected}
            consumption={meter.consumption}
            averagePower={meter.averagePower}
            averagePowerFactor={meter.averagePowerFactor}
            averageVoltage={meter.averageVoltage}
          />
        ))}
      </div>

      {/* Pagination Controls */}
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        ))}

        {/* Next */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded ${
            currentPage === totalPages ? "cursor-default" : "cursor-pointer"
          } bg-gray-200 dark:bg-gray-600 disabled:opacity-50`}
        >
          <MdOutlineChevronRight />
        </button>
      </div>
    </div>
  );
};

export default DailyConsumptionPage;
