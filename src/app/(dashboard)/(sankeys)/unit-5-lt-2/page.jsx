"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import SankeyTotalValues from "@/components/sakeyTotalValue/SankeyTotalValues";
import DailyConsumptionTimePeriod from "@/components/dashboardComponents/timePeriodSelector/DailyConsumptionTimePeriod";
import CustomDateAndTimeSelector from "@/components/dashboardComponents/timePeriodSelector/CustomDateAndTimeSelector";

const Unit5Lt4Page = () => {
  const [Unit5Lt2TimePeriod, setUnit5Lt2TimePeriod] = useState("today");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const formateDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: formateDate(today),
    endDate: formateDate(today),
    startTime: "06:00",
    endTime: "06:00",
  });

  let startDate = null;
  let endDate = null;
  if (Unit5Lt2TimePeriod !== "custom") {
      ({ startDate, endDate } = getDateRangeFromString(
        Unit5Lt2TimePeriod
      ));
    }
    // 👉 build unified range
  const finalRange =
    Unit5Lt2TimePeriod === "custom"
      ? intervalPeriod
      : { startDate, endDate };

  const fetchSankeyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT5_LT4}`,
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
        setData(resResult);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSankeyData();
  }, [Unit5Lt2TimePeriod, intervalPeriod.startDate, intervalPeriod.endDate, intervalPeriod.startTime, intervalPeriod.endTime]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Unit 5 LT-2</h2>
        <div className="flex items-center flex-col md:flex-row gap-2">
          <DailyConsumptionTimePeriod
            selected={Unit5Lt2TimePeriod}
            setSelected={setUnit5Lt2TimePeriod}
          />
          {Unit5Lt2TimePeriod === "custom" && (
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
          ) : (
            <SankeyChart data={data} id="unit5Lt4Chart" />
          )}
        </div>
      </div>
      <SankeyTotalValues data={data} lt="TotalLT4"/>
    </div>
  );
};

export default Unit5Lt4Page;
