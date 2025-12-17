"use client";
import Unit4Trafos from "@/components/trendsComponents/Unit4Trafos";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";

const TrafoLossesPage = () => {
  ////////////////////////////////////////////////////////

  const [dateRanges, setDateRanges] = useState({
    Unit4TrafoLosses1and2: { startDate: "", endDate: "" },
    Unit5TrafoLosses1: { startDate: "", endDate: "" },
    Unit5TrafoLosses2: { startDate: "", endDate: "" },
    Unit5TrafoLosses1and2: { startDate: "", endDate: "" },
  });

  ////////////////////////////////////////////////////////

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
  const u5Trafo1Keys = {
    timestamp: "time",
    Unit5Trafo3NetLosses: "netLosses",
    Unit5Trafo3NetLossesPercentage: "netLossesPercent",
  };
  const u5Trafo2Keys = {
    timestamp: "time",
    Unit5Trafo4NetLosses: "netLosses",
    Unit5Trafo4NetLossesPercentage: "netLossesPercent",
  };
  const u5Trafo1And2Keys = {
    timestamp: "time",
    Unit5CombineNetLosses: "netLosses",
    Unit5CombineNetLossesPercentage: "netLossesPercent",
  };
  const u4CombineData = pickAndTransformKeys(u4combineResData, selectedKeys);
  const u5Trafo1Data = pickAndTransformKeys(u5Trafo1ResData, u5Trafo1Keys);
  const u5Trafo2Data = pickAndTransformKeys(u5Trafo2ResData, u5Trafo2Keys);
  const u5Trafo1And2Data = pickAndTransformKeys(
    u5Trafo1and2ResData,
    u5Trafo1And2Keys
  );

  // ================================================================================
  const fetchU4Trafo1and2 = async ({ startDate, endDate }) => {
    try {
      setU4Trafo1and2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit4-combine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
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
  const fetchU5Trafo1 = async ({ startDate, endDate }) => {
    try {
      setU5Trafo1Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-trafo3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
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
  const fetchU5Trafo2 = async ({ startDate, endDate }) => {
    try {
      setU5Trafo2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-trafo4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
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
  const fetchU5Trafo1and2 = async ({ startDate, endDate }) => {
    try {
      setU5Trafo1and2Loading(true);
      const res = await fetch(`${config.BASE_URL}/tltrends/unit5-combine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
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
  //===============================================================================

  const handleDateChange = (id, range) => {
    setDateRanges((prev) => ({
      ...prev,
      [id]: range,
    }));

    switch (id) {
      case "Unit4TrafoLosses1and2":
        fetchU4Trafo1and2(range);
        break;
      case "Unit5TrafoLosses1":
        fetchU5Trafo1(range);
        break;
      case "Unit5TrafoLosses2":
        fetchU5Trafo2(range);
        break;
      case "Unit5TrafoLosses1and2":
        fetchU5Trafo1and2(range);
        break;
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

  return (
    <div className="h-[81vh] py-[1px] overflow-y-auto space-y-3">
      <Unit4Trafos
        id="Unit4TrafoLosses1and2"
        title={"UNIT 4 TRANSFORMER 1+2 LOSSES"}
        data={u4CombineData}
        colors={{
          series1: "#dc2626",
          series2: "#65a30d",
        }}
        loading={u4Trafo1and2Loading}
        onDateChange={handleDateChange}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses1"
        title={"UNIT 5 TRANSFORMER 1 LOSSES"}
        data={u5Trafo1Data}
        colors={{
          series1: "#c2410c",
          series2: "#047857",
        }}
        loading={u5Trafo1Loading}
        onDateChange={handleDateChange}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses2"
        title={"UNIT 5 TRANSFORMER 2 LOSSES"}
        data={u5Trafo2Data}
        colors={{
          series1: "#a16207",
          series2: "#0369a1",
        }}
        loading={u5Trafo2Loading}
        onDateChange={handleDateChange}
      />
      <Unit4Trafos
        id="Unit5TrafoLosses1and2"
        title={"UNIT 5 TRANSFORMER 1+2 LOSSES"}
        data={u5Trafo1And2Data}
        colors={{
          series1: "#f43f5e",
          series2: "#5b21b6",
        }}
        loading={u5Trafo1and2Loading}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default TrafoLossesPage;
