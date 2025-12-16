"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import SelectDropdown from "@/components/reUseUi/SelectDropdown";
import HarmonicDetailSummaryReport from "@/components/reportsComponent/energyComparisonTable/HarmonicDetailSummaryReport";

const sourceOptions = [
  {
    id: 0,
    label: "Wapda 2",
    value: "U27_PLC",
  },
  {
    id: 2,
    label: "Wapda 1",
    value: "U23_GW01",
  },
  {
    id: 3,
    label: "HFO 1",
    value: "U22_PLC",
  },
  {
    id: 4,
    label: "JMS 620",
    value: "U26_PLC",
  },
  {
    id: 5,
    label: "O/G 2 (Unit 5)",
    value: "U23_PLC",
  },
  {
    id: 6,
    label: "O/G 1 (Unit 4)",
    value: "U24_PLC",
  },
  {
    id: 7,
    label: "HFO Aux",
    value: "U25_PLC",
  },
  {
    id: 7,
    label: "HFO Aux",
    value: "U35_PLC",
  },
  {
    id: 7,
    label: "HFO Aux",
    value: "U31_PLC",
  },
  {
    id: 7,
    label: "HFO Aux",
    value: "U32_PLC",
  },
  {
    id: 7,
    label: "HFO Aux",
    value: "U33_PLC",
  },
];

