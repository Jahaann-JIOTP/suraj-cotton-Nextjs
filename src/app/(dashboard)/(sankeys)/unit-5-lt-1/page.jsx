"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import SankeyTotalValues from "@/components/sakeyTotalValue/SankeyTotalValues";

const Unit5Lt3Page = () => {
  const [Unit5lt3TimePeriod, setUnit5lt3TimePeriod] = useState("today");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const { startDate, endDate } = getDateRangeFromString(Unit5lt3TimePeriod);

  const fetchSankeyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT5_LT3}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
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
  }, [Unit5lt3TimePeriod]);
  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-center flex justify-between">
        <h2 className="text-[20px] font-600 font-inter">Unit 5 LT 1</h2>
        <TimePeriodSelector
          selected={Unit5lt3TimePeriod}
          setSelected={setUnit5lt3TimePeriod}
        />
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          {loading ? (
            <CustomLoader />
          ) : (
            <SankeyChart data={data} id="unit5Lt3Chart" />
          )}
        </div>
      </div>
      <SankeyTotalValues data={data} lt="TotalLT3"/>
    </div>
  );
};

export default Unit5Lt3Page;
