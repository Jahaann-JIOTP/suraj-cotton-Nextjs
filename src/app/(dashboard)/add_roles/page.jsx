"use client";

import { useState } from "react";
import ViewUsers from "@/components/userManagementComponents/viewUsers/ViewUsers";
import AddUser from "@/components/userManagementComponents/addUser/AddUser";
import Roles from "@/components/userManagementComponents/manageRoles/ManageRoles";
const UserMangementPage = () => {
  const [activeTab, setActiveTab] = useState("roles");
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg border-t-[4px] border-t-[#1d5998] md:h-[81vh]  overflow-auto">
      <div className="text-[#4F5562] dark:text-white font-[Raleway] text-[22.34px] font-semibold leading-[125%] mb-5">
        User Configuration
      </div>

      {/* Tabs */}
      <div className="flex mb-5 gap-16 border-b-2 border-[rgba(0,0,0,0.14)] dark:border-gray-500 mt-[40px] pb-2">
        <button
          onClick={() => setActiveTab("roles")}
          className={`relative font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "roles"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Roles
          {activeTab === "roles" && (
            <div className="w-[43px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`relative font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "add"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Add Users
          {activeTab === "add" && (
            <div className="w-[80px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`relative font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "view"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          View Users
          {activeTab === "view" && (
            <div className="w-[90px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "roles" && <Roles />}
      {activeTab === "add" && <AddUser />}
      {activeTab === "view" && <ViewUsers />}
    </div>
  );
};

export default UserMangementPage;
