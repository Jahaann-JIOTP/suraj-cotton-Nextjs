"use client";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import Card from "../../../components/dashboardComponents/daily_consumption/cards";
const TYPE_CONFIG = {
  lt1: { label: "Unit 4 LT-1" },
  lt2: { label: "Unit 4 LT-2" },
  lt3: { label: "Unit 5 LT-1" },
  lt4: { label: "Unit 5 LT-2" },
};
// ---------------------- Options ----------------------
const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisweek" },
  { label: "Last 7 days", value: "last7days" },
  { label: "This Month", value: "thismonth" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This Year", value: "thisyear" },
  { label: "Custom", value: "custom" },
];

const DEPT_OPTIONS = [
  { label: "All Departments", value: "all" },
  { label: "BLOW ROOM", value: "blow_room" },
  { label: "CARD", value: "card" },
  { label: "COMBER", value: "comber" },
  { label: "UNI-LAP", value: "uni_lap" },
  { label: "DRAWING FINISHER", value: "drawing_finisher" },
  { label: "DRAWING BREAKER", value: "drawing_breaker" },
  { label: "SPEED FRAME", value: "speed_frame" },
  { label: "RING FRAME", value: "ring_frame" },
  { label: "AUTO CONER", value: "auto_coner" },
];

// ---------------------- Helpers ----------------------
const toSlug = (s = "") =>
  s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const getDateRange = (timePeriod, customRange) => {
  const today = startOfDay(new Date());
  let start = today;
  let end = endOfDay(new Date());

  switch (timePeriod) {
    case "today":
      start = today;
      end = endOfDay(today);
      break;
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      start = startOfDay(y);
      end = endOfDay(y);
      break;
    }
    case "thisweek": {
      // Monday as start of week
      const dow = (today.getDay() + 6) % 7; // 0 = Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() - dow);
      start = startOfDay(monday);
      end = endOfDay(new Date());
      break;
    }
    case "last7days": {
      const s = new Date(today);
      s.setDate(today.getDate() - 6);
      start = startOfDay(s);
      end = endOfDay(new Date());
      break;
    }
    case "thismonth":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = endOfDay(new Date());
      break;
    case "last30days": {
      const s = new Date(today);
      s.setDate(today.getDate() - 29);
      start = startOfDay(s);
      end = endOfDay(new Date());
      break;
    }
    case "thisyear":
      start = new Date(today.getFullYear(), 0, 1);
      end = endOfDay(new Date());
      break;
    case "custom": {
      if (customRange.start && customRange.end) {
        start = startOfDay(customRange.start);
        end = endOfDay(customRange.end);
        if (start > end) [start, end] = [end, start];
      }
      break;
    }
    default:
      break;
  }
  return { startDate: start, endDate: end };
};

