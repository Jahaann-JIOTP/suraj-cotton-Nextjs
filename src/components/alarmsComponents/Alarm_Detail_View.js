import { useState, useMemo, useEffect } from "react";
import moment from "moment";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";
export default function ViewDetailsModal({
  isOpen,
  onClose,
  alarmData,
  hideAcknowledged,
  onAcknowledge,
}) {
  // === Tab state (unchanged tabs UI) ===
  const [activeTab, setActiveTab] = useState("details");
  const alarm_data = alarmData?.alarmConfigure;
  // === Your original fallbacks (unchanged) ===
  const source = alarm_data?.alarmDevice ?? "Transformer";
  const name = alarm_data?.alarmName ?? "Device Settings";
  const parameter = alarm_data?.alarmParameter ?? "Current";
  const alarmLocation = alarm_data?.alarmLocation ?? "Current";
  const alarmSubLocation = alarm_data?.alarmSubLocation ?? "Current";

  const alarmType = alarm_data?.alarmType?.type ?? "Critical (100)";
  const state = "Inactive";
  const [validationErrors, setValidationErrors] = useState({
    action: "",
    custom: "",
  });
  const [actions, setActions] = useState([]);
  const acknowledged = Number(alarmData?.alarmAcknowledgementStatusCount ?? 2);
  const total = Number(alarmData?.alarmOccurrenceCount ?? 0);
  const acknowledgementActions = alarm_data?.acknowledgementActions ?? "--";
  const unacknowledged = Number(total - acknowledged);
  const lastOccurrence =
    alarmData?.alarmLastOccurrence ?? "10/25/2025 4:24:07 PM";
  const [ackOpen, setAckOpen] = useState(false);
  const [ackForm, setAckForm] = useState({
    id: "",
    name: "",
    action: "",
    custom: "",
  });
  // NEW: selection + info banner state
  const [checkedKeys, setCheckedKeys] = useState(new Set());
  const [showInfoHint, setShowInfoHint] = useState(false);
  const isSingleAcknowledgment =
    alarmData?.alarmConfigure?.alarmType?.acknowledgeType === "Single";
  const [userId, setUserId] = useState(null);
  const [currentAlarm, setCurrentAlarm] = useState(alarmData);

  // get meter id
  const splitTag = parameter.split("_");
  const getMeterId = [splitTag[0], splitTag[1]].join("_");
  const splitLtLocation = alarmSubLocation.split("");
  const getLtLocation = `${splitLtLocation[0]}${splitLtLocation[1]}_${splitLtLocation[2]}`;

  // NEW: map each row to a stable key once
  const rowKeyOf = (r, idx) => `${r.id}-${idx}`;
  useEffect(() => {
    // Get the user ID from localStorage on component mount
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId); // Set the user ID in state
    }
  }, []);
  // NEW: checkbox toggle helpers
  const isChecked = (key) => checkedKeys.has(key);
  const toggleCheck = (key) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const clearChecks = () => setCheckedKeys(new Set());
  const acknowledgeSelected = async () => {
    if (!checkedKeys.size) return;

    const selectedRows = historyRows.filter((row, idx) =>
      checkedKeys.has(rowKeyOf(row, idx))
    );
    const payload = {
      ids: selectedRows.map((row) => row.occid),
      acknowledgedBy: userId,
    };

    try {
      const response = await axios.post(
        `${config.BASE_URL}/alarms/bulk-acknowledge`,
        payload
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Bulk Acknowledgment Successful");
        // 🔄 refresh modal history & parent list
        await refreshCurrentAlarm();
        onAcknowledge?.();
        clearChecks();
      } else {
        toast.error("Error occurred during bulk acknowledgment");
      }
    } catch (error) {
      console.error("Error acknowledging alarms:", error);
      toast.error("Error acknowledging alarms");
    }
  };

  const formatAlarmDate = (triggeredAt) => {
    // Convert the triggeredAt to a specific timezone (e.g., 'Asia/Karachi')
    const zonedDate = toZonedTime(new Date(triggeredAt), "Asia/Karachi");
    // Format the date into the desired format: dd-M-yyyy HH:mm (e.g., 27-08-2025 17:23)
    const activeSince = format(zonedDate, "dd-M-yyyy HH:mm");

    return activeSince;
  };
  const AlarmAge = (triggeredAt) => {
    const zonedDate = toZonedTime(new Date(triggeredAt), "Asia/Karachi");
    const now = toZonedTime(new Date(), "Asia/Karachi");

    // difference in minutes
    const alarmAgeInMinutes = Math.floor((now - zonedDate) / 60000);

    return `${alarmAgeInMinutes} min ago`;
  };
  const AlarmHourAge = (triggeredAt) => {
    // Convert the triggeredAt to a specific timezone (e.g., 'Asia/Karachi')
    const zonedDate = toZonedTime(new Date(triggeredAt), "Asia/Karachi");

    // Format the date into the desired format: dd-M-yyyy HH:mm (e.g., 27-08-2025 17:23)
    const activeSince = format(zonedDate, "dd-M-yyyy HH:mm");
    const now = toZonedTime(new Date(), "Asia/Karachi");

    // Calculate the alarm age in hours
    const alarmAgeInHours = Math.floor((now - zonedDate) / 3600000); // 3600000ms = 1 hour

    // Determine if "hour" or "hours" should be used
    const hourLabel = alarmAgeInHours === 1 ? "hour" : "hours";

    // Return the formatted alarm age
    const alarmAge = `${alarmAgeInHours} ${hourLabel} ago`;

    return alarmAge;
  };

  const historyRows = useMemo(() => {
    const occs = Array.isArray(currentAlarm?.alarmOccurrences)
      ? currentAlarm.alarmOccurrences
      : [];

    if (occs.length === 0) {
      return [
        {
          id: "No history available",
          alarmName: "N/A",
          timeAge: "N/A",
          timeStamp: "N/A",
          duration: "N/A",
          threshold: "N/A",
          ack: "N/A",
          action: "N/A",
          occid: "N/A",
        },
      ];
    }

    const rows = occs.map((occurrence) => ({
      id: occurrence.alarmID,
      alarmName: occurrence.alarmName ?? name,
      timeAge: AlarmHourAge(occurrence.date),
      timeStamp: formatAlarmDate(occurrence.date),
      duration: AlarmAge(occurrence.date) ?? "N/A",
      threshold: `${Number(occurrence.alarmPresentValue).toFixed(2)} / ${Number(
        occurrence.alarmThresholdValue
      ).toFixed(2)}`,
      occid: occurrence._id,
      accby: occurrence?.alarmAcknowledgedBy?.name,
      ack: occurrence.alarmAcknowledgeStatus ?? "No",
      action: occurrence.alarmAcknowledgmentAction ?? "",
    }));

    // ✅ Hide acknowledged rows when requested
    const filtered = hideAcknowledged
      ? rows.filter((r) => r.ack !== "Acknowledged")
      : rows;

    return filtered.length > 0 ? filtered : [];
  }, [currentAlarm?.alarmOccurrences, name, hideAcknowledged]);

  const historyCols = useMemo(() => {
    if (isSingleAcknowledgment) {
      return [
        { key: "id", label: "ID", basis: "basis-[16%]" },
        { key: "timeAge", label: "Time Age", basis: "basis-[16%]" },
        { key: "timeStamp", label: "Time Stamp", basis: "basis-[16%]" },
        { key: "duration", label: "Alarm Duration", basis: "basis-[16%]" },
        { key: "threshold", label: "PV/Threshold", basis: "basis-[16%]" },
        { key: "ack", label: "Acknowledge Status", basis: "basis-[16%]" },
        { key: "action", label: "Action Taken", basis: "basis-[16%]" },
      ];
    } else {
      return [
        { key: "id", label: "ID", basis: "basis-[16%]" },
        { key: "timeAge", label: "Time Age", basis: "basis-[16%]" },
        { key: "timeStamp", label: "Time Stamp", basis: "basis-[16%]" },
        { key: "duration", label: "Alarm Duration", basis: "basis-[16%]" },
        { key: "threshold", label: "PV/Threshold", basis: "basis-[16%]" },
        { key: "ack", label: "Acknowledge Status", basis: "basis-[16%]" },
        { key: "action", label: "Action Taken", basis: "basis-[16%]" },
      ];
    }
  }, [isSingleAcknowledgment]);

  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // optional: bubble up the selected object
  const selectRow = (row, key) => {
    setSelectedRowKey(key);
    setSelectedRowData(row);
  };
  useEffect(() => {
    if (isOpen) {
      // Call the API and populate the actions dropdown when the modal is opened
      axios
        .get(`${config.BASE_URL}/alarms/acknowledgment-actions`)
        .then((response) => {
          setActions(response.data); // Store the response actions
        })
        .catch((error) => {
          console.error("Error fetching actions:", error);
        });
    }
  }, [isOpen]); // Make sure the effect runs whenever isOpen changes

  const handleActionChange = (e) => {
    setAckForm((prevForm) => ({ ...prevForm, action: e.target.value }));
  };
  // useEffect(() => {
  //   // ✅ hook will always run, no violation
  //   console.log("Mounted or updated dropdown:");
  // }, [isOpen]);
  const handleCheckboxChange = (e, alarmId) => {
    if (e.target.checked) {
      setSelectedAlarms([...selectedAlarms, alarmId]);
    } else {
      setSelectedAlarms(selectedAlarms.filter((id) => id !== alarmId));
    }
  };
  const openAckForRow = (row) => {
    setAckForm({
      id: row.id || "",
      name: row.alarmName ?? name,
      threshold: row.threshold ?? "N/A",
      occid: row.occid,
      action: "",
      custom: "",
    });
    setAckOpen(true);
  };
  // below your other state:

  // keep local copy in sync with prop
  useEffect(() => {
    setCurrentAlarm(alarmData);
  }, [alarmData]);

  // GET re-fetcher for THIS alarm (swap to your real per-alarm GET if available)
  const refreshCurrentAlarm = async () => {
    try {
      // If you have a dedicated endpoint, e.g.:
      // const { data } = await axios.get(`${config.BASE_URL}/alarms/${alarmData._id}`);
      // setCurrentAlarm(data);
      // return;

      // Fallback: call get-all and pick the current one by _id
      const payload = { alarmStatus: false }; // same as your page fetch
      const resp = await axios.post(
        `${config.BASE_URL}/alarms/get-all-Alarms`,
        payload
      );
      const list = Array.isArray(resp?.data?.data) ? resp.data.data : [];
      const found = list.find((a) => String(a?._id) === String(alarmData?._id));
      if (found) setCurrentAlarm(found);
    } catch (e) {
      console.error("Failed to refresh alarm:", e);
    }
  };

  const submitAck = async () => {
    const { action, custom, occid } = ackForm;
    const acknowledgedBy = userId;

    let errors = {};

    // Only enforce action required if NOT single acknowledgment
    if (!isSingleAcknowledgment && !action) {
      errors.action = "Action is required.";
    }

    // (Custom should always be optional, so we don’t check it)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload = { action, id: occid, acknowledgedBy, custom };

    try {
      const response = await axios.post(
        `${config.BASE_URL}/alarms/single-acknowledge`,
        payload
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Acknowledgment Successful");
        await refreshCurrentAlarm(); // refresh modal history
        onAcknowledge?.();
        setAckOpen(false);
      } else {
        toast.error("Error acknowledging alarm");
      }
    } catch (error) {
      console.error("Error acknowledging alarm:", error);
      toast.error("Error acknowledging alarm");
    }
  };

  const getDiagramUrl = (location) => {
    // Check if location is 'Chiller' or 'Process', and pass it as a query parameter
    const type = location === "Chiller" ? "Chillers" : "Processor";
    return `/meter?area=${location}&meter_name=${source}&LT_selections=${getLtLocation}&meter_id=${getMeterId}`;
  };
  const allAcknowledged = useMemo(() => {
    if (!historyRows || historyRows.length === 0) return false;
    return historyRows.every((r) => r.ack === "Acknowledged");
  }, [historyRows]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 h-[80vh] mt-[9%] !border !border-t-4 !border-t-[#1d5999] border-black/10 dark:border-white/10 rounded-[10px] w-full max-w-[100%] !overflow-auto custom-scrollbar relative">
            {checkedKeys.size == 0 && (
              <div className="flex justify-end p-4 !pb-0">
                <button
                  onClick={onClose}
                  className="!font-[Inter] cursor-pointer bg-[#025697] dark:bg-[#024080] text-white px-4 py-2 rounded hover:bg-[#024080] transition duration-300"
                >
                  Close
                </button>
              </div>
            )}
            <div className="flex justify-center px-6">
              <div
                className="inline-flex items-center rounded-[12px] p-[3px] bg-white dark:bg-gray-600
                          border border-[#DCE6F3] dark:border-gray-500
                          shadow-[0_2px_12px_rgba(13,71,161,0.18)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={[
                    "h-9 min-w-[150px] px-6 rounded-[5px] text-[14px] font-semibold !font-[Inter] transition cursor-pointer",
                    activeTab === "details"
                      ? "bg-[#0B5DAA] text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]"
                      : "bg-[#EEF4FA] text-[#3B3F45] hover:bg-[#E6F0FA] dark:bg-gray-500 dark:text-white mr-1",
                  ].join(" ")}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={[
                    "h-9 min-w-[150px] px-6 rounded-[5px] text-[14px] font-semibold !font-[Inter] transition cursor-pointer",
                    activeTab === "history"
                      ? "bg-[#0B5DAA] text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]"
                      : "bg-[#EEF4FA] text-[#3B3F45] hover:bg-[#E6F0FA] dark:bg-gray-500 dark:text-white ml-1",
                  ].join(" ")}
                >
                  History
                </button>
              </div>
            </div>

            {/* ================= DETAILS (YOUR ORIGINAL MARKUP — UNCHANGED) ================= */}
            {activeTab === "details" && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT COLUMN */}
                  <div className="flex flex-col gap-8">
                    {/* Where */}
                    <div className="flex flex-col">
                      <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">
                        Where
                      </h4>
                      <div className="gap-4 text-[#17282FCF] dark:text-white">
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-2">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Source
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {source}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* What */}
                    <div className="flex flex-col">
                      <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">
                        What
                      </h4>
                      <div className="gap-4 text-[#17282FCF] dark:text-white">
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-2">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Name
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {name}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Location
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {alarmLocation}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Sub Location
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {alarmSubLocation}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Parameter
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {parameter}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Alarm Type
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {alarmType}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            State
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="flex flex-col gap-8">
                    {/* Occurrence Counter */}
                    <div className="flex flex-col">
                      <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">
                        Occurrence Counter
                      </h4>
                      <div className="gap-4 text-[#17282FCF] dark:text-white">
                        {!hideAcknowledged && (
                          <div className="grid grid-cols-[30%_70%] gap-1 mt-2">
                            <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                              Acknowledged
                            </p>
                            <span className="font-semibold !font-[Inter]">
                              {acknowledged}
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Unacknowledged
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {unacknowledged}
                          </span>
                        </div>
                        <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                          <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                            Total
                          </p>
                          <span className="font-semibold !font-[Inter]">
                            {total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col">
                      <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">
                        Actions
                      </h4>
                      <button
                        type="button"
                        className="text-left underline text-[#025697] dark:text-white !font-[Inter] w-fit"
                        onClick={() => {}}
                      >
                        <ul>
                          <li>
                            <a
                              href={getDiagramUrl(alarmLocation)}
                              target="_blank"
                              className="dark:text-white underline"
                            >
                              Open Meter Diagram
                            </a>
                          </li>
                        </ul>
                      </button>
                    </div>
                  </div>
                </div>

                {/* WHEN */}
                <div className="mt-10">
                  <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">
                    When
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[#17282FCF] dark:text-white">
                    <div className="grid grid-cols-[30%_70%] gap-1 mt-5">
                      <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter]">
                        Last Occurrences
                      </p>
                      <span className="font-semibold !font-[Inter]">
                        {formatAlarmDate(lastOccurrence)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="px-6 pb-6">
                <div className="pt-1 pb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-[#2A2A2A] dark:text-white !font-[Inter]">
                      {name || "Alarm"} History
                    </h3>
                    <p className="text-sm text-[#6F6F6F] dark:text-gray-300 !font-[Inter] -mt-1">
                      At: {source}
                    </p>
                  </div>

                  {/* Top-right action: Info (!) or Acknowledge */}
                  {!allAcknowledged &&
                    (!isSingleAcknowledgment ? (
                      <button
                        type="button"
                        onClick={acknowledgeSelected} // Trigger bulk acknowledgment
                        className="h-9 px-4 rounded bg-[#0B5DAA] text-white text-sm !font-[Inter] hover:bg-[#084a87]"
                        disabled={checkedKeys.size === 0} // Disable if no checkboxes are selected
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowInfoHint((v) => !v)}
                        className="h-9 px-3 rounded-full text-white text-sm !font-[Inter] flex items-center gap-2"
                        title="Show hint"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="33"
                          height="33"
                          viewBox="0 0 33 33"
                          fill="none"
                        >
                          <path
                            d="M15.125 23.375H17.875V15.125H15.125V23.375ZM16.5 12.375C16.8896 12.375 17.2164 12.243 17.4804 11.979C17.7444 11.715 17.8759 11.3887 17.875 11C17.8741 10.6113 17.7421 10.285 17.479 10.021C17.2159 9.757 16.8896 9.625 16.5 9.625C16.1104 9.625 15.7841 9.757 15.521 10.021C15.2579 10.285 15.1259 10.6113 15.125 11C15.1241 11.3887 15.2561 11.7155 15.521 11.9804C15.7859 12.2453 16.1123 12.3768 16.5 12.375ZM16.5 30.25C14.5979 30.25 12.8104 29.8888 11.1375 29.1665C9.46459 28.4442 8.00938 27.4647 6.77188 26.2281C5.53438 24.9915 4.55492 23.5363 3.8335 21.8625C3.11209 20.1887 2.75092 18.4012 2.75 16.5C2.74909 14.5988 3.11025 12.8113 3.8335 11.1375C4.55675 9.46367 5.53621 8.00846 6.77188 6.77188C8.00754 5.53529 9.46275 4.55583 11.1375 3.8335C12.8123 3.11117 14.5998 2.75 16.5 2.75C18.4003 2.75 20.1877 3.11117 21.8625 3.8335C23.5373 4.55583 24.9925 5.53529 26.2281 6.77188C27.4638 8.00846 28.4437 9.46367 29.1679 11.1375C29.892 12.8113 30.2528 14.5988 30.25 16.5C30.2473 18.4012 29.8861 20.1887 29.1665 21.8625C28.4469 23.5363 27.4675 24.9915 26.2281 26.2281C24.9888 27.4647 23.5336 28.4446 21.8625 29.1679C20.1914 29.8911 18.4039 30.2518 16.5 30.25Z"
                            fill="#025697"
                          />
                        </svg>
                      </button>
                    ))}
                </div>

                {/* Grey hint bar */}
                {showInfoHint && checkedKeys.size === 0 && (
                  <div className="mb-3 px-4 py-2 rounded-md bg-gray-200 text-[#0B5DAA] text-sm !font-[Inter] flex items-center justify-between">
                    <span className="!font-[Inter]">
                      Double-click on a specific row to open the popup for
                      single acknowledgment of alarms
                    </span>
                    <button
                      className="ml-4 text-[#0B5DAA] underline"
                      onClick={() => setShowInfoHint(false)}
                    >
                      Hide
                    </button>
                  </div>
                )}

                {/* Table */}
                <div className="border border-black/10 dark:border-gray-600 rounded-[6px] overflow-hidden">
                  <div className="bg-[#02508C] text-white !font-[Inter] font-bold text-[12px]">
                    <div className="h-[32px] flex items-stretch">
                      {historyCols.map((c, i) => (
                        <div
                          key={c.key}
                          className={[
                            c.basis, // Dynamic width based on the basis (percentage)
                            "px-2 lg:px-4 flex items-center justify-center !font-[Inter]",
                            "border-l border-white/20",
                            i === historyCols.length - 1 ? "rounded-tr-md" : "",
                          ].join(" ")}
                        >
                          {c.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[45vh] overflow-auto custom-scrollbar divide-y divide-[#EBEBEB] dark:divide-gray-700">
                    {historyRows.map((r, idx) => {
                      const key = rowKeyOf(r, idx);
                      const isSelected = selectedRowKey === key; // single-select (no checkboxes)
                      const checked = isChecked(key); // multi-select (checkbox)
                      const anyChecked = checkedKeys.size > 0;
                      const highlight = anyChecked ? checked : isSelected;

                      // Skip rendering or disable checkbox if acknowledged
                      if (r.ack === "Acknowledged") {
                        return (
                          <div
                            key={historyRows.length}
                            title={`Acknowledged by: ${r.accby || "N/A"}`} // Tooltip with the name on hover
                            className={[
                              "flex items-center h-[40px] text-[12px] !font-[Inter] transition-colors relative cursor-not-allowed",
                              highlight
                                ? "!bg-[rgba(203,0,0,0.18)] dark:!bg-red-900/30 ring-1 ring-[#CB0000]/30"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700",
                            ].join(" ")}
                            style={
                              highlight
                                ? { backgroundColor: "#FBE7E7" }
                                : undefined
                            }
                          >
                            <div
                              className={[
                                "absolute left-0 top-0 h-full",
                                highlight
                                  ? "w-[4px] bg-[#CB0000]"
                                  : "w-[3px] bg-[#CB0000]/90",
                              ].join(" ")}
                            />
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.id}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.timeAge}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.timeStamp}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.duration}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.threshold}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.ack}
                            </div>
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.action}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={key}
                          onClick={() => {
                            if (!anyChecked && isSingleAcknowledgment)
                              selectRow(r, key);
                          }}
                          onDoubleClick={() => openAckForRow(r)} // Open model on double-click if "single" acknowledgment
                          title="Double-click to acknowledge"
                          aria-selected={highlight}
                          tabIndex={0}
                          className={[
                            "flex items-center h-[40px] text-[12px] !font-[Inter] transition-colors relative cursor-pointer",
                            highlight
                              ? "!bg-[rgba(203,0,0,0.18)] dark:!bg-red-900/30 ring-1 ring-[#CB0000]/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700",
                          ].join(" ")}
                          style={
                            highlight
                              ? { backgroundColor: "#FBE7E7" }
                              : undefined
                          }
                        >
                          <div
                            className={[
                              "absolute left-0 top-0 h-full",
                              highlight
                                ? "w-[4px] bg-[#CB0000]"
                                : "w-[3px] bg-[#CB0000]/90",
                            ].join(" ")}
                          />
                          {/* Conditionally render checkboxes when not "Acknowledged" */}
                          {!isSingleAcknowledgment && (
                            <div className="basis-[6%] px-2 lg:px-3 flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleCheck(key); // Toggle checkbox selection
                                }}
                                className="w-4 h-4 accent-[#0B5DAA]"
                                disabled={r.ack === "Acknowledged"} // Disable if acknowledged
                              />
                            </div>
                          )}
                          {isSingleAcknowledgment ? (
                            <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                              {r.id}
                            </div>
                          ) : (
                            <div className="basis-[10%] px-2 lg:px-4 text-left text-black/88 dark:text-gray-100">
                              {r.id}
                            </div>
                          )}
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.timeAge}
                          </div>
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.timeStamp}
                          </div>
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.duration}
                          </div>
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.threshold}
                          </div>
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.ack}
                          </div>
                          <div className="basis-[16%] px-2 lg:px-4 text-center text-black/88 dark:text-gray-100">
                            {r.action}
                          </div>
                        </div>
                      );
                    })}

                    {historyRows.length === 0 && (
                      <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-300 !font-[Inter]">
                        No history records found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <AckModal
            open={ackOpen}
            onClose={() => setAckOpen(false)}
            form={ackForm}
            setForm={setAckForm}
            onSubmit={submitAck} // <-- pass the parent submit
            actions={actions}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            userId={userId}
          />
        </div>
      )}
    </>
  );
}

