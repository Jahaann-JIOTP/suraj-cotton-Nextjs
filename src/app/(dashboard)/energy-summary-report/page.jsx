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
  console.log(tarifData);

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
    console.log(tarifData);
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

              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
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
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              {/* end date selector */}
              <div className="flex flex-col w-full md:w-[30%] items-start justify-start gap-1">
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
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
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
              <div className="flex flex-col w-full md:w-[29%] lg:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="startDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  WAPDA 1
                </label>
                <input
                  type="number"
                  value={tarifData.wapda1}
                  id="wapda1"
                  name="wapda1"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
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
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
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
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  JMS 1
                </label>
                <input
                  type="number"
                  value={tarifData.jms}
                  id="jms"
                  name="jms"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  GG
                </label>
                <input
                  type="number"
                  value={tarifData.gg}
                  id="gg"
                  name="gg"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  DG
                </label>
                <input
                  type="number"
                  value={tarifData.dg}
                  id="dg"
                  name="dg"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  Solar 1
                </label>
                <input
                  type="number"
                  value={tarifData.solar1}
                  id="solar1"
                  name="solar1"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
              </div>
              <div className="flex flex-col w-full md:w-[32%] items-start justify-start gap-1">
                <label
                  htmlFor="endDate"
                  className="text-[13.51px] font-500 font-inter"
                >
                  Solar 2
                </label>
                <input
                  type="number"
                  value={tarifData.solar2}
                  id="solar2"
                  name="solar2"
                  required={true}
                  placeholder="00"
                  onChange={(e) => setTarifData(e.target.value)}
                  className="w-full lg:w-[80%] outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                />
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
