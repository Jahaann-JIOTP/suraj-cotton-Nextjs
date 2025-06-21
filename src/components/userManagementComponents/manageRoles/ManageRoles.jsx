"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/constant/apiRouteList";
import { useTheme } from "next-themes";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [token, setToken] = useState(null);
  const { theme } = useTheme();
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [editRolePopup, setEditRolePopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editPrivileges, setEditPrivileges] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchRoles();
      fetchPrivileges();
    }
  }, [token]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [roles]);

  const fetchRoles = async () => {
    try {
      const rolesRes = await axios.get(
        `${config.BASE_URL}${config.ADMIN.FETCH_ROLES}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rawRoles = rolesRes.data || [];
      setRoles(rawRoles);
      setFilteredRoles(rawRoles);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failde to fetch roles!",
        theme: theme,
      });
    }
  };

  const fetchPrivileges = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}${config.ADMIN.GET_PRIVILEGES}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrivileges(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch privileges!",
        theme: theme,
      });
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a role name.",
        confirmButtonColor: "#655CCA",
        confirmButtonText: "Ok",
        theme: theme,
      });
      return;
    }

    try {
      await axios.post(
        `${config.BASE_URL}${config.ADMIN.ADD_ROLE}`,
        {
          name: newRole,
          privileges: selectedPrivileges,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Role Created Successfully!",
        theme: theme,
      });
      setNewRole("");
      setSelectedPrivileges([]);
      setShowRolePopup(false);
      fetchRoles();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to create role!",
        theme: theme,
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole || editPrivileges.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select at least one privileges",
        theme: theme,
      });
      return;
    }
    try {
      await axios.patch(
        `${config.BASE_URL}${config.ADMIN.UPDATE_ROLE.replace(
          ":id",
          editRole._id
        )}`,
        {
          name: editRole.name,
          privileges: editPrivileges,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Privileges updated successfully!",
        theme: theme,
      });
      setEditRolePopup(false);
      fetchRoles();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update privileges!",
        theme: theme,
      });
    }
  };

  const handleDeleteRole = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      theme: theme,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${config.BASE_URL}${config.ADMIN.DELETE_ROLE.replace(":id", id)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          fetchRoles();
          Swal.fire({
            icon: "Deleted!",
            title: "Success",
            text: "Role has been removed.",
            theme: theme,
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.messag || "Failed to delete role!",
            theme: theme,
          });
        }
      }
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = roles.filter((role) => {
      const privilegesString = Array.isArray(role.privileges)
        ? role.privileges.map((p) => p.name).join(" ")
        : "";
      return `${role.name} ${privilegesString}`
        .toLowerCase()
        .includes(term.toLowerCase());
    });
    setFilteredRoles(filtered);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setShowRolePopup(true)}
          className="bg-[#1F5897] text-white px-4 py-2 rounded-md hover:bg-[#17406c]"
        >
          + Add Role
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search roles..."
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-500 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-[#1F5897]"
        />
      </div>

      <div className="overflow-auto rounded-md border border-gray-300 dark:border-gray-500">
        <table className="min-w-full text-sm text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-500">
          <thead className="bg-[#1A68B252] text-[#1A68B2] font-[600] font-[Raleway] text-[15.34px] leading-[125%] h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Privileges</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role, i) => {
              return (
                <tr
                  key={role._id}
                  className="hover:bg-blue-50 hover:dark:bg-gray-500 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-500">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-500">
                    {role.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-500">
                    {(role.privileges || []).map((p) => p.name).join(", ")}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-500 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        className="w-6 h-6"
                        onClick={() => {
                          setEditRole(role);
                          setEditPrivileges(role.privileges.map((p) => p._id));
                          setEditRolePopup(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
                            stroke="#1A68B2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 16L4 20L8 19L18 9L15 6L5 16Z"
                            fill="#1A68B2"
                          />
                          <path
                            d="M15 6L18 9M13 20H21"
                            stroke="#1A68B2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="w-6 h-6"
                        onClick={() => handleDeleteRole(role._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
                            fill="#D90505"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="bg-white dark:bg-gray-800 rounded-[8px] shadow-lg border-2 border-gray-300 dark:border-gray-500 border-t-[4px] border-t-[#1d5998] dark:border-t-[#1d5998] p-6 animate-fadeIn w-[500px]">
            <p className="text-black dark:text-white font-[Raleway] text-[27.44px] font-semibold leading-none !mb-[35px]">
              Add New Role
            </p>
            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-500 text-sm text-gray-700 dark:text-gray-300  focus:outline-none focus:ring-2 focus:outline-[#1F5897]"
              />
              <div className="text-gray-700 dark:text-gray-200 font-semibold mt-4">
                Select Privileges:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {privileges.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPrivileges.includes(p._id)}
                      onChange={() =>
                        setSelectedPrivileges((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((id) => id !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddRole}
                className="bg-[#1d5998] hover:bg-[#1d589898] text-white font-medium px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setShowRolePopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="bg-white dark:bg-gray-800 rounded-[8px] shadow-lg border-2 border-gray-300 dark:border-gray-500 border-t-[4px] border-t-[#1d5998] dark:border-t-[#1d5998] p-6 animate-fadeIn w-[500px]">
            <p className="text-black dark:text-white font-[Raleway] text-[27.44px] font-semibold leading-none !mb-[35px]">
              Edit Role: {editRole?.name}
            </p>

            <div className="space-y-3 mb-6">
              <div className="text-gray-700 dark:text-gray-200 font-semibold">
                Update Privileges:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {privileges.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={editPrivileges.includes(p._id)}
                      onChange={() =>
                        setEditPrivileges((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((id) => id !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleUpdateRole}
                className="bg-[#1d5998] hover:bg-[#1d589898] text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditRolePopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
