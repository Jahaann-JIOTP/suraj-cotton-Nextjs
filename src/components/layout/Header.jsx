"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import config from "@/constant/apiRouteList";
import { privilegeConfig } from "@/constant/navigation";
import { privilegeOrder } from "@/constant/navigation";
import MobileSidebar from "./MobileSidebar";
import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";
import { getActiveTabFromPathname } from "@/utils/navigation-utils";
import MeterToggleBetweenUnits from "../meterToggleBetweenUnits/MeterToggleBetweenUnits";

const Header = ({ handleTabClick, activeTab }) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [bellIcon, setBellIcon] = useState("basil_notification-solid.png");
  const [newAlarmCount, setNewAlarmCount] = useState(0);
  const [error, setError] = useState(null);
  const acknowledgedAlarms = useRef([]);

  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    if (currentTab !== activeTab) {
      handleTabClick(currentTab);
    }
  }, [pathname]);
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
  // fetch alarms
  const fetchAlarms = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}${config.ALARMS.BELL}`);
      let newAlarms = res.data.bells || [];
      newAlarms = newAlarms.filter(
        (alarm) => !acknowledgedAlarms.current.includes(alarm._id)
      );

      setBellIcon(
        newAlarms.length > 0 ? "alert.gif" : "basil_notification-solid.png"
      );
      setNewAlarmCount(newAlarms.length);
      setAlarms(newAlarms.slice(0, 5));
    } catch (err) {
      console.error("Alarm error:", err);
      setError("Failed to fetch alarms.");
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
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotificationVisibility = () =>
    setNotificationVisible(!isNotificationVisible);

  useEffect(() => {
    fetchUserDetails();
    // fetchAlarms();
    // const interval = setInterval(fetchAlarms, 5000);
    // return () => clearInterval(interval);
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
    <header className="bg-[#1F5897] text-white mx-0 my-2 mt-0 h-[44px] flex text-sm items-center justify-between w-full">
      {/* Dropdown menu for small screens */}
      <div className="lg:hidden flex justify-between items-center px-4 py-2">
        <button onClick={toggleDropdown} className="cursor-pointer">
          <FontAwesomeIcon
            icon={isDropdownOpen ? faXmark : faBars}
            style={{ fontSize: "1.5em" }}
          />
        </button>
      </div>
      <nav className={`bg-[#1F5897] hidden  lg:flex w-full`}>
        {privilegeOrder
          .filter((key) => userPrivileges.includes(key))
          .map((key) => renderLink(key))}
      </nav>
      {/* mobile menu */}
      <div className="flex lg:hidden">
        <div
          className={`fixed top-[44px] left-0 w-full z-[999] transition-all duration-500 ${
            isDropdownOpen
              ? "flex max-h-[1000px]"
              : "hidden max-h-0 overflow-hidden"
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
        {/* link status */}
        {/* alarms */}
        <div className="relative mr-4 mt-1">
          <div className="relative inline-block">
            <img
              src={`./${bellIcon}`}
              alt="Bell Icon"
              className="ml-2 cursor-pointer w-[50px]"
              onClick={toggleNotificationVisibility}
            />
            {bellIcon === "alert.gif" && newAlarmCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 transform translate-x-1/2 -translate-y-1/2">
                {/* {newAlarmCount} */}
              </span>
            )}
          </div>
          {/* when alarams enables make this uncomment */}

          {/* {isNotificationVisible && (
            <div className="absolute top-full right-0 mt-2 w-80 p-6 bg-white dark:bg-gray-700 shadow-lg border border-gray-300 rounded-lg z-[9999]">
              <div className="font-semibold text-gray-700 flex justify-between items-center">
                <span className="text-black dark:text-white">Alarms</span>
                <button
                  className="text-xs text-white bg-[#c1121f] cursor-pointer px-2 py-1 rounded hover:bg-[#e9a781]"
                  onClick={() => setNotificationVisible(false)}
                >
                  Close
                </button>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className="px-3 py-3 bg-gradient-to-r cursor-pointer from-blue-400 to-[#1F5897] text-white text-sm font-semibold uppercase tracking-wide rounded-md shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  onClick={acknowledgeAlarms}
                >
                  Acknowledge
                </button>
              </div>
              <ul className="mt-4 text-sm text-gray-600">
                {error && <p>{error}</p>}
                {alarms.length > 0 ? (
                  alarms.map((alarm, idx) => (
                    <li key={idx} className="py-2 border-b flex items-center">
                      <img
                        src="./yellowbell.gif"
                        alt="Alarm"
                        className="w-6 h-6 mr-2"
                      />
                      <div className="flex flex-col text-[12px]">
                        <div className="text-black dark:text-white ">
                          {alarm.Source}
                        </div>
                        <div className="text-black dark:text-white ">
                          {alarm.Status}
                        </div>
                      </div>
                      <div className="text-right text-[12px] ml-auto">
                        <div className="text-black dark:text-white">
                          {alarm.current_time}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-4 text-gray-500">
                    No alarms available.
                  </li>
                )}
                <li
                  className="text-center py-2 mt-2 text-blue-500 cursor-pointer rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-100"
                  onClick={() => (window.location.href = "/Recent_Alarms")}
                >
                  Details
                </li>
              </ul>
            </div>
          )} */}
        </div>
        <div className=" flex items-center pr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
