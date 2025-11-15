"use client";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

// Default options for the dropdown
const defaultOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisweek" },
  { label: "Last 7 days", value: "last7days" },
  { label: "This Month", value: "thismonth" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This Year", value: "thisyear" },
  { label: "Custom", value: "custom" },
];

// Helper function to format date
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Helper function to add minutes to time
const addMinutes = (timeString, minutesToAdd) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
};

export const DateRangePicker = ({
  // Configuration props
  options = defaultOptions,
  showTime = false,
  showLabels = true,
  defaultSelected = "today",

  // Label customization
  dateRangeLabel = "",
  intervalLabel = "",
  toLabel = "",
  timeLabel = "",

  // Styling
  className = "",
  dropdownWidth = "w-35",

  // Initial values for custom range
  initialCustomRange,

  // Callback
  onChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize custom date range
  const today = new Date();
  const [customRange, setCustomRange] = useState(() => {
    if (initialCustomRange) {
      return initialCustomRange;
    }
    return {
      startDate: formatDate(today),
      endDate: formatDate(today),
      startTime: "06:00",
      endTime: "23:59",
    };
  });

  // Mount effect and click outside handler
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate final range and notify parent
  useEffect(() => {
    let finalRange;

    if (selectedPeriod === "custom") {
      finalRange = {
        ...customRange,
        // If time is not shown, set default times
        ...(!showTime && { startTime: "06:00", endTime: "06:00" }),
        selectedPeriod,
      };
    } else {
      const { startDate, endDate } = getDateRangeFromString(selectedPeriod);
      finalRange = {
        startDate,
        endDate,
        startTime: "06:00",
        endTime: "06:00",
        selectedPeriod,
      };
    }

    onChange?.(finalRange);
  }, [selectedPeriod, customRange, showTime, onChange]);

  // Handle custom range field changes
  const handleCustomRangeChange = (updatedFields) => {
    setCustomRange((prev) => {
      const newRange = { ...prev, ...updatedFields };

      // Auto-adjust time constraints when dates are the same
      if (newRange.startDate === newRange.endDate && showTime) {
        if (
          updatedFields.startTime &&
          updatedFields.startTime >= newRange.endTime
        ) {
          newRange.endTime = addMinutes(updatedFields.startTime, 30);
        } else if (
          updatedFields.endTime &&
          updatedFields.endTime <= newRange.startTime
        ) {
          newRange.endTime = addMinutes(newRange.startTime, 30);
        } else if (updatedFields.startDate || updatedFields.endDate) {
          if (newRange.startTime >= newRange.endTime) {
            newRange.endTime = addMinutes(newRange.startTime, 30);
          }
        }
      }

      return newRange;
    });
  };

  // Handle end time blur for manual input
  const handleEndTimeBlur = () => {
    if (customRange.startDate === customRange.endDate && showTime) {
      if (customRange.endTime <= customRange.startTime) {
        const newEndTime = addMinutes(customRange.startTime, 30);
        handleCustomRangeChange({ endTime: newEndTime });
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className={`flex  gap-4 ${className}`}>
      {/* Date Range Selector */}
      <div
        ref={dropdownRef}
        className="relative inline-block text-left md:w-auto"
      >
        <div className="flex items-center justify-center md:justify-start gap-2">
          {showLabels && (
            <span className="flex text-[15.49px] font-raleway font-600">
              {dateRangeLabel}
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 w-35 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
          >
            {options.find((o) => o.value === selectedPeriod)?.label}
            <HiChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isOpen && (
          <div
            className={`absolute right-0 z-50 mt-1 ${dropdownWidth} rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700`}
          >
            <div className="py-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={selectedPeriod === option.value}
                    onChange={() => {
                      setSelectedPeriod(option.value);
                      setIsOpen(false);
                    }}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date and Time Selector */}
      {selectedPeriod === "custom" && (
        <div className="flex items-start lg:items-center flex-col md:flex-row justify-center gap-5">
          {/* Date Range */}
          <div className="flex items-start md:items-center flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2">
              {showLabels && (
                <label
                  htmlFor="startDate"
                  className="font-raleway font-600 text-[13.22px]"
                >
                  {intervalLabel}
                </label>
              )}
              <input
                type="date"
                name="startDate"
                id="startDate"
                style={{ width: "9rem" }}
                className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                onChange={(e) =>
                  handleCustomRangeChange({ startDate: e.target.value })
                }
                value={customRange.startDate}
              />
            </div>
            <div className="flex items-center gap-2">
              {showLabels && (
                <label
                  htmlFor="endDate"
                  className="font-raleway font-600 text-[13.22px]"
                >
                  {toLabel}
                </label>
              )}
              <input
                type="date"
                name="endDate"
                id="endDate"
                style={{ width: "9rem" }}
                className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                min={customRange.startDate}
                onChange={(e) =>
                  handleCustomRangeChange({ endDate: e.target.value })
                }
                value={customRange.endDate}
              />
            </div>
          </div>

          {/* Time Range */}
          {showTime && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                {showLabels && (
                  <label
                    htmlFor="startTime"
                    className="font-raleway font-600 text-[13.22px]"
                  >
                    {timeLabel}
                  </label>
                )}
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  style={{ width: "7.3rem" }}
                  className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                  onChange={(e) =>
                    handleCustomRangeChange({ startTime: e.target.value })
                  }
                  value={customRange.startTime}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="endTime"
                  className="font-raleway font-600 text-[13.22px]"
                >
                  {toLabel}:
                </label>
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  style={{ width: "7.3rem" }}
                  className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
                  onChange={(e) =>
                    handleCustomRangeChange({ endTime: e.target.value })
                  }
                  value={customRange.endTime}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
