"use client";
import React from "react";

/**
 * Reusable Production Table
 * @param {Array} days - Array of date strings (e.g. ["1/11/2025", "2/11/2025"])
 * @param {Object} data - Object of formatted production data keyed by date-unit
 * @param {Array} rows - Array of row labels like [{label:'Production', key:'production'}]
 * @param {number} chunkSize - Number of columns per row group
 * @param {number} month - Selected month (0–11)
 * @param {Function} setMonth - Setter for month
 * @param {String} unit - Unit name e.g. "U4"
 */
export default function ProductionTable({
  days = [],
  data = {},
  rows = [],
  chunkSize = 15,
  month,
  setMonth,
  unit = "",
}) {
  const today = new Date();

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };

  const getValueByDate = (dateStr, type) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const entry = data[`${dateStr}-${unit}`] || {};
    const value = entry[type] ?? 0;
    if (dateObj > today && value === 0) return "";
    return value !== 0 ? value : "-";
  };

  const dayChunks = chunkArray(days, chunkSize);
  const slotWidth = `${100 / (chunkSize + 1)}%`;

  return (
    <div className="relative w-full  border border-[#025697]">
      {/* Month selector */}
      <div className="absolute mb-4 top-1 left-3 flex items-center gap-2">
        <label className="text-[12px]">Month:</label>
        <select
          value={month + 1}
          onChange={(e) => setMonth(Number.parseInt(e.target.value) - 1)}
          className="border p-1 rounded-sm shadow text-[12px] w-[95px] outline-none font-400"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div className="w-full flex items-center justify-center mt-5">
        <h2
          className="text-white capitalize bg-[#025697] px-10 py-1.5 text-[13px] md:text-[17.62px] font-inter font-500"
          style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)" }}
        >
          History of daily production
        </h2>
      </div>

      {/* Rows */}
      {dayChunks.map((chunk, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-6 px-4 w-full flex flex-col overflow-hidden"
        >
          {/* Date Row */}
          <div className="flex w-full items-center  text-center">
            <div
              style={{ width: slotWidth }}
              className="flex-shrink-0 border h-[28px] border-y-[#025697] border-l-[#025697] border-r-white py-1 bg-[#E5F3FD] dark:bg-gray-600 text-[10px] md:text-[12px] font-medium"
            >
              Date
            </div>
            {chunk.map((dateStr, index) => (
              <div
                key={dateStr}
                className={`flex-shrink-0 border h-[28px] border-y-[#025697] ${
                  index === chunk.length - 1
                    ? "border-r-[#025697]"
                    : "border-r-white"
                } py-1 bg-[#E5F3FD] dark:bg-gray-600 text-[12px] font-medium`}
                style={{ width: slotWidth }}
              >
                {dateStr}
              </div>
            ))}
          </div>

          {/* Dynamic data rows */}
          {rows.map((row) => (
            <div key={row.key} className="flex w-full items-center text-center">
              <div
                style={{ width: slotWidth }}
                className="flex-shrink-0 font-semibold h-[40px] border-[#025697] border-t-transparent py-4 border text-[12px]"
              >
                {row.label}
              </div>
              {chunk.map((dateStr) => (
                <div
                  key={dateStr + row.key}
                  className="flex-shrink-0 border py-4 h-[40px] border-r-[#025697] border-b-[#025697] border-t-transparent text-[12px]"
                  style={{ width: slotWidth }}
                >
                  {getValueByDate(dateStr, row.key)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