const HarmonicsDetailReport = () => {
  const createSixAM = () => {
    const d = new Date();
    d.setHours(6, 0, 0, 0);
    return d;
  };

  const [resData, setResData] = useState({});
  //   const [usageReportTimePeriod, setUsageReportTimePeriod] = useState("day");
  const usageReportTimePeriod = "day";
  const [selectedSource, setSelectedSource] = useState([]);
  console.log(selectedSource);
  const [sourceDropdwon, setSourceDropdown] = useState(false);
  const [intervalDropdown, setIntervalDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const period1Ref = useRef(null);
  const period2Ref = useRef(null);
  //   const periodStartTime1Ref = useRef(null);
  //   const periodEndTime1Ref = useRef(null);
  //   const periodStartTime2Ref = useRef(null);
  //   const periodEndTime2Ref = useRef(null);
  const sourceDropdownRef = useRef(null);
  const intervalDropdownRef = useRef(null);
  const [period1, setPeriod1] = useState([createSixAM(), createSixAM()]);
  const [period2, setPeriod2] = useState([createSixAM(), createSixAM()]);
  const [period1Date, setPeriod1Date] = useState([null, null]); // NEW: for dates only
  const [period2Date, setPeriod2Date] = useState([null, null]);
  //   const { theme } = useTheme();
  function formatToPKTime(date) {
    if (!date) return "";

    // Create a copy in PKT (UTC+5)
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    // PKT offset = +5 hours
    const pktHours = (utcHours + 5) % 24;

    // Format hours and minutes to 2 digits
    const hh = String(pktHours).padStart(2, "0");
    const mm = String(utcMinutes).padStart(2, "0");

    return `${hh}:${mm}`;
  }

  const toLocalISODate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  //========================handle date range selection========================
  const openPeriod1Calendar = () => {
    if (period1Ref.current) {
      period1Ref.current.setOpen(true);
    }
  };

  const openPeriod2Calendar = () => {
    if (period2Ref.current) {
      period2Ref.current.setOpen(true);
    }
  };
  //   const openPeriod1StartTime = () => {
  //     if (periodStartTime1Ref.current) {
  //       periodStartTime1Ref.current.setOpen(true);
  //     }
  //   };
  //   const openPeriod1endTime = () => {
  //     if (periodEndTime1Ref.current) {
  //       periodEndTime1Ref.current.setOpen(true);
  //     }
  //   };
  //   const openPeriod2StartTime = () => {
  //     if (periodStartTime2Ref.current) {
  //       periodStartTime2Ref.current.setOpen(true);
  //     }
  //   };
  //   const openPeriod2endTime = () => {
  //     if (periodEndTime2Ref.current) {
  //       periodEndTime2Ref.current.setOpen(true);
  //     }
  //   };
  // /=============================================================================
  const fixKarachiOffset = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(d.getHours()); // add 5 hours to prevent shifting backward
    return d;
  };

  const normalizeLocalDate = (date) => {
    if (!date) return null;
    const d = fixKarachiOffset(date);
    d.setHours(0, 0, 0, 0); // set midnight after offset fix
    return d;
  };
  // -------------------dates----------------------
  const Period1startDate = toLocalISODate(period1Date[0]);
  const Period1endDate = toLocalISODate(period1Date[1]);
  const Period2startDate = toLocalISODate(period2Date[0]);
  const Period2endDate = toLocalISODate(period2Date[1]);
  // -------------------time----------------------
  const Period1startTime = "06:00";
  const Period1endTime = "06:00";
  const Period2startTime = "06:00";
  const Period2endTime = "06:00";

  // -------------------Get Payload----------------------
  const payload = {
    Period1startDate: Period1startDate,
    Period1endDate: Period1endDate,
    Period1startTime: Period1startTime,
    Period1endTime: Period1endTime,
    Period2startDate: Period2startDate,
    Period2endDate: Period2endDate,
    Period2startTime: Period2startTime,
    Period2endTime: Period2endTime,
    resolution: usageReportTimePeriod,
    DeviceId: selectedSource,
  };

  const isPeriod1Complete = period1Date[0] && period1Date[1];
  const isPeriod2Complete = period2Date[0] && period2Date[1];

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };
  // ========================= handle Period 1 change ========================
  const handlePeriod1Change = (dates) => {
    const [start, end] = dates.map((d) => normalizeLocalDate(d));

    // Always store the partial selection
    setPeriod1Date([start, end]);

    // Run validation ONLY when end date is selected
    if (!start || !end) return;

    const days = calculateDays(start, end);

    // DAILY validation
    if (usageReportTimePeriod === "day") {
      if (days < 2) {
        Swal.fire({
          title: "Invalid Range",
          text: "You must select at least 2 days.",
          icon: "error",
        });
        setPeriod1Date([null, null]);
        return;
      }
    }
  };
  // ========================= handle Period 2 change ========================
  const handlePeriod2Change = (dates) => {
    const [start, end] = dates.map((d) => normalizeLocalDate(d));

    setPeriod2Date([start, end]); // store partial selection

    if (!period1Date[0] || !period1Date[1]) {
      Swal.fire({
        title: "Select Period 1 First",
        icon: "warning",
      });
      setPeriod2Date([null, null]);
      return;
    }

    if (!start || !end) return; // wait until selection complete

    const p1Days = calculateDays(period1Date[0], period1Date[1]);
    const p2Days = calculateDays(start, end);

    // DAILY validation
    if (p2Days !== p1Days) {
      Swal.fire({
        title: "Invalid Range",
        text: `Period 2 must be exactly ${p1Days} day(s), same as Period 1.`,
        icon: "error",
      });
      setPeriod2Date([null, null]);
      return;
    }
  };

  //============================handle time change=========================
  const showMinAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Invalid Time Range",
      text: "Minimum duration must be at least 30 minutes.",
    });
  };

  const showMaxAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Invalid Time Range",
      text: "Maximum duration allowed is 6 hours.",
    });
  };
  const showMismatchAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Time Mismatch",
      text: "Period 2 duration must be the same as Period 1.",
    });
  };

  const handleTimeChange = (period, index, date) => {
    const MIN_DURATION_MIN = 30; // minutes
    const MAX_DURATION_MIN = 360; // 6 hours

    // 🔹 Normalize date → remove seconds & milliseconds
    const normalize = (d) => {
      if (!d) return d;
      const copy = new Date(d);
      copy.setSeconds(0, 0);
      return copy;
    };

    const getMinutesDiff = (start, end) => Math.round((end - start) / 60000);

    // ---------- NO RESTRICTIONS ----------
    if (usageReportTimePeriod !== "15mins") {
      period === 1
        ? setPeriod1((p) => {
            const copy = [...p];
            copy[index] = normalize(date);
            return copy;
          })
        : setPeriod2((p) => {
            const copy = [...p];
            copy[index] = normalize(date);
            return copy;
          });
      return;
    }

    // ---------- PERIOD 1 ----------
    if (period === 1) {
      setPeriod1((prev) => {
        const updated = [...prev];
        updated[index] = normalize(date);

        const [start, end] = updated;

        if (start && end) {
          let durationMin = getMinutesDiff(start, end);

          if (durationMin < MIN_DURATION_MIN) {
            showMinAlert();
            updated[1] = new Date(start.getTime() + MIN_DURATION_MIN * 60000);
          }

          if (durationMin > MAX_DURATION_MIN) {
            showMaxAlert();
            updated[1] = new Date(start.getTime() + MAX_DURATION_MIN * 60000);
          }
        }

        return updated;
      });
      return;
    }

    // ---------- PERIOD 2 ----------
    if (period === 2) {
      setPeriod2((prev) => {
        const updated = [...prev];
        updated[index] = normalize(date);

        const [start, end] = updated;

        if (start && end) {
          let durationMin = getMinutesDiff(start, end);

          // Own min/max
          if (durationMin < MIN_DURATION_MIN) {
            showMinAlert();
            updated[1] = new Date(start.getTime() + MIN_DURATION_MIN * 60000);
            durationMin = MIN_DURATION_MIN;
          }

          if (durationMin > MAX_DURATION_MIN) {
            showMaxAlert();
            updated[1] = new Date(start.getTime() + MAX_DURATION_MIN * 60000);
            durationMin = MAX_DURATION_MIN;
          }

          // 🔗 Compare with Period 1 (MINUTES-BASED)
          if (period1[0] && period1[1]) {
            const p1DurationMin = getMinutesDiff(period1[0], period1[1]);

            if (durationMin !== p1DurationMin) {
              showMismatchAlert();
              updated[1] = new Date(start.getTime() + p1DurationMin * 60000);
            }
          }
        }

        return updated;
      });
    }
  };

  //============================handle time change=========================

  //   Dropdown click outside handlers
  const toggleIntervalDropdown = () => setIntervalDropdown(!intervalDropdown);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        intervalDropdownRef.current &&
        !intervalDropdownRef.current.contains(event.target)
      ) {
        setIntervalDropdown(false);
      }
      if (
        sourceDropdownRef.current &&
        !sourceDropdownRef.current.contains(event.target)
      ) {
        setSourceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setPeriod2Date([null, null]);
  }, [period1Date]);
  useEffect(() => {
    setPeriod2([null, null]);
  }, [period1]);
  useEffect(() => {
    // Reset periods whenever resolution changes
    setPeriod1([null, null]);
    setPeriod2([null, null]);
    setPeriod1Date([null, null]);
    setPeriod2Date([null, null]);
  }, [usageReportTimePeriod]);
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //===================================Handle all data processing end=================================
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //--------------------------------params data----------------------------------------
  const intervalObj = {
    Period: { p1: "Period 1", p2: "Period 2" },
    "Start Date": {
      p1: toLocalISODate(period1Date[0]),
      p2: toLocalISODate(period1Date[1]),
    },
    "End Date": {
      p1: toLocalISODate(period2Date[0]),
      p2: toLocalISODate(period2Date[1]),
    },
  };

  const selectedLabels = selectedSource
    .map((val) => sourceOptions.find((opt) => opt.value === val)?.label)
    .filter(Boolean);
  //--------------------------------Chart Data----------------------------------------
  const period1Data = Array.isArray(resData?.period1) ? resData.period1 : [];
  const period2Data = Array.isArray(resData?.period2) ? resData.period2 : [];

  const mergePeriodData = ({
    period1Data = [],
    period2Data = [],
    type = "",
  }) => {
    const minLength = Math.min(period1Data.length, period2Data.length);
    return Array.from({ length: minLength }, (_, index) => {
      const p1 = period1Data[index];
      const p2 = period2Data[index];
      return {
        year: `C${index + 1}`, // 👈 interval key

        // Harmonics (Voltage THD)
        p1Harmonics: p1?.[`${selectedSource}_Harmonics_${type}_THD`] ?? 0,
        p2Harmonics: p2?.[`${selectedSource}_Harmonics_${type}_THD`] ?? 0,

        // Min / Max
        p1Max: p1?.[`${selectedSource}_Harmonics_${type}_THD_max`] ?? 0,
        p1Min: p1?.[`${selectedSource}_Harmonics_${type}_THD_min`] ?? 0,

        p2Max: p2?.[`${selectedSource}_Harmonics_${type}_THD_max`] ?? 0,
        p2Min: p2?.[`${selectedSource}_Harmonics_${type}_THD_min`] ?? 0,

        // Dates
        p1date: p1?.timestamp ?? null,
        p2date: p2?.timestamp ?? null,
      };
    });
  };

  const filteredVoltageChartData = mergePeriodData({
    period1Data,
    period2Data,
    type: "V",
  });
  const filteredCurrentChartData = mergePeriodData({
    period1Data,
    period2Data,
    type: "I",
  });
  //--------------------------------Min Max Data----------------------------------------
  function getExtremeValueWithDate({
    data,
    valueKey,
    dateKey,
    type = "max", // "min" or "max"
  }) {
    if (!Array.isArray(data) || data.length === 0) {
      return { value: 0, date: "" }; // ✅ safe default
    }

    let result = null;

    for (const item of data) {
      const value = item?.[valueKey];
      if (value == null) continue;

      if (
        !result ||
        (type === "max" ? value > result.value : value < result.value)
      ) {
        result = {
          value,
          date: item?.[dateKey] || item?.timestamp || "",
        };
      }
    }

    return result ?? { value: 0, date: "" };
  }
  const p1MaxVoltage = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource}_Harmonics_V_THD_max`,
    dateKey: `${selectedSource}_Harmonics_V_THD_max_timestamp`,
    type: "max",
  });
  const p2MaxVoltage = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource}_Harmonics_V_THD_max`,
    dateKey: `${selectedSource}_Harmonics_V_THD_max_timestamp`,
    type: "max",
  });
  const p1MinVoltage = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource}_Harmonics_V_THD_min`,
    dateKey: `${selectedSource}_Harmonics_V_THD_min_timestamp`,
    type: "min",
  });
  const p2MinVoltage = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource}_Harmonics_V_THD_min`,
    dateKey: `${selectedSource}_Harmonics_V_THD_min_timestamp`,
    type: "min",
  });
  const p1MaxCurrent = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource}_Harmonics_I_THD_max`,
    dateKey: `${selectedSource}_Harmonics_I_THD_max_timestamp`,
    type: "max",
  });
  const p2MaxCurrent = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource}_Harmonics_I_THD_max`,
    dateKey: `${selectedSource}_Harmonics_I_THD_max_timestamp`,
    type: "max",
  });
  const p1MinCurrent = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource}_Harmonics_I_THD_min`,
    dateKey: `${selectedSource}_Harmonics_I_THD_min_timestamp`,
    type: "min",
  });
  const p2MinCurrent = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource}_Harmonics_I_THD_min`,
    dateKey: `${selectedSource}_Harmonics_I_THD_min_timestamp`,
    type: "min",
  });
  //--------------------------------Min Max Data----------------------------------------
  const voltageAvgData = [
    {
      period: "Period 1",
      minValue: p1MinVoltage.value,
      minDate: p1MinVoltage.date,
      maxValue: p1MaxVoltage.value,
      maxDate: p1MaxVoltage.date,
    },
    {
      period: "Period 2",
      minValue: p2MinVoltage.value,
      minDate: p2MinVoltage.date,
      maxValue: p2MaxVoltage.value,
      maxDate: p2MaxVoltage.date,
    },
  ];
  const currentAvgData = [
    {
      period: "Period 1",
      minValue: p1MinCurrent.value,
      minDate: p1MinCurrent.date,
      maxValue: p1MaxCurrent.value,
      maxDate: p1MaxCurrent.date,
    },
    {
      period: "Period 2",
      minValue: p2MinCurrent.value,
      minDate: p2MinCurrent.date,
      maxValue: p2MaxCurrent.value,
      maxDate: p2MaxCurrent.date,
    },
  ];

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //===================================Handle all data processing end=================================
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // ===============handle submit=====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usageReportTimePeriod) {
      toast.warning("Please Select Resolution first");
      return;
    }
    if (!selectedSource) {
      toast.warning("Please Select Meter");
      return;
    }
    if (
      !Period1startDate &&
      !Period1endDate &&
      !Period1startTime &&
      !Period1endTime &&
      !Period2startDate &&
      !Period2endDate &&
      !Period2startTime &&
      !Period2endTime
    ) {
      return;
    }
    try {
      setLoadingSubmit(true);
      const res = await fetch(`${config.BASE_URL}/harmonics/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const resResult = await res.json();
      if (res.ok) {
        setResData(resResult);
        setShowResults(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Harmonics Detail Summary Report
        </h1>
        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center ${
              isHovered ? "justify-center" : "justify-start"
            } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
              isHovered ? "w-[90px]" : "w-[40px]"
            }`}
            style={{
              borderRadius: isHovered ? "8px" : "50%",
            }}
          >
            <ImArrowLeft2 className="text-white shrink-0" />
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              Back
            </span>
          </button>
        )}
      </div>
      <hr className="" />
      {!showResults ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-6 ">
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
              {/* Device selector dropdown */}

              <div className="w-full">
                <SelectDropdown
                  label="Select Source"
                  options={sourceOptions}
                  value={selectedSource}
                  onChange={setSelectedSource}
                  isMulti={true}
                  placeholder="Select Sources"
                />
              </div>
              {/* Period 1 */}
              <div className="">
                <span className={` text-[13.51px] font-500 font-inter`}>
                  First Range
                </span>

                <div
                  className={`flex items-center justify-between px-4 w-full border rounded`}
                  onClick={openPeriod1Calendar}
                >
                  <DatePicker
                    ref={period1Ref}
                    selectsRange
                    startDate={period1Date[0]}
                    endDate={period1Date[1]}
                    onChange={handlePeriod1Change}
                    disabled={!usageReportTimePeriod}
                    className={` w-full py-2 ${
                      !usageReportTimePeriod
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "cursor-pointer"
                    } rounded-md text-sm outline-none`}
                    placeholderText={
                      !usageReportTimePeriod
                        ? "Select Resolution first"
                        : "Select date range"
                    }
                    onClick={(e) => e.stopPropagation()} // prevent recursion
                  />

                  <FaRegCalendarAlt />
                </div>
              </div>
              {/* Period 2 */}
              <div className="">
                <span
                  className={`${
                    !isPeriod1Complete ? "text-gray-400 dark:text-gray-500" : ""
                  } text-[13.51px] font-500 font-inter`}
                >
                  Second Range
                </span>

                <div
                  className={` flex items-center justify-between px-4 w-full border rounded ${
                    !isPeriod1Complete ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={openPeriod2Calendar}
                >
                  <DatePicker
                    ref={period2Ref}
                    selectsRange
                    startDate={period2Date[0]}
                    endDate={period2Date[1]}
                    onChange={handlePeriod2Change}
                    disabled={!isPeriod1Complete}
                    className={` w-full py-2 ${
                      !isPeriod1Complete
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "cursor-pointer"
                    } rounded-md text-sm outline-none`}
                    placeholderText={
                      !isPeriod1Complete
                        ? "Select Period 1 first"
                        : "Select matching date range"
                    }
                    onClick={(e) => e.stopPropagation()}
                  />

                  <FaRegCalendarAlt
                    className={`pointer-events-none ${
                      !isPeriod1Complete
                        ? "text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  />
                </div>
              </div>
              {/* ////////////////////time selectors////////////////////////////////////// */}
            </div>
            {/* // here code will be pasted */}

            <div className="w-full flex items-center justify-center mt-5 md:mt-10">
              <button
                type="submit"
                disabled={loadingSubmit}
                className="bg-[#1A68B2] cursor-pointer text-white px-4 py-1 rounded flex items-center justify-center gap-2"
              >
                {loadingSubmit ? (
                  <>
                    <span>Generating</span>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : showResults ? (
        <HarmonicDetailSummaryReport
          voltageChartData={filteredVoltageChartData}
          currentChartData={filteredCurrentChartData}
          intervalObj={intervalObj}
          usageReportTimePeriod={usageReportTimePeriod}
          selectedSource={selectedLabels}
          voltageAvgData={voltageAvgData}
          currentAvgData={currentAvgData}
        />
      ) : null}
    </div>
  );
};
export default HarmonicsDetailReport;
