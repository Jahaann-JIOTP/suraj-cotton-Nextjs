'use client';
import React from "react";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";import axios from 'axios';  // Import axios for API calls
import SelectDropdown from '../../../components/ui/SelectDropdown';
import { format, toZonedTime } from 'date-fns-tz';
import { toast } from "react-toastify";
import config from "../../../config";

// new added
const useBeepSound = () => {
  const beepSoundRef = useRef(null);
  
  if (!beepSoundRef.current) {
    beepSoundRef.current = new Audio('/alarm.mp3');
  }
  
  return beepSoundRef.current;
};

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'activeSince', label: 'Active Since', sortable: true },
  { key: 'alarmType', label: 'Alarm Type', sortable: true },
  { key: 'alarmAge', label: 'Alarm Age', sortable: true },
  { key: 'alarmName', label: 'Alarm Name', sortable: true },
  { key: 'pvThreshold', label: 'PV/Threshold', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];
const FIXED_ROWS = 10;
const ROW_HEIGHT = 32; // matches your h-[32px] per row


// Add a useState hook to store the fetched alarms.
export default function ActiveAlarmsPage() {

  const [alarms, setAlarms] = useState([]);  // To store alarms fetched from API
  const [timer, setTimer] = useState(41);
  // const beepSound = new Audio('/alarm.mp3');
  const beepSound = useBeepSound();
  const [beepSounds, setBeepSounds] = useState({});
  const [sort, setSort] = useState({ key: '', dir: 'asc' });
  const [alarmTypeFilter, setAlarmTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [alarmNameFilter, setAlarmNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);
  const actionMenuRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // To control dropdown visibility
  const [selectedAction, setSelectedAction] = useState('');  // To store the selected action
  const [isBeeping, setIsBeeping] = useState({});
  const [selectedActions, setSelectedActions] = useState({});  // Store selected action per row
  const [isUpdating, setIsUpdating] = useState(false);
  // Create a ref for the beep sound to avoid recreating it on every render
  const beepSoundRef = useRef(null);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 40 : prev - 1));  // Timer counts down to 0 and resets to 40
    }, 1000);

    // Call API when timer reaches 0
    if (timer === 0) {
      setIsUpdating(true);  // Set isUpdating to true to show the loader
      fetchAlarms();  // Fetch updated alarms
    }

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [timer]);  // Effect will run when 'timer' changes
  const startBeep = useCallback((id) => {
    console.log(id)
    const occurrenceId = id; // always this
    console.log('startBeep', occurrenceId, 'beepSounds keys:', Object.keys(beepSounds));

    if (!occurrenceId) {
      console.error("❌ Missing occurrenceId for alarm:", alarm);
      return;
    }

    if (beepSounds[occurrenceId]) {
      beepSounds[occurrenceId].loop = true;
      beepSounds[occurrenceId].play();
    } else {
      const audio = new Audio('/alarm.mp3');
      audio.loop = true;
      audio.play();
      setBeepSounds(prev => ({ ...prev, [occurrenceId]: audio }));
    }

    setIsBeeping(prev => ({ ...prev, [occurrenceId]: true }));
  },[beepSounds]);




  const stopBeep = useCallback((occurrenceId) => {
    if (beepSounds[occurrenceId]) {
      beepSounds[occurrenceId].pause();
      beepSounds[occurrenceId].currentTime = 0;

      // cleanup reference so it won't restart later
      setBeepSounds(prev => {
        const { [occurrenceId]: _, ...rest } = prev;
        return rest;
      });

      setIsBeeping(prev => ({ ...prev, [occurrenceId]: false }));
      console.log("Stopped beep for", occurrenceId);
    } else {
      console.log("No beep sound found for", occurrenceId);
    }
  }, [beepSounds]);


  const handleOptionSelect = async (id, option, alarmId) => {
    console.log('handleOptionSelect', alarmId);
    const duration = getSnoozeDuration(option);
    const snoozeAt = new Date().toISOString(); // current time

    try {
      await axios.patch(`${config.BASE_URL}/alarms/snooze`, {
        ids: [id],  // this should be alarmOccurrenceId (not alarmId!)
        alarmSnooze: true,
        snoozeDuration: duration / 60000, // convert ms → minutes
        snoozeAt
      });
      console.log('passing id to stop beep', id);
      stopBeep(id);  // immediately stop local beep until fetch refresh
      toast.success(`${alarmId} has been snoozed for ${option}`);  // Display the success message with the alarm ID
      setOpenActionId(null);
      fetchAlarms(); // refresh UI with new snooze state
    } catch (error) {
      console.error("Error snoozing alarm:", error);
      toast.error("Failed to snooze alarm");
    }
  };



  const toggleDropdown = (id) => {
    console.log('toggledropdown', id)
    setOpenActionId((prev) => (prev === id ? null : id));
  };
  const alarmTypes = useMemo(() => [...new Set(alarms.map(a => a.alarmType))], [alarms]);
  const locations = useMemo(() => [...new Set(alarms.map(a => a.location))], [alarms]);
  const alarmNames = useMemo(() => [...new Set(alarms.map(a => a.alarmName))], [alarms]);

  const getActionIconColor = (alarm) => {
    if (alarm.snoozeStatus && !alarm.isSnoozeExpired) {
      return '#8F8F8F';  // snoozed → grey
    }
    return '#025697';     // active → blue
  };

  // Trigger sound on dropdown toggle (for example)
  const handleDropdownToggle = (id) => {
    console.log(id)
    toggleDropdown(id); //  dropdown is opened
  };
  const fetchAlarms = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/alarms/active-alarms`);
      const fetchedAlarms = response.data.map((alarm) => {
        const triggeredAt = alarm.triggeredAt;
        const zonedDate = toZonedTime(new Date(triggeredAt), 'Asia/Karachi');
        const activeSince = format(zonedDate, 'dd-M-yyyy HH:mm');

        const now = toZonedTime(new Date(), 'Asia/Karachi');
        const alarmAgeInMinutes = Math.floor((now - zonedDate) / 60000);
        const alarmAge = `${alarmAgeInMinutes} min ago`;

        const isSnoozed = alarm.alarmSnoozeStatus;
        const snoozeEndTime = alarm.alarmSnoozeAt
          ? new Date(alarm.alarmSnoozeAt).getTime() + alarm.alarmSnoozeDuration * 60000
          : 0;

        const isSnoozeExpired = isSnoozed && Date.now() > snoozeEndTime;

        return {
          alarmOccurenceId: alarm.alarmOccurenceId,
          id: alarm.alarmId,
          alarmName: alarm.alarmName,
          pvThreshold: `${Math.round(alarm.value)}/${alarm.threshold.value}`,
          alarmType: alarm.alarmType,
          hasAction: alarm.priority > 3,
          alarmAge,
          activeSince,
          location: alarm.Location,
          snoozeStatus: isSnoozed,            // ✅ keep snooze status
          snoozeDuration: alarm.alarmSnoozeDuration,
          snoozeAt: alarm.alarmSnoozeAt,
          isSnoozeExpired,
          color: alarm.color || '#000000',
        };
      });
      setAlarms(fetchedAlarms);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    } finally {
      setIsUpdating(false);
    }
  };



  useEffect(() => {



    fetchAlarms();
  }, []);  // Empty dependency array means this effect runs only once on mount.

  useEffect(() => {
    if (alarms.length === 0) {
      // no alarms → stop all sounds
      Object.keys(beepSounds).forEach((id) => stopBeep(id));
      return;
    }

    alarms.forEach((alarm) => {
      const id = alarm.alarmOccurenceId;
      if (!id) return;

      if (alarm.snoozeStatus && !alarm.isSnoozeExpired) {
        stopBeep(id);
      } else {
        startBeep(id);
      }
    });
  }, [alarms, beepSounds, startBeep, stopBeep]);


  useEffect(() => {
    return () => {
      // ✅ cleanup ALL sounds
      Object.values(beepSounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [beepSounds]);


  const getSnoozeDuration = (snoozeOption) => {
    switch (snoozeOption) {
      case '15 mins': return 15 * 60 * 1000;
      case '30 mins': return 30 * 60 * 1000;
      case '1 hour': return 60 * 60 * 1000;
      case '2 hours': return 2 * 60 * 60 * 1000;
      default: return 0;
    }
  };
  useEffect(() => {
    return () => {
      beepSound.pause();  // Stop beep sound on unmount
      beepSound.currentTime = 0;  // Reset sound to start
    };
  }, [beepSound]);

  useEffect(() => {
    if (timer === 0) {
      setIsUpdating(true);  // Set updating status when timer hits 0
      fetchAlarms();  // Call the API to fetch updated alarms
    }
  }, [timer]);  // Only run when timer changes

  const filteredAlarms = useMemo(() => {
    return alarms.filter(a =>
      (!alarmTypeFilter || a.alarmType === alarmTypeFilter) &&
      (!locationFilter || a.location === locationFilter) &&
      (!alarmNameFilter || a.alarmName === alarmNameFilter)
    );
  }, [alarmTypeFilter, locationFilter, alarmNameFilter, alarms]);

  const sortedAlarms = useMemo(() => {
    if (!sort.key) return filteredAlarms;

    const arr = [...filteredAlarms].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];

      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return String(va ?? "").localeCompare(String(vb ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    return sort.dir === "asc" ? arr : arr.reverse();
  }, [filteredAlarms, sort]);


  const totalItems = sortedAlarms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const pageAlarms = sortedAlarms.slice(startIdx, endIdx);
  const fillerCount = Math.max(0, FIXED_ROWS - pageAlarms.length);

  const onSort = useCallback((key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }, []);

  const isOpen = useCallback((id) => openActionId === id, [openActionId]);
  const toggleActionMenu = useCallback((id) => setOpenActionId((prev) => (prev === id ? null : id)), []);

  const gotoFirst = useCallback(() => setCurrentPage(1), []);
  const gotoPrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const gotoNext = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
  const gotoLast = useCallback(() => setCurrentPage(totalPages), [totalPages]);

  return (
    <div className="w-full p-4 min-h-[81vh] rounded-[8px] bg-white dark:bg-gray-800 !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">

      <div className="w-full flex flex-wrap items-start mb-3">

        <div className="w-full sm:flex-1 sm:pr-4 text-left">
          <span className="text-2xl text-[#626469] dark:text-white font-semibold">Active Alarms</span>
          <div className="mt-1 flex items-center justify-between sm:block">
            <p className="text-[15.04px] text-[#7E7E7E] dark:text-gray-200 m-0">Display currently active (live) alarms that require operator attention.</p>

            <div className="ml-4 text-sm text-[#014D89] dark:text-gray-100 whitespace-nowrap sm:hidden">
              <span>Update in {timer > 40 ? `0:${timer}` : `0:0${timer}`}</span>
            </div>

          </div>
        </div>
        <div className="w-full sm:w-2/5 mt-3 sm:mt-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-end">
            <SelectDropdown label="Alarm Name" options={alarmNames} selectedValue={alarmNameFilter} onChange={setAlarmNameFilter} width="w-full lg:w-36" padding="!p-[3.5px]" labelshow={false} />
            <SelectDropdown label="Location" options={locations} selectedValue={locationFilter} onChange={setLocationFilter} width="w-full lg:w-36" padding="!p-[3.5px]" labelshow={false} />
            <SelectDropdown label="Severity" options={alarmTypes} selectedValue={alarmTypeFilter} onChange={setAlarmTypeFilter} width="w-full lg:w-36" padding="!p-[3.5px]" labelshow={false} />
          </div>
          <div className="mt-2 text-right text-sm text-[#014D89] dark:text-gray-100 whitespace-nowrap hidden sm:block">
            <span>Update in {timer > 9 ? `0:${timer}` : `0:0${timer}`}</span>
          </div>
        </div>
      </div>

      <div className="border border-black/8 dark:border-gray-700 rounded-[5px] z-0">
        {/* Desktop View */}

        <div className="hidden md:block">
          <div className="bg-[#02508C] text-white !font-[Inter] font-bold text-[12px] overflow-hidden rounded-t-md">
            <div className="h-[32px] flex items-stretch">
              {columns.map((col, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === columns.length - 1;
                const isActive = sort.key === col.key;
                const ascOn = isActive && sort.dir === 'asc';
                const descOn = isActive && sort.dir === 'desc';
                const cellCls = [
                  'flex-1 px-2 lg:px-4 flex items-center justify-center gap-1',
                  !isFirst ? 'border-l border-white/20' : '',
                  isFirst ? 'rounded-tl-md' : '',
                  isLast ? 'rounded-tr-md' : ''
                ].join(' ');

                return (
                  <div key={col.key} className={cellCls}>
                    {col.sortable ? (
                      <button type="button" onClick={() => onSort(col.key)} className="flex items-center gap-2 outline-none focus:ring-0" aria-label={`Sort by ${col.label}`}>
                        <span className="leading-none select-none">{col.label}</span>
                        <span className="flex flex-col leading-none -mt-[1px]">
                          <svg width="10" height="6" viewBox="0 0 20 12" fill="none">
                            <path d="M5 8 L10 3 L15 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={ascOn ? 1 : 0.45} />
                          </svg>
                          <svg width="10" height="6" viewBox="0 0 20 12" fill="none">
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
          <div className="relative">
            <div
              className="divide-y divide-[#EBEBEB] dark:divide-gray-700 overflow-y-auto"
              style={{ maxHeight: `${ROW_HEIGHT * FIXED_ROWS}px`, minHeight: `${ROW_HEIGHT * FIXED_ROWS}px` }}
              ref={actionMenuRef}
            >
              {pageAlarms.map((alarm) => (
                <div key={alarm.id} className="flex items-center h-[32px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 px-2 lg:px-4 text-center text-black/73 dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.id}</div>
                  <div className="flex-1 px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.activeSince}</div>
                  <div className="flex-1 px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter] text-[12px] capitalize">{alarm.alarmType}</div>
                  <div className="flex-1 px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.alarmAge}</div>
                  <div className="flex-1 px-2 lg:px-4 flex items-center justify-center gap-2">
                    <div className="w-[9px] h-[9px] rounded-sm" style={{ backgroundColor: alarm.color }} />
                    <span className="text-black/88 dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.alarmName}</span>
                  </div>
                  <div className="flex-1 px-2 lg:px-4 text-center text-black dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.pvThreshold}</div>
                  <div className="flex-1 px-2 lg:px-4 text-center text-black/88 dark:text-gray-100 !font-[Inter] text-[12px]">{alarm.location}</div>
                  <div className="flex-1 px-2 lg:px-4 flex justify-center relative">
                    <button
                      type="button"
                      onClick={() => handleDropdownToggle(alarm.alarmOccurenceId)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                      aria-haspopup="listbox"
                      aria-expanded={openActionId === alarm.alarmOccurenceId}
                      aria-label="Open actions"
                      disabled={alarm.snoozeStatus && !alarm.isSnoozeExpired} // Disable button if snoozed
                      style={alarm.snoozeStatus && !alarm.isSnoozeExpired ? { cursor: 'not-allowed' } : {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4 8C4 6.4087 4.63215 4.88258 5.75736 3.75736C6.88258 2.63214 8.40871 2 10 2C11.5913 2 13.1174 2.63214 14.2426 3.75736C15.3679 4.88258 16 6.4087 16 8C16 9.887 16.454 11.665 17.257 13.234C17.3096 13.3368 17.3378 13.4503 17.3393 13.5657C17.3408 13.6811 17.3157 13.7954 17.2659 13.8995C17.216 14.0036 17.1428 14.0948 17.052 14.166C16.9611 14.2372 16.855 14.2865 16.742 14.31C15.6658 14.5335 14.5791 14.703 13.486 14.818C13.4079 15.6886 13.0068 16.4985 12.3617 17.0883C11.7166 17.6782 10.8741 18.0053 10 18.0053C9.12589 18.0053 8.28341 17.6782 7.63829 17.0883C6.99317 16.4985 6.59211 15.6886 6.514 14.818C5.42089 14.703 4.3342 14.5335 3.258 14.31C3.14498 14.2865 3.03891 14.2372 2.94804 14.166C2.85718 14.0948 2.78398 14.0036 2.73414 13.8995C2.6843 13.7954 2.65917 13.6811 2.66071 13.5657C2.66225 13.4503 2.69041 13.3368 2.743 13.234C3.57198 11.614 4.00288 9.81977 4 8ZM10 15C9.34534 15 8.69534 14.981 8.05 14.943C8.15071 15.3849 8.39849 15.7794 8.75277 16.0621C9.10705 16.3447 9.54681 16.4986 10 16.4986C10.4532 16.4986 10.893 16.3447 11.2472 16.0621C11.6015 15.7794 11.8493 15.3849 11.95 14.943C11.306 14.981 10.656 15 10 15ZM8.75 6C8.55109 6 8.36033 6.07902 8.21968 6.21967C8.07902 6.36032 8 6.55109 8 6.75C8 6.94891 8.07902 7.13968 8.21968 7.28033C8.36033 7.42098 8.55109 7.5 8.75 7.5H9.793L8.14001 9.814C8.0599 9.92611 8.01224 10.0581 8.00223 10.1956C7.99223 10.333 8.02028 10.4705 8.0833 10.593C8.14632 10.7156 8.24188 10.8184 8.35949 10.8902C8.4771 10.962 8.61222 11 8.75 11H11.25C11.4489 11 11.6397 10.921 11.7803 10.7803C11.921 10.6397 12 10.4489 12 10.25C12 10.0511 11.921 9.86032 11.7803 9.71967C11.6397 9.57902 11.4489 9.5 11.25 9.5H10.207L11.86 7.186C11.9401 7.07389 11.9878 6.94187 11.9978 6.80445C12.0078 6.66702 11.9797 6.5295 11.9167 6.40696C11.8537 6.28443 11.7581 6.18163 11.6405 6.10984C11.5229 6.03805 11.3878 6.00005 11.25 6H8.75Z"
                          fill={getActionIconColor(alarm)}  // Change color based on snooze
                        />
                      </svg>
                    </button>
                    {openActionId === alarm.alarmOccurenceId && (
                      <div className="absolute right-0 top-[100%] z-50 bg-white dark:bg-gray-600 shadow-lg rounded w-40">
                        {['15 mins', '30 mins', '1 hour', '2 hours'].map((option) => (
                          <button
                            key={option}
                            className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleOptionSelect(alarm.alarmOccurenceId, option, alarm.id)}  // Handle option selection
                            disabled={alarm.snoozeStatus && !alarm.isSnoozeExpired}  // Disable button if snoozed
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Filler rows to maintain fixed height when < 10 rows */}
              {Array.from({ length: fillerCount }).map((_, i) => (
                <div key={`filler-${i}`} className="flex items-center h-[32px] text-[12px] !font-[Inter] bg-white dark:bg-gray-800" aria-hidden>
                  {columns.map((c) => (
                    <div key={c.key} className="flex-1 px-2 lg:px-4 text-transparent">&nbsp;</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Empty state centered inside fixed body */}
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

        {/* Mobile View */}
        <div className="md:hidden">

          {pageAlarms.map((alarm) => (

            <div key={alarm.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-black/73 dark:text-gray-100 font-inter text-sm">{alarm.id}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-[9px] h-[9px] rounded-sm`} style={{ backgroundColor: alarm.color }} />
                  <span className="text-black/88 dark:text-gray-100 font-inter text-sm capitalize">{alarm.alarmType}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Name:</span><span className="text-black/88 dark:text-gray-100 font-inter">{alarm.alarmName}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Location:</span><span className="text-black/88 dark:text-gray-100 font-inter">{alarm.location}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Age:</span><span className="text-black/88 dark:text-gray-100 font-inter">{alarm.alarmAge}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">PV/Threshold:</span><span className="text-black dark:text-gray-100 font-inter">{alarm.pvThreshold}</span></div>
                <div className="flex items-center justify-between">
                  <div className="relative ml-auto">
                    <button
                      type="button"
                      onClick={() => handleDropdownToggle(alarm.alarmOccurenceId)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                      aria-haspopup="listbox"
                      aria-expanded={openActionId === alarm.alarmOccurenceId}
                      aria-label="Open actions"
                      disabled={alarm.snoozeStatus && !alarm.isSnoozeExpired} // Disable button if snoozed
                      style={alarm.snoozeStatus && !alarm.isSnoozeExpired ? { cursor: 'not-allowed' } : {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4 8C4 6.4087 4.63215 4.88258 5.75736 3.75736C6.88258 2.63214 8.40871 2 10 2C11.5913 2 13.1174 2.63214 14.2426 3.75736C15.3679 4.88258 16 6.4087 16 8C16 9.887 16.454 11.665 17.257 13.234C17.3096 13.3368 17.3378 13.4503 17.3393 13.5657C17.3408 13.6811 17.3157 13.7954 17.2659 13.8995C17.216 14.0036 17.1428 14.0948 17.052 14.166C16.9611 14.2372 16.855 14.2865 16.742 14.31C15.6658 14.5335 14.5791 14.703 13.486 14.818C13.4079 15.6886 13.0068 16.4985 12.3617 17.0883C11.7166 17.6782 10.8741 18.0053 10 18.0053C9.12589 18.0053 8.28341 17.6782 7.63829 17.0883C6.99317 16.4985 6.59211 15.6886 6.514 14.818C5.42089 14.703 4.3342 14.5335 3.258 14.31C3.14498 14.2865 3.03891 14.2372 2.94804 14.166C2.85718 14.0948 2.78398 14.0036 2.73414 13.8995C2.6843 13.7954 2.65917 13.6811 2.66071 13.5657C2.66225 13.4503 2.69041 13.3368 2.743 13.234C3.57198 11.614 4.00288 9.81977 4 8ZM10 15C9.34534 15 8.69534 14.981 8.05 14.943C8.15071 15.3849 8.39849 15.7794 8.75277 16.0621C9.10705 16.3447 9.54681 16.4986 10 16.4986C10.4532 16.4986 10.893 16.3447 11.2472 16.0621C11.6015 15.7794 11.8493 15.3849 11.95 14.943C11.306 14.981 10.656 15 10 15ZM8.75 6C8.55109 6 8.36033 6.07902 8.21968 6.21967C8.07902 6.36032 8 6.55109 8 6.75C8 6.94891 8.07902 7.13968 8.21968 7.28033C8.36033 7.42098 8.55109 7.5 8.75 7.5H9.793L8.14001 9.814C8.0599 9.92611 8.01224 10.0581 8.00223 10.1956C7.99223 10.333 8.02028 10.4705 8.0833 10.593C8.14632 10.7156 8.24188 10.8184 8.35949 10.8902C8.4771 10.962 8.61222 11 8.75 11H11.25C11.4489 11 11.6397 10.921 11.7803 10.7803C11.921 10.6397 12 10.4489 12 10.25C12 10.0511 11.921 9.86032 11.7803 9.71967C11.6397 9.57902 11.4489 9.5 11.25 9.5H10.207L11.86 7.186C11.9401 7.07389 11.9878 6.94187 11.9978 6.80445C12.0078 6.66702 11.9797 6.5295 11.9167 6.40696C11.8537 6.28443 11.7581 6.18163 11.6405 6.10984C11.5229 6.03805 11.3878 6.00005 11.25 6H8.75Z"
                          fill={getActionIconColor(alarm)}  // Change color based on snooze
                        />
                      </svg>
                    </button>
                    {openActionId === alarm.alarmOccurenceId && (
                      <div className="absolute right-0 top-[100%] z-50 bg-white dark:bg-gray-600 shadow-lg rounded w-40">
                        {['15 mins', '30 mins', '1 hour', '2 hours'].map((option) => (
                          <button
                            key={option}
                            className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleOptionSelect(alarm.alarmOccurenceId, option, alarm.id)}  // Handle option selection
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="px-3 !z-0 py-2 border-t border-[#EBEBEB] dark:border-gray-700 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 text-sm text-black/70 dark:text-gray-200">
            <span className='!font-[Inter]'>Rows per page:</span>
            <select className="border rounded px-2 py-1 text-sm !font-[Inter] bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4 w-full sm:w-auto text-gray-800 dark:text-gray-100">
            <span className="text-sm text-black/70 dark:text-gray-200 !font-[Inter]">{totalItems === 0 ? '0–0' : `${startIdx + 1}–${endIdx}`} of {totalItems}</span>
            <div className="flex items-center gap-1">
              <button onClick={gotoFirst} disabled={currentPage === 1} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="First page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M11.5 4L6 10L11.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 4L8.5 10L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoPrev} disabled={currentPage === 1} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Previous page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M12.5 4L7 10L12.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoNext} disabled={currentPage === totalPages || totalItems === 0} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Next page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M7.5 4L13 10L7.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={gotoLast} disabled={currentPage === totalPages || totalItems === 0} className="p-1.5 rounded border dark:border-gray-600 disabled:opacity-40" title="Last page">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-800 dark:text-white">
                  <path d="M8.5 4L14 10L8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 4L11.5 10L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <span className="hidden sm:inline text-sm text-black/60 dark:text-gray-300 !font-[Inter]">Page {Math.min(currentPage, totalPages)} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
