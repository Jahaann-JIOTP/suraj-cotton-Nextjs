"use client";
import React, { useState } from "react";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import ReusableTrendChart from "./ReusableTrendChart";
import CustomLoader from "../customLoader/CustomLoader";

const Unit4Trafos = ({
  title,
  selectedKeys = {},
  data = [],
  loading = false,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [fullscreen, setFullscreen] = useState(false);
  //   const [loading, setLoading] = useState(false);

  return (
    <div
      className={`w-full p-4 ${
        fullscreen ? "absolute top-0 left-0 z-50 h-screen" : "relative"
      } bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
          {title}
        </span>

        <div className="flex items-center gap-2">
          {/* Date Pickers */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium dark:text-gray-300">Interval:</span>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <span className="dark:text-gray-300">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {fullscreen ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>
      <>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
            <CustomLoader />
          </div>
        )}
        <ReusableTrendChart
          id={`Unit4TrafoLosses1and2`}
          title="UNIT 4 TRANSFORMER 1+2 LOSSES"
          data={data}
          //   data={data.map((item) => ({
          //     time: new Date(item.timestamp).getTime(),
          //     Unit4CombineNetLosses: item.Unit4CombineNetLosses,
          //     Unit4CombineNetLossesPercentage:
          //       item.Unit4CombineNetLossesPercentage,
          //   }))}
          xKey="time"
          xType="date"
          series={[
            {
              type: "line",
              yKey: "netLosses",
              name: "Net Losses",
              color: "#4682B4",
            },
            {
              type: "line",
              yKey: "netLossesPercent",
              name: "Losses (%)",
              color: "#008D23",
              yAxis: "right",
            },
          ]}
          yLeftTitle="Net Losses"
          yRightTitle="Losses (%)"
          legend
          cursor
          scrollbar
          isFullscreen={fullscreen}
        />
      </>
    </div>
  );
};

export default Unit4Trafos;
