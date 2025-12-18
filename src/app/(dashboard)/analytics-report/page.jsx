"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import config from "@/constant/apiRouteList";
import { CircularProgress } from "@mui/material";
import { ImArrowLeft2 } from "react-icons/im";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import {
  IoChevronDownOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
// import { useTheme } from "next-themes";
import HarmonicAnalytics from "@/components/reportsComponent/energyComparisonTable/HarmonicAnalytics";
import { HiOutlineClock } from "react-icons/hi2";
import { harmonicsMeterId } from "@/data/harmonicsMeterId";
import { mainMeterMapping } from "@/data/mainMeterMapping";
import SelectDropdown from "@/components/reUseUi/SelectDropdown";
export const areaOptions = [
  {
    meterName: "All",
    meterId: "all",
  },
  {
    meterName: "HFO",
    meterId: "HFO",
  },
  {
    meterName: "Unit 4 HT Room",
    meterId: "HT_Room1",
  },
  {
    meterName: "Unit 5 HT Room",
    meterId: "HT_Room2",
  },
  {
    meterName: "UNIT 4 LT 1",
    meterId: "Unit 4 LT_1",
  },
  {
    meterName: "UNIT 4 LT 2",
    meterId: "Unit 4 LT_2",
  },
  {
    meterName: "UNIT 5 LT 1",
    meterId: "Unit 5 LT_1",
  },
  {
    meterName: "UNIT 5 LT 2",
    meterId: "Unit 5 LT_2",
  },
];

export const InfoCard = ({ content }) => {
  return (
    <div className="relative lg:absolute top-0 right-0 w-full  xl:w-auto">
      <div
        className="relative flex items-center gap-3  py-1 px-3 
                    rounded-md bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 
                    shadow-lg text-white overflow-hidden"
      >
        <div className="relative flex items-center">
          <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-40"></span>
          <span
            className="relative flex items-center justify-center h-8 w-8 
              rounded-full bg-orange-600 shadow-md"
          >
            <IoInformationCircleOutline size={22} className="text-white" />
          </span>
        </div>
        <div className="">{content}</div>
      </div>
    </div>
  );
};

export const sourceOptions = [
  {
    value: "U27_PLC",
    label: "Wapda 2",
  },
  {
    value: "U22_PLC",
    label: "HFO 1",
  },
  {
    value: "U26_PLC",
    label: "JMS 620",
  },
  {
    value: "U23_PLC",
    label: "O/G 2 (Unit 5)",
  },
  {
    value: "U24_PLC",
    label: "O/G 1 (Unit 4)",
  },
  {
    value: "U25_PLC",
    label: "HFO AUX",
  },
  {
    value: "U22_GW01",
    label: "P/H IC HFO",
  },
  {
    value: "U23_GW01",
    label: "Wapda 1",
  },
  {
    value: "U21_GW03",
    label: "Main Incoming (Unit 5)",
  },
  {
    value: "U20_GW03",
    label: "T/F 1",
  },
  {
    value: "U19_GW03",
    label: "T/F 2",
  },
  {
    value: "U1_PLC",
    label: "Roving Transport System",
  },
  {
    value: "U6_PLC",
    label: "Deep Valve Turbine",
  },
  {
    value: "U7_PLC",
    label: "Main Meter",
  },
  {
    value: "U9_PLC",
    label: "Winding 7-9",
  },
  {
    value: "U10_PLC",
    label: "Ring 1-4",
  },
  {
    value: "U11_PLC",
    label: "Ring 17-20",
  },
  {
    value: "U12_PLC",
    label: "Ring 21-24",
  },
  {
    value: "U13_PLC",
    label: "Comber 1-10 + Lap Former 1-2",
  },
  {
    value: "U14_PLC",
    label: "Compressor (119 kW)",
  },
  {
    value: "U15_PLC",
    label: "Simplex 1-6",
  },
  {
    value: "U17_PLC",
    label: "Ring A/C(Supply & Return Fans)",
  },
  {
    value: "U20_PLC",
    label: "Compressor (119kW) Bypass",
  },
  {
    value: "U21_PLC",
    label: "Wapda+HFO+JMS Incoming",
  },
  {
    value: "U1_GW01",
    label: "Back Process A/C",
  },
  {
    value: "U2_GW01",
    label: "Conditioning Machine",
  },
  {
    value: "U3_GW01",
    label: "Winding A/C",
  },
  {
    value: "U5_GW01",
    label: "Card 1-4+9-12",
  },
  {
    value: "U20_GW01",
    label: "Bailing press",
  },
  {
    value: "U8_GW01",
    label: "Blow Room",
  },
  {
    value: "U9_GW01",
    label: "Card 5-8+ 13-14 + Breaker 5-6",
  },
  {
    value: "U10_GW01",
    label: "Winding 1-6",
  },
  {
    value: "U14_GW01",
    label: "B/Card + Comber Filter",
  },
  {
    value: "U13_GW01",
    label: "Wapda+HFO+JMS Incoming",
  },
  {
    value: "U12_GW01",
    label: "B/Card + Comber Filter Bypass",
  },
  {
    value: "U15_GW01",
    label: "Ring 5-8",
  },
  {
    value: "U16_GW01",
    label: "Ring 13-16",
  },
  {
    value: "U17_GW01",
    label: "Ring 9-12",
  },
  {
    value: "U24_GW01",
    label: "Solar 352.50 kW",
  },
  {
    value: "U28_PLC",
    label: "Solar 52.17 kW",
  },
  {
    value: "U6_GW02",
    label: "Solar 1185 KW",
  },
  {
    value: "U7_GW02",
    label: "Ring 1-3",
  },
  {
    value: "U8_GW02",
    label: "Ring A/C (Supply Fans)",
  },
  {
    value: "U9_GW02",
    label: "Blow Room",
  },
  {
    value: "U10_GW02",
    label: "Ring 4-6",
  },
  {
    value: "U11_GW02",
    label: "A/C Back Process",
  },
  {
    value: "U12_GW02",
    label: "Lighting Internal",
  },
  {
    value: "U13_GW02",
    label: "T/F 1",
  },
  {
    value: "U15_GW02",
    label: "Ring A/C (Return Fans)",
  },
  {
    value: "U17_GW02",
    label: "Card 8-14",
  },
  {
    value: "U18_GW02",
    label: "Winding 1-9",
  },
  {
    value: "U19_GW02",
    label: "Card 1-7",
  },
  {
    value: "U20_GW02",
    label: "Winding A/C",
  },
  {
    value: "U21_GW02",
    label: "Simplex + Drawing Breaker",
  },
  {
    value: "U22_GW02",
    label: "Ring Unit 4 (17-20)",
  },
  {
    value: "U23_GW02",
    label: "Drawing Finisher 1-8",
  },
  {
    value: "U1_GW03",
    label: "Ring 7-9",
  },
  {
    value: "U2_GW03",
    label: "Conditioning Machine",
  },
  {
    value: "U4_GW03",
    label: "Roving Transport System",
  },
  {
    value: "U5_GW03",
    label: "Ring 10-12",
  },
  {
    value: "U9_GW03",
    label: "Ring 13-15",
  },
  {
    value: "U10_GW03",
    label: "Winding 10-18",
  },
  {
    value: "U11_GW03",
    label: "Bailing Press",
  },
  {
    value: "U12_GW03",
    label: "Ring 16-18",
  },
  // {
  //     "value": "U13_GW03",
  //     "label": "B/Card+Comber filter"
  // },
  {
    value: "U14_GW03",
    label: "Lighting Internal",
  },
  {
    value: "U15_GW03",
    label: "Deep Valve Turbine",
  },
  {
    value: "U16_GW03",
    label: "T/F 2",
  },
  {
    value: "U18_GW03",
    label: "PF Panel",
  },
];
const intervalOptions = [
  {
    id: 0,
    label: "15 Minutes",
    value: "15mins",
  },
  {
    id: 2,
    label: "Hourly",
    value: "hour",
  },
  {
    id: 3,
    label: "Day",
    value: "day",
  },
];

const harmonicsMeterSet = new Set(harmonicsMeterId ?? []);

export const filteredArray = (mainMeterMapping ?? []).filter((v) =>
  harmonicsMeterSet.has(v?.meterId)
);

const HarmonicsReport = () => {
  const createSixAM = () => {
    const d = new Date();
    d.setHours(6, 0, 0, 0);
    return d;
  };

  const [resData, setResData] = useState({});
  const [usageReportTimePeriod, setUsageReportTimePeriod] = useState("");
  const [selectedArea, setSelectedArea] = useState(["all"]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [sourceDropdwon, setSourceDropdown] = useState(false);
  const [intervalDropdown, setIntervalDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const period1Ref = useRef(null);
  const period2Ref = useRef(null);
  const periodStartTime1Ref = useRef(null);
  const periodEndTime1Ref = useRef(null);
  const periodStartTime2Ref = useRef(null);
  const periodEndTime2Ref = useRef(null);
  const sourceDropdownRef = useRef(null);
  const intervalDropdownRef = useRef(null);
  const [period1, setPeriod1] = useState([createSixAM(), createSixAM()]);
  const [period2, setPeriod2] = useState([createSixAM(), createSixAM()]);
  const [period1Date, setPeriod1Date] = useState([null, null]); // NEW: for dates only
  const [period2Date, setPeriod2Date] = useState([null, null]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const filteredDevices = selectedArea.includes("all")
    ? filteredArray
    : filteredArray.filter((meter) => selectedArea.includes(meter.area));
  // const { theme } = useTheme();
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
  const openPeriod1StartTime = () => {
    if (periodStartTime1Ref.current) {
      periodStartTime1Ref.current.setOpen(true);
    }
  };
  const openPeriod1endTime = () => {
    if (periodEndTime1Ref.current) {
      periodEndTime1Ref.current.setOpen(true);
    }
  };
  const openPeriod2StartTime = () => {
    if (periodStartTime2Ref.current) {
      periodStartTime2Ref.current.setOpen(true);
    }
  };
  const openPeriod2endTime = () => {
    if (periodEndTime2Ref.current) {
      periodEndTime2Ref.current.setOpen(true);
    }
  };
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
  const Period1startTime =
    usageReportTimePeriod === "15mins" ? formatToPKTime(period1[0]) : "06:00";
  const Period1endTime =
    usageReportTimePeriod === "15mins" ? formatToPKTime(period1[1]) : "06:00";
  const Period2startTime =
    usageReportTimePeriod === "15mins" ? formatToPKTime(period2[0]) : "06:00";
  const Period2endTime =
    usageReportTimePeriod === "15mins" ? formatToPKTime(period2[1]) : "06:00";

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

    if (usageReportTimePeriod === "15mins") {
      if (days > 1) {
        Swal.fire({
          title: "Invalid Range",
          text: "For for 15 minutes data, you must select exactly 1 day.",
          icon: "error",
        });
        setPeriod1Date([null, null]);
        return;
      }
      return; // skip daily checks
    } else if (usageReportTimePeriod === "hour") {
      if (days !== 2) {
        Swal.fire({
          title: "Invalid Range",
          text: "For hourly data, you must select exactly 2 days.",
          icon: "error",
        });
        setPeriod1Date([null, null]);
        return;
      }
      return; // skip daily checks
    }

    // DAILY validation
    else if (usageReportTimePeriod === "day") {
      if (days < 2) {
        Swal.fire({
          title: "Invalid Range",
          text: "You must select at least 2 days.",
          icon: "error",
        });
        setPeriod1Date([null, null]);
        return;
      }

      if (days > 30) {
        Swal.fire({
          title: "Invalid Range",
          text: "You can select a maximum of 30 days.",
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

    if (usageReportTimePeriod === "5mins") {
      if (p1Days !== 1 || p2Days !== 1) {
        Swal.fire({
          title: "Invalid Range",
          text: "For 5 Miutes data, both periods must be exactly 1 day.",
          icon: "error",
        });
        setPeriod2Date([null, null]);
        return;
      }
      return; // skip daily checks
    }
    if (usageReportTimePeriod === "hour") {
      if (p1Days !== 2 || p2Days !== 2) {
        Swal.fire({
          title: "Invalid Range",
          text: "For hourly data, both periods must be exactly 2 days.",
          icon: "error",
        });
        setPeriod2Date([null, null]);
        return;
      }
      return; // skip daily checks
    }

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
  const toggleSourceDropdown = () => setSourceDropdown(!sourceDropdwon);
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

  const sourceLabel = filteredDevices.find(
    (source) => source.meterId === selectedSource[0]
  );

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
        p1Harmonics: p1?.[`${selectedSource[0]}_Harmonics_${type}_THD`] ?? 0,
        p2Harmonics: p2?.[`${selectedSource[0]}_Harmonics_${type}_THD`] ?? 0,

        // Min / Max
        p1Max: p1?.[`${selectedSource[0]}_Harmonics_${type}_THD_max`] ?? 0,
        p1Min: p1?.[`${selectedSource[0]}_Harmonics_${type}_THD_min`] ?? 0,

        p2Max: p2?.[`${selectedSource[0]}_Harmonics_${type}_THD_max`] ?? 0,
        p2Min: p2?.[`${selectedSource[0]}_Harmonics_${type}_THD_min`] ?? 0,

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
    valueKey: `${selectedSource[0]}_Harmonics_V_THD_max`,
    dateKey: `${selectedSource[0]}_Harmonics_V_THD_max_timestamp`,
    type: "max",
  });

  const p2MaxVoltage = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource[0]}_Harmonics_V_THD_max`,
    dateKey: `${selectedSource[0]}_Harmonics_V_THD_max_timestamp`,
    type: "max",
  });

  const p1MinVoltage = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource[0]}_Harmonics_V_THD_min`,
    dateKey: `${selectedSource[0]}_Harmonics_V_THD_min_timestamp`,
    type: "min",
  });

  const p2MinVoltage = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource[0]}_Harmonics_V_THD_min`,
    dateKey: `${selectedSource[0]}_Harmonics_V_THD_min_timestamp`,
    type: "min",
  });
  const p1MaxCurrent = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource[0]}_Harmonics_I_THD_max`,
    dateKey: `${selectedSource[0]}_Harmonics_I_THD_max_timestamp`,
    type: "max",
  });

  const p2MaxCurrent = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource[0]}_Harmonics_I_THD_max`,
    dateKey: `${selectedSource[0]}_Harmonics_I_THD_max_timestamp`,
    type: "max",
  });

  const p1MinCurrent = getExtremeValueWithDate({
    data: period1Data,
    valueKey: `${selectedSource[0]}_Harmonics_I_THD_min`,
    dateKey: `${selectedSource[0]}_Harmonics_I_THD_min_timestamp`,
    type: "min",
  });

  const p2MinCurrent = getExtremeValueWithDate({
    data: period2Data,
    valueKey: `${selectedSource[0]}_Harmonics_I_THD_min`,
    dateKey: `${selectedSource[0]}_Harmonics_I_THD_min_timestamp`,
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
    if (!selectedSource[0]) {
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
  useEffect(() => {
    setSelectedSource([]);
  }, [selectedArea]);
  return (
    <div className="relative bg-white dark:bg-gray-800 h-full md:h-[81vh] overflow-y-auto custom-scrollbar-report rounded-md border-t-3 border-[#1A68B2] px-3 md:px-6 pt-2">
      {showResults === false && usageReportTimePeriod === "15mins" ? (
        <InfoCard
          content="For hour 15 Minutes Resolution please select single date and select
            Maximum 6 hours on each time interval"
        />
      ) : showResults === false && usageReportTimePeriod === "hour" ? (
        <InfoCard content="For hourly resolution please select only 2 days" />
      ) : showResults === false && usageReportTimePeriod === "day" ? (
        <InfoCard
          content="For daily resolution please select atleast 2 days(due to 6:00-6:00
            time interval) and maximum 30 days"
        />
      ) : (
        ""
      )}
      <div className="flex pb-3 items-center justify-between">
        <h1 className="text-[18.22px] text-raleway font-600">
          Harmonics Analytics Report
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
              {/* Interval selector dropdown */}
              <div className="flex flex-col w-full items-start justify-center gap-1">
                <span className="text-[13.51px] font-500 font-inter text-black dark:text-white">
                  Select Resolution
                </span>
                <div
                  className="relative inline-block w-full"
                  ref={intervalDropdownRef}
                >
                  <button
                    type="button"
                    onClick={toggleIntervalDropdown}
                    className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border cursor-pointer border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
                  >
                    {/* Find and display the label instead of the value */}
                    {intervalOptions.find(
                      (option) => option.value === usageReportTimePeriod
                    )?.label || "Select Resolution"}
                    <IoChevronDownOutline
                      className={`transition-all duration-300 ${
                        intervalDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {intervalDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
                      {intervalOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white"
                        >
                          <input
                            type="radio"
                            checked={usageReportTimePeriod === option.value}
                            value={option.value}
                            onChange={(e) => {
                              setIntervalDropdown(false);
                              setUsageReportTimePeriod(e.target.value);
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Area selector dropdown */}
              <div className="w-full">
                <SelectDropdown
                  label="Select Area"
                  options2={areaOptions}
                  value={selectedArea}
                  onChange={setSelectedArea}
                  isMulti={false}
                  showSubLabel={false}
                  enableSearch={false}
                  placeholder="Select Area"
                />
              </div>
              {/* Device selector dropdown */}
              <div className="w-full">
                <SelectDropdown
                  label="Select Source"
                  options2={filteredDevices}
                  value={selectedSource}
                  onChange={setSelectedSource}
                  isMulti={false}
                  showSubLabel={true}
                  enableSearch={true}
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
              {/* period 1 time interval */}
              {usageReportTimePeriod === "15mins" && isPeriod1Complete && (
                <>
                  <div className="">
                    <span>Period 1 Time Interval</span>
                    <div className="grid grid-cols-2 items-center justify-center gap-2">
                      <div
                        onClick={openPeriod1StartTime}
                        className="w-full flex items-center justify-around border p-1 pl-3 rounded flex items-center gap-2"
                      >
                        <label htmlFor="">From</label>
                        {/* <div className="bg-gray-400 dark:bg-gray-600 w-[2px] h-[25px]"></div> */}
                        <DatePicker
                          ref={periodStartTime1Ref}
                          selected={period1[0]}
                          onChange={(date) => handleTimeChange(1, 0, date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Start Time"
                          dateFormat="hh:mm aa"
                          className="rounded p-1 outline-none w-full"
                        />
                        <HiOutlineClock className="text-[22px]" />
                      </div>
                      <div
                        onClick={openPeriod1endTime}
                        className="w-full border flex items-center justify-around p-1 pl-3 rounded flex items-center gap-2"
                      >
                        <label htmlFor="">To</label>
                        {/* <div className="bg-gray-400 dark:bg-gray-600 w-[1.8px] h-[25px]"></div> */}
                        <DatePicker
                          ref={periodEndTime1Ref}
                          selected={period1[1]}
                          onChange={(date) => handleTimeChange(1, 1, date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End Time"
                          dateFormat="hh:mm aa"
                          className="rounded p-1 outline-none w-full"
                        />
                        <HiOutlineClock className="text-[22px]" />
                      </div>
                    </div>
                  </div>
                </>
              )}

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
              {/* ///// period 2 time selectors//// */}
              {usageReportTimePeriod === "15mins" && isPeriod2Complete && (
                <>
                  <div>
                    <span>Period 2 Time Interval</span>
                    <div className="grid grid-cols-2 items-center justify-center gap-2">
                      <div
                        onClick={openPeriod2StartTime}
                        className="w-full flex items-center justify-around border p-1 pl-3 rounded  flex items-center gap-2"
                      >
                        <label htmlFor="">From</label>
                        {/* <div className="bg-gray-400 dark:bg-gray-600 w-[2px] h-[25px]"></div> */}
                        <DatePicker
                          ref={periodStartTime2Ref}
                          selected={period2[0]}
                          onChange={(date) => handleTimeChange(2, 0, date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Start Time"
                          dateFormat="hh:mm aa"
                          className="p-1 outline-none w-full"
                        />
                        <HiOutlineClock className="text-[22px]" />
                      </div>
                      <div
                        onClick={openPeriod2endTime}
                        className="w-full border flex items-center justify-around p-1 pl-3 rounded  flex items-center gap-2"
                      >
                        <label htmlFor="">To</label>
                        {/* <div className="bg-gray-400 dark:bg-gray-600 w-[1.8px] h-[25px]"></div> */}
                        <DatePicker
                          ref={periodEndTime2Ref}
                          selected={period2[1]}
                          onChange={(date) => handleTimeChange(2, 1, date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End Time"
                          dateFormat="hh:mm aa"
                          className="p-1 outline-none w-full"
                        />
                        <HiOutlineClock className="text-[22px]" />
                      </div>
                    </div>
                  </div>
                </>
              )}
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
        <HarmonicAnalytics
          voltageChartData={filteredVoltageChartData}
          currentChartData={filteredCurrentChartData}
          intervalObj={intervalObj}
          usageReportTimePeriod={usageReportTimePeriod}
          selectedSource={sourceLabel?.meterName}
          voltageAvgData={voltageAvgData}
          currentAvgData={currentAvgData}
        />
      ) : null}
    </div>
  );
};
export default HarmonicsReport;
