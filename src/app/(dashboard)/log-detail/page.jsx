"use client";
import config from "@/constant/apiRouteList";
import { useSearchParams, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const LogDetails = () => {
  const [meterLogsData, setMeterLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  const type = searchParams.get("val");
  const meter_id = searchParams.get("meter_id");
  const router = useRouter();

  const getMeterLogsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/logs_data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            meters: meter_id,
            // start_date: "2025-06-28",
            // end_date: "2025-06-28",
            start_date: startDate,
            end_date: endDate,
          }),
        }
      );

      if (response.ok) {
        const resResult = await response.json(); // this is the actual data
        setMeterLogsData(resResult.data); // make sure resResult.data exists
        setLoading(false);
      } else {
        console.error("Failed to fetch logs:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  useEffect(() => {
    getMeterLogsData();
  }, [startDate, endDate]);

  const columns = Array.from(
    new Set(
      meterLogsData
        .flatMap((row) => Object.keys(row))
        .filter((key) => key !== "meterId")
    )
  );
  console.log("===================>", columns);
  return (
    <div className="h-[81vh] bg-white dark:bg-gray-800 border-t-3 border-[#1D5999] rounded-md px-5 py-2">
      <h1 className="font-700 font-inter text-[24px]">
        Meter Logs - <span className="uppercase text-[#1D5999]">{type}</span>
      </h1>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center justify-start gap-5">
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endtDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#22C35D] to-[#15813D] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer">
            Export excel
          </button>
          <button
            onClick={() => router.back()}
            className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#989FAC] to-[#4E5765] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
      <div className="mt-8">
        {loading ? (
          <span>Loading....</span>
        ) : (
          <div className="rounded overflow-hidden border border-gray-300">
            <div className="max-h-[63vh] overflow-y-auto">
              <table className="w-full border-collapse table-fixed">
                <thead className=" text-white sticky top-0 z-10">
                  <tr className="bg-[#1D5999] border-t-2 border-[#1D5999]">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="border border-gray-300 px-3 py-2 text-sm font-semibold  text-center"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {meterLogsData.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="border border-gray-200 px-3 py-1 text-center text-sm"
                        >
                          {col === "time"
                            ? new Date(row[col]).toLocaleString()
                            : typeof row[col] === "number"
                            ? Math.round(row[col] * 100) / 100
                            : row[col] == null
                            ? 0
                            : row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDetails;
