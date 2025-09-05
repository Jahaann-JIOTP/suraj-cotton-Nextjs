"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { usePathname,useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faTimes } from "@fortawesome/free-solid-svg-icons";
import config from "@/constant/apiRouteList";
import { privilegeConfig } from "@/constant/navigation";
import { privilegeOrder } from "@/constant/navigation";
import { AiFillBell } from "react-icons/ai";
import MobileSidebar from "./MobileSidebar";
import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";
import { getActiveTabFromPathname } from "@/utils/navigation-utils";
import { RxCross1 } from "react-icons/rx";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
const SEEN_KEY = "seenAlarmIds_v1";
const Header = ({ handleTabClick, activeTab }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const notificationDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);

  const [error, setError] = useState(null);
  const acknowledgedAlarms = useRef([]);
  const { theme } = useTheme();
// State variables to manage bell icon and new alarm count
const [bellIcon, setBellIcon] = useState("none"); // "none" | "yellow" | "red"
const [newAlarmCount, setNewAlarmCount] = useState(0);
const seenAlarms = useRef(new Set()); // Stores IDs of alarms that have been seen
const lastFetchedIdsRef = useRef([]); // Stores the IDs of alarms fetched in the current session

// Function to update bell icon and new alarm count based on fetched alarms
const updateBellIcon = (fetchedAlarms) => {
  const enrichedAll = fetchedAlarms.map((a) => ({
    ...a,
    status: seenAlarms.current.has(a.alarmOccurenceId) ? "old" : "new",
  }));

  // Update bell icon and new alarm count based on alarm statuses
  const hasNew = enrichedAll.some((a) => a.status === "new");
  const hasOld = enrichedAll.some((a) => a.status === "old");
  // Set bell icon color based on new/old alarms
  setBellIcon(hasNew ? "red" : hasOld ? "yellow" : "none");

  // Set the number of new alarms
  setNewAlarmCount(enrichedAll.filter((a) => a.status === "new").length);

  // Only show top 5 alarms in the UI
  setAlarms(enrichedAll.slice(0, 5));
};

// Function to fetch alarms
const fetchAlarms = async () => {
  try {
    const res = await axios.get(`http://localhost:5001/alarms/active-alarms`);
    const fetched = res.data || [];

    // Store alarm IDs for later marking as seen
    const allIds = fetched.map((a) => a.alarmOccurenceId);
    lastFetchedIdsRef.current = allIds;

    // Call the function to update bell icon and alarm count
    updateBellIcon(fetched);

    setError(null);
  } catch (err) {
    console.error("Alarm error:", err);
    setError("Failed to fetch alarms.");
  }
};

