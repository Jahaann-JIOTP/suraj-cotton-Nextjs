"use client";
import React, { useRef, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export default function SelectDropdown({
  label = "",
  options = [],
  value = [], // array of strings
  onChange, // (arrayOfStrings) => void
  isMulti = false,
  placeholder = "",
}) {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((p) => !p);

  const handleSelect = (val) => {
    if (isMulti) {
      let updated;
      if (value.includes(val)) {
        updated = value.filter((v) => v !== val);
      } else {
        updated = [...value, val];
      }
      onChange(updated);
    } else {
      onChange([val]); // 👈 always array
      setOpen(false);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <div className="flex flex-col w-full gap-1">
      <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
        {label}
      </span>

      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded text-sm text-left"
        >
          {selectedLabels || placeholder}
          <IoChevronDownOutline
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full max-h-[16rem] overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-[13.51px] font-inter text-black dark:text-white"
              >
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  checked={value.includes(option.value)}
                  onChange={() => handleSelect(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
