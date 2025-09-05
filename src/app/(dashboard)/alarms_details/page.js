'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import SelectDropdown from '../../../components/ui/SelectDropdown';
import ViewDetailsModal from '../../../components/AlarmsComponents/Alarm_Detail_View';
import TimerComponent from '../../../components/AlarmsComponents/timer';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import config from '../../../config';

// ====== CONSTANTS FOR FIXED BODY HEIGHT ======
const FIXED_ROWS = 10;  // keep pagination visually fixed after 10 rows
const ROW_HEIGHT = 40;  // matches your h-[40px]

// ====== HELPERS ======
const getAlarmColor = (alarm) => {
  const color = alarm?.alarmConfigure?.alarmType?.color?.trim();
  if (color) return color; // expect #RRGGBB/rgb(...)
  if (alarm?.severity === 'high') return '#CB0000';
  if (alarm?.severity === 'low') return '#008622';
  return '#FCC60D';
};

const parseDisplayDate = (s) => {
  const date = new Date(s);
  return date.getTime() || 0;
};

const parseAck = (row) => {
  let a = 0, t = 0;
  try {
    const [aa, tt] = String(row.acknowledgeStatus || '0/0').split('/').map(Number);
    a = isNaN(aa) ? 0 : aa;
    t = isNaN(tt) ? 0 : tt;
  } catch {}
  return { ack: a, total: t, unack: Math.max(t - a, 0) };
};

const getViewConfig = (typeRaw) => {
  const t = (typeRaw || '').toLowerCase();

  if (t === 'unacknowledged') {
    return {
      title: 'Unacknowledged Alarms',
      subtitle: 'Helping users monitor recent trends, repeating alarms, or new risks.',
      midFilterLabel: 'Location',
      showAckCol: false,
      showDateRange: true,
      forceUnackOnly: true,
    };
  }

  if (t === 'recent') {
    return {
      title: 'Recent Alarms',
      subtitle: 'Helping users monitor recent trends, repeating alarms, or new risks.',
      midFilterLabel: 'Location',
      showAckCol: true,
      showDateRange: false,
      forceUnackOnly: false,
    };
  }

  return {
    title: 'All Alarms',
    subtitle: 'Archive of all alarms — active, past, acknowledged, unacknowledged.',
    midFilterLabel: 'Location',
    showAckCol: true,
    showDateRange: true,
    forceUnackOnly: false,
  };
};

const getIntervalBounds = (interval) => {
  if (!interval) return null;

  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();

  switch (String(interval).toLowerCase()) {
    case 'today':
      return { start: startOfToday, end };
    case 'yesterday': {
      const yStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0).getTime();
      const yEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999).getTime();
      return { start: yStart, end: yEnd };
    }
    case 'last 3 days': {
      const threeDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0, 0, 0).getTime();
      return { start: threeDaysAgo, end };
    }
    default:
      return null;
  }
};

const formatAlarmDate = (triggeredAt) => {
  const zonedDate = toZonedTime(new Date(triggeredAt), 'Asia/Karachi');
  return format(zonedDate, 'dd-M-yyyy HH:mm');
};

const formatStartEndDate = (date) => {
  if (!date) return '';
  const zonedDate = toZonedTime(new Date(date), 'Asia/Karachi');
  return format(zonedDate, 'yyyy-MM-dd');
};

