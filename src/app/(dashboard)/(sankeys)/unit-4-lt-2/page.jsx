"use client";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SankeyChart from "@/components/dashboardComponents/sankeychart/SankeyChart";

import { useEffect, useState } from "react";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";
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
const UnitLt42Page = () => {
  const [Unit4Lt2TimePeriod, setUnit4Lt2TimePeriod] = useState("today");

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
          <SankeyChart data={sankeyData} id="unit4Lt2Chart" />
        </div>
      </div>
    </div>
  );
};

export default UnitLt42Page;
