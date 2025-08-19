"use client";
import SingleValueDiv from "@/components/dashboardComponents/singleValueDiv/SingleValueDiv";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";
import TrafoCard from "@/components/dashboardComponents/trafoCard/TrafoCard";
import config from "@/constant/apiRouteList";
import { getDateRangeFromString } from "@/utils/dateRangeCalculator";
import React, { useEffect, useState } from "react";

const PowerSummaryPage = () => {
  const [powerSummaryData, setPowerSummaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [powerSummaryTimePeriod, setPowerSummaryTimePeriod] = useState("today");
  const { startDate, endDate } = getDateRangeFromString(powerSummaryTimePeriod);

  const fetchPowerSummaryData = async () => {
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
  }, [powerSummaryTimePeriod]);

  return (
    <div className="h-full lg:h-[81vh] overflow-y-auto">
      {/* time period selector */}
      <div className="w-full z-100 flex items-center justify-center md:justify-start">
        <TimePeriodSelector
          selected={powerSummaryTimePeriod}
          setSelected={setPowerSummaryTimePeriod}
        />
      </div>
      {/* first section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA 1"
            value={Number(powerSummaryData.Wapda1).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA 2"
            value="00.00"
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Niigata HFO"
            value="00.00"
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv title="JMS" value="00.00" unit="kWh" height="6rem" />
        </div>
      </div>
      {/* second section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Unit 4 Transformer 1"
            icomingValue={Number(powerSummaryData.Trafo1Incoming||0).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(powerSummaryData.Trafo1outgoing||0).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(powerSummaryData.Trafo1losses||0).toLocaleString("en-US")}
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Unit 4 Transformer 2"
            icomingValue={Number(powerSummaryData.Trafo2Incoming||0).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(powerSummaryData.Trafo2outgoing||0).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(powerSummaryData.Trafo2losses||0).toLocaleString("en-US")}
            lossesUnit="kWh"
          />
        </div>
      </div>
      {/* Third section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Unit 5 Transformer 1"
            icomingValue={Number(powerSummaryData.Trafo3Incoming||0).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(powerSummaryData.Trafo3outgoing||0).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(powerSummaryData.Trafo3losses||0).toLocaleString("en-US")}
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Unit 5 Transformer 2"
            icomingValue={Number(powerSummaryData.Trafo4Incoming||0).toLocaleString("en-US")}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={Number(powerSummaryData.Trafo4outgoing||0).toLocaleString("en-US")}
            outgoingUnit="kWh"
            lossesValue={Number(powerSummaryData.Trafo4losses||0).toLocaleString("en-US")}
            lossesUnit="kWh"
          />
        </div>
      </div>
      {/* fourth section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar 1"
            loading={loading}
            value={Number(powerSummaryData.Solar1||0).toLocaleString("en-US")}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar 2"
            value={Number(powerSummaryData.Solar2||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Diesel Genset"
            value={Number(powerSummaryData.DieselGenset||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Gas Genset"
            value={Number(powerSummaryData.GasGenset||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
      </div>
      {/* fifth section first of small divs */}
      <div className="mt-3 md:mt-[0.9vw]  flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="WAPDA Energy Export"
            value="00.00"
            unit="kWh"
            height="6rem"
            valueColor="#019726"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Unaccountable Energy"
            value={Number(powerSummaryData.unaccoutable_energy||0).toLocaleString("en-US")}
            loading={loading}
            unit="kWh"
            height="6rem"
            valueColor="#E40101"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Transformer losses"
            value={Number(powerSummaryData.TrasformerLosses||0).toLocaleString("en-US")}
            unit="kWh"
            height="6rem"
            loading={loading}
            valueColor="#E40101"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="HT Transmission Losses"
            value="00.00"
            unit="kWh"
            height="6rem"
            valueColor="#E40101"
          />
        </div>
      </div>
    </div>
  );
};

export default PowerSummaryPage;
