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
  const [unit4Spindle, setUnit4Spindle] = useState("");
  const [unit5Spindle, setUnit5Spindle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState([]);
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
  // fetch unit 4 spindles
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
        setUnit4Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
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
        setUnit5Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (unit !== "" && startDate !== "" && endDate !== "") {
      fetchU4Spindles();
      fetchU5Spindles();
    }
  }, [unit4, unit5, startDate, endDate]);
  // getting energy usage report
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!unit || startDate.length === 0 || endDate.length === 0) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (unit === "Unit_4" && unit4Spindle === 0) {
      setErrorMessage("Add Unit 4 spindles first in Spindle Production Tab");
      return;
    }
    if (unit === "Unit_5" && unit5Spindle === 0) {
      setErrorMessage("Add Unit 5 spindles first in Spindle Production Tab");
      return;
    }

    if (unit === "ALL") {
      if (unit4Spindle === 0 && unit5Spindle === 0) {
        setErrorMessage(
          "Add Unit 4 and Unit 5 spindles first in Spindle Production Tab"
        );
        return;
      } else if (unit4Spindle === 0) {
        setErrorMessage("Add Unit 4 spindles first in Spindle Production Tab");
        return;
      } else if (unit5Spindle === 0) {
        setErrorMessage("Add Unit 5 spindles first in Spindle Production Tab");
        return;
      }
    }
    setLoading(true);
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
            suffixes: ["Del_ActiveEnergy"],
            area: unit,
          }),
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        setResData(resResult);
      }
    } catch (error) {
      console.error(error.message);
    }

    setShowResults(true);
    setLoading(false);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      {!showResults && errorMessage.length !== 0 && (
        <div className="flex relative md:absolute top-0 right-0 bg-[#D40000] text-[14.22px] items-center gap-3 px-5 py-1.5 rounded rounded-t-md md:rounded-tr-md text-white">
          <RiErrorWarningFill size={23} />
          {errorMessage}
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
              setUnit4Spindle("");
              setUnit5Spindle("");
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
              {/* area slector dropdown */}
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
              {/* spindle field field */}
              <div className="w-full flex items-center justify-between">
                {unit === "Unit_4" ? (
                  <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                    <label
                      htmlFor="unit4Spindels"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      No. of Spindles Unit 4
                    </label>
                    <input
                      type="number"
                      value={unit4Spindle}
                      id="rates"
                      name="rates"
                      readOnly
                      onChange={(e) => setUnit4Spindle(e.target.value)}
                      placeholder="00"
                      className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                    />
                  </div>
                ) : unit === "Unit_5" ? (
                  <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                    <label
                      htmlFor="unit4Spindels"
                      className="text-[13.51px] font-500 font-inter"
                    >
                      No. of Spindles Unit 5
                    </label>
                    <input
                      type="number"
                      value={unit5Spindle}
                      id="rates"
                      name="rates"
                      readOnly
                      onChange={(e) => setUnit5Spindle(e.target.value)}
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
                        No. of Spindles Unit 4
                      </label>
                      <input
                        type="number"
                        value={unit4Spindle}
                        id="rates"
                        name="rates"
                        readOnly
                        onChange={(e) => setUnit4Spindle(e.target.value)}
                        placeholder="00"
                        className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-[46%] items-start justify-start gap-1">
                      <label
                        htmlFor="unit4Spindels"
                        className="text-[13.51px] font-500 font-inter"
                      >
                        No. of Spindles Unit 5
                      </label>
                      <input
                        type="number"
                        value={unit5Spindle}
                        id="rates"
                        name="rates"
                        readOnly
                        onChange={(e) => setUnit5Spindle(e.target.value)}
                        placeholder="00"
                        className="w-full outline-none border-1 border-gray-300 dark:border-gray-500 rounded px-3 py-1"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
              <button
                type="submit"
                className="bg-[#1A68B2]  cursor-pointer text-white px-4 py-1 rounded flex items-center justify-center gap-2"
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
      ) : showResults && (unit === "Unit_4" || unit === "Unit_5") ? (
        <SingleUnitComponent
          unit={unit}
          startDate={startDate}
          endDate={endDate}
          unit4Spindle={unit4Spindle}
          unit5Spindle={unit5Spindle}
          resData={resData}
        />
      ) : showResults && unit === "ALL" ? (
        <MultipleUnitComponent
          unit={unit}
          unit4Spindle={unit4Spindle}
          unit5Spindle={unit5Spindle}
          startDate={startDate}
          endDate={endDate}
          resData={resData}
        />
      ) : null}
    </div>
  );
};

export default FilterPage;
