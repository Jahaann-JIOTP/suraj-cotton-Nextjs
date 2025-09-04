"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";

const UnitLt41Page = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("today");
  const [data, setData] = useState([]);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>",data)
  const [loading, setLoading] = useState(false);

  // time period selector
  const { startDate, endDate } = getDateRangeFromString(unit4Lt1TimePeriod);
  const fetchLt1SankyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT4_LT1}`,
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
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLt1SankyData();
  }, [unit4Lt1TimePeriod]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-center flex justify-between">
        <h2 className="text-[20px] font-600 font-inter">Unit 4 LT-1</h2>
        <TimePeriodSelector
          selected={unit4Lt1TimePeriod}
          setSelected={setUnit4Lt1TimePeriod}
        />
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          {loading ? (
            <CustomLoader />
          ) : (
            <SankeyChart data={data} id="unit4Lt1Chart" />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitLt41Page;
