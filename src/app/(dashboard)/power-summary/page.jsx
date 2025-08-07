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

  const handleTimePeriodForPowerSummary = (period) => {
    setPowerSummaryTimePeriod(period);
  };

  const fetchPowerSummaryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.SINGLE_VALUE_DIV}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
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
            value={powerSummaryData.Wapda1 || "00.00"}
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
            mainTitle="Trafo 1"
            icomingValue={powerSummaryData.Trafo1Incoming || "00.00"}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={powerSummaryData.Trafo1outgoing || "00.00"}
            outgoingUnit="kWh"
            lossesValue={powerSummaryData.Trafo1losses || "00.00"}
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Trafo 2"
            icomingValue={powerSummaryData.Trafo2Incoming || "00.00"}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={powerSummaryData.Trafo2outgoing || "00.00"}
            outgoingUnit="kWh"
            lossesValue={powerSummaryData.Trafo2losses || "00.00"}
            lossesUnit="kWh"
          />
        </div>
      </div>
      {/* Third section */}
      <div className="mt-3 md:mt-[0.9vw] flex flex-wrap items-center gap-3 lg:gap-[0.7vw] justify-between">
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Trafo 3"
            icomingValue={powerSummaryData.Trafo3Incoming || "00.00"}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={powerSummaryData.Trafo3outgoing || "00.00"}
            outgoingUnit="kWh"
            lossesValue={powerSummaryData.Trafo3losses || "00.00"}
            lossesUnit="kWh"
          />
        </div>
        <div className="w-full lg:w-[49.5%]">
          <TrafoCard
            mainTitle="Trafo 4"
            icomingValue={powerSummaryData.Trafo4Incoming || "00.00"}
            loading={loading}
            iconmingUnit="kWh"
            outgoingValue={powerSummaryData.Trafo4outgoing || "00.00"}
            outgoingUnit="kWh"
            lossesValue={powerSummaryData.Trafo4losses || "00.00"}
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
            value={powerSummaryData.Solar1 || "00.00"}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Solar 2"
            value={powerSummaryData.Solar2 || "00.00"}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Diesel Genset"
            value={powerSummaryData.DieselGenset || "00.00"}
            loading={loading}
            unit="kWh"
            height="6rem"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Gas Genset"
            value={powerSummaryData.GasGenset || "00.00"}
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
            value={powerSummaryData.unaccoutable_energy || "00.00"}
            loading={loading}
            unit="kWh"
            height="6rem"
            valueColor="#E40101"
          />
        </div>
        <div className="w-full md:w-[23%] lg:w-[24.3%] ">
          <SingleValueDiv
            title="Transformer losses"
            value={powerSummaryData.TrasformerLosses || "00.00"}
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
