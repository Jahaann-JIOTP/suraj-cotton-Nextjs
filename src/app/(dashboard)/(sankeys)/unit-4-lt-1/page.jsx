"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";
const sankeyData = [
  { from: "TF1 1000kWh", to: "LT1 1800kWh", value: 500 },
  { from: "LT Gen. 800kWh", to: "LT1 1800kWh", value: 800 },
  { from: "LT1 1800kWh", to: "Drawing 1(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Winding 2(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Simplex 1(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring 5(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring 6(100Kwh)", value: 50 },
  { from: "LT1 1800kWh", to: "Comber 1(100Kwh)", value: 50 },
  { from: "LT1 1800kWh", to: "Compressor(100Kwh)", value: 50 },
  { from: "LT1 1800kWh", to: "Compressor 2(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Ring AC(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Lightning Outside(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Lightning Inside(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "WAPDA Gen.(100Kwh)", value: 50 },
  { from: "LT1 1800kWh", to: "Unit 5 Aux(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Transport(100Kwh)", value: 0 },
  { from: "LT1 1800kWh", to: "Unit 5 Gen.(100Kwh)", value: 0 },
  { from: "LT1 1800kWh", to: "Spare(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "PF Panel(100Kwh)", value: 100 },
  { from: "LT1 1800kWh", to: "Draw Frame Finish(100Kwh)", value: 100 },
];
const UnitLt41Page = () => {
  const [unit4Lt1TimePeriod, setUnit4Lt1TimePeriod] = useState("daily");
  const [data, setData] = useState([]);
  const handleTimePeriodForUnit4Lt1 = (period) => {
    setUnit4Lt1TimePeriod(period);
  };
  const today = new Date();
  console.log(today);

  const fetchLt1SankyData = async () => {
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/unit4-lt1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: "2025-07-01",
            endDate: "2025-07-01",
          }),
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setData(resResult);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchLt1SankyData();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full p-4 rounded-md border-t-3 border-[#025697] ">
      <div className="w-full items-center flex justify-between">
        <h2 className="text-[20px] font-600 font-inter">Unit 4 LT-1</h2>
        <TimePeriodSelector getTimePeriod={handleTimePeriodForUnit4Lt1} />
      </div>
      <div className=" w-full  flex items-center justify-center">
        <div className="w-full md:px-20 flex items-center justify-center mt-6">
          <SankeyChart data={data} id="unit4Lt1Chart" />
        </div>
      </div>
    </div>
  );
};

export default UnitLt41Page;
