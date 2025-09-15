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

////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useCallback } from 'react';

// const useChartData = (chartType, initialData) => {
//   const [data, setData] = useState(initialData);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async (startDate, endDate) => {
//     if (!startDate || !endDate) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${config.BASE_URL}/plants-trends/unit5-lt2?startDate=2025-09-11&endDate=2025-09-11&type=${chartType}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       setData(result);
//     } catch (err) {
//       console.error(`Error fetching ${chartType} data:`, err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [chartType]);

//   return { data, loading, error, fetchData };
// };

// export default useChartData;