// --- Custom date input styled like the dropdown (with bigger calendar SVG) ---
const CustomDateInput = forwardRef(
  ({ value, onClick, placeholder, disabled }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      disabled={disabled}
      className="text-[14px] flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 justify-between gap-2 w-35 py-[3px] px-2 rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
    >
      <span className="truncate">{value || placeholder}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 14 14"
        fill="none"
        className="ml-2 shrink-0"
      >
        <path d="M9.23386 7.98746C9.37785 7.98746 9.51595 7.93026 9.61777 7.82844C9.71958 7.72662 9.77678 7.58853 9.77678 7.44453C9.77678 7.30054 9.71958 7.16245 9.61777 7.06063C9.51595 6.95881 9.37785 6.90161 9.23386 6.90161C9.08987 6.90161 8.95178 6.95881 8.84996 7.06063C8.74814 7.16245 8.69094 7.30054 8.69094 7.44453C8.69094 7.58853 8.74814 7.72662 8.84996 7.82844C8.95178 7.93026 9.08987 7.98746 9.23386 7.98746ZM9.23386 10.1591C9.37785 10.1591 9.51595 10.1019 9.61777 10.0001C9.71958 9.89831 9.77678 9.76021 9.77678 9.61622C9.77678 9.47223 9.71958 9.33414 9.61777 9.23232C9.51595 9.1305 9.37785 9.0733 9.23386 9.0733C9.08987 9.0733 8.95178 9.1305 8.84996 9.23232C8.74814 9.33414 8.69094 9.47223 8.69094 9.61622C8.69094 9.76021 8.74814 9.89831 8.84996 10.0001C8.95178 10.1019 9.08987 10.1591 9.23386 10.1591ZM7.06217 7.44453C7.06217 7.58853 7.00497 7.72662 6.90316 7.82844C6.80134 7.93026 6.66324 7.98746 6.51925 7.98746C6.37526 7.98746 6.23717 7.93026 6.13535 7.82844C6.03353 7.72662 5.97633 7.58853 5.97633 7.44453C5.97633 7.30054 6.03353 7.16245 6.13535 7.06063C6.23717 6.95881 6.37526 6.90161 6.51925 6.90161C6.66324 6.90161 6.80134 6.95881 6.90316 7.06063C7.00497 7.16245 7.06217 7.30054 7.06217 7.44453ZM7.06217 9.61622C7.06217 9.76021 7.00497 9.89831 6.90316 10.0001C6.80134 10.1019 6.66324 10.1591 6.51925 10.1591C6.37526 10.1591 6.23717 10.1019 6.13535 10.0001C6.03353 9.89831 5.97633 9.76021 5.97633 9.61622C5.97633 9.47223 6.03353 9.33414 6.13535 9.23232C6.23717 9.1305 6.37526 9.0733 6.51925 9.0733C6.66324 9.0733 6.80134 9.1305 6.90316 9.23232C7.00497 9.33414 7.06217 9.47223 7.06217 9.61622ZM3.80464 7.98746C3.94863 7.98746 4.08673 7.93026 4.18854 7.82844C4.29036 7.72662 4.34756 7.58853 4.34756 7.44453C4.34756 7.30054 4.29036 7.16245 4.18854 7.06063C4.08673 6.95881 3.94863 6.90161 3.80464 6.90161C3.66065 6.90161 3.52255 6.95881 3.42074 7.06063C3.31892 7.16245 3.26172 7.30054 3.26172 7.44453C3.26172 7.58853 3.31892 7.72662 3.42074 7.82844C3.52255 7.93026 3.66065 7.98746 3.80464 7.98746ZM3.80464 10.1591C3.94863 10.1591 4.08673 10.1019 4.18854 10.0001C4.29036 9.89831 4.34756 9.76021 4.34756 9.61622C4.34756 9.47223 4.29036 9.33414 4.18854 9.23232C4.08673 9.1305 3.94863 9.0733 3.80464 9.0733C3.66065 9.0733 3.52255 9.1305 3.42074 9.23232C3.31892 9.33414 3.26172 9.47223 3.26172 9.61622C3.26172 9.76021 3.31892 9.89831 3.42074 10.0001C3.52255 10.1019 3.66065 10.1591 3.80464 10.1591Z" fill="black" />
        <path fillRule="evenodd" clipRule="evenodd" d="M4.25448 2.10083C4.34802 2.10083 4.43774 2.13799 4.50388 2.20414C4.57003 2.27029 4.60719 2.36 4.60719 2.45355V2.81238C4.91852 2.80626 5.26137 2.80626 5.63854 2.80626H7.57284C7.95048 2.80626 8.29332 2.80626 8.60465 2.81238V2.45355C8.60465 2.36 8.64181 2.27029 8.70796 2.20414C8.77411 2.13799 8.86382 2.10083 8.95737 2.10083C9.05092 2.10083 9.14063 2.13799 9.20678 2.20414C9.27293 2.27029 9.31009 2.36 9.31009 2.45355V2.84248C9.43236 2.85188 9.54821 2.8638 9.65763 2.87822C10.2088 2.95252 10.6551 3.10866 11.0074 3.46044C11.3591 3.81268 11.5153 4.25899 11.5896 4.81017C11.6615 5.3463 11.6615 6.03057 11.6615 6.89496V7.88821C11.6615 8.75261 11.6615 9.43735 11.5896 9.97301C11.5153 10.5242 11.3591 10.9705 11.0074 11.3227C10.6551 11.6745 10.2088 11.8307 9.65763 11.905C9.1215 11.9769 8.43723 11.9769 7.57284 11.9769H5.63948C4.77509 11.9769 4.09034 11.9769 3.55469 11.905C3.00351 11.8307 2.5572 11.6745 2.20495 11.3227C1.85318 10.9705 1.69704 10.5242 1.62274 9.97301C1.55078 9.43688 1.55078 8.75261 1.55078 7.88821V6.89496C1.55078 6.03057 1.55078 5.34583 1.62274 4.81017C1.69704 4.25899 1.85318 3.81268 2.20495 3.46044C2.5572 3.10866 3.00351 2.95252 3.55469 2.87822C3.66442 2.8638 3.78027 2.85188 3.90223 2.84248V2.45355C3.90223 2.36008 3.93933 2.27044 4.00537 2.2043C4.07142 2.13817 4.16101 2.10095 4.25448 2.10083ZM3.6478 3.57754C3.17516 3.64103 2.90239 3.76048 2.70346 3.95941C2.50453 4.15835 2.38507 4.43111 2.32159 4.90376C2.31093 4.98371 2.30183 5.0682 2.29431 5.15724H10.9175C10.91 5.0682 10.9009 4.98355 10.8903 4.90329C10.8268 4.43064 10.7073 4.15788 10.5084 3.95894C10.3095 3.76001 10.0367 3.64056 9.56357 3.57707C9.08059 3.51217 8.44334 3.51123 7.5465 3.51123H5.66534C4.7685 3.51123 4.13173 3.51264 3.6478 3.57754ZM2.25575 6.9213C2.25575 6.51967 2.25575 6.17025 2.26186 5.86315H10.95C10.9561 6.17025 10.9561 6.51967 10.9561 6.9213V7.86188C10.9561 8.75872 10.9552 9.39596 10.8903 9.87942C10.8268 10.3521 10.7073 10.6248 10.5084 10.8238C10.3095 11.0227 10.0367 11.1421 9.56357 11.2056C9.08059 11.2705 8.44334 11.2715 7.5465 11.2715H5.66534C4.7685 11.2715 4.13173 11.2705 3.6478 11.2056C3.17516 11.1421 2.90239 11.0227 2.70346 10.8238C2.50453 10.6248 2.38507 10.3521 2.32159 9.87895C2.25669 9.39596 2.25575 8.75872 2.25575 7.86188V6.9213Z" fill="black" />
      </svg>
    </button>
  )
);
CustomDateInput.displayName = "CustomDateInput";

