"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import config from "@/constant/apiRouteList";
import { FaCircle } from "react-icons/fa";
import { AlarmTable } from "@/components/alarmsComponents/AlarmsTable";
import CustomLoader from "@/components/customLoader/CustomLoader";
const AllAlarmPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14;
  const paginationBtn =
    "px-3 py-2 text-sm rounded-md border border-gray-300 bg-gradient-to-b from-gray-100 to-gray-300 text-gray-800 hover:from-gray-200 hover:to-gray-400 hover:text-gray-900 transition duration-300";

  const removeDuplicates = (alarms) => {
    const seen = new Set();
    return alarms.filter((alarm) => {
      if (seen.has(alarm._id)) return false;
      seen.add(alarm._id);
      return true;
    });
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      axios
        .get(`${config.BASE_URL}${config.ALARMS.GET_ALARMS}`)
        .then((response) => {
          const alarms = response.data?.alarms || [];
          const formattedAlarms = alarms.map((alarm) => ({
            _id: alarm._id,
            state: alarm.end_time ? "Inactive" : "Active", // sets state based on end_time
            Source: alarm.Source,
            Status: alarm.status1,
            Time: alarm.current_time,
            alarm_count: alarm.alarm_count,
          }));

          const uniqueData = removeDuplicates(formattedAlarms);
          setData(uniqueData);
          setLoading(false);
        });
      setLoading(false);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) return <CustomLoader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const getStatusDetails = (status) => {
    if (status === "Low Voltage" || status === "Low Current") {
      return {
        color: "bg-yellow-400",
        image: <FaCircle className="text-yellow-500" />,
      };
    }
    if (status === "High Voltage" || status === "High Current") {
      return {
        color: "bg-red-500",
        image: <FaCircle className="text-red-500" />,
      };
    }
    return { color: "bg-green-500", image: null };
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const exportData = data.map((item) => ({
      State: item.state || "N/A",
      Source: item.Source || "N/A",
      Status: item.Status || "N/A",
      LastOccurrence: item.Time ? new Date(item.Time).toLocaleString() : "N/A",
      Occurrences: item.alarm_count || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alarms");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelFile, "alarms_data.xlsx");
  };

  return (
    <div className="relative w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-3 border-t-[#1F5897]">
      <div className="flex justify-between items-center px-6 py-4 border-b dark:border-b-gray-500 border-gray-200 z-10 relative">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          All Alarms
        </h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 text-sm bg-[#0561a7] cursor-pointer text-white rounded-md shadow hover:bg-[#025697a9] transition"
        >
          Export to Excel
        </button>
      </div>
      <div className="px-10">
        <AlarmTable />
      </div>
    </div>
  );
};
export default AllAlarmPage;
