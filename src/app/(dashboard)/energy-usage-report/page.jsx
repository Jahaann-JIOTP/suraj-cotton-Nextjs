"use client";

import MultipleUnitComponent from "@/components/reportsComponent/MultipleUnitComponent/MultipleUnitComponent";
import SingleUnitComponent from "@/components/reportsComponent/SingleUnitComponent/SingleUnitComponent";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";

const FilterPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("2025-06-11");
  const [endDate, setEndDate] = useState("2025-06-18");
  const [unit4Spindle, setUnit4Spindle] = useState("12");
  const [unit5Spindle, setUnit5Spindle] = useState("12");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false); // ← controls form vs results
  const [loading, setLoading] = useState(false);
  const spindles = Number(unit4Spindle) + Number(unit5Spindle);
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

  useEffect(() => {
    if (unit === "Unit_4" && unit4Spindle.length === 0) {
      setErrorMessage("Add Unit 4 spindles first in Spindle Production Tab");
    } else if (unit === "Unit_5" && unit5Spindle.length === 0) {
      setErrorMessage("Add Unit 5 spindles first in Spindle Production Tab");
    } else if (unit === "ALL") {
      if (unit4Spindle.length === 0 && unit5Spindle.length === 0) {
        setErrorMessage(
          "Add Unit 4 and Unit 5 spindles first in Spindle Production Tab"
        );
      } else if (unit4Spindle.length === 0) {
        setErrorMessage("Add Unit 4 spindles first in Spindle Production Tab");
      } else if (unit5Spindle.length === 0) {
        setErrorMessage("Add Unit 5 spindles first in Spindle Production Tab");
      } else {
        setErrorMessage("");
      }
    } else {
      setErrorMessage(""); // Clear if no condition matches
    }
  }, [unit, unit4Spindle, unit5Spindle]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!unit || startDate.length === 0 || endDate.length === 0) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (unit === "Unit_4" && unit4Spindle.length === 0) {
      toast.warning("Please enter spindles for Unit 4.");
      return;
    }

    if (unit === "Unit_5" && unit5Spindle.length === 0) {
      toast.warning("Please enter spindles for Unit 5.");
      return;
    }

    if (unit === "ALL") {
      if (unit4Spindle.length === 0 && unit5Spindle.length === 0) {
        toast.warning("Please enter spindles for both Unit 4 and Unit 5.");
        return;
      } else if (unit4Spindle.length === 0) {
        toast.warning("Please enter spindles for Unit 4.");
        return;
      } else if (unit5Spindle.length === 0) {
        toast.warning("Please enter spindles for Unit 5.");
        return;
      }
    }
    setLoading(true);

    setShowResults(true); // Switch to result view
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
          Energy Cost Report
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
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
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
                      required={true}
                      onChange={(e) => setUnit4Spindle(e.target.value)}
                      placeholder="05"
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
                      required={true}
                      onChange={(e) => setUnit5Spindle(e.target.value)}
                      placeholder="05"
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
                        required={true}
                        onChange={(e) => setUnit4Spindle(e.target.value)}
                        placeholder="05"
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
                        required={true}
                        onChange={(e) => setUnit5Spindle(e.target.value)}
                        placeholder="05"
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
      ) : showResults && (unit === "Unit_4" || unit === "Unit_5") ? (
        <SingleUnitComponent
          unit={unit}
          startDate={startDate}
          endDate={endDate}
          spindles={spindles}
        />
      ) : showResults && unit === "ALL" ? (
        <MultipleUnitComponent
          unit={unit}
          startDate={startDate}
          endDate={endDate}
          spindles={spindles}
        />
      ) : null}
    </div>
  );
};

export default FilterPage;
