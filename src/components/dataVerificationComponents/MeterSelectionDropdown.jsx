"use client";
import { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const MeterSelectionDropdown = ({ meters, selectedMeter, setSelectedMeter,onSelectMeter, loading }) => {
  const [open, setOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setSelectedMeter(id);
    setDropdownSearch("");
    setOpen(false);
  };

  const filteredMeters = meters.filter(
    (meter) =>
      meter.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      meter.location.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      {loading ? (
        <p className="text-xs text-gray-500">loading...</p>
      ) : (
        <>
          {/* Button */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="appearance-none border border-gray-300 rounded px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white text-black w-full flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-[#1A68B2]"
          >
            <span className="truncate">
              {meters.find((m) => m.id === selectedMeter)?.name || "-- Select --"}
            </span>
            <RiArrowDropDownLine
              className={`ml-2 text-xl flex-shrink-0 transition-transform duration-200 ease-in-out ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute mt-1 h-[20rem] w-full rounded bg-white shadow-lg ring-1 ring-black/10 z-20 origin-top">
              {/* Search bar */}
              <div className="sticky top-0 bg-white z-30 px-3 py-2 border-b border-gray-200">
                <input
                  type="text"
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                      setDropdownSearch((prev) => prev + " ");
                    }
                  }}
                  placeholder="Search meters..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[8px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#265F95] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                  autoFocus
                />
              </div>

              {/* Options */}
              <div className="max-h-[16rem] overflow-auto">
                {filteredMeters.length === 0 ? (
                  <div className="py-3 px-4 text-gray-500 text-sm">
                    No meters found
                  </div>
                ) : (
                  filteredMeters.map((meter, index) => (
                    <div
                      key={meter.id}
                      onClick={() => {
                        handleSelect(meter.id)
                        onSelectMeter(meter.id);
                    }}
                      className={`cursor-pointer select-none relative py-2.5 pl-4 pr-4 truncate text-sm transition-colors duration-150 ease-in-out ${
                        selectedMeter === meter.id
                          ? "bg-blue-100 text-blue-900 font-medium"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{meter.name}</span>
                        {selectedMeter === meter.id && (
                          <span className="text-blue-600 ml-2">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {meter.location}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MeterSelectionDropdown;