// ====================== PAGE ======================
export default function AllAlarmsLikeImage() {
  const searchParams = useSearchParams();

  const [isUpdating, setIsUpdating] = useState(false);
  const [sort, setSort] = useState({ key: '', dir: 'asc' });
  const [alarmTypeFilter, setAlarmTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [alarmNameFilter, setAlarmNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const type = searchParams.get('type') || 'All';
  const cfg = useMemo(() => getViewConfig(type), [type]);

  const [interval, setInterval] = useState('');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [alarmData, setAlarmData] = useState([]);

  const startTs = useMemo(
    () => (startDate ? new Date(`${startDate}T00:00:00`).getTime() : null),
    [startDate]
  );
  const endTs = useMemo(
    () => (endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null),
    [endDate]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Reset pagination on filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [alarmTypeFilter, locationFilter, alarmNameFilter, sort, pageSize, startDate, endDate, type, interval]);

  const generatePayload = (tabType) => {
    switch (tabType) {
      case 'Unacknowledged':
        return {
          alarmAcknowledgeStatus: 'Unacknowledged',
          alarmStatus: false,
        };
      case 'Recent':
        return {
          range: 'Last 3 Calendar Days',
          alarmStatus: false,
        };
      case 'All':
      default:
        return { alarmStatus: false };
    }
  };

  const fetchAlarms = async () => {
    setIsUpdating(true);
    const payload = generatePayload(type);
    try {
      const response = await axios.post(`${config.BASE_URL}/alarms/get-all-Alarms`, payload);
      setAlarmData(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching alarm data:', error);
      setAlarmData([]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTimerFinish = useCallback(() => {
    fetchAlarms();
  }, []);

  const onAcknowledge = () => {
    fetchAlarms();
  };

  // 1) Define column accessors (used for sorting)
  const columns = useMemo(() => {
    const base = [
      {
        key: 'lastOccurrence',
        label: 'Last Occurrence',
        sortable: true,
        get: (a) => new Date(a?.alarmLastOccurrence ?? 0).getTime(),
      },
      {
        key: 'alarmName',
        label: 'Alarm Name',
        sortable: true,
        get: (a) => a?.alarmConfigure?.alarmName ?? '',
      },
      {
        key: 'location',
        label: 'Location',
        sortable: true,
        get: (a) => a?.alarmConfigure?.alarmLocation ?? '',
      },
      {
        key: 'currentThreshold',
        label: 'Current Threshold',
        sortable: true,
        get: (a) => {
          const v = a?.alarmOccurrences?.[0]?.alarmThresholdValue;
          const num = typeof v === 'string' ? parseFloat(v.replace(/[^\d.-]/g, '')) : Number(v);
          return Number.isFinite(num) ? num : -Infinity;
        },
      },
      {
        key: 'countOccurrences',
        label: 'Count Of Occurrences',
        sortable: true,
        get: (a) => Number(a?.alarmOccurrenceCount ?? 0),
      },
    ];

    if (cfg.showAckCol) {
      base.push({
        key: 'acknowledgeStatus',
        label: 'Acknowledge Status',
        sortable: true,
        get: (a) => {
          const ack = Number(a?.alarmAcknowledgementStatusCount ?? 0);
          const total = Number(a?.alarmOccurrenceCount ?? 0) || 1;
          return ack / total;
        },
      });
    }
    return base;
  }, [cfg.showAckCol]);

  // initial fetch + refetch on tab change
  useEffect(() => {
    fetchAlarms();
  }, [type]);

  // Reset filters when page type (tab) changes
  useEffect(() => {
    setAlarmTypeFilter('');
    setLocationFilter('');
    setAlarmNameFilter('');
    setStartDate('');
    setEndDate('');
    setInterval('');
    if (!cfg.showDateRange) {
      setSort({ key: 'lastOccurrence', dir: 'desc' });
    } else {
      setSort({ key: '', dir: 'asc' });
    }
    setCurrentPage(1);
  }, [type, cfg.showDateRange]);

  useEffect(() => {
    if (!cfg.showDateRange) {
      setSort({ key: 'lastOccurrence', dir: 'desc' });
    }
  }, [cfg.showDateRange]);

  const alarmTypes = useMemo(
    () => [...new Set(alarmData.map((a) => a?.alarmConfigure?.alarmType?.type).filter(Boolean))],
    [alarmData]
  );
  const locations = useMemo(
    () => [...new Set(alarmData.map((a) => a?.alarmConfigure?.alarmLocation).filter(Boolean))],
    [alarmData]
  );
  const alarmNames = useMemo(
    () => [...new Set(alarmData.map((a) => a?.alarmConfigure?.alarmName).filter(Boolean))],
    [alarmData]
  );

  const intervalBounds = useMemo(() => {
    if (cfg.showDateRange) return null;
    return getIntervalBounds(interval);
  }, [cfg.showDateRange, interval]);

  const filteredAlarms = useMemo(() => {
    return alarmData.filter((alarm) => {
      const occTs = parseDisplayDate(alarm?.alarmLastOccurrence);

      // Interval filter (Recent)
      if (intervalBounds) {
        if (occTs < intervalBounds.start || occTs > intervalBounds.end) return false;
      }

      // Date range filter (All / Unack)
      if (startTs && occTs < startTs) return false;
      if (endTs && occTs > endTs) return false;

      // Unack filter: keep alarms that have at least one Unacknowledged occurrence
      if (cfg.forceUnackOnly) {
        const hasUnack = alarm?.alarmOccurrences?.some(
          (o) => String(o?.alarmAcknowledgeStatus) === 'Unacknowledged'
        );
        if (!hasUnack) return false;
      }

      // General filters
      if (alarmTypeFilter && alarm?.alarmConfigure?.alarmType?.type !== alarmTypeFilter) return false;
      if (locationFilter && alarm?.alarmConfigure?.alarmLocation !== locationFilter) return false;
      if (alarmNameFilter && alarm?.alarmConfigure?.alarmName !== alarmNameFilter) return false;

      return true;
    });
  }, [alarmData, alarmTypeFilter, locationFilter, alarmNameFilter, startTs, endTs, cfg, intervalBounds]);

  // 2) Sort AFTER filtering, using column getter
  const sortedAlarms = useMemo(() => {
    const arr = [...filteredAlarms];
    if (!sort.key) return arr;
    const col = columns.find((c) => c.key === sort.key);
    const getter = col?.get ?? ((x) => x?.[sort.key]);

    arr.sort((a, b) => {
      const va = getter(a);
      const vb = getter(b);
      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      return String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    });
    return sort.dir === 'asc' ? arr : arr.reverse();
  }, [filteredAlarms, sort, columns]);

  const totalItems = sortedAlarms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const pageAlarms = sortedAlarms.slice(startIdx, endIdx);

  // Filler rows to keep body exactly 10 rows tall
  const fillerCount = Math.max(0, FIXED_ROWS - pageAlarms.length);

  // Sort handler
  const onSort = useCallback((key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  }, []);

  // Pagination handlers
  const gotoFirst = useCallback(() => setCurrentPage(1), []);
  const gotoPrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const gotoNext = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
  const gotoLast = useCallback(() => setCurrentPage(totalPages), [totalPages]);

  // Modal
  const openModal = useCallback((row) => {
    setModalData(row);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, []);

  // basis width depending on column count (6 when Ack shown, else 5)
  const basisCls = columns.length === 6 ? 'basis-[16.66%]' : 'basis-[20%]';

  return (
    <div className="w-full dark:bg-gray-800 p-4 min-h-[81vh] rounded-[8px] bg-white !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">
      {/* Header + Filters */}
      <div className="w-full flex flex-wrap items-start mb-3">
        <div className="w-full sm:flex-1 sm:pr-4 text-left">
          <span className="text-2xl text-[#626469] dark:text-white font-semibold">{cfg.title}</span>
          <div className="mt-1 flex items-center justify-between sm:block">
            <p className="text-[15.04px] text-[#7E7E7E] dark:text-gray-200 m-0">
              {cfg.subtitle}
            </p>
            <div className="ml-4 text-sm text-[#014D89] dark:text-gray-100 whitespace-nowrap sm:hidden">
              <TimerComponent onTimerFinish={handleTimerFinish} />
            </div>
          </div>
        </div>

        <div className="w-full sm:flex-1 sm:w-3/5 mt-3 sm:mt-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-end lg:items-center">
            <SelectDropdown
              label="Alarm Name"
              options={alarmNames}
              selectedValue={alarmNameFilter}
              onChange={setAlarmNameFilter}
              width="w-full lg:w-36"
              padding="!h-9 !px-3 !py-0"
              labelshow={false}
            />

            <SelectDropdown
              label={cfg.midFilterLabel}
              options={locations}
              selectedValue={locationFilter}
              onChange={setLocationFilter}
              width="w-full lg:w-36"
              padding="!h-9 !px-3 !py-0"
              labelshow={false}
            />

            <SelectDropdown
              label="Severity"
              options={alarmTypes}
              selectedValue={alarmTypeFilter}
              onChange={setAlarmTypeFilter}
              width="w-full lg:w-36"
              padding="!h-9 !px-3 !py-0"
              labelshow={false}
            />

            {/* Date controls or Interval */}
            {cfg.showDateRange ? (
              <>
                <div className="relative w-[full] lg:w-38">
                  <input
                    ref={startDateRef}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 px-3 pr-9 border border-gray-300 rounded text-sm leading-none dark:bg-gray-700 dark:border-gray-600 dark:text-white hide-calendar-icon appearance-none"
                  />
                  <FaCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer dark:text-white"
                    onClick={() => startDateRef.current?.showPicker()}
                  />
                </div>
                <div className="relative w-[full] lg:w-38">
                  <input
                    ref={endDateRef}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!startDate}
                    min={startDate}
                    className="w-full h-9 px-3 pr-9 border border-gray-300 rounded text-sm leading-none dark:bg-gray-700 dark:border-gray-600 dark:text-white hide-calendar-icon appearance-none"
                  />
                  <FaCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer dark:text-white"
                    onClick={() => endDateRef.current?.showPicker()}
                  />
                </div>
              </>
            ) : (
              <SelectDropdown
                label="Interval"
                options={['Today', 'Yesterday', 'Last 3 Days']}
                selectedValue={interval ? interval.charAt(0).toUpperCase() + interval.slice(1) : ''}
                onChange={(v) => setInterval(String(v).toLowerCase())}
                width="w-full lg:w-40"
                padding="!h-9 !px-3 !py-0"
                labelshow={false}
              />
            )}
          </div>

          <div className="mt-2 text-right text-sm text-[#014D89] dark:text-gray-100 whitespace-nowrap hidden sm:block">
            <TimerComponent onTimerFinish={handleTimerFinish} />
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="border border-black/8 dark:border-gray-700 rounded-[5px] overflow-hidden">
        <div className="hidden md:block">
          {/* Header Row */}
          <div className="bg-[#02508C] text-white !font-[Inter] font-bold text-[12px] overflow-hidden rounded-t-md">
            <div className="h-[32px] flex items-stretch">
              {columns.map((col, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === columns.length - 1;
                const isActive = sort.key === col.key;
                const ascOn = isActive && sort.dir === 'asc';
                const descOn = isActive && sort.dir === 'desc';

                const cellCls = [
                  basisCls,
                  'px-2 lg:px-4 flex items-center justify-center gap-1',
                  !isFirst ? 'border-l border-white/20' : '',
                  isFirst ? 'rounded-tl-md' : '',
                  isLast ? 'rounded-tr-md' : '',
                ].join(' ');

                return (
                  <div key={col.key} className={cellCls}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="flex items-center gap-2 outline-none focus:ring-0"
                        aria-label={`Sort by ${col.label}`}
                      >
                        <span className="leading-none select-none">{col.label}</span>
                        <span className="flex flex-col leading-none -mt-[1px]">
                          <svg width="10" height="6" viewBox="0 0 20 12" fill="none" aria-hidden>
                            <path d="M5 8 L10 3 L15 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={ascOn ? 1 : 0.45} />
                          </svg>
                          <svg width="10" height="6" viewBox="0 0 20 12" fill="none" aria-hidden>
                            <path d="M5 4 L10 9 L15 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={descOn ? 1 : 0.45} />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <span className="leading-none select-none">{col.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body with fixed height and loader overlay */}
          <div className="relative">
            <div
              className="divide-y divide-[#EBEBEB] dark:divide-gray-700 overflow-y-auto"
              style={{ maxHeight: `${ROW_HEIGHT * FIXED_ROWS}px`, minHeight: `${ROW_HEIGHT * FIXED_ROWS}px` }}
            >
              {pageAlarms.map((alarm) => (
                <div
                  key={alarm?._id}
                  onClick={() => openModal(alarm)}
                  className="flex items-center h-[40px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[12px] !font-[Inter] cursor-pointer"
                  title="View details"
                >
                  <div className={`${basisCls} px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter]`}>
                    {alarm?.alarmLastOccurrence ? formatAlarmDate(alarm.alarmLastOccurrence) : '—'}
                  </div>
                  <div className={`${basisCls} px-2 lg:px-4 flex items-center justify-center gap-2`}>
                    <div className="w-[9px] h-[9px] rounded-sm" style={{ backgroundColor: getAlarmColor(alarm) }} />
                    <span className="text-black/88 dark:text-gray-100 !font-[Inter]">
                      {alarm?.alarmConfigure?.alarmName ?? '—'}
                    </span>
                  </div>
                  <div className={`${basisCls} px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter]`}>
                    {alarm?.alarmConfigure?.alarmLocation ?? '—'}
                  </div>
                  <div className={`${basisCls} px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter]`}>
                    {alarm?.alarmOccurrences?.[0]?.alarmThresholdValue ?? '—'}
                  </div>
                  <div className={`${basisCls} px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter]`}>
                    {alarm?.alarmOccurrenceCount ?? 0}
                  </div>
                  {cfg.showAckCol && (
                    <div className={`${basisCls} px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter]`}>
                      {(alarm?.alarmAcknowledgementStatusCount ?? 0)}/{(alarm?.alarmOccurrenceCount ?? 0)}
                    </div>
                  )}
                </div>
              ))}

              {/* Filler rows to maintain fixed height when < 10 rows */}
              {Array.from({ length: fillerCount }).map((_, i) => (
                <div
                  key={`filler-${i}`}
                  className="flex items-center h-[40px] text-[12px] !font-[Inter] bg-white dark:bg-gray-800"
                  aria-hidden
                >
                  {columns.map((_, idx) => (
                    <div key={idx} className={`${basisCls} px-2 lg:px-4 text-transparent`}>&nbsp;</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Empty state (shows inside the fixed-height body) */}
            {totalItems === 0 && !isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                No alarms to display.
              </div>
            )}

            {/* Loader overlay (does not shift layout) */}
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 pointer-events-none">
                <div className="loader" />
              </div>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <div className="bg-[#02508C] h-[32px] flex items-center justify-center text-white font-raleway font-bold text-sm">
            {cfg.title}
          </div>
          <div className="divide-y divide-[#EBEBEB] dark:divide-gray-700">
            {pageAlarms.map((alarm) => (
              <div
                key={alarm?._id}
                onClick={() => openModal(alarm)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="View details"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-black/73 dark:text-gray-100 !font-[Inter] text-sm">
                    {alarm?.alarmLastOccurrence ? formatAlarmDate(alarm.alarmLastOccurrence) : '—'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-[9px] h-[9px] rounded-sm" style={{ backgroundColor: getAlarmColor(alarm) }} />
                    <span className="text-black/88 dark:text-gray-100 !font-[Inter] text-sm">
                      {alarm?.alarmConfigure?.alarmName ?? '—'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{cfg.midFilterLabel}:</span>
                    <span className="text-black/88 dark:text-gray-100 !font-[Inter]">
                      {alarm?.alarmConfigure?.alarmLocation ?? '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Current Thresh.:</span>
                    <span className="text-black dark:text-gray-100 !font-[Inter]">
                      {alarm?.alarmOccurrences?.[0]?.alarmThresholdValue ?? '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Occurrences:</span>
                    <span className="text-black/88 dark:text-gray-100 !font-[Inter]">
                      {alarm?.alarmOccurrenceCount ?? 0}
                    </span>
                  </div>
                  {cfg.showAckCol && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Ack:</span>
                      <span className="text-black/88 dark:text-gray-100 !font-[Inter]">
                        {(alarm?.alarmAcknowledgementStatusCount ?? 0)}/{(alarm?.alarmOccurrenceCount ?? 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Mobile filler to keep similar feel (optional) */}
            {pageAlarms.length === 0 && !isUpdating && (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-300">No alarms to display.</div>
            )}
          </div>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="px-3 py-2 border-t border-[#EBEBEB] dark:border-gray-700 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 text-sm text-black/70 dark:text-gray-200">
            <span className="!font-[Inter]">Rows per page:</span>
            <select
              className="border rounded px-2 py-1 text-sm !font-[Inter] bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4 w-full sm:w-auto text-gray-800 dark:text-gray-100">
            <span className="text-sm text-black/70 dark:text-gray-200 !font-[Inter]">
              {totalItems === 0 ? '0–0' : `${startIdx + 1}–${endIdx}`} of {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={gotoFirst} disabled={currentPage === 1} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="First page" aria-label="First page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M11.5 4L6 10L11.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 4L8.5 10L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoPrev} disabled={currentPage === 1} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Previous page" aria-label="Previous page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M12.5 4L7 10L12.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoNext} disabled={currentPage === totalPages || totalItems === 0} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Next page" aria-label="Next page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M7.5 4L13 10L7.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoLast} disabled={currentPage === totalPages || totalItems === 0} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Last page" aria-label="Last page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M8.5 4L14 10L8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 4L11.5 10L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <span className="hidden sm:inline text-sm text-black/60 dark:text-gray-300 !font-[Inter]">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Mount */}
      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        alarmData={modalData}
        hideAcknowledged={(type || '').toLowerCase() === 'unacknowledged'}
        onAcknowledge={onAcknowledge}
      />
    </div>
  );
}
