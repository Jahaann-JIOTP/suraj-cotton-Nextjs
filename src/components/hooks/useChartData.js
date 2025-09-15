// hooks/useTrendsChart.ts
"use client";
import { useEffect, useState } from "react";
import config from "@/constant/apiRouteList";

export function useTrendsChart(type, startDate, endDate) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type || !startDate || !endDate) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${config.BASE_URL}/plants-trends/unit4-lt1?startDate=${startDate}&endDate=${endDate}&type=${type}`,
          { method: "GET" }
        );
        const resResult = await response.json();

        if (response.ok) {
          setData(resResult);
        } else {
          setError(resResult.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, startDate, endDate]);

  return { data, loading, error };
}
