"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
const sankeyData = [
  { from: "TF1 1000kWh", to: "LT1 1800kWh", value: 1000 },
  { from: "LT Gen. 800kWh", to: "LT1 1800kWh", value: 800 },
  { from: "LT1 1800kWh", to: "Drawing 1(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Winding 2(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Simplex 1(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring 5(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring 6(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Comber 1(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Compressor(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Compressor 2(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring AC(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Lightning Outside(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Lightning Inside(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "WAPDA Gen.(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Unit 5 Aux(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Transport(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Unit 5 Gen.(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Spare(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "PF Panel(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Draw Frame Finish(100Kwh)", value: 100 },
];

const UnitLt41Page = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("today");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // time period selector
  const { startDate, endDate } = getDateRangeFromString(unit4Lt1TimePeriod);
  const fetchLt1SankyData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.SANKEY.UNIT4_LT1}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    }
  };
  useEffect(() => {
    fetchLt1SankyData();
  }, [unit4Lt1TimePeriod]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full md:h-[81vh] p-4 rounded-md border-t-3 border-[#025697] ">
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
            // <SankeyChart data={sankeyData} id="unit4Lt1Chart" />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitLt41Page;
