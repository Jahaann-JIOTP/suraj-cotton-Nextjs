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
import MainSankeyTimeSelector from "@/components/dashboardComponents/timePeriodSelector/MainSankeyTimeSelector";
const navigationMap = {
  LT1: "/unit-5-lt-1",
  LT2: "/unit-5-lt-2",
};
const MainSankey = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("today");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const today = new Date();
  const formateDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const [intervalsObj, setIntervalsObj] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: formateDate(today),
    endDate: formateDate(today),
    startTime: "06:00",
    endTime: "18:00",
  });

  const { generation, consumption } = calculateSums(data, "Unit 5 Consumption");

  // time period selector
  let startDate = null;
  let endDate = null;
  if (unit4Lt1TimePeriod !== "custom") {
    ({ startDate, endDate } = getDateRangeFromString(unit4Lt1TimePeriod));
  }
  // 👉 build unified range

  // ==================fetch unit 4 lt 1 sankey daata
  const fetchLt1SankyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/unit5`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(intervalsObj),
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
  }, [intervalsObj]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Unit 5</h2>
        <div className="flex items-center flex-col md:flex-row gap-2">
          {/* <DailyConsumptionTimePeriod
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
          )} */}
          <MainSankeyTimeSelector onRangeChange={setIntervalsObj} />
        </div>
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          {loading ? (
            <CustomLoader />
          ) : consumption > 0 || generation > 0 ? (
            <SankeyChart
              data={data}
              isGray={false}
              navigateLinks={navigationMap}
            />
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
      <SankeyTotalValues data={data} lt="Unit 5 Consumption" />
    </div>
  );
};

export default MainSankey;
