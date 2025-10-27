"use client";
// import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import SankeyTotalValues, {
  calculateSums,
} from "@/components/sakeyTotalValue/SankeyTotalValues";
import CustomDateAndTimeSelector from "@/components/dashboardComponents/timePeriodSelector/CustomDateAndTimeSelector";
import DailyConsumptionTimePeriod from "@/components/dashboardComponents/timePeriodSelector/DailyConsumptionTimePeriod";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
const mainSanekyData = [
  { from: "HT", to: "Total", value: 300 },
  { from: "LT", to: "Total", value: 300 },
  { from: "WAPDA", to: "Total", value: 100 },
  { from: "SOLAR", to: "Total", value: 500 },
  { from: "Total", to: "U4", value: 400 },
  { from: "Total", to: "U5", value: 200 },
  { from: "Total", to: "HFO Auxiliary", value: 300 },
  { from: "Total", to: "LOSSES", value: 300 },
];
const MainSankey = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("today");
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
    endTime: "18:00",
  });

  const { generation, consumption } = calculateSums(data, "Unit 4 Consumption");

  // time period selector
  let startDate = null;
  let endDate = null;
  if (unit4Lt1TimePeriod !== "custom") {
    ({ startDate, endDate } = getDateRangeFromString(unit4Lt1TimePeriod));
  }
  // 👉 build unified range
  const finalRange =
    unit4Lt1TimePeriod === "custom" ? intervalPeriod : { startDate, endDate };

  // ==================fetch unit 4 lt 1 sankey daata
  const fetchLt1SankyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/unit4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(intervalPeriod),
      });
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
  }, [
    unit4Lt1TimePeriod,
    intervalPeriod.startDate,
    intervalPeriod.endDate,
    intervalPeriod.startTime,
    intervalPeriod.endTime,
  ]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Unit 4</h2>
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
          {loading ? (
            <CustomLoader />
          ) : consumption > 0 || generation > 0 ? (
            <SankeyChart data={data} id="unit4Sankey" />
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
      <SankeyTotalValues data={data} lt="Unit 4 Consumption" />
    </div>
  );
};

export default MainSankey;
