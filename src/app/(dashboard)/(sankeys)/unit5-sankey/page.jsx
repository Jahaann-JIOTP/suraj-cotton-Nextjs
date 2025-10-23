"use client";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import SankeyTotalValues, {
  calculateSums,
} from "@/components/sakeyTotalValue/SankeyTotalValues";
import CustomDateAndTimeSelector from "@/components/dashboardComponents/timePeriodSelector/CustomDateAndTimeSelector";
import DailyConsumptionTimePeriod from "@/components/dashboardComponents/timePeriodSelector/DailyConsumptionTimePeriod";
const mainSanekyData = [
  { from: "Unit 5", to: "LT 1", value: 500 },
  { from: "Unit 5", to: "LT 2", value: 100 },
];
const Unit5Sankey = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("today");
  const [data, setData] = useState([]);
  const nodeClickMap = {
    "LT 1": "/unit-5-lt-1",
    "LT 2": "/unit-5-lt-2",
  };
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

  const { generation, consumption } = calculateSums(data, "TotalLT1");

  // time period selector
  let startDate = null;
  let endDate = null;
  if (unit4Lt1TimePeriod !== "custom") {
    ({ startDate, endDate } = getDateRangeFromString(unit4Lt1TimePeriod));
  }

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Unit 5</h2>
        <div className="flex items-center flex-col md:flex-row gap-2">
          <DailyConsumptionTimePeriod
            selected={unit4Lt1TimePeriod}
            setSelected={setUnit4Lt1TimePeriod}
          />
          {unit4Lt1TimePeriod === "custom" && (
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
          {/* <SankeyChart data={mainSanekyData} id="Unit5Sankey" /> */}
          <SankeyChart
            data={mainSanekyData}
            id="Unit5Sankey"
            nodeClickMap={nodeClickMap}
          />
        </div>
      </div>
      <SankeyTotalValues data={data} lt="TotalLT1" />
    </div>
  );
};

export default Unit5Sankey;
