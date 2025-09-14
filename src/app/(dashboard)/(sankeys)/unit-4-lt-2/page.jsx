"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";

import { useEffect, useState } from "react";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import SankeyTotalValues from "@/components/sakeyTotalValue/SankeyTotalValues";

const UnitLt42Page = () => {
  const [Unit4Lt2TimePeriod, setUnit4Lt2TimePeriod] = useState("today");
  const [data, setDAta] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startDate, endDate } = getDateRangeFromString(Unit4Lt2TimePeriod);
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
          body: JSON.stringify({
            startDate: startDate,
            endDate: endDate,
          }),
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
  }, [Unit4Lt2TimePeriod]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-center flex justify-between">
        <h2 className="text-[20px] font-600 font-inter">Unit 4 LT 2</h2>
        <TimePeriodSelector
          selected={Unit4Lt2TimePeriod}
          setSelected={setUnit4Lt2TimePeriod}
        />
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          {loading ? (
            <CustomLoader />
          ) : (
            <SankeyChart data={data} id="unit4Lt2Chart" />
          )}
        </div>
      </div>
      <SankeyTotalValues data={data} lt="TotalLT2" />
    </div>
  );
};

export default UnitLt42Page;
