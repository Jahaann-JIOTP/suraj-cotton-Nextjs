"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export default function SelectDropdown({
  label = "",
  options2 = [],
  value = [],
  onChange,
  isMulti = false,
  placeholder = "Select option",
  showSubLabel = false, // ✅ NEW
  searchPlaceholder = "Search...", // ✅ NEW
  enableSearch = false,
}) {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null); // ✅ NEW

  const [open, setOpen] = useState(false);
  const [displayLabels, setDisplayLabels] = useState("");
  const [search, setSearch] = useState(""); // ✅ NEW

  const toggleDropdown = () => setOpen((p) => !p);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search & focus when opened
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (val) => {
    if (isMulti) {
      onChange(
        value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
      );
    } else {
      onChange([val]);
      setOpen(false);
    }
  };

  // 🔍 Filtered options (SEARCH)
  const filteredOptions = useMemo(() => {
    if (!enableSearch || !search) return options2;

    const q = search.toLowerCase();
    return options2.filter(
      (o) =>
        o.meterName?.toLowerCase().includes(q) ||
        o.area?.toLowerCase().includes(q)
    );
  }, [search, options2, enableSearch]);

  // Display label calculation (unchanged logic)
  const updateDisplayLabels = () => {
    if (!buttonRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth - 30;
    const selectedOptions = options2.filter((opt) =>
      value.includes(opt.meterId)
    );
    const labels = selectedOptions.map((opt) => opt.meterName);

    if (!labels.length) {
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

    setDisplayLabels(
      remaining > 0
        ? `${visibleLabels.join(", ")} ...+${remaining}`
        : labels.join(", ")
    );
  };

  const highlightText = (text, query) => {
    if (!enableSearch || !query) return text;

    const regex = new RegExp(`(${query})`, "ig");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600/40 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(updateDisplayLabels, [value, options2]);
  useEffect(() => {
    window.addEventListener("resize", updateDisplayLabels);
    return () => window.removeEventListener("resize", updateDisplayLabels);
  }, [value, options2]);

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
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
            {/* 🔍 Search Input */}
            {enableSearch && (
              <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full px-3 py-2 outline-none text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            <div className="max-h-[14rem] overflow-auto">
              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </div>
              )}

              {filteredOptions.map((option) => (
                <label
                  key={option.meterId}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                >
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    checked={value.includes(option.meterId)}
                    onChange={() => handleSelect(option.meterId)}
                  />

                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold">
                      {/* {option.meterName} */}
                      {highlightText(option.meterName, search)}
                    </span>

                    {/* Optional sub label */}
                    {showSubLabel && option.area && (
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {highlightText(option.area, search)}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
