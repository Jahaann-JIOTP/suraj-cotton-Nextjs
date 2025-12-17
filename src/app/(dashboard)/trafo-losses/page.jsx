"use client";
import { ChartCard } from "@/components/trendsComponents/ChartCard";
import CurrentChart from "@/components/trendsComponents/CurrentChart";
import EnergyChart from "@/components/trendsComponents/EnergyChart";
import HarmonicsChart from "@/components/trendsComponents/HarmonicsChart";
import PowerChart from "@/components/trendsComponents/PowerChart";
import PowerFactorChart from "@/components/trendsComponents/PowerFactor";
import Unit4Trafos from "@/components/trendsComponents/Unit4Trafos";
import VoltageChart from "@/components/trendsComponents/VoltageChart";
import { useEffect, useState } from "react";
import { trafoLosses } from "@/data/rawData";
import config from "@/constant/apiRouteList";

const TrafoLossesPage = () => {
  const [u4combineResData, setU4CombineResData] = useState([]);
  const [u5Trafo1ResData, setU5Trafo1ResData] = useState([]);
  const [u5Trafo2ResData, setU5Trafo2ResData] = useState([]);
  const [u5Trafo1and2ResData, setU5Trafo1and2ResData] = useState([]);
  const [u4Trafo1and2Loading, setU4Trafo1and2Loading] = useState(false);
  const [u5Trafo1Loading, setU5Trafo1Loading] = useState(false);
  const [u5Trafo2Loading, setU5Trafo2Loading] = useState(false);
  const [u5Trafo1and2Loading, setU5Trafo1and2Loading] = useState(false);
  const pickAndTransformKeys = (arr, keyMap) => {
    return arr.map((obj) => {
      const newObj = {};
      Object.keys(keyMap).forEach((originalKey) => {
        if (obj.hasOwnProperty(originalKey)) {
          // Convert timestamp to milliseconds if it's the timestamp field
          if (originalKey === "timestamp") {
            newObj[keyMap[originalKey]] = new Date(obj[originalKey]).getTime();
          } else {
            newObj[keyMap[originalKey]] = obj[originalKey];
          }
        }
      });
      return newObj;
    });
  };
  const selectedKeys = {
    timestamp: "time",
    Unit4CombineNetLosses: "netLosses",
    Unit4CombineNetLossesPercentage: "netLossesPercent",
  };
  const data = pickAndTransformKeys(trafoLosses, selectedKeys);
  // ================================================================================
  const fetchU4Trafo1and2 = async () => {
    try {
      setU4Trafo1and2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit4-combine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2025-11-23",
          end_date: "2025-11-24",
        }),
      });
      const resResult = await res.json();
      if (res.ok) {
        setU4CombineResData(resResult);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setU4Trafo1and2Loading(false);
    }
  };
  // ================================================================================
  const fetchU5Trafo1 = async () => {
    try {
      setU5Trafo1Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-trafo3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2025-11-23",
          end_date: "2025-11-24",
        }),
      });
      const resResult = await res.json();
      if (res.ok) {
        setU5Trafo1ResData(resResult);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setU5Trafo1Loading(false);
    }
  };
  // ================================================================================
  const fetchU5Trafo2 = async () => {
    try {
      setU5Trafo2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-trafo4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2025-11-23",
          end_date: "2025-11-24",
        }),
      });
      const resResult = await res.json();
      if (res.ok) {
        setU5Trafo2ResData(resResult);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setU5Trafo2Loading(false);
    }
  };
  // ================================================================================
  const fetchU5Trafo1and2 = async () => {
    try {
      setU5Trafo1and2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-combine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2025-11-23",
          end_date: "2025-11-24",
        }),
      });
      const resResult = await res.json();
      if (res.ok) {
        setU5Trafo1and2ResData(resResult);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setU5Trafo1and2Loading(false);
    }
  };

  useEffect(() => {
    fetchU4Trafo1and2();
  }, []);
  useEffect(() => {
    fetchU5Trafo1();
  }, []);
  useEffect(() => {
    fetchU5Trafo2();
  }, []);
  useEffect(() => {
    fetchU5Trafo1and2();
  }, []);
  const charts = [
    {
      id: "harmonics",
      title: "Unit 4 Transformer 1+2 Losses",
      Chart: HarmonicsChart,
    },
    {
      id: "power",
      title: "UNIT 5 TRANSFORMER 1 LOSSES",
      Chart: PowerChart,
    },
    {
      id: "voltage",
      title: "UNIT 5 TRANSFORMER 2 LOSSES",
      Chart: VoltageChart,
    },
    {
      id: "current",
      title: "UNIT 5 TRANSFORMER 1+2 LOSSES",
      Chart: CurrentChart,
    },
  ];
  return (
    <div className="h-[81vh] py-[1px] overflow-y-auto space-y-3">
      {/* {charts.map(({ id, title, Chart }) => (
        <ChartCard
          area="unit4-lt1"
          key={id}
          id={id}
          chartId={id}
          title={title}
          ChartComponent={Chart}
          state={chartStates[id]}
          onChange={updateChartState}
        />
      ))} */}
      <Unit4Trafos
        id="Unit4TrafoLosses1and2"
        title={"UNIT 4 TRANSFORMER 1+2 LOSSES"}
        data={data}
        trafoLosses={trafoLosses}
        loading={u4Trafo1and2Loading}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses1"
        title={"UNIT 5 TRANSFORMER 1 LOSSES"}
        data={data}
        trafoLosses={trafoLosses}
        loading={u5Trafo1Loading}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses2"
        title={"UNIT 5 TRANSFORMER 2 LOSSES"}
        data={data}
        trafoLosses={trafoLosses}
        loading={u5Trafo2Loading}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses1and2"
        title={"UNIT 5 TRANSFORMER 1+2 LOSSES"}
        data={data}
        trafoLosses={trafoLosses}
        loading={u5Trafo1and2Loading}
      />
    </div>
  );
};

export default TrafoLossesPage;
