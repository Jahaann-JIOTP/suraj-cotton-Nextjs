"use client";

import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const intervalOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisweek" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "This Month", value: "thismonth" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Year", value: "thisyear" },
  { label: "Custom", value: "custom" },
];

/* ---------- helpers ---------- */
const formatTime = (d) => (d ? d.toTimeString().slice(0, 5) : "06:00");
const formatDateLocal = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/* ---------- component ---------- */
export default function DashboardIntervalSelector({ onChange }) {
  const [interval, setInterval] = useState("today");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customRange, setCustomRange] = useState([null, null]);

  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openCalendar = () => {
    if (calendarRef.current) calendarRef.current.setOpen(true);
  };

  /* ---------- compute dates and times ---------- */
  useEffect(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate = null;
    let endDate = null;
    let startTime = "06:00";
    let endTime = "06:00";

    switch (interval) {
      case "today":
        startDate = today;
        endDate = today;
        endTime = formatTime(now);
        break;

      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = today;
        break;

      case "thisweek":
        startDate = getMonday(today);
        endDate = today;
        if (formatDateLocal(startDate) === formatDateLocal(endDate))
          endTime = formatTime(now);
        break;

      case "last7days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;

      case "thismonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        if (formatDateLocal(startDate) === formatDateLocal(endDate))
          endTime = formatTime(now);
        break;

      case "last30days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = today;
        break;

      case "thisyear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        if (formatDateLocal(startDate) === formatDateLocal(endDate))
          endTime = formatTime(now);
        break;

      case "custom":
        if (!customRange[0]) return; // no start date
        startDate = customRange[0];
        endDate = customRange[1] || null;

        const isToday =
          startDate &&
          endDate &&
          formatDateLocal(startDate) === formatDateLocal(today) &&
          formatDateLocal(endDate) === formatDateLocal(today);
        if (isToday) endTime = formatTime(now);
        break;

      default:
        return;
    }

    onChange?.({
      startDate: formatDateLocal(startDate),
      endDate: formatDateLocal(endDate),
      startTime,
      endTime,
    });
  }, [interval, customRange[0], customRange[1]]);

  /* ---------- handle custom range selection ---------- */
  const handleCustomRangeChange = (update) => {
    if (!update) return;

    const [start, end] = update;

    if (start && end) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startCopy = new Date(start);
      startCopy.setHours(0, 0, 0, 0);

      const endCopy = new Date(end);
      endCopy.setHours(0, 0, 0, 0);

      const isStartToday =
        formatDateLocal(startCopy) === formatDateLocal(today);

      if (!isStartToday && startCopy.getTime() === endCopy.getTime()) {
        Swal.fire({
          icon: "warning",
          title: "Invalid selection",
          text: "For past dates, the same start and end date is not allowed due to 6-to-6 time period.",
        });
        return; // ignore update
      }
    }

    setCustomRange(update);
  };

  return (
    <div className="flex gap-4 w-auto">
      {/* -------- Interval Dropdown -------- */}
      <div className="relative w-[11rem]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((p) => !p)}
          className="w-full flex justify-between items-center px-4 py-1 border rounded bg-white dark:bg-gray-900"
        >
          {intervalOptions.find((o) => o.value === interval)?.label}
          <IoChevronDownOutline
            className={`transition ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border rounded shadow">
            {intervalOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  checked={interval === opt.value}
                  onChange={() => {
                    setInterval(opt.value);
                    setDropdownOpen(false);
                    setCustomRange([null, null]);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* -------- Custom Date Picker -------- */}
      {interval === "custom" && (
        <div
          className="flex items-center justify-between px-4 border bg-white dark:bg-gray-900 rounded cursor-pointer"
          onClick={openCalendar}
        >
          <DatePicker
            ref={calendarRef}
            selectsRange
            startDate={customRange[0]}
            endDate={customRange[1]}
            onChange={handleCustomRangeChange}
            maxDate={new Date()}
            className="w-full py-1 rounded outline-none"
            placeholderText="Select date range"
          />
          <FaRegCalendarAlt className="pointer-events-none" />
        </div>
      )}
    </div>
  );
}
