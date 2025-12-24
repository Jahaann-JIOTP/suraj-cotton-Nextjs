"use client";
import React, { useEffect, useState } from "react";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import ConsumptionEnergy from "@/components/dashboardComponents/consumptionEnergy/ConsumptionEnergy";
import EnergyComparison from "@/components/dashboardComponents/energyComparison/EnergyComparison";
import GenerationEnergy from "@/components/dashboardComponents/generationEnergy/GenerationEnergy";
import PowerComparison from "@/components/dashboardComponents/powerComparison/PowerComparison";
import config from "@/constant/apiRouteList";
import DashboardIntervalSelector from "@/components/dashboardComponents/timePeriodSelector/DashboardIntervalSelector";

const Dashboard = () => {
  const [singleDivData, setSingleDivData] = useState({});
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState(false);
  const [unitConsumption, setUnitConsumption] = useState({});
  const [dateTimeRange, setDateTimeRange] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  // ===========================fetch consumption api data===================
  const fetchSingleValueData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!dateTimeRange.endDate) return null;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.DASHABOARD_SINGLE_VALUE}?start_date=${dateTimeRange.startDate}&end_date=${dateTimeRange.endDate}&start_time=${dateTimeRange.startTime}&end_time=${dateTimeRange.endTime}`,
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
    if (!dateTimeRange.endDate) return null;
    setUnitLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.DASHABOARD_UNIT_CONSUMPTION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: dateTimeRange.startDate,
            end_date: dateTimeRange.endDate,
            start_time: dateTimeRange.startTime,
            end_time: dateTimeRange.endTime,
            suffixes: ["Del_ActiveEnergy"],
            area: "ALL",
          }),
        }
      );

      const resResult = await response.json();
      if (response.ok) {
        setUnitConsumption(resResult);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUnitLoading(false);
    }
  };

  const totalEnerOutput =
    unitConsumption?.Unit_4_Consumption +
    unitConsumption?.Unit_5_Consumption +
    Number(singleDivData?.Aux_consumption || 0);

  useEffect(() => {
    if (!dateTimeRange.endDate) return;

    fetchUnitConsumption();
    fetchSingleValueData();

    const interval = setInterval(() => {
      fetchUnitConsumption();
      fetchSingleValueData();
    }, 900000);

    return () => clearInterval(interval);
  }, [dateTimeRange.endDate]);

  return (
    <div className="h-[81vh] outline-none overflow-y-auto relative">
      {/* first section */}

      <div className="z-100">
        <DashboardIntervalSelector
          onChange={(range) => {
            setDateTimeRange(range);
          }}
        />
      </div>
      {/* second section first of small divs */}
      {/* <div className="mt-3 md:mt-[0.7vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between"> */}
      <div className="mt-3 md:mt-[0.7vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2  justify-between">
        {/* <div className="w-full md:w-[23%] lg:w-[24.3%] "> */}
        <div className="w-full">
          <SingleValueDiv
            title="HT Generation"
            height="6rem"
            value={Number(singleDivData?.HT_Generation || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        {/* <div className="w-full md:w-[23%] lg:w-[24.3%] "> */}
        <div className="w-full">
          <SingleValueDiv
            title="LT Generation"
            height="6rem"
            value={Number(singleDivData?.LTGeneration || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        {/* <div className="w-full md:w-[23%] lg:w-[24.3%] "> */}
        <div className="w-full">
          <SingleValueDiv
            title="Solar Generation"
            height="6rem"
            value={Number(singleDivData?.SolarGeneration || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
        {/* <div className="w-full md:w-[23%] lg:w-[24.3%] "> */}
        <div className="w-full">
          <SingleValueDiv
            title="WAPDA Import"
            height="6rem"
            value={Number(singleDivData?.WapdaImport || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
          />
        </div>
      </div>
      {/* charts second section */}
      <div className=" mt-2 lg:mt-[0.7vw] grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-2 justify-between">
        {/* left side */}
        <div className="w-full flex flex-col gap-2">
          {/* small card two */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center  justify-between">
            <div className="w-full">
              <SingleValueDiv
                title="In-house Generation"
                height="6rem"
                value={Number(
                  singleDivData?.Total_Generation || 0
                ).toLocaleString("en-US")}
                loading={loading}
                unit="kWh"
              />
            </div>
            <div className="w-full">
              <SingleValueDiv
                title="Total Energy Input"
                height="6rem"
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
        <div className="w-full flex flex-col gap-2">
          {/* graph card one */}
          <div className="">
            <ConsumptionEnergy />
          </div>
          {/* small card two */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center  justify-between">
            <div className="w-full">
              <SingleValueDiv
                title="Energy/Bags(U4)"
                height="6rem"
                value={
                  unitConsumption?.Unit_4_ConsumptionPerBag?.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || 0
                }
                loading={unitLoading}
                unit="kWh"
              />
            </div>
            <div className="w-full">
              <SingleValueDiv
                title="Energy/Bags(U5)"
                height="6rem"
                value={
                  unitConsumption?.Unit_5_ConsumptionPerBag?.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || 0
                }
                loading={unitLoading}
                unit="kWh"
              />
            </div>
          </div>
        </div>
      </div>
      {/*  third section */}
      <div className="mt-3 md:mt-[0.7vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2 justify-between">
        <div className="w-full">
          <SingleValueDiv
            title="U4 Consumption"
            height="6rem"
            value={
              unitConsumption?.Unit_4_Consumption?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0
            }
            loading={unitLoading}
            unit="kWh"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="U5 Consumption"
            height="6rem"
            value={
              unitConsumption?.Unit_5_Consumption?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0
            }
            loading={unitLoading}
            unit="kWh"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="HFO + JMS Auxiliary"
            height="6rem"
            loading={loading}
            value={Number(singleDivData?.Aux_consumption || 0).toLocaleString(
              "en-US"
            )}
            unit="kWh"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="Total Energy Output"
            height="6rem"
            value={(totalEnerOutput || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            loading={unitLoading}
            unit="kWh"
          />
        </div>
      </div>
      {/* comparison graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 md:mt-[0.7vw] gap-2 justify-between">
        <div className="w-full">
          <EnergyComparison dateRange={dateTimeRange} />
        </div>
        <div className="w-full">
          <PowerComparison dateRange={dateTimeRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
