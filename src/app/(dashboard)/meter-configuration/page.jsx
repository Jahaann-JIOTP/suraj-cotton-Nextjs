"use client";

import { useState } from "react";
import Settings from "@/components/meterConfigurationComponents/settings/Settings";
import MeterLogs from "@/components/meterConfigurationComponents/meterLogs/MeterLogs";

const MeterConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("view");
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg border-t-[4px] border-t-[#1d5998] h-full md:h-[87vh]  overflow-auto">
      <div className="text-[#4F5562] dark:text-white font-[Raleway] text-[22.34px] font-semibold leading-[125%] mb-5">
        Meter Configuration
      </div>

      {/* Tabs */}
      <div className="flex mb-5 gap-16 border-b-2 border-[rgba(0,0,0,0.14)] dark:border-gray-500 mt-[40px] pb-2">
        <button
          onClick={() => setActiveTab("view")}
          className={`font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "view"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Settings
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "roles"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Logs
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "view" && <Settings />}
      {activeTab === "roles" && <MeterLogs />}
    </div>
  );
};

export default MeterConfigurationPage;
