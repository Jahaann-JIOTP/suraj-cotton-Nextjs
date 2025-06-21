"use client";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import TrafoCard from "@/components/dashboardComponents/trafoCard/TrafoCard";
import React, { useState } from "react";

const PowerSummaryPage = () => {
  const [PlantSummaryTimePeriod, setPlantSummaryTimePeriod] = useState("");
  const handleTimePeriodForPlantSummary = (period) => {
    setPlantSummaryTimePeriod(period);
  };

  return (
    <>
      {/* time period selector */}
      <div className="w-full z-100 flex items-center justify-center md:justify-start">
        <TimePeriodSelector getTimePeriod={handleTimePeriodForPlantSummary} />
      </div>
      {/* first section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA 1"
            value="7373.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA 2"
            value="8883.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Nilgata HFO"
            value="8883.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv title="JMS" value="7083.98" unit="kWh" height={6} />
        </div>
      </div>
      {/* second section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.3%]">
          <TrafoCard
            mainTitle="Trafo 1"
            icomingValue="7373.98"
            iconmingUnit="kWh"
            outgoingValue="7373.98"
            outgoingUnit="kWh"
            lossesValue="7373.98"
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.3%]">
          <TrafoCard
            mainTitle="Trafo 2"
            icomingValue="7373.98"
            iconmingUnit="kWh"
            outgoingValue="7373.98"
            outgoingUnit="kWh"
            lossesValue="7373.98"
            lossesUnit="kWh"
          />
        </div>
      </div>
      {/* Third section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.3%]">
          <TrafoCard
            mainTitle="Trafo 1"
            icomingValue="7373.98"
            iconmingUnit="kWh"
            outgoingValue="7373.98"
            outgoingUnit="kWh"
            lossesValue="7373.98"
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.3%]">
          <TrafoCard
            mainTitle="Trafo 2"
            icomingValue="7373.98"
            iconmingUnit="kWh"
            outgoingValue="7373.98"
            outgoingUnit="kWh"
            lossesValue="7373.98"
            lossesUnit="kWh"
          />
        </div>
      </div>
      {/* fourth section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value="7373.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value="8883.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value="8883.98"
            unit="kWh"
            height={6}
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value="7083.98"
            unit="kWh"
            height={6}
          />
        </div>
      </div>
      {/* fifth section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value="7373.98"
            unit="kWh"
            height={6}
            valueColor="#019726"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value="8883.98"
            unit="kWh"
            height={6}
            valueColor="#E40101"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value="8883.98"
            unit="kWh"
            height={6}
            valueColor="#E40101"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value="7083.98"
            unit="kWh"
            height={6}
            valueColor="#E40101"
          />
        </div>
      </div>
    </>
  );
};

export default PowerSummaryPage;
