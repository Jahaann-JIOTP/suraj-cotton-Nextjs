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

const getDateRangeFromString = (rangeType) => {
  const today = new Date();
  const start = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const currentTime = `${String(today.getHours()).padStart(2, "0")}:${String(
    today.getMinutes()
  ).padStart(2, "0")}`;

  switch (rangeType) {
    case "today":
      return {
        startDate: formatDate(today),
        endDate: formatDate(today),
        startTime: "06:00",
        endTime: currentTime, // ✅ current time for today
      };

    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return {
        startDate: formatDate(y),
        endDate: formatDate(today),
        startTime: "06:00",
        endTime: "06:00",
      };
    }

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
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(today),
    startTime: "06:00",
    endTime: "06:00",
  };
};

const MainSankeyTimeSelector = ({ onRangeChange }) => {
  const [selected, setSelected] = useState("today");
  const [range, setRange] = useState(getDateRangeFromString("today"));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // update on dropdown change
  useEffect(() => {
    if (selected !== "custom") {
      const newRange = getDateRangeFromString(selected);
      setRange(newRange);
      onRangeChange(newRange);
    }
  }, [selected]);

  // handle custom inputs
  const handleCustomChange = (key, value) => {
    const updated = { ...range, [key]: value };

    // ✅ If startDate and endDate are same → set endTime = current time automatically
    if (
      updated.startDate &&
      updated.endDate &&
      updated.startDate === updated.endDate
    ) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      updated.endTime = currentTime;
    }

    const startDateTime = new Date(`${updated.startDate}T${updated.startTime}`);
    const endDateTime = new Date(`${updated.endDate}T${updated.endTime}`);

    if (updated.startDate === updated.endDate && startDateTime >= endDateTime) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time Selection",
        text: "End time must be later than start time for the same date.",
      });
      return;
    }

    const diffMinutes = (endDateTime - startDateTime) / (1000 * 60);
    if (updated.startDate === updated.endDate && diffMinutes < 30) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time Selection",
        text: "Minimum 30-minute gap required for same date.",
      });
      return;
    }

    setRange(updated);
    onRangeChange(updated);
  };

  return (
    <div className="flex gap-3 w-full">
      {/* ====== Dropdown Section ====== */}
      <div ref={dropdownRef} className="relative flex items-center gap-2">
        <span className="text-[15px] font-medium">Select Date Range:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-[3px] rounded border border-gray-300 bg-white"
        >
          {options.find((o) => o.value === selected)?.label}
          <HiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-[120%] left-20 z-50 bg-white border rounded w-40 shadow">
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
        <div className="flex flex-wrap md:flex-nowrap items-center justify-start gap-4">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Interval</label>
            <input
              type="date"
              value={range.startDate}
              onChange={(e) => handleCustomChange("startDate", e.target.value)}
              className="border rounded p-1"
            />
            <span className="font-medium">to</span>
            <input
              type="date"
              value={range.endDate}
              onChange={(e) => handleCustomChange("endDate", e.target.value)}
              className="border rounded p-1"
            />
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Time</label>
            <input
              type="time"
              value={range.startTime}
              onChange={(e) => handleCustomChange("startTime", e.target.value)}
              className="border rounded p-1"
            />
            <span className="font-medium">to</span>
            <input
              type="time"
              value={range.endTime}
              onChange={(e) => handleCustomChange("endTime", e.target.value)}
              className="border rounded p-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSankeyTimeSelector;
