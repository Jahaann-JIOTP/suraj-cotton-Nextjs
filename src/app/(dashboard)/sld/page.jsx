"use client";

import { useSearchParams } from "next/navigation";
import InitialSldUnit4 from "@/components/sldComponent/initialSldUnit4/InitialSldUnit4";
import Unit4Lt1 from "@/components/sldComponent/unit4lt1/Unit4Lt1";
import Unit4Lt2 from "@/components/sldComponent/unit4Lt2/Unit4Lt2";
import React, { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import { toast } from "react-toastify";

const Page = () => {
  const [meterData, setMeterData] = useState([]);
  const searchParams = useSearchParams();
  const unit = searchParams.get("unit");
  const area = searchParams.get("area");
  const getMeterData = async () => {
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/node-red-link`
      );
      const resData = await response.json();
      if (response.ok) {
        setMeterData(resData);
      }
    } catch (error) {
      console.log("link is down.");
      console.error(error.message);
    }
  };
  function roundNumbersInJson(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "number") {
        // Round to 2 decimal places
        obj[key] = Math.round(obj[key] * 100) / 100;
      }
    }
    return obj;
  }
  const roundedData = roundNumbersInJson(meterData);

  useEffect(() => {
    getMeterData();
    const interval = setInterval(() => {
      getMeterData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-4 p-5 border-[#1F5897] overflow-auto">
      <div className="relative min-w-[1250px] min-h-[500px] mx-auto">
        {area === "lt1" && unit === "unit4" ? (
          <Unit4Lt1 roundedData={roundedData} />
        ) : area === "lt2" && unit === "unit4" ? (
          <Unit4Lt2 roundedData={roundedData} />
        ) : (
          <InitialSldUnit4 roundedData={roundedData} />
        )}
      </div>
    </div>
  );
};

export default Page;
