"use client";
import DailyConsumptionPage from "@/components/dashboardComponents/daily_consumption/DailyConsumptionPage";
import config from "@/constant/apiRouteList";

import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import React, { useEffect, useState } from "react";

const U4Lt1Dailyconsumption = () => {
  const { startDate, endDate } = getDateRangeFromString("today");

  const [lt1Data, setLt1Data] = useState({});
  const [loading, setLoading] = useState(false)
  const [range, setRange] = useState({ startDate, endDate });
          
  const handleRangeChange = (newRange) => {
    setRange(newRange);
  };
  // fetch daily consumption for unit 4 lt 1
  const fetchDailyConsumption = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DAILY_CONSUMPTION.UNIT4_LT1_CONS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(range),
        }
        
      );
      const resResult = await response.json();
      if(response.ok){
        setLt1Data(resResult)
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchDailyConsumption();
  },[range])
  return (
    <div className="bg-white shadow dark:bg-gray-800 rounded-md border-t-3 border-[#025697] overflow-y-auto h-full md:h-[81vh] px-4 py-3">
      <div className="">
        <DailyConsumptionPage
          pageTitle="Unit 4 - LT 1"
          data={lt1Data}
          loading={loading}
          onRangeChange={handleRangeChange}
        />
      </div>
    </div>
  );
};

export default U4Lt1Dailyconsumption;
