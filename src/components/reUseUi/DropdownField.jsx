"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

const DropdownField = ({
  title = "",
  options = [],
  isMultiSelect = false,
  defaultValue = "",
  onChange = () => {},
}) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(() => {
    if (isMultiSelect) return Array.isArray(defaultValue) ? defaultValue : [];
    return defaultValue || "";
  });

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Single select handler (FIXED)
  const handleSingleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    onChange(value); // send to parent
  };

  // Multi select handler (FIXED)
  const handleMultiSelect = (value) => {
    let updated;
    if (selected.includes(value)) {
      updated = selected.filter((v) => v !== value); // FIXED
    } else {
      updated = [...selected, value];
    }
    setSelected(updated);
    onChange(updated); // send array to parent
  };

  // Render selected text
  const getSelectedLabel = () => {
    if (isMultiSelect) {
      if (selected.length === 0) return "Select";
      const names = options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label);
      return names.join(", ");
    }
    const match = options.find((opt) => opt.value === selected);
    return match?.label || "Select";
  };

  return (
    <div className="flex flex-col w-full items-start gap-1">
      <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
        {title}
      </span>

      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          text-black dark:text-white px-4 py-2 rounded text-sm cursor-pointer"
        >
          <span>{getSelectedLabel()}</span>

          <IoChevronDownOutline
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 
          dark:border-gray-600 rounded shadow-md max-h-60 overflow-auto"
          >
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white"
              >
                <input
                  type={isMultiSelect ? "checkbox" : "radio"}
                  checked={
                    isMultiSelect
                      ? selected.includes(opt.value)
                      : selected === opt.value
                  }
                  value={opt.value}
                  onChange={() =>
                    isMultiSelect
                      ? handleMultiSelect(opt.value)
                      : handleSingleSelect(opt.value)
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownField;
