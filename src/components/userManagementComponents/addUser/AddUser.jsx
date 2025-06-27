"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/constant/apiRouteList";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";

export default function AddUser() {
  const [AuthToken, setAuthToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const { theme } = useTheme();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (AuthToken) fetchRoles();
  }, [AuthToken]);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        // `${config.BASE_URL}${config.ADMIN.FETCH_SELECTED_ROLES}`,
        `${config.SURAJ_COTTON_BASE_URL}/roles/allrole`,
        {
          headers: { Authorization: `Bearer ${AuthToken}` },
        }
      );

      setRoles(res?.data?.data || []); // ✅ Corrected
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch roles!",
        "error"
      );
    }
  };

  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.roleId
    ) {
      Swal.fire("Error", "Please fill in all fields!", "error");
      return;
    }

    if (newUser.password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Warning!",
        text: "Password and Confirm Password Must be Matched!",
        theme: theme,
      });
      return;
    }

    try {
      await axios.post(
        // `${config.BASE_URL}${config.ADMIN.ADD_USER}`,
        `${config.SURAJ_COTTON_BASE_URL}/users/addUser`,
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          roleId: newUser.roleId, // now roleName, not roleId
        },
        {
          headers: { Authorization: `Bearer ${AuthToken}` },
        }
      );

      Swal.fire("Success", "User added successfully!", "success");
      setNewUser({ name: "", email: "", password: "", roleId: "" });
    } catch (err) {
      const message = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join("\n")
        : err.response?.data?.message || "Failed to add user!";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div>
      <p className="text-black dark:text-white font-[Raleway] text-[18.34px] font-semibold leading-[125%] mt-[40px] mb-5">
        Add New User
      </p>

      <div className="space-y-4 mb-6 flex items-center justify-between flex-wrap gap-5">
        <div className="w-full md:w-[45%]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full md:w-[45%]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full md:w-[45%]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="w-full md:w-[45%]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full md:w-[45%]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Role
          </label>
          <select
            value={newUser.roleId}
            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F5897]"
          >
            <option value="" className="dark:text-gray-400 dark:bg-gray-800">
              Select Role
            </option>
            {roles.map((role) => (
              <option
                key={role._id}
                className="dark:text-gray-400 dark:bg-gray-800"
                value={role._id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handleAddUser}
          className="flex w-[454px] h-[41px] px-[176px] py-[9px] justify-center items-center gap-[10px] shrink-0 rounded-[6px] font-[Raleway] bg-[#1A68B2] text-white"
        >
          Add User
        </button>
      </div>
    </div>
  );
}
