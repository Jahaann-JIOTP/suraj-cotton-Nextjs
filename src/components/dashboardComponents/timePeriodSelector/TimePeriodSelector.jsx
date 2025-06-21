"use client";
import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const options = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Montly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const TimePeriodSelector = ({ getTimePeriod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("daily");
  const [mounted, setMounted] = useState(false);

  const handleTimePeriod = () => {
    getTimePeriod(selected);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative  inline-block text-left md:w-auto">
      <div className="flex items-center justify-center md:justify-start gap-2">
        <span className="text-[15.49px] font-raleway font-600">
          Select Date Range:{" "}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-evenly gap-2 w-30 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          {options.find((o) => o.value === selected)?.label}
          <HiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-30 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => {
                    setSelected(option.value);
                    setIsOpen(false);
                    handleTimePeriod();
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
  );
};

export default TimePeriodSelector;
