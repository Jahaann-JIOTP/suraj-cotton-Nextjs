"use client";
import React, { useEffect, useState } from "react";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import ConsumptionEnergy from "@/components/dashboardComponents/consumptionEnergy/ConsumptionEnergy";
import EnergyComparison from "@/components/dashboardComponents/energyComparison/EnergyComparison";
import GenerationEnergy from "@/components/dashboardComponents/generationEnergy/GenerationEnergy";
import PowerComparison from "@/components/dashboardComponents/powerComparison/PowerComparison";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import config from "@/constant/apiRouteList";

const Dashboard = () => {
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("today");
  const [singleDivData, setSingleDivData] = useState({});
  const [u4Spindle, setU4Spindle] = useState(0);
  const [u5Spindle, setU5Spindle] = useState(0);
  const [loading, setLoading] = useState(false);
  const { startDate, endDate } = getDateRangeFromString(dashboardTimePeriod);

  const fetchSingleValueData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.SINGLE_VALUE_DIV}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        setSingleDivData(resResult.total_consumption);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };
  const fetchU4Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setU4Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchU5Spindles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_SPINDLES}?start_date=${startDate}&end_date=${endDate}&unit=U5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok && Array.isArray(resResult) && resResult.length > 0) {
        setU5Spindle(resResult[0].totalProduction);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const u4EnergyPerSpindle =
    u4Spindle > 0 ? singleDivData.U4_Consumption / u4Spindle : 0;

  const u5EnergyPerSpindle =
    u5Spindle > 0 ? singleDivData.U5_Consumption / u5Spindle : 0;

  useEffect(() => {
    fetchU4Spindles();
    fetchU5Spindles();
    fetchSingleValueData();
  }, [dashboardTimePeriod]);

  return (
    <div className="h-[81vh] overflow-y-auto relative">
      {/* first section */}
      <div className="w-full z-100 flex items-center justify-center md:justify-start">
        {/* <TimePeriodSelector getTimePeriod={handleTimePeriodForDashboard} /> */}
        <TimePeriodSelector
          selected={dashboardTimePeriod}
          setSelected={setDashboardTimePeriod}
        />
      </div>
      {/* second section first of small divs */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value={Number(singleDivData?.HT_Generation||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value={Number(singleDivData.LTGeneration||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value={Number(singleDivData.SolarGeneration||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value={Number(singleDivData.WapdaImport||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="3"
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
                value={Number(singleDivData.Total_Generation || 0).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Energy Input"
                value={Number(singleDivData.total_energy_input || 0).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
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
                title="Energy/Spindle(U4)"
                value={Number(u4EnergyPerSpindle||0).toFixed(2).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Energy/Spindle(U5)"
                value={Number(u5EnergyPerSpindle||0).toFixed(2).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
          </div>
        </div>
      </div>
      {/* small divs second section */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="U4 Consumption"
            value={Number(singleDivData.U4_Consumption||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="U5 Consumption"
            value={Number(singleDivData.U5_Consumption||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv title="Misc. Consumption" value="000" unit="kWh" />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Total Energy Output"
            value={Number(singleDivData.totalenergyoutput||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
          />
        </div>
      </div>
      {/* comparison graphs */}
      <div className="flex flex-col lg:flex-row mt-3 md:mt-[0.7vw] gap-3 md:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <EnergyComparison />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <PowerComparison />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
