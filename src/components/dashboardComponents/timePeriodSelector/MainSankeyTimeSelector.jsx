"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { HiChevronDown } from "react-icons/hi";

const options = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisweek" },
  { label: "Last 7 days", value: "last7days" },
  { label: "This Month", value: "thismonth" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This Year", value: "thisyear" },
  { label: "Custom", value: "custom" },
];

//====================new data
const getDateRangeFromString = (rangeType) => {
  const today = new Date();
  const start = new Date();

  const formatDate = (date) => date.toISOString().split("T")[0];

  switch (rangeType.toLowerCase()) {
    case "today":
      break;

    case "yesterday":
      start.setDate(today.getDate() - 1);
      today.setDate(today.getDate());
      break;

    case "thisweek": {
      const day = today.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(today.getDate() + mondayOffset);
      break;
    }

    case "last7days":
      start.setDate(today.getDate() - 6);
      break;

    case "thismonth":
      start.setDate(1);
      break;

    case "last30days":
      start.setDate(today.getDate() - 29);
      break;

    case "thisyear":
      start.setMonth(0);
      start.setDate(1);
      break;

    default:
      throw new Error(
        `Invalid range type: "${rangeType}". Use one of: today, yesterday, thisWeek, last7Days, thisMonth, last30Days, or thisYear.`,
      );
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(today),
  };
};

const MainSankeyTimeSelector = ({ onRangeChange }) => {
  const [selected, setSelected] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toMinutes = (time) => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  const today = new Date();
  const hour = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hour}:${minutes}`;

  useEffect(() => {
    if (selected !== "custom") {
      const { startDate, endDate } = getDateRangeFromString(selected);
      setStartDate(startDate);
      setEndDate(endDate);
      setStartTime("06:00");
      if (startDate === endDate) {
        setEndTime(currentTime);
      } else {
        setEndTime("06:00");
      }
    }
  }, [selected]);
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
  useEffect(() => {
    // Ensure all values exist before notifying parent
    if (!startDate || !endDate || !startTime || !endTime) return;

    const range = { startDate, endDate, startTime, endTime };
    onRangeChange?.(range);
  }, [startDate, endDate, startTime, endTime]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center flex-wrap justify-end gap-3 w-full">
      {/* ====== Dropdown Section ====== */}
      <div ref={dropdownRef} className="relative flex items-center gap-2">
        <span className="text-[15px] font-medium">Select Date Range:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-[3px] rounded border border-gray-300 bg-white dark:bg-gray-900"
        >
          {options.find((o) => o.value === selected)?.label}
          <HiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-[120%] left-20 z-50 bg-white dark:bg-gray-900 border rounded w-40 shadow">
            {options.map((o) => (
              <label
                key={o.value}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  value={o.value}
                  checked={selected === o.value}
                  onChange={() => {
                    setSelected(o.value);
                    setIsOpen(false);
                  }}
                  className="mr-2"
                />
                {o.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ====== Custom Interval Section ====== */}
      {selected === "custom" && (
        <div className="flex flex-wrap  items-center justify-end gap-4">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Interval</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-1"
            />
            <span className="font-medium">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-1"
            />
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded p-1"
            />
            <span className="font-medium">to</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded p-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSankeyTimeSelector;
