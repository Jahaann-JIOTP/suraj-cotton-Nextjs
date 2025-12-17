"use client";
import React, { useRef, useState, useEffect } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export default function SelectDropdown({
  label = "",
  options = [],
  value = [], // array of strings
  onChange, // callback: (arrayOfStrings) => void
  isMulti = false,
  placeholder = "Select option",
}) {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [displayLabels, setDisplayLabels] = useState("");

  const toggleDropdown = () => setOpen((p) => !p);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
      onChange([val]);
      setOpen(false);
    }
  };

  // Function to calculate which labels fit and remaining +N
  const updateDisplayLabels = () => {
    if (!buttonRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth - 30; // leave space for arrow
    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const labels = selectedOptions.map((opt) => opt.label);

    if (labels.length === 0) {
      setDisplayLabels(placeholder);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = window.getComputedStyle(buttonRef.current).font;

    let widthUsed = 0;
    let visibleLabels = [];
    let remaining = 0;

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i] + (i < labels.length - 1 ? ", " : "");
      const labelWidth = ctx.measureText(label).width;

      if (widthUsed + labelWidth <= buttonWidth) {
        visibleLabels.push(labels[i]);
        widthUsed += labelWidth;
      } else {
        remaining = labels.length - visibleLabels.length;
        break;
      }
    }

    if (remaining > 0) {
      setDisplayLabels(`${visibleLabels.join(", ")} ...+${remaining}`);
    } else {
      setDisplayLabels(labels.join(", "));
    }
  };

  useEffect(() => {
    updateDisplayLabels();
  }, [value, options]);

  // Update on window resize
  useEffect(() => {
    window.addEventListener("resize", updateDisplayLabels);
    return () => window.removeEventListener("resize", updateDisplayLabels);
  }, [value, options]);

  return (
    <div className="flex flex-col w-full gap-1">
      {label && (
        <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
          {label}
        </span>
      )}

      <div className="relative w-full" ref={dropdownRef}>
        {/* Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded text-sm text-left overflow-hidden"
        >
          <span className="truncate">{displayLabels}</span>
          <IoChevronDownOutline
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-20 mt-1 w-full max-h-[16rem] overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
            {options.map((option, idx) => (
              <label
                key={idx}
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
