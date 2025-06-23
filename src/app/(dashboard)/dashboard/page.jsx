"use client";
import React, { useState } from "react";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import ConsumptionEnergy from "@/components/dashboardComponents/consumptionEnergy/ConsumptionEnergy";
import EnergyComparison from "@/components/dashboardComponents/energyComparison/EnergyComparison";
import GenerationEnergy from "@/components/dashboardComponents/generationEnergy/GenerationEnergy";
import PowerComparison from "@/components/dashboardComponents/powerComparison/PowerComparison";

const Dashboard = () => {
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("");
  const handleTimePeriodForDashboard = (period) => {
    setDashboardTimePeriod(period);
  };

  return (
    <div className="overflow-hidden relative">
      {/* first section */}
      <div className="w-full z-100 flex items-center justify-center md:justify-start">
        <TimePeriodSelector getTimePeriod={handleTimePeriodForDashboard} />
      </div>
      {/* second section first of small divs */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value="7373.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value="8883.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value="8883.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value="7083.98"
            unit="kWh"
            height="4rem"
          />
        </div>
      </div>
      {/* charts firlst section */}
      <div className=" mt-3 lg:mt-[0.7vw] flex flex-wrap w-full items-center gap-3 lg:gap-[0.7vw] justify-between">
        {/* left side */}
        <div className="w-full lg:w-[49.5%] flex flex-col gap-3 lg:gap-[0.7vw]">
          {/* small card two */}
          <div className="flex flex-wrap gap-3 md:gap-[0.7vw] items-center  justify-between">
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Generation"
                value="7373.98"
                unit="kWh"
                height="4rem"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Energy Input"
                value="7373.98"
                unit="kWh"
                height="4rem"
              />
            </div>
          </div>
          {/* graph card one */}
          <div className="">
            <ConsumptionEnergy />
          </div>
        </div>
        {/* right side */}
        <div className="w-full lg:w-[49.5%] flex flex-col gap-3 md:gap-[0.7vw]">
          {/* graph card one */}
          <div className="">
            <GenerationEnergy />
          </div>
          {/* small card two */}
          <div className="flex flex-wrap gap-3 md:gap-[0.7vw] items-center  justify-between">
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Generation"
                value="7373.98"
                unit="kWh"
                height="4rem"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Energy Input"
                value="7373.98"
                unit="kWh"
                height="4rem"
              />
            </div>
          </div>
        </div>
      </div>
      {/* small divs second section */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value="7373.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value="8883.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value="8883.98"
            unit="kWh"
            height="4rem"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value="7083.98"
            unit="kWh"
            height="4rem"
          />
        </div>
      </div>
      {/* comparison graphs */}
      <div className="flex flex-col lg:flex-row mt-3 md:mt-[0.7vw] gap-3 md:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.1%]">
          <EnergyComparison />
        </div>
        <div className="w-full lg:w-[49.1%]">
          <PowerComparison />{" "}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
