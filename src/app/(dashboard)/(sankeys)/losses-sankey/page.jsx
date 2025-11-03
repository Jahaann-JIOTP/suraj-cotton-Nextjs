"use client";

import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

import SankeyTotalValues, {
  calculateSums,
} from "@/components/sakeyTotalValue/SankeyTotalValues";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import MainSankeyTimeSelector from "@/components/dashboardComponents/timePeriodSelector/MainSankeyTimeSelector";
const navigationMap = {
  LT1: "/unit-4-lt-1",
  LT2: "/unit-4-lt-2",
};
const LossesSankeyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({});
  const handleRange = (data) => {
    setRange(data);
  };
  const { generation, consumption } = calculateSums(data, "Losses");

  // ==================fetch unit 4 lt 1 sankey daata
  const fetchLossesSankyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/losses-sankey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(range),
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
    if (
      !range.startDate ||
      !range.endDate ||
      !range.startTime ||
      !range.endTime
    )
      return;
    fetchLossesSankyData();
  }, [range]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <h2 className="text-[20px] font-600 font-inter">Losses</h2>
        <div className="flex items-center flex-col md:flex-row gap-2">
          <MainSankeyTimeSelector onRangeChange={handleRange} />
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
      <SankeyTotalValues data={data} lt="Losses" loading={loading} />
    </div>
  );
};

export default LossesSankeyPage;