function AckModal({
  open,
  onClose,
  form,
  setForm,
  actions,
  validationErrors,
  setValidationErrors,
  userId,
  onSubmit,
}) {
  if (!open) return null;

  // Function to handle changes in the action dropdown
  const handleActionChange = (e) => {
    setForm((f) => ({ ...f, action: e.target.value }));
    setValidationErrors((errors) => ({ ...errors, action: "" }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-[600px] max-w-[95vw] rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 !border-t-4 !border-t-[#1d5999]">
        <h2 className="text-center text-[24px] font-bold text-[#0B5DAA] dark:text-white !font-[Inter] mb-5">
          Single Acknowledgement Actions
        </h2>

        {/* Form for selecting the action */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 !font-[Inter]">
              Alarm ID
            </label>
            <input
              value={form.id || ""}
              disabled
              className="w-full h-10 rounded text-[#025697] !font-[Inter] border border-gray-300 px-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 !font-[Inter]">
              Alarm Name
            </label>
            <input
              value={form.name || ""}
              disabled
              className="w-full h-10 rounded text-[#025697] !font-[Inter] border border-gray-300 px-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 !font-[Inter]">
              Pv/Threshold
            </label>
            <input
              value={form.threshold || ""}
              disabled
              className="w-full h-10 rounded text-[#025697] !font-[Inter] border border-gray-300 px-3 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Action Dropdown */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 !font-[Inter]">
            Select Action Taken
          </label>
          <select
            value={form.action || ""}
            onChange={handleActionChange}
            className="w-full h-10 text-[#025697] !font-[Inter] rounded border border-gray-300 px-3 text-sm appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" disabled>
              Select…
            </option>
            {actions.map((action, index) => (
              <option key={index} value={action}>
                {action}
              </option>
            ))}
          </select>
          {/* Show validation message for action */}
          {validationErrors.action && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.action}
            </p>
          )}
        </div>

        {/* Custom Action Textarea */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 !font-[Inter]">
            Custom Action
          </label>
          <textarea
            rows={5}
            value={form.custom || ""}
            onChange={(e) => setForm((f) => ({ ...f, custom: e.target.value }))}
            className="w-full text-[#025697] !font-[Inter] rounded border border-gray-300 px-3 py-2 text-sm resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {/* Show validation message for custom action */}
          {validationErrors.custom && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.custom}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              // clear validation errors when closing
              setValidationErrors((errors) => ({ ...errors, action: "" }));
              onClose();
            }}
            className="rounded px-4 py-2 text-sm !font-[Inter] border border-gray-300 dark:border-gray-600 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded bg-[#0B5DAA] px-4 py-2 text-white text-sm !font-[Inter] hover:bg-[#084a87]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
