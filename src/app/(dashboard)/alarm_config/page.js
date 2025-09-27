"use client";
import { ArrowLeft, Edit, Eye, Trash } from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import ViewDetailsModal from "@/components/alarmsComponents/Alarm_View";
import DeleteModal from "@/components/alarmsComponents/Delete_Modal";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import config from "../../../config";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataString = searchParams.get("data");
  const alarm = dataString ? JSON.parse(dataString) : null;

  // Derive typeId robustly
  const typeId = useMemo(() => {
    if (!alarm) return searchParams.get("typeId") || null;
    return (
      alarm.typeId ||
      alarm.typeID ||
      alarm.alarmTypeId?._id ||
      alarm._id || // if /types/:id object was passed directly
      searchParams.get("typeId") ||
      null
    );
  }, [alarm, searchParams]);

  const [alarms, setAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const alarmsPerPage = 4;
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalsOpen, setIsDeleteModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const priorityLabels = {
    1: "Priority 1",
    2: "Priority 2",
    3: "Priority 3",
    4: "Priority 4",
    5: "Priority 5",
  };

  const fetchAlarms = useCallback(async () => {
    if (!typeId) {
      setFetchError("Missing typeId to fetch alarms.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setFetchError(null); // Clear previous errors
    try {
      const res = await fetch(`${config.BASE_URL}/alarms/by-type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typeId }),
      });

      if (!res.ok) {
        // const txt = await res.text();
        // throw new Error(`API ${res.status}: ${txt || res.statusText}`);
      }

      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];

      // Only update the state if there is data
      if (list.length > 0) {
        const mapped = list.map((a) => {
          const thr = a?.alarmTriggerConfig?.thresholds?.[0] || {};
          let thresholdComparison = "";

          switch (thr?.operator) {
            case ">":
              thresholdComparison = "Greater than";
              break;
            case "<":
              thresholdComparison = "Less than";
              break;
            case ">=":
              thresholdComparison = "Greater than or equal to";
              break;
            case "<=":
              thresholdComparison = "Less than or equal to";
              break;
            case "==":
              thresholdComparison = "Equal to";
              break;
            case "!=":
              thresholdComparison = "Not equal to";
              break;
            default:
              thresholdComparison = "Unknown";
          }

          return {
            _id: a?._id,
            name: a?.alarmName ?? "Alarm",
            parameter: a?.alarmParameter ?? "",
            device: a?.alarmDevice ?? "",
            location: a?.alarmLocation ?? "",
            subLocation: a?.alarmSubLocation ?? "",
            thresholdValue: thr?.value ?? "",
            thresholdComparison, // Use the updated comparison value
            actions: Array.isArray(a?.acknowledgementActions)
              ? a.acknowledgementActions
              : [],
            priority: a?.alarmTypeId?.priority ?? "",
            code: a?.alarmTypeId?.code ?? "",
            acknowledgement: a?.alarmTypeId?.acknowledgeType ?? "",
            triggerPersistChecked: !!a?.alarmTriggerConfig?.persistenceTime,
            triggerOccursChecked: !!a?.alarmTriggerConfig?.occursCount,
            raw: a, // keep entire object for details modal if needed
          };
        });

        setAlarms(mapped);
        setCurrentPage(1);
      } else {
        setAlarms([]); // Ensure alarms state is cleared when no data is returned
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch alarms.");
    } finally {
      setIsLoading(false);
    }
  }, [typeId]);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]); // Add fetchAlarms as a dependency

  const indexOfLastAlarm = currentPage * alarmsPerPage;
  const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
  const currentAlarms = alarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

  const handleNext = () => {
    if (currentAlarms.length === alarmsPerPage) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const canGoNext = alarms.length > currentPage * alarmsPerPage;
  const canGoBack = currentPage > 1;

  const handleAddClick = () => {
    const rowData = {
      _id: null,
      name: "",
      parameter: "",
      device: "",
      location: "",
      subLocation: "",
      thresholdValue: "",
      actions: [""],
      priority: "",
      code: "",
      acknowledgement: "",
      triggerPersistChecked: false,
      triggerOccursChecked: true,
    };
    router.push(
      `/alarms?data=${encodeURIComponent(
        JSON.stringify(alarm)
      )}&rowData=${encodeURIComponent(JSON.stringify(rowData))}`
    );
  };

  const handleEditClick = (selected) => {
    const rowData = selected;
    router.push(
      `/alarms?data=${encodeURIComponent(
        JSON.stringify(alarm)
      )}&rowData=${encodeURIComponent(JSON.stringify(rowData))}`
    );
  };
  // remove _ and id from param
  const formateParmeter = (param) => {
    let parts = param.split("_");
    return parts.slice(2).join(" ");
  };
  const handleDeleteClick = (alarmRow) => {
    setSelectedAlarm(alarmRow);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (alarmRow) => {
    setSelectedAlarm(alarmRow);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };
  const handleDeleteSuccess = () => {
    // only called after API confirms deletion
    setIsDeleteModalOpen(false);
    fetchAlarms(); // refresh table now
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full p-4 min-h-[81vh] rounded-[8px] dark:bg-gray-800 bg-white !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">
        <div className="w-full flex justify-between items-start mb-3">
          {alarm ? (
            <div className="text-left">
              <span className="flex items-center text-2xl text-[#626469] dark:text-white font-semibold">
                <ArrowLeft
                  className="w-5 h-5 text-gray-600 !cursor-pointer"
                  onClick={() => router.back()}
                />
                <span className="ml-2">
                  {" "}
                  Alarm Configuration {`(Alarm Type ${alarm.type || ""})`}
                </span>
              </span>

              <p className="mt-1 px-7 text-left dark:text-white text-[15.04px] text-[#7E7E7E]">
                Define where, what and how an alarm is triggered
              </p>
            </div>
          ) : (
            <p>No alarm data found.</p>
          )}
          <div className="py-3">
            <button
              onClick={handleAddClick}
              className="bg-[#025697] cursor-pointer !font-[Inter] text-white px-4 py-2 rounded hover:bg-[#024080] text-sm font-medium"
            >
              + Add Alarms
            </button>
          </div>
        </div>

        {/* Alarm type chips */}
        {alarm ? (
          <div className="w-full px-7 flex flex-wrap gap-6 text-sm text-[#17282FCF] dark:text-white font-[Inter] mb-4">
            <span>
              <strong>Alarm Priority:</strong>{" "}
              <span className="text-[#025697] font-semibold">
                {priorityLabels[alarm.priority] || `Priority ${alarm.priority}`}
              </span>
            </span>
            <span>
              <strong>Alarm Type:</strong>{" "}
              <span className="text-[#025697] font-semibold">{alarm.type}</span>
            </span>
            <span className="flex items-center">
              <strong>Alarm Color:</strong>
              <div
                className="ml-2 w-4 h-4 rounded-sm border border-black/20"
                style={{ backgroundColor: alarm.color }}
              />
            </span>
            <span>
              <strong>Acknowledgement Type:</strong>{" "}
              <span className="text-[#025697] cursor-pointer">
                {alarm.acknowledgeType === "Both"
                  ? "Single + Mass Acknowledgement"
                  : "Single Acknowledgement"}
              </span>
            </span>
          </div>
        ) : (
          <p>No alarm data found.</p>
        )}

        {/* Error state */}
        {fetchError && (
          <div className="my-4 p-3 rounded border border-red-300 bg-red-50 text-red-700">
            {fetchError}
          </div>
        )}

        {/* Table / States */}
        <div className="mt-6 flex w-full max-w-full mx-auto">
          <table className="min-w-full text-sm !font-[Inter]">
            <thead className="text-left text-[#7E7E7E] dark:text-gray-300">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 w-[30%] !font-[Inter]">Alarm Name</th>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4 !font-[Inter]">Device</th>
                <th className="py-3 px-4 !font-[Inter]">Location</th>
                <th className="py-3 px-4 text-right !font-[Inter]">Action</th>
              </tr>
            </thead>

            <tbody className="text-[#17282FCF] dark:text-white">
              {/* Inline loading row (only when loading AND no existing rows yet) */}
              {isLoading && alarms.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="loader" />
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state (only when NOT loading and truly no data) */}
              {!isLoading && alarms.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex flex-col items-center">
                      <Image
                        src="/alarm_bell.png"
                        alt="No Alarms"
                        className="w-[30vh] h-[29vh] mb-6"
                        width={300}
                        height={300}
                      />
                      <div className="text-center text-[#17282F] text-[15px] font-normal tracking-[-0.3px]">
                        <div className="text-[rgba(23, 40, 47, 0.81)] !font-[Inter] dark:text-white">
                          No Alarms available for this Type!!
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Render data rows (visible even while isLoading=true on refetch) */}
              {currentAlarms.map((row) => (
                <tr
                  key={row._id || row.name}
                  className="z-[10] border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <td className="py-3 px-4 !font-[Inter]">{row.name}</td>
                  <td className="py-3 px-4 !font-[Inter]">
                    {formateParmeter(row.parameter) ?? "Voltage"}
                  </td>
                  <td className="py-3 px-4 !font-[Inter]">
                    {row.device ?? "Transformer"}
                  </td>
                  <td className="py-3 px-4 !font-[Inter]">
                    {row.location.replace("_", " ") ?? "Location"}
                  </td>
                  <td className="py-3 px-4 text-right relative">
                    <button
                      onClick={() => toggleMenu(row._id)}
                      className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ⋮
                    </button>

                    {openMenuId === row._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md z-[999]">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                          <li
                            onClick={() => {
                              handleDeleteClick(row);
                              setOpenMenuId(null);
                            }}
                            className="!font-[Inter] flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Trash className="w-4 h-4 text-red-600" />
                            Delete
                          </li>
                          <li
                            onClick={() => {
                              handleEditClick(row);
                              setOpenMenuId(null);
                            }}
                            className="!font-[Inter] flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                            Update
                          </li>
                          <li
                            onClick={() => handleViewDetails(row)}
                            className="!font-[Inter] flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-green-600" />
                            View Details
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* Optional thin loader bar while refetching but rows exist */}
              {isLoading && alarms.length > 0 && (
                <tr>
                  <td colSpan={5} className="py-2">
                    <div className="w-full flex justify-center">
                      <div className="loader scale-75" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager (only show when we have any rows) */}
        {alarms.length > 0 && (
          <div className="flex justify-between mt-6 w-full">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="bg-[#025697] text-white text-sm px-6 py-2 rounded hover:bg-[#024080]"
              >
                Back
              </button>
            )}
            {canGoNext && (
              <button
                onClick={handleNext}
                className="bg-[#025697] text-white text-sm px-6 py-2 rounded hover:bg-[#024080] ml-auto"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        alarmData={selectedAlarm}
      />
      <DeleteModal
        isOpen={isModalsOpen}
        onClose={() => setIsDeleteModalOpen(false)} // NO refetch here
        onDelete={handleDeleteSuccess} // refresh ONLY on success
        alarmData={selectedAlarm}
        alarmConfigId={selectedAlarm?._id}
        type={2}
      />
    </>
  );
}
