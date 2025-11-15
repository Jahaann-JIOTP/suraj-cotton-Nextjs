"use client";
import React, { useEffect, useState } from "react";

export default function CombinedProduction({
  days = [],
  data = {},
  month,
  setMonth,
  title = "",
}) {
  const [chunkSize, setChunkSize] = useState(15);
  const today = new Date();

  // FIXED 5 ROWS
  const fixedRows = [
    { label: "U4 Production", unit: "U4", type: "production" },
    { label: "U4 Avg Count", unit: "U4", type: "avgcount" },
    { label: "U5 Production", unit: "U5", type: "production" },
    { label: "U5 Avg Count", unit: "U5", type: "avgcount" },
  ];

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };

  const getValueByDate = (dateStr, unit, type) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);

    const entry = data[`${dateStr}-${unit}`] || {};
    const value = entry[type] ?? 0;

    if (dateObj > today && value === 0) return "";
    return value !== 0 ? value : "-";
  };

  const getChunkSize = (width) => {
    if (width >= 1400) return 15;
    if (width >= 1200) return 12;
    if (width >= 992) return 10;
    if (width >= 768) return 8;
    if (width >= 576) return 6;
    if (width >= 400) return 3;
    if (width >= 340) return 2;
    return 4;
  };

  useEffect(() => {
    const handleResize = () => setChunkSize(getChunkSize(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dayChunks = chunkArray(days, chunkSize);
  const slotWidth = `${100 / (chunkSize + 1)}%`;

  return (
    <div className="relative w-full border border-[#025697]">
      {/* Month Selector */}
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
          {title}
        </h2>
      </div>

      {/* TABLE */}
      {dayChunks.map((chunk, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-6 px-4 w-full flex flex-col overflow-hidden"
        >
          {/* DATE ROW */}
          <div className="flex w-full items-center text-center">
            <div
              style={{ width: slotWidth }}
              className="flex-shrink-0 border h-[28px] border-y-[#025697] 
              border-l-[#025697] border-r-white py-1 bg-[#E5F3FD] 
              dark:bg-gray-600 text-[10px] md:text-[12px] font-medium"
            >
              Date
            </div>

            {chunk.map((dateStr, index) => (
              <div
                key={dateStr}
                className={`flex-shrink-0 border flex items-center justify-center h-[28px] border-y-[#025697] ${
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

          {/* FIXED 4 DATA ROWS */}
          {fixedRows.map((row) => (
            <div
              key={row.label}
              className="flex w-full items-center text-center"
            >
              {/* LABEL CELL */}
              <div
                style={{ width: slotWidth }}
                className="flex-shrink-0 font-semibold flex items-center justify-center h-[60px] border-[#025697] 
                border-t-transparent border text-[12px]"
              >
                {row.label}
              </div>

              {/* VALUE CELLS */}
              {chunk.map((dateStr) => (
                <div
                  key={dateStr + row.label}
                  className="flex-shrink-0 border h-[60px] flex items-center justify-center border-r-[#025697] border-b-[#025697] border-t-transparent text-[12px]"
                  style={{ width: slotWidth }}
                >
                  {getValueByDate(dateStr, row.unit, row.type)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
