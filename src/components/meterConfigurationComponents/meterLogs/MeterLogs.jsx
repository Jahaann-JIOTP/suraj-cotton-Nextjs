import config from "@/constant/apiRouteList";
import React, { useEffect, useState } from "react";

const MeterLogs = () => {
  const [meterLogsData, setMeterLogsData] = useState([]);

  const fetchMeterLogsData = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/meter/config/latest`, {
        method: "GET",
      });
      const resResult = await response.json();

      if (response.ok) {
        setMeterLogsData(resResult);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchMeterLogsData();
  }, []);
  return (
    <div>
      <div></div>
      <div className="w-full min-w-[500px]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[10%]">
                No.
              </th>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[15%]">
                Meter
              </th>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[10%]">
                Area
              </th>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[20%]">
                User Name
              </th>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[25%]">
                User Eamil
              </th>
              <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[20%]">
                Update At
              </th>
            </tr>
          </thead>
          <tbody>
            {meterLogsData.map((log, index) => {
              const date = new Date(log.updatedAt).toLocaleString();
              return (
                <tr
                  key={log._id}
                  className=" hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {log.meterId}
                  </td>
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {log.area}
                  </td>
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {log.username}
                  </td>
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {log.email}
                  </td>
                  <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                    {date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeterLogs;
