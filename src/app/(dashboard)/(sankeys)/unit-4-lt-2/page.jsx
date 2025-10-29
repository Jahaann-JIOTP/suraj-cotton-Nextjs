"use client";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";

import { useEffect, useState } from "react";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import SankeyTotalValues, {
  calculateSums,
} from "@/components/sakeyTotalValue/SankeyTotalValues";
import CustomDateAndTimeSelector from "@/components/dashboardComponents/timePeriodSelector/CustomDateAndTimeSelector";
import DailyConsumptionTimePeriod from "@/components/dashboardComponents/timePeriodSelector/DailyConsumptionTimePeriod";

const UnitLt42Page = () => {
  const [Unit4Lt2TimePeriod, setUnit4Lt2TimePeriod] = useState("today");
  const [data, setDAta] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const formateDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: formateDate(today),
    endDate: formateDate(today),
    startTime: "06:00",
    endTime: "18:00",
  });

  let startDate = null;
  let endDate = null;
  if (Unit4Lt2TimePeriod !== "custom") {
    ({ startDate, endDate } = getDateRangeFromString(Unit4Lt2TimePeriod));
  }

  const { generation, consumption } = calculateSums(data, "TotalLT2");
  // 👉 build unified range
  const finalRange =
    Unit4Lt2TimePeriod === "custom" ? intervalPeriod : { startDate, endDate };
  const fetchUnit4Lt2Data = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT4_LT2}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalRange),
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setDAta(resResult);
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit4Lt2Data();
  }, [
    Unit4Lt2TimePeriod,
    intervalPeriod.startDate,
    intervalPeriod.endDate,
    intervalPeriod.startTime,
    intervalPeriod.endTime,
  ]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Unit 4 LT-2</h2>
        <div className="flex items-center flex-col md:flex-row gap-2">
          <DailyConsumptionTimePeriod
            selected={Unit4Lt2TimePeriod}
            setSelected={setUnit4Lt2TimePeriod}
          />
          {Unit4Lt2TimePeriod === "custom" && (
            <CustomDateAndTimeSelector
              intervalPeriod={intervalPeriod}
              onChange={(updated) =>
                setIntervalPeriod((prev) => ({ ...prev, ...updated }))
              }
            />
          )}
        </div>
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          {loading ? (
            <CustomLoader />
          ) : consumption > 0 || generation > 0 ? (
            <SankeyChart data={data} isGray={true} />
          ) : (
            <div className="absolute top-19 left-0 h-[70%] w-full flex flex-col items-center justify-center rounded-md z-10">
              <img src="./sankeyEmpty.png" className="w-[300px]" alt="" />
              <span className="text-gray-400 text-[14px]">
                No Data Available!
              </span>
            </div>
          )}
        </div>
      </div>
      <SankeyTotalValues data={data} lt="TotalLT2" />
    </div>
  );
};

export default UnitLt42Page;
