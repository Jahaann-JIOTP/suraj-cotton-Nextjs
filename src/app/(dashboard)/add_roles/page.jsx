"use client";

import { useState } from "react";
import ViewUsers from "@/components/userManagementComponents/viewUsers/ViewUsers";
import AddUser from "@/components/userManagementComponents/addUser/AddUser";
import Roles from "@/components/userManagementComponents/manageRoles/ManageRoles";
const UserMangementPage = () => {
  const [activeTab, setActiveTab] = useState("view");
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg border-t-[4px] border-t-[#1d5998] md:h-[81vh]  overflow-auto">
      <div className="text-[#4F5562] dark:text-white font-[Raleway] text-[22.34px] font-semibold leading-[125%] mb-5">
        User Configuration
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
          View Users
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "add"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Add Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`font-[Raleway] text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "roles"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}
        >
          Roles
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "view" && <ViewUsers />}
      {activeTab === "add" && <AddUser />}
      {activeTab === "roles" && <Roles />}
    </div>
  );
};

export default UserMangementPage;
