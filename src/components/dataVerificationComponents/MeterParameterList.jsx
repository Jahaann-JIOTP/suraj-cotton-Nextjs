"use client";
import React, { useState, useEffect } from "react";
import { FaEdit as Edit, FaSave as Save } from "react-icons/fa";
import CustomLoader from "../customLoader/CustomLoader";
import config from "@/constant/apiRouteList";
import { toast } from "react-toastify";

const statusOptions = ["Verified", "Not Verified", "Not Sure", "Not Used"];

const PAGE_SIZE = 10;

const MeterParameterList = ({
  data,
  location,
  uniqueKey,
  searchQuery,
  statusFilter,
  currentPage,
  setCurrentPage,
  meterName
}) => {
  const [parameters, setParameters] = useState(data);
  const [lastUpdated, setLastUpdated] = useState("");
  const [comments, setComments] = useState({});
  const [comment, setComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [realTimeValues, setRealTimeValues] = useState({});
  const [lastFetchedTime, setLastFetchedTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRealTimeLoading, setIsRealTimeLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [meterComment, setMeterComment] = useState("");
  const [updatedAt, setUpdateAT] = useState("")
  const updateTimeToLocal = new Date(updatedAt).toLocaleString("en-US")
  const updateMeterData = async (updates) => {
    try {
      const response = await fetch(`/api/meters/${uniqueKey}/update-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const resResult = await response.json();
      if (response.ok) {
        toast.success(
          <div>
            Status of <strong>{updates?.paramName}</strong> updated to{" "}
            <strong>{resResult.updatedStatus}</strong>
          </div>
        );
        return resResult;
      }
    } catch (error) {
      console.error("Error updating meter data:", error);
      throw error;
    }
  };

  const fetchRealTimeValues = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsRealTimeLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.MAIN_METER_TAGS_LINK}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch real-time data");
      const data = await response.json();
      setRealTimeValues(data);
      setLastFetchedTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    } finally {
      setIsRealTimeLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeValues();
    const interval = setInterval(fetchRealTimeValues, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchParameters = async () => {
    if (!uniqueKey) return;
    setIsLoading(true);
    try {
      let url = `/api/meters/${uniqueKey}`;
      if (statusFilter && statusFilter !== "") {
        url = `/api/meters/filter?unique_key=${uniqueKey}&status=${encodeURIComponent(
          statusFilter
        )}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const apiData = await res.json();
        if (apiData?.parameters) {
          const dynamicParams = apiData.parameters.map((p) => ({
            param: p.paramName,
            status: p.status || "Not Verified",
          }));
          setParameters(dynamicParams);
          setMeterComment(apiData.comment || "");
          setUpdateAT(apiData?.updatedAt)
        }
      } else {
        setParameters(data);
      }
    } catch (err) {
      setParameters(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, [uniqueKey, statusFilter]);

  const filteredParameters = parameters.filter((param) => {
    const matchesSearch = param.param
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || param.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setComment(comments[uniqueKey] || "");
    setIsEditingComment(false);
  }, [uniqueKey]);

  const pageCount = Math.ceil(filteredParameters.length / PAGE_SIZE);
  const pagedParameters = filteredParameters.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleStatusChange = async (paramName, newStatus) => {
    const originalIndex = parameters.findIndex((p) => p.param === paramName);
    if (originalIndex !== -1) {
      try {
        setUpdatingStatus((prev) => ({ ...prev, [paramName]: true }));
        const newParameters = [...parameters];
        newParameters[originalIndex].status = newStatus;
        setParameters(newParameters);
        setLastUpdated(getCurrentTime());
        await updateMeterData({
          paramName,
          newStatus,
        });
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        setUpdatingStatus((prev) => ({
          ...prev,
          [paramName]: false,
        }));
      }
    }
  };

  const handleSaveComment = async () => {
    try {
      await updateMeterData({ comment });
      setComments((prev) => ({
        ...prev,
        [uniqueKey]: comment,
      }));
      setMeterComment(comment);
      setIsEditingComment(false);
      toast.success("Comment updated")
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  const getStatusColor = (status, isSelected) => {
    if (!isSelected) return "text-gray-500";
    switch (status) {
      case "Verified":
        return "text-green-600";
      case "Not Verified":
        return "text-red-600";
      case "Not Sure":
        return "text-[#1A68B2]";
      case "Not Used":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const getDotColor = (status, isSelected) => {
    if (!isSelected) return "bg-gray-300";
    switch (status) {
      case "Verified":
        return "bg-green-500";
      case "Not Verified":
        return "bg-red-500";
      case "Not Sure":
        return "bg-[#1A68B2]";
      case "Not Used":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const getRealTimeValue = (paramName) => {
    const key = `${uniqueKey}_${paramName}`.replace(/\s+/g, "_");
    return realTimeValues[key] !== undefined
      ? realTimeValues[key].toFixed(2)
      : "N/A";
  };

  return (
    <div className="bg-white dark:bg-gray-800 px-2 sm:px-4 md:px-7 py-4 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-400 mb-4">
        {/* <span>
          <span className="font-medium">Meter: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">{selectedMeter}</span>
        </span> */}
        <span>
          <span className="font-medium">Location: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">{location}</span>
        </span>
        <span>
          <span className="font-medium">Unique ID: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">{uniqueKey}</span>
        </span>
        <span>
          <span className="font-medium">CT Ratio: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">Not Available</span>
        </span>
        <span>
          <span className="font-medium">PT Ratio: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">Not Available</span>
        </span>
        <span>
          <span className="font-medium">Modbus ID: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">Not Available</span>
        </span>
        <span>
          <span className="font-medium">Last Updated: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">{updateTimeToLocal || "N/A"}</span>
        </span>
        <span>
          <span className="font-medium">Last Fetched: </span>
          <span className="text-[#265F95] dark:text-[#4DA0F0]">{lastFetchedTime || "N/A"}</span>
        </span>
      </div>
      {/* Title with Results Count */}
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <h1 className="text-base sm:text-lg font-medium text-[#7B849A] text-left">
          Parameter list for meter ({meterName})
        </h1>
        {(searchQuery || statusFilter) && (
          <div className="text-sm text-gray-600">
            Showing {filteredParameters.length} of {parameters.length}{" "}
            parameters
            {statusFilter && (
              <span className="ml-2">
                • Status:{" "}
                <span className="font-medium text-blue-600">
                  {statusFilter}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full sm:min-w-[500px] rounded w-full border border-gray-200 text-center text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr className="bg-[#02569738]">
              <th className="p-2 text-[#004981] border whitespace-nowrap">
                Serial No.
              </th>
              <th className="p-2 sm:pl-[25px] sm:pr-10 border text-[#004981] whitespace-nowrap">
                Parameter
              </th>
              <th className="p-2 sm:pl-[26px] sm:pr-10 border text-[#004981] whitespace-nowrap">
                Value
              </th>
              <th className="p-2 border text-[#004981] whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="">
                <td colSpan={4} className="p-8">
                  <div className="flex justify-center items-center">
                    <CustomLoader />
                  </div>
                </td>
              </tr>
            ) : filteredParameters.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {searchQuery || statusFilter
                    ? "No parameters found matching your search criteria."
                    : "No parameters available."}
                </td>
              </tr>
            ) : (
              pagedParameters.map((param, i) => (
                <tr
                  key={`${uniqueKey}-${param.param}`}
                  className="border-t hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <td className="p-2 border whitespace-nowrap">
                    {(currentPage - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="p-2 sm:p-3 border whitespace-nowrap text-center">
                    {searchQuery ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: param.param.replace(
                            new RegExp(`(${searchQuery})`, "gi"),
                            '<mark class="bg-yellow-200 font-medium">$1</mark>'
                          ),
                        }}
                      />
                    ) : (
                      param.param
                    )}
                  </td>
                  <td className="p-2 border whitespace-nowrap">
                    {getRealTimeValue(param.param)}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-col md:flex-row justify-around gap-4 md:gap-1">
                      {statusOptions.map((option) => {
                        const isSelected = param.status === option;
                        return (
                          <label
                            key={option}
                            className={`flex items-center gap-1 cursor-pointer ${getStatusColor(
                              option,
                              isSelected
                            )}`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full ${getDotColor(
                                option,
                                isSelected
                              )}`}
                            ></span>
                            <input
                              type="radio"
                              name={`status-${uniqueKey}-${param.param}`}
                              checked={isSelected}
                              onChange={() =>
                                handleStatusChange(param.param, option)
                              }
                              className="hidden"
                              disabled={updatingStatus[param.param]}
                            />
                            <span className="text-xs sm:text-sm font-medium">
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {!isLoading && pageCount > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-3 py-1 border rounded shadow-sm bg-white dark:bg-gray-700 text-gray-600 cursor-pointer hover:bg-blue-50 dark:text-blue-100 hover:text-blue-700 transition disabled:opacity-50 disabled:shadow-none"
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {Array.from({ length: pageCount }).map((_, idx) => {
            if (
              idx === 0 ||
              idx === pageCount - 1 ||
              Math.abs(currentPage - (idx + 1)) <= 1
            ) {
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 border rounded shadow-sm bg-white dark:bg-gray-700 transition cursor-pointer 
                    ${
                      currentPage === idx + 1
                        ? "font-bold text-black bg-blue-100 border-[#004981] shadow"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    }
                    `}
                >
                  {idx + 1}
                </button>
              );
            }
            if (
              (idx === 1 && currentPage > 3) ||
              (idx === pageCount - 2 && currentPage < pageCount - 2)
            ) {
              return (
                <span key={idx} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              );
            }
            return null;
          })}
          <button
            onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
            className="px-3 py-1 border rounded shadow-sm bg-white dark:bg-gray-700 text-gray-600 hover:bg-blue-50  hover:text-blue-700 transition disabled:opacity-50 disabled:shadow-none cursor-pointer"
            disabled={currentPage === pageCount}
          >
            {">"}
          </button>
        </div>
      )}
      {/* Comment */}
      {!isLoading && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="w-full">
            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
              <h3 className="text-base font-medium text-gray-600 dark:text-gray-400">
                Add comment (for this Meter)
              </h3>
              {isEditingComment ? (
                <button
                  onClick={handleSaveComment}
                  className="text-[#265F95] hover:text-blue-700 flex items-center cursor-pointer gap-1 text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              ) : meterComment || comments[uniqueKey] ? (
                <button
                  onClick={() => {
                    setComment(meterComment || comments[uniqueKey] || "");
                    setIsEditingComment(true);
                  }}
                  className="text-[#265F95] hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              ) : null}
            </div>
            {isEditingComment ? (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300  rounded px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#265F95] min-h-[6rem] resize-y"
                placeholder="Type your comment here..."
                autoFocus
              />
            ) : meterComment || comments[uniqueKey] ? (
              <div className="border border-transparent px-3 py-2 rounded min-h-[6rem] whitespace-pre-wrap bg-gray-200 dark:bg-gray-600">
                {meterComment || comments[uniqueKey]}
              </div>
            ) : (
              <button
                onClick={() => {
                  setComment("");
                  setIsEditingComment(true);
                }}
                className="text-[#265F95] hover:text-blue-700 text-sm font-medium hover:underline"
              >
                + Add comment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default MeterParameterList;
