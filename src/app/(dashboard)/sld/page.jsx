"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";

// Unit 4 Components
import InitialSldUnit4 from "@/components/sldComponent/initialSldUnit4/InitialSldUnit4";
import Unit4Lt1 from "@/components/sldComponent/unit4lt1/Unit4Lt1";

// Unit 5 Components
import InitialSldUnit5 from "@/components/sldComponent/initialSldUnit5/InitialSldUnit5";

// Main Overview
import MainSldOverview from "@/components/sldComponent/mainSldSelector/MainSldOverview";
import Unit5Lt3 from "@/components/sldComponent/unit5lt3/Unit5Lt3";
import Unit5Lt4 from "@/components/sldComponent/unit5lt4/Unit5Lt4";
import Unit4Lt2 from "@/components/sldComponent/unit4Lt2/Unit4Lt2";

const Page = () => {
  const [meterData, setMeterData] = useState([]);
  const searchParams = useSearchParams();

  const unit = searchParams.get("unit");
  const area = searchParams.get("area");

  const getMeterData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DIAGRAM.MAIN_METER_TAGS_LINK}`
      );
      const resData = await response.json();
      if (response.ok) setMeterData(resData);
    } catch (error) {
      console.error(error.message);
    }
  };

  function roundNumbersInJson(obj) {
    const newObj = { ...obj };

    for (let key in newObj) {
      const value = newObj[key];

      if (typeof value === "number") {
        if (value >= 1000) {
          // No decimal
          newObj[key] = Math.round(value);
        } else if (value >= 100 && value < 1000) {
          // 1 decimal
          newObj[key] = Math.round(value * 10) / 10;
        } else if (value < 100) {
          // 2 decimals
          newObj[key] = Math.round(value * 100) / 100;
        }
      }
    }

    return newObj;
  }

  const roundedData = roundNumbersInJson(meterData);

  useEffect(() => {
    getMeterData();
    const interval = setInterval(getMeterData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderComponent = () => {
    if (!unit) return <MainSldOverview roundedData={roundedData} />;

    if (unit === "unit4") {
      if (area === "lt1") return <Unit4Lt1 roundedData={roundedData} />;
      if (area === "lt2") return <Unit4Lt2 roundedData={roundedData} />;
      return <InitialSldUnit4 roundedData={roundedData} />;
    }

    if (unit === "unit5") {
      if (area === "lt1") return <Unit5Lt3 roundedData={roundedData} />;
      if (area === "lt2") return <Unit5Lt4 roundedData={roundedData} />;
      return <InitialSldUnit5 roundedData={roundedData} />;
    }

    return <MainSldOverview roundedData={roundedData} />;
  };

  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-4 p-5 border-[#1F5897] overflow-auto">
      <div className="relative min-w-[1250px] min-h-[500px] mx-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Page;
