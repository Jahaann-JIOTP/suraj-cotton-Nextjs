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
import { AiFillBell } from "react-icons/ai";
import MobileSidebar from "./MobileSidebar";
import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";
import { getActiveTabFromPathname } from "@/utils/navigation-utils";
import { RxCross1 } from "react-icons/rx";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

const Header = ({ handleTabClick, activeTab }) => {
  const pathname = usePathname();
  const notificationDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [bellIcon, setBellIcon] = useState("basil_notification-solid.png");
  const [newAlarmCount, setNewAlarmCount] = useState(0);
  const [realTimeData, setRealTimeData] = useState([]);
  const [error, setError] = useState(null);
  const acknowledgedAlarms = useRef([]);
  const { theme } = useTheme();

  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    if (currentTab !== activeTab) {
      handleTabClick(currentTab);
    }
  }, [pathname]);
  const getMeterData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.MAIN_METER_TAGS_LINK}`
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

    // fetchAlarms();

    // const interval = setInterval(fetchAlarms, 5000);
    // return () =>clearInterval(interval);
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
        <button
          // onClick={toggleDropdown}
          onClick={() => {
            isDropdownOpen === true
              ? setIsDropdownOpen(false)
              : setIsDropdownOpen(true);
          }}
          className="cursor-pointer"
        >
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
            isDropdownOpen ? "flex max-h-[1000px]" : "hidden"
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
          {realTimeData.error === "Invalid data structure" ? (
            <div className="flex flex-col items-center justify-center">
              <img src={"../../../red_bl.gif"} className="w-[20px]" />
              <span className="text-[10px] animate-pulse duration-300">
                Link Down
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img src={"../../../green_bl.gif"} className="w-[20px]" />
              <span className="text-[10px]">Link Up</span>
            </div>
          )}
        </div>
        {/* link status */}
        {/* alarms */}
        <div className="relative mr-4">
          <div className="relative">
            <AiFillBell
              size={30}
              className="cursor-pointer"
              onClick={toggleNotificationVisibility}
            />
            {/* <span className="absolute top-0 right-1 px-[1px] pb-[1px] bg-red-500 text-white text-[9px] rounded-full ">
              {newAlarmCount}10
              </span> */}
            {newAlarmCount > 0 && (
              <Badge className="px-1 w-[18px] h-[18px] rounded-full absolute top-[-2px] right-[-5px] bg-red-500 text-[11px]">
                {newAlarmCount}
              </Badge>
            )}
          </div>
          {/* when alarams enables make this uncomment */}

          {isNotificationVisible && (
            <div
              ref={notificationDropdownRef}
              className="absolute top-full right-[-60px] md:right-0 mt-2 w-80 p-4 bg-white dark:bg-gray-700 shadow-lg border border-gray-300 rounded-lg z-[9999]"
            >
              <div className=" w-full flex justify-between items-center">
                <div className="w-[60%] flex items-center  justify-end">
                  <span className=" font-500 text-gray-800 darktext-white text-[20.22px] dark:text-white">
                    Alarms
                  </span>
                </div>
                <div className="w-[40%] flex items-center  justify-end">
                  <button
                    className="  text-gray-800 dark:text-white cursor-pointer"
                    onClick={() => setNotificationVisible(false)}
                  >
                    <RxCross1 size={23} />
                  </button>
                </div>
              </div>

              {alarms.length > 0 ? (
                <div className="">
                  <div className="flex flex-col h-[10rem] overflow-x-hidden overflow-y-auto custom-scrollbar-report items-center justify-center w-full mt-5">
                    {alarms.map((alarm, index) => {
                      const lastIntex = alarms.length - 1;

                      return (
                        <div
                          key={index}
                          className={`text-black dark:text-white flex items-center py-3 justify-between ${
                            lastIntex !== index
                              ? "border-b-1 border-gray-300"
                              : ""
                          } w-full`}
                        >
                          <div className="flex items-center gap-1">
                            <AiFillBell size={28} className="text-[#1F5897]" />
                            <div className="flex flex-col gap-1">
                              <span className="font-inter font-500 text-[12.04px]">
                                {alarm.Source}
                              </span>
                              <span className="font-inter font-400 text-[11.04px] text-gray-500 dark:text-gray-200">
                                {alarm.Status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-inter font-400 text-[11.04px] text-gray-500 dark:text-gray-200">
                              {alarm.current_date}
                            </span>
                            <span className="font-inter font-400 text-[11.04px] text-gray-500 dark:text-gray-200">
                              {alarm.current_time}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={"/recent-alarms"}
                              className="font-inter font-400 pr-2 text-[12.04px] text-[#025697] hover:underline transition-all duration-300"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      className="px-3 py-2  cursor-pointer bg-[#1F5897] text-white text-sm font-500 font-inter text-[
12.04px] rounded-sm shadow-md hover:scale-103 transition-all duration-300"
                      onClick={acknowledgeAlarms}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-7 p-7 items-center justify-center">
                  <img
                    src={
                      theme === "light"
                        ? "../../../noAlarmImage.png"
                        : "../../../noAlarm-dark.png"
                    }
                    alt=""
                    className="w-[170px]"
                  />
                  <span className="text-black dark:text-white font-inter font-400 text-[15.04px]">
                    No Alarms available yet!
                  </span>
                </div>
              )}
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