// Whenever the notifications panel is opened, mark all fetched alarms as seen
useEffect(() => {
  if (isNotificationVisible && lastFetchedIdsRef.current.length) {
    let added = false;
    for (const id of lastFetchedIdsRef.current) {
      if (!seenAlarms.current.has(id)) {
        seenAlarms.current.add(id);
        added = true;
      }
    }
    if (added) {
      saveSeen(); // Persist seen alarms in localStorage

      // Recompute bell icon after marking alarms as seen
      setBellIcon("yellow");
      setNewAlarmCount(0);
    }
  }
}, [isNotificationVisible]);

  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    if (currentTab !== activeTab) {
      handleTabClick(currentTab);
    }
  }, [pathname]);
  // Get meter status
  const getMeterData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.NODE_RED_REAL_TIME_STATUS}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData = await response.json();
      if (response.ok) {
        setRealTimeData(resData);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // fetch user details
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${config.BASE_URL}${config.USER.PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const privileges = data?.role?.privelleges?.map((p) => p.name) || [];

        setUserPrivileges(privileges);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // fetch acknowldge
  const acknowledgeAlarms = async () => {
    try {
      const res = await axios.post(
        `${config.BASE_URL}${config.ALARMS.ACKNOWLEDGE}`
      );
      if (res.data.success) {
        setBellIcon("basil_notification-solid.png");
        setNewAlarmCount(0);
        acknowledgedAlarms.current = [
          ...acknowledgedAlarms.current,
          ...alarms.map((a) => a._id),
        ];
        setAlarms([]);
        setNotificationVisible(false);
      }
    } catch (err) {
      console.error("Acknowledge error:", err);
    }
  };
  const toggleNotificationVisibility = () =>
    setNotificationVisible(!isNotificationVisible);

  useEffect(() => {
    fetchUserDetails();
    getMeterData();
    const interval = setInterval(() => {
      getMeterData();
    }, 5000);
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };

   
  }, []);
    // Format date in Asia/Karachi
  const formatAlarmDate = (triggeredAt) => {
    const zonedDate = toZonedTime(new Date(triggeredAt), "Asia/Karachi");
    return format(zonedDate, "dd-MM-yyyy HH:mm");
  };

  // Helpers to persist/load seen IDs
  const loadSeen = () => {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  };
  const saveSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seenAlarms.current)));
    } catch {
      /* ignore */
    }
  };
  useEffect(() => {
    // Load seen IDs from localStorage before first fetch
    if (typeof window !== "undefined") {
      seenAlarms.current = loadSeen();
    }
    // fetchUserDetails();
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 40000);
    return () => clearInterval(interval);
  }, []);

  const renderLink = (key) => {
    const config = privilegeConfig[key];
    if (!config) return null;

    const isActive = config.matchPaths.some((p) => pathname.startsWith(p));

    return (
      <Link
        key={key}
        href={config.href}
        className="py-[8px]  px-4"
        onClick={() => handleTabClick(config.tab)}
      >
        <p
          className={`px-3 py-1 cursor-pointer rounded-sm flex gap-1 ${
            isActive
              ? "bg-white text-black dark:bg-gray-700 dark:text-white"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={config.icon} style={{ fontSize: "1.1em" }} />
          {config.label}
        </p>
      </Link>
    );
  };

  return (
    <header
      className="text-white mx-0 my-2 mt-0 h-[44px] flex text-sm items-center justify-between w-full"
      style={{ background: "linear-gradient(to top, #183A5C, #1F5897)" }}
    >
      {/* Dropdown menu for small screens */}

      <div className="2xl:hidden flex justify-between items-center px-4 py-2 z-40 relative">
        {!isDropdownOpen && (
          <button
            onClick={() => setIsDropdownOpen(true)}
            className="cursor-pointer relative z-[10001]"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} style={{ fontSize: "1.5em" }} />
          </button>
        )}
        {isDropdownOpen && (
          <button
            onClick={() => setIsDropdownOpen(true)}
            className="cursor-pointer relative z-[10001]"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: "1.5em" }} />
          </button>
        )}
      </div>

      {/* <nav className={`bg-[#1F5897] hidden  xl:flex w-full`}> */}
      <nav className={`hidden  2xl:flex w-full`}>
        {privilegeOrder
          .filter((key) => userPrivileges.includes(key))
          .map((key) => renderLink(key))}
      </nav>
      {/* mobile menu */}
      <div className="flex 2xl:hidden">
        <div
          className={`fixed top-[44px] left-0 w-full z-[999] transition-all duration-500 ${
            isDropdownOpen ? "flex max-h-[900px]" : "hidden"
          }`}
        >
          <MobileSidebar
            userPrivileges={userPrivileges}
            closeSidebar={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>

      {/* Bell Icon */}
      <div className="flex items-center justify-center">
        <div className="mr-4 w-[60px]">
          {realTimeData.message === "Link is up" ? (
            <div className="flex flex-col items-center justify-center">
              <img src={"../../../green_bl.gif"} className="w-[20px]" />
              <span className="text-[10px]">Link Up</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img src={"../../../red_bl.gif"} className="w-[20px]" />
              <span className="text-[10px] animate-pulse duration-300">
                Link Down
              </span>
            </div>
          )}
        </div>
        {/* link status */}
        <div className="relative mr-4 mt-1">
          <div className="relative inline-block cursor-pointer" onClick={toggleNotificationVisibility}>
            {/* Inline SVG bell with dynamic fill */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 26 26"
              fill="none"
              className="ml-2 w-8 h-8"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0829 3.25C14.0829 2.96268 13.9688 2.68713 13.7656 2.48397C13.5624 2.2808 13.2869 2.16666 12.9996 2.16666C12.7123 2.16666 12.4367 2.2808 12.2336 2.48397C12.0304 2.68713 11.9162 2.96268 11.9162 3.25V4.0625H11.3128C10.1515 4.06242 9.03385 4.50492 8.18733 5.29992C7.34081 6.09492 6.82909 7.18264 6.75633 8.34166L6.51692 12.1702C6.42436 13.6296 5.93435 15.036 5.09992 16.237C4.92727 16.4852 4.82178 16.7738 4.7937 17.0748C4.76563 17.3758 4.81593 17.6789 4.9397 17.9547C5.06348 18.2305 5.25653 18.4696 5.50006 18.6487C5.7436 18.8278 6.02934 18.9408 6.3295 18.9767L10.0204 19.4187V20.5833C10.0204 21.3735 10.3343 22.1312 10.893 22.6899C11.4517 23.2486 12.2095 23.5625 12.9996 23.5625C13.7897 23.5625 14.5475 23.2486 15.1062 22.6899C15.6649 22.1312 15.9787 21.3735 15.9787 20.5833V19.4187L19.6697 18.9757C19.9696 18.9396 20.2552 18.8266 20.4986 18.6475C20.742 18.4685 20.9349 18.2296 21.0587 17.9539C21.1824 17.6783 21.2328 17.3753 21.2048 17.0745C21.1769 16.7736 21.0716 16.4851 20.8992 16.237C20.0648 15.036 19.5748 13.6296 19.4822 12.1702L19.2428 8.34275C19.1703 7.18354 18.6587 6.09554 17.8122 5.30032C16.9656 4.50509 15.8478 4.06244 14.6863 4.0625H14.0829V3.25ZM11.6454 20.5833C11.6454 20.9425 11.7881 21.2869 12.042 21.5409C12.296 21.7948 12.6404 21.9375 12.9996 21.9375C13.3587 21.9375 13.7032 21.7948 13.9571 21.5409C14.2111 21.2869 14.3537 20.9425 14.3537 20.5833V19.7708H11.6454V20.5833Z"
                fill={bellIcon === "red" ? "red" : bellIcon === "yellow" ? "yellow" : "white"}
              />
            </svg>

            {newAlarmCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 transform translate-x-1/2 -translate-y-1/2">
                {newAlarmCount}
              </span>
            )}
          </div>

          {isNotificationVisible && (
            <div
              className="absolute top-full right-0 mt-2 w-80 p-6 bg-white dark:bg-gray-700 shadow-lg border border-gray-300 rounded-lg z-[9999]"
              role="menu"
              aria-label="Alarms"
            >
              <div className="font-semibold text-gray-700 flex justify-between items-center">
                <span className="text-black dark:text-white">Alarms</span>
                <button
                  className="absolute top-2 right-2 text-white text-2xl hover:text-red-500 transition-all mr-2 mt-2"
                  onClick={() => setNotificationVisible(false)}
                  aria-label="Close alarms"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-[20px] text-black dark:text-white cursor-pointer" />
                </button>
              </div>

              <ul className="mt-4 text-sm text-gray-600">
                {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

                {alarms.length > 0 ? (
                  alarms.map((alarm) => (
                    <li key={alarm.alarmOccurenceId} className="py-2 border-b flex items-center">
                      <Image
                        src="/yellowbell.gif"
                        alt={alarm.status === "new" ? "New alarm" : "Seen alarm"}
                        width={24}
                        height={24}
                        className="w-6 h-6 mr-2"
                        priority 
                      />
                      <div className="flex flex-col text-[12px]">
                        <div className="text-black dark:text-white">{alarm.alarmName}</div>
                        <div className="text-black dark:text-white">
                          {alarm.Location} - {alarm.subLocation}
                        </div>
                      </div>
                      <div className="text-right text-[12px] ml-auto">
                        <div className="text-black dark:text-white">{formatAlarmDate(alarm.triggeredAt)}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center items-center flex-col h-[200px]">
                    <Image
                      src="/alarm_bell.png"
                      alt="No Alarms"
                      className="w-[15vh] h-[15vh] mb-6"
                      width={300}
                      height={300}
                    />
                    <p className="text-center dark:text-white text-gray-500">No active alarms at the moment.</p>
                  </div>
                )}

                <li
                  className="text-center py-2 mt-2 text-blue-500 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500"
                  onClick={() => router.push("/active_alarms")}
                >
                  Details
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className=" flex items-center pr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
