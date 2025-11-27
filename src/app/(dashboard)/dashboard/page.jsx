"use client";
import React, { useCallback, useEffect, useState } from "react";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import ConsumptionEnergy from "@/components/dashboardComponents/consumptionEnergy/ConsumptionEnergy";
import EnergyComparison from "@/components/dashboardComponents/energyComparison/EnergyComparison";
import GenerationEnergy from "@/components/dashboardComponents/generationEnergy/GenerationEnergy";
import PowerComparison from "@/components/dashboardComponents/powerComparison/PowerComparison";
import config from "@/constant/apiRouteList";

import { DateRangePicker } from "@/components/dashboardComponents/timePeriodSelector/UnifiedDateRangeSelector";

const Dashboard = () => {
  const [singleDivData, setSingleDivData] = useState({});
  const [loading, setLoading] = useState(false);
  const [unitCLoading, setUnitCLoading] = useState(false);
  const [unitConsumption, setUnitConsumption] = useState({});

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedPeriod: "today",
  });
  const [timeRange, setTimeRange] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);
  // ===========================fetch consumption api data===================
  const fetchSingleValueData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!dateRange.startDate && !dateRange.endDate) return null;
    setLoading(true);
    try {
      const response = await fetch(
        // `${config.BASE_URL}${config.DASHBOARD.SINGLE_VALUE_DIV}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`,
        `${config.BASE_URL}/dashboard/consumption?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`,
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
  // =====================fetch unit 4 and u5 consumption========================
  const fetchUnitConsumption = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // BLOCK API IF DATE MISSING
    if (!timeRange.startDate || !timeRange.endDate) return null;

    setUnitCLoading(true);

    try {
      const response = await fetch(
        `${config.BASE_URL}/energy-consumption-report/unit-only`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: timeRange.startDate,
            end_date: timeRange.endDate,
            start_time: timeRange.startTime,
            end_time: timeRange.endTime,
            suffixes: ["Del_ActiveEnergy"],
            area: "ALL",
          }),
        }
      );

      const resResult = await response.json();
      if (response.ok) {
        setUnitConsumption(resResult);
        setUnitCLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUnitCLoading(false);
    }
  };

  const totalEnerOutput =
    unitConsumption?.Unit_4_Consumption +
    unitConsumption?.Unit_5_Consumption +
    Number(singleDivData?.Aux_consumption || 0);

  // time rnage effect
  const updateTimeRange = (dateRange) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const currentTime = today.toTimeString().slice(0, 5); // HH:MM

    // 1. If both dates same AND period = today
    if (
      dateRange.startDate === dateRange.endDate &&
      dateRange.selectedPeriod === "today"
    ) {
      setTimeRange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        startTime: "06:00",
        endTime: currentTime,
      });
      return;
    }

    // 2. If both dates same AND period = yesterday
    if (
      dateRange.startDate === dateRange.endDate &&
      dateRange.selectedPeriod === "yesterday"
    ) {
      setTimeRange({
        startDate: dateRange.startDate, // Keep start date as it is
        endDate: today.toISOString().split("T")[0], // End date should be today
        startTime: "06:00",
        endTime: "06:00",
      });
      return;
    }

    // 3. If both dates same (for other cases like this week, this month)
    if (dateRange.startDate === dateRange.endDate) {
      setTimeRange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        startTime: "06:00",
        endTime: currentTime, // Current time for today
      });
      return;
    }

    // 4. If dates NOT same
    setTimeRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      startTime: "06:00",
      endTime: "06:00",
    });
  };
  useEffect(() => {
    updateTimeRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    fetchUnitConsumption();
    fetchSingleValueData();
    const interval = setInterval(() => {
      fetchUnitConsumption();
      fetchSingleValueData();
    }, 900000);
    return () => clearInterval(interval);
  }, [dateRange]);
  useEffect(() => {
    fetchUnitConsumption();
    const interval = setInterval(() => {
      fetchUnitConsumption();
    }, 900000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <div className="h-[81vh] overflow-y-auto relative">
      {/* first section */}
      <div className="w-full z-100 flex items-center justify-center md:justify-start">
        <DateRangePicker
          showTime={false}
          showLabels={true}
          dateRangeLabel="Select Date Range:"
          intervalLabel="From"
          toLabel="To"
          timeLabel="Time"
          onChange={handleDateRangeChange}
        />
      </div>
      {/* second section first of small divs */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Generation"
            value={Number(singleDivData?.HT_Generation || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="LT Generation"
            value={Number(singleDivData?.LTGeneration || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar Generation"
            value={Number(singleDivData?.SolarGeneration || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Import"
            value={Number(singleDivData?.WapdaImport || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
            height="3"
          />
        </div>
      </div>
      {/* charts second section */}
      <div className=" mt-3 lg:mt-[0.7vw] flex flex-wrap w-full items-center gap-3 lg:gap-[0.7vw] justify-between">
        {/* left side */}
        <div className="w-full lg:w-[49.5%] flex flex-col gap-3 lg:gap-[0.7vw]">
          {/* small card two */}
          <div className="flex flex-wrap gap-3 md:gap-[0.7vw] items-center  justify-between">
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                // title="Total Generation"
                title="In-house Generation"
                value={Number(
                  singleDivData?.Total_Generation || 0
                ).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Total Energy Input"
                value={Number(
                  singleDivData?.total_energy_input || 0
                ).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
          </div>
          {/* graph card one */}
          <div className="">
            <GenerationEnergy />
          </div>
        </div>
        {/* right side */}
        <div className="w-full lg:w-[49.5%] flex flex-col gap-3 md:gap-[0.7vw]">
          {/* graph card one */}
          <div className="">
            <ConsumptionEnergy />
          </div>
          {/* small card two */}
          <div className="flex flex-wrap gap-3 md:gap-[0.7vw] items-center  justify-between">
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Energy/Bags(U4)"
                value={
                  unitConsumption?.Unit_4_ConsumptionPerBag?.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || 0
                }
                loading={loading}
                unit="kWh"
              />
            </div>
            <div className="w-full md:w-[48.7%]">
              <SingleValueDiv
                title="Energy/Bags(U5)"
                value={
                  unitConsumption?.Unit_5_ConsumptionPerBag?.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || 0
                }
                loading={loading}
                unit="kWh"
              />
            </div>
          </div>
        </div>
      </div>
      {/*  third section */}
      <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="U4 Consumption"
            value={
              unitConsumption?.Unit_4_Consumption?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0
            }
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="U5 Consumption"
            value={
              unitConsumption?.Unit_5_Consumption?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0
            }
            loading={loading}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HFO + JMS Auxiliary"
            loading={loading}
            value={Number(singleDivData?.Aux_consumption || 0).toLocaleString(
              "en-US"
            )}
            unit="kWh"
          />
        </div>
        <div className="w-full md:w-[23.5%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Total Energy Output"
            value={(totalEnerOutput || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            loading={loading}
            unit="kWh"
          />
        </div>
      </div>
      {/* comparison graphs */}
      <div className="flex flex-col lg:flex-row mt-3 md:mt-[0.7vw] gap-3 md:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <EnergyComparison dateRange={dateRange} />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <PowerComparison dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
