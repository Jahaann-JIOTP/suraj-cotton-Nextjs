"use client";

import config from "@/constant/apiRouteList";
import React, { useEffect, useState } from "react";

const ProductionBlocks = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [GetProductionData, setGetProductionData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [chunkSize, setChunkSize] = useState(15);
  const [productionData, setProductionData] = useState({
    unit: "",
    startDate: "",
    values: [],
  });

  useEffect(() => {
    generateDaysOfMonth(year, month);
  }, [month, year]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductionData((prev) => {
      if (name === "values") {
        const numericValue = parseFloat(value);
        return {
          ...prev,
          values: !isNaN(numericValue) ? [numericValue] : [],
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/production`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productionData),
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        await fetchSpindleProduction(); // ✅ Refresh data right after submission
      }
    } catch (error) {
      console.error(error);
    }
  };

  // //////////////////////
  const fetchSpindleProduction = async () => {
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/production-monthwise?month=${year}-${
          month + 1 < 10 ? "0" : ""
        }${month + 1}`
      );
      const resResult = await response.json();

      if (response.ok) {
        const formatDate = (isoDate) => {
          const date = new Date(isoDate);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          return `${day}/${month}/${year}`; // e.g., 30/6/2025
        };

        const grouped = {};

        // Group by formatted date and unit
        resResult.data.forEach((item) => {
          const formattedDate = formatDate(item.date);
          const key = `${formattedDate}-${item.unit}`;

          if (!grouped[key]) {
            grouped[key] = 0;
          }

          grouped[key] += item.value; // Sum values if duplicates
        });

        setGetProductionData(grouped); // Save in grouped format
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // //////////////////////

  const generateDaysOfMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    const datesArray = [];
    for (let i = 1; i <= days; i++) {
      // const dayStr = i.toString().padStart(2, "0");
      const dayStr = i.toString();
      // const monthStr = (month + 1).toString().padStart(2, "0");
      const monthStr = (month + 1).toString();
      datesArray.push(`${dayStr}/${monthStr}/${year}`);
    }
    setDaysInMonth(datesArray);
  };

  const getProductionByDate = (dateStr) => {
    const today = new Date();
    const [day, month, year] = dateStr.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (dateObj > today) return " ";

    const unit4 = GetProductionData[`${dateStr}-U4`] || 0;
    const unit5 = GetProductionData[`${dateStr}-U5`] || 0;

    // ✅ Only show according to selected unit
    if (productionData.unit === "U4") return unit4 !== 0 ? unit4 : "-";
    if (productionData.unit === "U5") return unit5 !== 0 ? unit5 : "-";

    // If no unit selected, show both if present
    if (unit4 === 0 && unit5 === 0) return "-";

    return (
      <div className="flex flex-col text-[11px] leading-[13px]">
        {unit4 !== 0 && <span>U4: {unit4}</span>}
        {unit5 !== 0 && <span>U5: {unit5}</span>}
      </div>
    );
  };

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // const dayChunks = chunkArray(daysInMonth, 15);
  const getChunkSize = (width) => {
    if (width >= 1400) return 15;
    if (width >= 1300) return 15;
    if (width >= 1200) return 12;
    if (width >= 992) return 10;
    if (width >= 768) return 8;
    if (width >= 576) return 6;
    if (width >= 400) return 3;
    if (width >= 340) return 2;
    return 4;
  };
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newSize = getChunkSize(width);
      setChunkSize(newSize);
    };

    // Set initial chunk size
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const dayChunks = chunkArray(daysInMonth, chunkSize);
  const slotWidth = `${100 / (chunkSize + 1)}%`;
  useEffect(() => {
    fetchSpindleProduction();
  }, [month, year]);
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-[81vh] rounded-md border-t-3 overflow-x-auto border-[#1F5897] px-4 py-2">
      <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
        Spindle Production
      </h1>
      <div className="w-full flex items-center justify-center">
        <div className="w-full md:w-[80%] lg:w-[50%] flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col items-center mt-10 justify-center">
              <h3 className="font-inter text-[16px] pt-2 text-black dark:text-white font-500">
                Select Plant Units
              </h3>

              <div className="flex gap-15">
                <label
                  htmlFor="unit4"
                  className="font-inter text-[15px] cursor-pointer pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input
                    type="radio"
                    id="unit4"
                    onChange={handleChange}
                    name="unit"
                    value="U4"
                  />
                  Unit 4
                </label>
                <label
                  htmlFor="unit5"
                  className="font-inter text-[15px] pt-5 cursor-pointer text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input
                    type="radio"
                    id="unit5"
                    name="unit"
                    onChange={handleChange}
                    value="U5"
                  />
                  Unit 5
                </label>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="selectDate"
                  className="font-inter text-[15px] pt-5 text-black  dark:text-white font-500"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={handleChange}
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                  value={productionData.startDate}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="production"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500"
                >
                  Enter Production
                </label>
                <input
                  type="number"
                  id="values"
                  name="values"
                  onChange={handleChange}
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                  value={productionData.values}
                />
              </div>
              <button
                type="submit"
                className="bg-[#1F5897] cursor-pointer text-white w-[6rem] py-1.5 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={month + 1}
          onChange={(e) => setMonth(parseInt(e.target.value) - 1)}
          className="border p-2 text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border p-2 text-sm"
        >
          {Array.from({ length: 5 }, (_, i) => year - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Slot Rows */}
      <div className=" border-1 border-[#025697] px-3">
        <div className="w-full flex items-center justify-center">
          <h2
            className="text-white bg-[#025697] px-10 py-1.5 text-[17.62px] font-inter font-500"
            style={{
              clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
            }}
          >
            History of daily production
          </h2>
        </div>
        {dayChunks.map((chunk, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="mb-6 w-full flex flex-col overflow-hidden"
            >
              {/* Date Row */}
              <div className="flex  w-full items-center text-center">
                <div
                  style={{ width: slotWidth }}
                  className="flex-shrink-0 border-1 h-[28px] border-[#025697] border-r-white py-1 bg-[#E5F3FD] text-[10px] md:text-[12px] font-medium"
                >
                  Date
                </div>
                {chunk.map((dateStr, index) => {
                  return (
                    <div
                      key={dateStr}
                      className={`flex-shrink-0 border-1 h-[28px] border-y-[#025697] ${
                        index === chunk.length - 1
                          ? "border-r-[#025697]"
                          : "border-r-white"
                      } py-1 bg-[#E5F3FD] text-[12px] font-medium`}
                      style={{ width: slotWidth }}
                    >
                      {dateStr}
                    </div>
                  );
                })}
              </div>

              {/* Production Row */}
              <div className="flex w-full items-center text-center">
                <div
                  style={{ width: slotWidth }}
                  className="flex-shrink-0 font-semibold h-[53px] border-[#025697] border-t-transparent py-4  border text-[12px]"
                >
                  Production
                </div>
                {chunk.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex-shrink-0 border py-4 h-[53px] border-r-[#025697] border-b-[#025697] border-t-transparent text-[12px]"
                    style={{ width: slotWidth }}
                  >
                    {getProductionByDate(dateStr)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProductionBlocks;
