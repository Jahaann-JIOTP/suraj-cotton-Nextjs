"use client";

import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import SankeyTotalValues, {
  calculateSums,
} from "@/components/sakeyTotalValue/SankeyTotalValues";

import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import MainSankeyTimeSelector from "@/components/dashboardComponents/timePeriodSelector/MainSankeyTimeSelector";
import { ImArrowLeft2 } from "react-icons/im";

const navigationMap = {
  "Unit 4 Incomer": "/unit4-sankey",
  "Unit 5 Incomer": "/unit5-sankey",
};
// Losses: "/losses-sankey",
const MainSankey = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({});
  const handleRange = (data) => {
    setRange(data);
  };

  const { generation, consumption } = calculateSums(data, "Total Generation");

  // ==================fetch unit 4 lt 1 sankey daata
  const fetchMainSankyData = async () => {
    if (!range.startDate) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/mainsankey`, {
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
    fetchMainSankyData();
  }, [range]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] overflow-y-auto p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-start md:items-center flex justify-between flex-col md:flex-row">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              history.back();
            }}
            className={`flex items-center gap-2 px-1 w-[30px] h-[30px] cursor-pointer bg-[#1F5897] overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white`}
            style={{
              borderRadius: "50%",
            }}
          >
            <ImArrowLeft2 className="text-white shrink-0 text-[15px]" />
          </button>
          <h2 className="text-[20px] font-600 font-inter">Main</h2>
        </div>
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
              navigateLinks={navigationMap}
              isGray={true}
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
      <SankeyTotalValues data={data} lt="Total Generation" loading={loading} />
    </div>
  );
};

export default MainSankey;
