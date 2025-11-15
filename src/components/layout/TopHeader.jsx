"use client";
import config from "@/constant/apiRouteList";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TiInfoOutline } from "react-icons/ti";

const TopHeader = () => {
  const [mounted, setMounted] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const { theme } = useTheme();
  const isCaching = realTimeData?.message?.includes("cache retreving");
  const getMeterData = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.NODE_RED_REAL_TIME_STATUS}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      const resData = await response.json();
      if (response.ok) {
        setRealTimeData(resData);
      }
    } catch (e) {
      console.error(e?.message);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    getMeterData();
    const meterIv = setInterval(getMeterData, 5000);
    return () => clearInterval(meterIv);
  }, []);
  if (!mounted) return null;
  return (
    <header className="h-[48px] flex items-center justify-between px-4 bg-white dark:bg-gray-800">
      <div className="flex items-center">
        {theme === "light" ? (
          <img src="./suraj-cotton-logo.png" className="h-14" alt="Logo" />
        ) : (
          <img
            src="./suraj-cotton-login-logo.png"
            className="h-14"
            alt="Logo"
          />
        )}
      </div>
      {isCaching === true && (
        <div
          className="relative flex items-center gap-3 w-[60%] lg:w-[40%] py-1 px-3 
            rounded-md bg-gradient-to-r from-red-700 via-red-600 to-red-700 
            shadow-lg text-white overflow-hidden"
        >
          <div className="relative flex items-center">
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40"></span>
            <span
              className="relative flex items-center justify-center h-8 w-8 
                 rounded-full bg-red-600 shadow-md"
            >
              <TiInfoOutline size={22} className="text-white" />
            </span>
          </div>

          {/* <div className="font-bold text-sm bg-red-900 px-2 py-1 rounded">Note:</div> */}

          <div className="marquee flex-1 overflow-hidden whitespace-nowrap">
            <div className="track inline-block text-sm tracking-wide font-medium">
              Data is retrieving from cache. Once the retrieval is complete, the
              updated data will be shown on EMS.
            </div>
          </div>
        </div>
      )}

      <div className="header-right flex items-center space-x-4">
        {theme === "light" ? (
          <img
            src={"./jahaann-light.svg"}
            alt="User Image"
            className={`h-[30px]`}
          />
        ) : (
          <img
            src={"./jahaann-dark.png"}
            alt="User Image"
            className={`h-[30px]`}
          />
        )}
      </div>
    </header>
  );
};

export default TopHeader;
