"use client";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import { DateRangePicker } from "@/components/dashboardComponents/timePeriodSelector/UnifiedDateRangeSelector";
import TrafoCard from "@/components/dashboardComponents/trafoCard/TrafoCard";
import config from "@/constant/apiRouteList";
import React, { useCallback, useEffect, useState } from "react";

const PowerSummaryPage = () => {
  const [powerSummaryData, setPowerSummaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);
  // unit 5 trafo 1 + 2
  const u5incomming =
    Number(powerSummaryData.Trafo4Incoming || 0) +
    Number(powerSummaryData.Trafo3Incoming || 0);
  const u5Outgoin =
    Number(powerSummaryData.Trafo4outgoing || 0) +
    Number(powerSummaryData.Trafo3outgoing || 0);
  const u5Losses =
    Number(powerSummaryData.Trafo4losses || 0) +
    Number(powerSummaryData.Trafo3losses || 0);
  const u5LossesPercent =
    Number(powerSummaryData.T2unit5percentage || 0) +
    Number(powerSummaryData.T1unit5percentage || 0);
  console.log({ u5incomming, u5Outgoin, u5Losses, u5LossesPercent });
  const fetchPowerSummaryData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.SINGLE_VALUE_DIV}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setPowerSummaryData(resResult.total_consumption);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPowerSummaryData();
    const interval = setInterval(() => {
      fetchPowerSummaryData();
    }, 900000);
    return () => clearInterval(interval);
  }, [dateRange]);

  return (
    <div className="h-full lg:h-[81vh] overflow-y-auto">
      {/* time period selector */}
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
      {/* first section first of small divs */}

      {/* second section */}

      <div className="mt-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="w-full ">
          <SingleValueDiv
            title="WAPDA IC"
            value={Number(powerSummaryData.Wapda1 || 0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>

        <div className="w-full ">
          <SingleValueDiv
            title="WAPDA 2"
            value={Number(powerSummaryData.Wapda2 || 0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>

        <div className="w-full ">
          <SingleValueDiv
            title="Niigata HFO"
            value={Number(powerSummaryData.Niigata || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>

        <div className="w-full ">
          <SingleValueDiv
            title="JMS"
            value={Number(powerSummaryData.JMS || 0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
      </div>

      {/* Third section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Unit 4 Transformer 1+2"
            icomingValue={Number(
              powerSummaryData.T1andT2incoming || 0
            ).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(
              powerSummaryData.T1andT2outgoing || 0
            ).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(
              powerSummaryData.T1andT2losses || 0
            ).toLocaleString("en-US")}
            lossesUnit="kWh"
            lossesPercent={Number(
              powerSummaryData.T1T2unit4percentage || 0
            ).toLocaleString("en-US")}
            lossesPercentUnit="%"
          />
        </div>
        <div className="w-full lg:w-[49.6%]">
          <TrafoCard
            mainTitle="Unit 5 Transformer 1+2"
            icomingValue={Number(u5incomming || 0).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(u5Outgoin || 0).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(u5Losses || 0).toLocaleString("en-US")}
            lossesUnit="kWh"
            lossesPercent={Number(u5LossesPercent || 0).toLocaleString("en-US")}
            lossesPercentUnit="%"
          />
        </div>
      </div>
      {/* fourth section first of small divs */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-[0.9vw]">
        <div className="w-full">
          <SingleValueDiv
            title="Solar 1184.55 kW"
            loading={loading}
            value={Number(powerSummaryData.Solar1 || 0).toLocaleString("en-US")}
            unit="kWh"
            height="6.1rem"
          />
        </div>

        <div className="w-full">
          <SingleValueDiv
            title="Solar 1066.985 kW"
            value={Number(powerSummaryData.Solar2 || 0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6.5rem"
          />
        </div>

        <div className="w-full">
          <SingleValueDiv
            title="Solar 352.50 kW"
            value={Number(powerSummaryData.solarunit4 || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
            height="6.5rem"
          />
        </div>

        <div className="w-full">
          <SingleValueDiv
            title="Solar 52.17 kW"
            value={Number(powerSummaryData.solar52 || 0).toLocaleString(
              "en-US"
            )}
            loading={loading}
            unit="kWh"
            height="6.5rem"
          />
        </div>

        <div className="w-full">
          <SingleValueDiv
            title="Diesel and Gas Genset"
            value={Number(
              powerSummaryData.DieselandGasGenset || 0
            ).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6.5rem"
          />
        </div>
        {/* </div> */}
        {/* Fifth section first of small divs */}
        <div className="w-full">
          <SingleValueDiv
            title="WAPDA Energy Export"
            loading={loading}
            value={Number(powerSummaryData.Wapdaexport || 0).toLocaleString(
              "en-US"
            )}
            unit="kWh"
            height="6.5rem"
            valueColor="#019726"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="Unaccounted Energy"
            value={Number(
              powerSummaryData.unaccoutable_energy || 0
            ).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6.5rem"
            valueColor="#E40101"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="Trasformer Losses"
            value={Number(
              powerSummaryData.TrasformerLosses || 0
            ).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6.5rem"
            valueColor="#E40101"
          />
        </div>
        <div className="w-full">
          <SingleValueDiv
            title="Tranformer Losses (%)"
            value={Number(
              powerSummaryData.TotalTrasformepercentage || 0
            ).toLocaleString("en-US")}
            loading={loading}
            unit="%"
            height="6.5rem"
            valueColor="#E40101"
          />
        </div>

        <div className="w-full">
          <SingleValueDiv
            title="HT Transmission Losses"
            value={Number(
              powerSummaryData.HT_Transmissioin_Losses || 0
            ).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6.5rem"
            valueColor="#E40101"
          />
        </div>
      </div>
    </div>
  );
};

export default PowerSummaryPage;
