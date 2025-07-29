import CustomLoader from "@/components/customLoader/CustomLoader";
import config from "@/constant/apiRouteList";
import { relativeDateTimeCalculator } from "@/utils/relativeDateTimeCalculator";
import React, { useEffect, useState } from "react";

const meters = [
  { name: "Transport", id: "U1_PLC" },
  { name: "Unit 05 aux", id: "U2_PLC" },
  { name: "Lighting External", id: "U3_PLC" },
  { name: "Light Internal", id: "U4_PLC" },
  { name: "Power House", id: "U5_PLC" },
  { name: "Turbine", id: "U6_PLC" },
];

const MeterLogs = () => {
  const [meterLogsData, setMeterLogsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 13;

  const fetchMeterLogsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.METER_CONFIG.GET_METER_LOGS}`,
        {
          method: "GET",
        }
      );
      const resResult = await response.json();

      if (response.ok) {
        setMeterLogsData(resResult);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMeterLogsData();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(meterLogsData.length / itemsPerPage);
  const paginatedData = meterLogsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getMeterName = (id) => {
    const match = meters.find((m) => m.id === id);
    return match ? match.name : id;
  };

  return (
    <div>
      {loading ? (
        <CustomLoader />
      ) : (
        <div className="w-full overflow-hidden">
          <div className="w-full overflow-x-auto md:overflow-x-visible">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[10%] py-1">
                      No.
                    </th>
                    <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[15%] py-1">
                      Meter
                    </th>
                    <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[10%] py-1">
                      Area
                    </th>
                    <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[20%] py-1">
                      User Name
                    </th>
                    {/* <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[25%] py-1">
                      User Email
                    </th> */}
                    <th className="border-1 border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-400 w-[20%] py-1">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((log, index) => {
                      const updatedAtTime = new Date(log.updatedAt);
                      const updateTime = updatedAtTime.toLocaleString();
                      return (
                        <tr
                          key={log._id}
                          className="hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="border-1 border-gray-300 capitalize dark:border-gray-500 py-1 text-center">
                            {getMeterName(log.meterId)}
                          </td>
                          <td className="border-1 border-gray-300 capitalize dark:border-gray-500 py-1 text-center">
                            {log.area === "unit4" ? "Unit 4" : "Unit 5"}
                          </td>
                          <td className="border-1 border-gray-300 capitalize dark:border-gray-500 py-1 text-center">
                            {log.username}
                          </td>
                          {/* <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                            {log.email}
                          </td> */}
                          <td className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                            {updateTime}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-1 border-gray-300 dark:border-gray-500 py-1 text-center">
                      <td colSpan={6} className="text-center py-2">
                        No active meter configuration
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {meterLogsData.length > itemsPerPage && (
            <div className="flex justify-end mt-3 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-gray-200 cursor-pointer dark:bg-gray-600 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1 bg-gray-200 cursor-pointer dark:bg-gray-600 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeterLogs;