// =====================================================

const Dashboard = () => {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "lt1").toLowerCase();
  const typeInfo = TYPE_CONFIG[type] || TYPE_CONFIG.lt1;
  // filters
  const [department, setDepartment] = useState(DEPT_OPTIONS[0].value);
  const [timePeriod, setTimePeriod] = useState("last30days");
  const [customRange, setCustomRange] = useState({ start: null, end: null });

  // dropdown states
  const [isOpenPeriod, setIsOpenPeriod] = useState(false);
  const [isOpenDept, setIsOpenDept] = useState(false);
  const [mounted, setMounted] = useState(false);

  const periodRef = useRef(null);
  const deptRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e) => {
      if (periodRef.current && !periodRef.current.contains(e.target)) setIsOpenPeriod(false);
      if (deptRef.current && !deptRef.current.contains(e.target)) setIsOpenDept(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPeriod = (val) => {
    setTimePeriod(val);
    setIsOpenPeriod(false);
    if (val !== "custom") setCustomRange({ start: null, end: null });
  };
  const handleSelectDept = (val) => {
    setDepartment(val);
    setIsOpenDept(false);
  };

  // -------------------- Demo data --------------------
  const getCardsDataFor = (t) => [
    { title: "BLOW ROOM", machines: 4, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-05" },
    { title: "CARD", machines: 5, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-04" },
    { title: "COMBER", machines: 2, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-03" },
    { title: "UNI-LAP", machines: 1, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-30" },
    { title: "DRAWING FINISHER", machines: 4, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-01" },
    { title: "DRAWING BREAKER", machines: 3, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-28" },
    { title: "SPEED FRAME", machines: 6, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-02" },
    { title: "RING FRAME", machines: 7, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-20" },
    { title: "AUTO CONER", machines: 3, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-06" },
  ];

  // -------------------- Filtering logic --------------------
  const { startDate, endDate } = getDateRange(timePeriod, customRange);

  const byDept = (card) =>
    department === "all" ? true : toSlug(card.title) === department;

  const byInterval = (card) => {
    if (!card.updatedAt) return true;
    const t = new Date(card.updatedAt);
    return t >= startDate && t <= endDate;
  };

  // Custom mode flags
  const isCustom = timePeriod === "custom";
  const customReady = !!(customRange.start && customRange.end);
  const applyInterval = !isCustom || (isCustom && customReady);
const cardsData = React.useMemo(() => getCardsDataFor(type), [type]);
  const filteredCards = applyInterval
    ? cardsData.filter((c) => byDept(c) && byInterval(c))
    : [];

  // -------------------- Pagination on filtered list --------------------
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLast = safePage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredCards.slice(indexOfFirst, indexOfLast);

  // keep page in range on filter change
  useEffect(() => {
    const newTotal = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
    if (currentPage > newTotal) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, timePeriod, customRange.start, customRange.end, type]);

  if (!mounted) return null;

  // -------------------- Empty states --------------------
  const showCustomInstruction = isCustom && !customReady;
  const showNoData = !showCustomInstruction && applyInterval && filteredCards.length === 0;

  const EmptyState = ({ text }) => (
    <div className="flex flex-col items-center justify-center flex-1 py-10">
      <Image
  src="/empty_cards.svg" // must be in /public
  alt="No data illustration"
  width={224} // 56 * 4 (since Tailwind uses rem scaling)
  height={224}
  className="h-auto opacity-90 dark:opacity-80"
/>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">{text}</p>
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      {/* Header row */}
      <div className="w-full items-center flex justify-between flex-wrap gap-3">
        <h2 className="text-[20px] font-600 font-inter">Daily Consumption - <span className="text-[#025697]">{typeInfo.label}</span></h2>

        {/* Filter bar: Department + Period + (Custom dates) */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Department dropdown */}
          <span className="text-[15.49px] font-raleway font-600">Department:</span>
          <div ref={deptRef} className="relative inline-block text-left md:w-auto">
            <button
              onClick={() => setIsOpenDept((v) => !v)}
              className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 w-40 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              {DEPT_OPTIONS.find((o) => o.value === department)?.label}
              <HiChevronDown className={`transition-transform ${isOpenDept ? "rotate-180" : ""}`} />
            </button>

            {isOpenDept && (
              <div className="absolute right-0 z-50 mt-1 w-48 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
                <div className="py-1 max-h-64 overflow-auto">
                  {DEPT_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name="department"
                        value={option.value}
                        checked={department === option.value}
                        onChange={() => handleSelectDept(option.value)}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Period dropdown */}
          <span className="text-[15.49px] font-raleway font-600">Select Date Range:</span>
          <div ref={periodRef} className="relative inline-block text-left md:w-auto">
            <button
              onClick={() => setIsOpenPeriod((v) => !v)}
              className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 w-35 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              {PERIOD_OPTIONS.find((o) => o.value === timePeriod)?.label}
              <HiChevronDown className={`transition-transform ${isOpenPeriod ? "rotate-180" : ""}`} />
            </button>

            {isOpenPeriod && (
              <div className="absolute right-0 z-50 mt-1 w-35 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
                <div className="py-1">
                  {PERIOD_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name="period"
                        value={option.value}
                        checked={timePeriod === option.value}
                        onChange={() => handleSelectPeriod(option.value)}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inline date pickers (Custom): end available from start+1 onward */}
          {timePeriod === "custom" && (
            <div className="flex items-center gap-2">
              <span className="text-[15.49px] font-raleway font-600">Interval:</span>

              {/* Start */}
              <DatePicker
                selected={customRange.start}
                onChange={(date) =>
                  setCustomRange(() => ({
                    start: date ? startOfDay(date) : null,
                    end: null, // clear end so user picks it
                  }))
                }
                selectsStart
                startDate={customRange.start}
                endDate={customRange.end}
                placeholderText="dd/mm/yy"
                dateFormat="dd/MM/yy"
                customInput={<CustomDateInput />}
              />

              <span className="text-[15.49px] font-raleway font-600">to:</span>

              {/* End (enabled; min is start + 1, no max) */}
              <DatePicker
                selected={customRange.end}
                onChange={(date) =>
                  setCustomRange((r) => ({
                    ...r,
                    end: date ? startOfDay(date) : null,
                  }))
                }
                selectsEnd
                startDate={customRange.start}
                endDate={customRange.end}
                minDate={customRange.start ? addDays(customRange.start, 1) : undefined}
                placeholderText="dd/mm/yy"
                dateFormat="dd/MM/yy"
                customInput={<CustomDateInput />}
              />
            </div>
          )}
        </div>
      </div>

      {/* Empty states */}
      {showCustomInstruction && <EmptyState text="Please select interval to view data" />}

      {showNoData && <EmptyState text="No data available for the selected criteria." />}

      {/* Cards grid + pagination (only when there is data) */}
      {!showCustomInstruction && !showNoData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {currentItems.map((card, index) => (
              <Card
                key={`${card.title}-${index}`}
                title={card.title}
                machines={card.machines}
                loadConnected={card.loadConnected}
                consumption={card.consumption}
                averagePower={card.averagePower}
                averagePowerFactor={card.averagePowerFactor}
                averageVoltage={card.averageVoltage}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredCards.length > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage === 1}
                className="w-7 h-7 border rounded-md disabled:opacity-50 hover:bg-gray-100 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M5.29229 8.45226L4.61005 9.12591L0.93733 5.41117C0.878126 5.35164 0.831278 5.281 0.799482 5.2033C0.767686 5.1256 0.751571 5.04237 0.752063 4.95842C0.752555 4.87447 0.769645 4.79144 0.802349 4.71412C0.835054 4.63679 0.882727 4.5667 0.942625 4.50788L4.65865 0.834523L5.33231 1.51613L1.84456 4.96387L5.29229 8.45226Z" fill="#62727F" />
                </svg>
              </button>

              {/* Pages with ellipsis */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === totalPages || (page >= safePage - 1 && page <= safePage + 1))
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx] - arr[idx - 1] > 1 && <span className="px-2">…</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md ${
                        safePage === page ? "text-blue-500 border-gray-300" : "text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages}
                className="w-7 h-7 border rounded-md disabled:opacity-50 hover:bg-gray-100 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                  <path d="M3.31941 6.44845L4.00334 5.7768L7.66511 9.50077C7.72414 9.56044 7.77079 9.6312 7.80236 9.70897C7.83394 9.78674 7.84983 9.86999 7.8491 9.95393C7.84838 10.0379 7.83107 10.1208 7.79816 10.198C7.76525 10.2753 7.7174 10.3452 7.65735 10.4039L3.9321 14.0663L3.26045 13.383L6.75686 9.9455L3.31941 6.44845Z" fill="#62727F" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
