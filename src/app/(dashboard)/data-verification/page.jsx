"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useRouter, useSearchParams } from "next/navigation";
import DataVerificationPanelEmptyPage from "@/components/dataVerificationComponents/EmptyPage";
import MeterParameterList from "@/components/dataVerificationComponents/MeterParameterList";
import { CiFilter } from "react-icons/ci";
import CustomLoader from "@/components/customLoader/CustomLoader";
import SearchBar from "@/components/dataVerificationComponents/SearchBar";
import { Check } from "lucide-react";
import { IoFilterOutline } from "react-icons/io5";

const areaOptions = [
  "ALL",
  "HFO",
  "HT ROOM 1",
  "HT Room 2",
  "UNIT 4 LT 1",
  "UNIT 4 LT 2",
  "UNIT 5 LT 1",
  "UNIT 5 LT 2",
];

const PageContent = () => {
  const [selectedMeter, setSelectedMeter] = useState("");
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // refs for dropdowns
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchMeters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meters/");
      const data = await res.json();
      if (res.ok) {
        const uniqueMeters = Array.from(
          new Map(
            data.map((m) => [
              m.unique_key,
              {
                id: m.unique_key,
                name: m.meter_name,
                location: m.location,
                unique_key: m.unique_key,
              },
            ])
          ).values()
        );
        setMeters(uniqueMeters);
      } else {
        console.error("API failed, status:", res.status);
        setMeters([]);
      }
    } catch (err) {
      console.error("Error fetching meters:", err);
      setMeters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  useEffect(() => {
    if (!loading && meters.length > 0) {
      const meterFromUrl = searchParams.get("meter") || "";
      const searchFromUrl = searchParams.get("search") || "";
      const statusFromUrl = searchParams.get("status") || "";
      const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

      if (meterFromUrl && meters.some((m) => m.id === meterFromUrl)) {
        setSelectedMeter(meterFromUrl);
        setSearchQuery(searchFromUrl);
        setStatusFilter(statusFromUrl);
        setCurrentPage(isNaN(pageFromUrl) ? 1 : pageFromUrl);
      } else {
        resetFilters();
        router.push("/data-verification");
      }
    }
  }, [loading, meters, searchParams, router]);

  const resetFilters = () => {
    setSelectedMeter("");
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (selectedMeter) params.set("meter", selectedMeter);
    if (searchQuery) params.set("search", searchQuery);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", currentPage.toString());
    router.push(`/data-verification?${params.toString()}`);
  };

  useEffect(() => {
    if (selectedMeter) updateUrl();
  }, [selectedMeter, searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleMeterChange = (value) => {
    setSelectedMeter(value);
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(1);
    setDropdownSearch("");
    setIsDropdownOpen(false);
  };

  const handleOptionClick = (option) => {
    setSelectedAreaFilter(option);
    setIsFilterOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) setDropdownSearch("");
  };
  // //////implementing area filter---------------------------------------------------------------------

  const filterMetersByArea =
    selectedAreaFilter === "ALL"
      ? meters
      : meters.filter((meter) => meter.location.includes(selectedAreaFilter));

  const filteredMeters = filterMetersByArea.filter(
    (meter) =>
      meter.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      meter.location.toLowerCase().includes(dropdownSearch.toLowerCase())
  );
  // unified outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMeterObj = meters.find((m) => m.id === selectedMeter);

  return (
    <>
      <main className="flex items-start justify-center">
        <div className="relative w-full h-[81vh]">
          <div className="absolute top-[3px] left-0 right-0 bottom-0 bg-white dark:bg-gray-800 shadow-md border-t-3 border-[#265F95] z-10 overflow-y-auto custom-scrollbar-report flex flex-col rounded-md">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-4 sm:pt-8 gap-4">
              <div>
                <h2 className="text-[18px] font-600 text-[#1F5897] dark:text-[#4DA0F0]">
                  Data Verification Panel
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Select a meter from dropdown to verify and update the status
                  of individual data parameters.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                {/* Area filter */}
                <div className="relative flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Select Area:
                  </label>
                  <button
                    ref={filterButtonRef}
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                    className="cursor-pointer border-1 border-gray-300 hover:border-[#1F5897] rounded p-1"
                  >
                    <IoFilterOutline size={22} />
                  </button>
                  {isFilterOpen && (
                    <div
                      ref={filterRef}
                      className="absolute top-[2.2rem] z-50 bg-white dark:bg-gray-700 shadow-lg rounded border border-gray-200 w-40 max-h-[20rem] overflow-y-auto"
                    >
                      {areaOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer text-sm flex items-center"
                        >
                          <div className={`w-4 h-4 rounded-full ${option===selectedAreaFilter ?"bg-[#1F5897] dark:bg-blue-500":""} border-1 border-gray-300 mr-2 flex items-center justify-center`}>
                            {option === selectedAreaFilter && (
                              <Check size={20} className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className={`${option===selectedAreaFilter ?"text-[#1F5897] dark:text-blue-500":"text-gray-700 dark:text-gray-300"} font-500`}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Meter dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Select Meter:
                  </label>
                  <div className="relative w-full sm:w-48">
                    <button
                      ref={dropdownButtonRef}
                      onClick={toggleDropdown}
                      className="appearance-none border cursor-pointer border-gray-300 rounded px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-gray-300 w-full flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1A68B2] transition-all duration-200 hover:border-[#1A68B2]"
                    >
                      <span className="truncate">
                        {loading
                          ? "Loading..."
                          : selectedMeterObj?.name || "-- Select --"}
                      </span>
                      <RiArrowDropDownLine
                        className={`ml-2 text-xl flex-shrink-0 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute mt-1 w-full overflow-hidden rounded bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black/10 focus:outline-none z-20 top-full"
                      >
                        {/* Search input */}
                        <div className="sticky top-0 bg-white dark:bg-gray-700 z-30 px-3 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            placeholder="Search meters..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 dark:bg-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#265F95] focus:border-transparent placeholder-gray-400 dark:placeholder-gray-100 transition-all duration-200"
                            autoFocus
                          />
                        </div>

                        {/* List */}
                        <div className="max-h-[20rem] custom-scrollbar-report overflow-auto">
                          {filteredMeters.length === 0 ? (
                            <div className="py-3 px-4 text-gray-500 text-sm">
                              No meters found
                            </div>
                          ) : (
                            filteredMeters.map((meter, index) => (
                              <button
                                key={meter.id}
                                onClick={() => handleMeterChange(meter.id)}
                                className={`w-full text-left cursor-pointer py-2.5 pl-4 pr-4 truncate text-sm ${
                                  selectedMeter === meter.id
                                    ? "bg-gray-200 dark:bg-gray-500 text-[#1F5897] font-medium"
                                    : "text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500"
                                }`}
                                style={{ animationDelay: `${index * 20}ms` }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">{meter.name}</span>
                                  {selectedMeter === meter.id && (
                                    <span className="text-blue-600 ml-2">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">
                                  {meter.location}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedMeter && (
                  <div className="w-full sm:w-48 animate-fadeIn">
                    <SearchBar
                      setSearchQuery={setSearchQuery}
                      setStatusFilter={setStatusFilter}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {selectedMeter === "" ? (
                <DataVerificationPanelEmptyPage />
              ) : (
                <MeterParameterList
                  data={[]}
                  location={selectedMeterObj?.location || ""}
                  uniqueKey={selectedMeterObj?.unique_key || ""}
                  meterName={selectedMeterObj?.name || ""}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const Page = () => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center h-screen">
        <CustomLoader />
      </div>
    }
  >
    <PageContent />
  </Suspense>
);

export default Page;
