"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";

import { useEffect, useState } from "react";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
// const sankeyData = [
//   { from: "tf2", to: "totalLT2", value: 35798698 },
//   { from: "GasGen", to: "totalLT2", value: 1.71 },
//   { from: "totalLT2", to: "Drying Simplex AC", value: 1229925.43 },
//   { from: "totalLT2", to: "Weikel Conditioning Machine", value: 885060.34 },
//   { from: "totalLT2", to: "Winding AC", value: 2205441.5 },
//   { from: "totalLT2", to: "Mills RES-CLNY& Workshop", value: 0 },
//   { from: "totalLT2", to: "Card 1", value: 3702715 },
//   { from: "totalLT2", to: "Colony", value: 0 },
//   { from: "totalLT2", to: "Power House and Source", value: 0 },
//   { from: "totalLT2", to: "Blow Room", value: 2917736 },
//   { from: "totalLT2", to: "Card 2", value: 2413052.75 },
//   { from: "totalLT2", to: "Winding 01", value: 7302094.5 },
//   { from: "totalLT2", to: "Card  Filter (Bypass)", value: 0 },
//   { from: "totalLT2", to: "D/R Card Filter", value: 338064.46 },
//   { from: "totalLT2", to: "Ring 02 (Auto Cone 10-18)", value: 9749442 },
//   { from: "totalLT2", to: "Ring 04", value: 2799442.25 },
//   { from: "totalLT2", to: "Ring 03", value: 2254752.75 },
//   { from: "totalLT2", to: "Bale Press", value: 20.42 },
//   { from: "totalLT2", to: "AC Lab", value: 1.85 },
//   { from: "totalLT2", to: "Spare 01", value: 2.45 },
// ];

const UnitLt42Page = () => {
  const [Unit4Lt2TimePeriod, setUnit4Lt2TimePeriod] = useState("today");
  const [data, setDAta] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startDate, endDate } = getDateRangeFromString(Unit4Lt2TimePeriod);
  console.log(data);

  const fetchUnit4Lt2Data = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT4_LT2}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] p-4 rounded-md border-t-3 border-[#025697] ">
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
    </div>
  );
};

export default UnitLt42Page;
