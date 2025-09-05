"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import config from "../../config";
import { toast } from "react-toastify";

export default function AlarmTypeModal({
  isOpen,
  onClose,
  refreshAlarms,
  mode = "add",          // "add" | "edit"
  alarmData = {},        // {_id, type, priority, color, acknowledgeType}
}) {
  const [alarmType, setAlarmType] = useState("");
  const [color, setColor] = useState("#025697");
  const [acknowledgementType, setAcknowledgementType] = useState("Single");
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priority, setPriority] = useState(1); // number 1..5
  const [formErrors, setFormErrors] = useState({});

  // ---- helpers for robust comparisons ----
  const normStr = (s) => (s ?? "").toString().trim();
  const normColor = (c) => (c ?? "#025697").toString().trim().toUpperCase();
  const normPriority = (p) => Number(p ?? 1);

  const priorityLabels = {
    1: "Priority 1",
    2: "Priority 2",
    3: "Priority 3",
    4: "Priority 4",
    5: "Priority 5",
  };

  // Prefill (or reset) every time modal opens or source changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && alarmData) {
      setAlarmType(normStr(alarmData.type));
      setColor(normColor(alarmData.color));
      setAcknowledgementType(
        normStr(alarmData.acknowledgeType || alarmData.acknowledge_type) || "Single"
      );
      setPriority(normPriority(alarmData.priority));
    } else {
      // add mode fresh defaults
      setAlarmType("");
      setColor("#025697");
      setAcknowledgementType("Single");
      setPriority(1);
    }
    setFormErrors({});
  }, [isOpen, mode, alarmData]);

  // Initial snapshot for EDIT-mode comparison
  const initialEdit = useMemo(() => {
    if (mode !== "edit" || !alarmData) return null;
    return {
      type: normStr(alarmData.type),
      color: normColor(alarmData.color),
      ackType: normStr(alarmData.acknowledgeType || alarmData.acknowledge_type || "Single"),
      priority: normPriority(alarmData.priority),
    };
  }, [mode, alarmData]);

  // Are current values unchanged (EDIT only)?
  const isUnchanged = useMemo(() => {
    if (mode !== "edit" || !initialEdit) return false;
    return (
      normStr(alarmType) === initialEdit.type &&
      normColor(color) === initialEdit.color &&
      normStr(acknowledgementType) === initialEdit.ackType &&
      normPriority(priority) === initialEdit.priority
    );
  }, [mode, initialEdit, alarmType, color, acknowledgementType, priority]);

  // Close priority dropdown when clicking outside
  const priorityRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSave = async () => {
    // Validate
    const errors = {};
    if (!normStr(alarmType)) errors.alarmType = "Alarm Type is required";
    if (!normColor(color)) errors.color = "Color is required";
    if (!priority) errors.priority = "Priority is required";
    if (!normStr(acknowledgementType)) errors.acknowledgementType = "Acknowledgement Type is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // No-op if edit with no changes
    if (mode === "edit" && isUnchanged) return;

    // Build payload
    const payload = {
      type: normStr(alarmType),
      priority: normPriority(priority),
      color: normColor(color),
      code: "L001", // your existing constant
      acknowledgeType: normStr(acknowledgementType),
    };
    if (mode === "edit" && alarmData && alarmData._id) {
      payload.typeId = alarmData._id;
    }

    const url =
      mode === "edit"
        ? `${config.BASE_URL}/alarms/update-types-alarms`
        : `${config.BASE_URL}/alarms/add-types-alarms`;
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        toast.error(text || "Failed to save alarm type");
        throw new Error(`Request failed (${response.status}): ${text}`);
      }

      const data = await response.json();
      toast.success(data.message || (mode === "edit" ? "Updated successfully" : "Added successfully"));

      if (typeof refreshAlarms === "function") refreshAlarms();
      onClose(); // parent should also clear selectedAlarm for perfect reset
    } catch (err) {
      console.error("Error saving alarm type:", err);
      toast.error("Error saving alarm type");
    }
  };

  const hasErrors =
    !!formErrors.alarmType ||
    !!formErrors.color ||
    !!formErrors.priority ||
    !!formErrors.acknowledgementType;

  const isUpdateDisabled = mode === "edit" ? (isUnchanged || hasErrors) : hasErrors;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-700 !border !border-t-4 !border-t-[#1d5999] border-black/10 dark:border-white/10 rounded-[10px] w-full max-w-[373px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-0">
          <div className="relative w-full mt-2 pt-2 pb-0 mb-4">
            <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[#025697] dark:text-white text-base font-semibold !font-[Inter]">
              {mode === "edit" ? "Edit Alarm Type" : "Add New Alarm Type"}
            </h2>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 mt-[2px] w-[18px] h-[18px] flex items-center justify-center text-black dark:text-white cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 mt-5">
          {/* Priority */}
          <div className="relative mb-4" ref={priorityRef}>
            <label className="block text-black dark:text-white text-sm font-medium !font-[Inter] leading-6 mb-1">
              Set Alarm Priority:
            </label>

            <button
              onClick={() => setPriorityOpen(!priorityOpen)}
              className={`w-full cursor-pointer px-[10px] py-[7px] border border-black/15 dark:border-white/20 rounded-md text-[#025697] dark:text-white text-xs font-medium !font-[Inter] leading-5 flex justify-between items-center dark:bg-gray-800 ${
                formErrors.priority ? "border-red-500" : ""
              }`}
            >
              {priorityLabels[priority]}
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="ml-2">
                <path
                  d="M5 3.5L10 8.5L15 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {formErrors.priority && (
              <p className="text-red-500 text-xs mt-1">{formErrors.priority}</p>
            )}

            {priorityOpen && (
              <div className="absolute bg-white z-50 mt-1 dark:bg-gray-700 rounded shadow-lg py-2 w-full">
                {[1, 2, 3, 4, 5].map((val) => (
                  <label
                    key={val}
                    className="!font-[Inter] flex items-center px-3 py-1.5 text-xs text-[black] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={val}
                      checked={priority === val}
                      onChange={() => {
                        setPriority(val);
                        setPriorityOpen(false);
                      }}
                      className="mr-2"
                    />
                    {priorityLabels[val]}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Alarm Type */}
          <div className="mb-4">
            <label className="block text-black dark:text-white text-sm font-medium !font-[Inter] leading-6 mb-1">
              Set Alarm Type:
            </label>
            <div className="relative">
              <input
                type="text"
                value={alarmType}
                onChange={(e) => setAlarmType(e.target.value)}
                placeholder="Set Alarm Type"
                className={`w-full px-[10px] py-[7px] border border-black/15 dark:border-white/20 rounded-md text-[#025697] dark:text-white text-xs !font-[Inter] leading-5 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-800 ${
                  formErrors.alarmType ? "border-red-500" : ""
                }`}
              />
              {formErrors.alarmType && (
                <p className="text-red-500 text-xs mt-1">{formErrors.alarmType}</p>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-black dark:text-white text-sm font-medium !font-[Inter] leading-6 mb-1">
              Set Color
            </label>
            <div className="w-full rounded-md border border-black/15 dark:border-white/20 p-[4px] flex gap-1 dark:bg-gray-800">
              <div className="flex items-center gap-2 w-[60%] px-2 py-1 rounded-[2.003px] bg-[rgba(217,217,217,0.49)] dark:bg-gray-600">
                <div
                  className="w-6 h-5 rounded-sm border border-black/20"
                  style={{ backgroundColor: color }}
                ></div>
                <input
                  type="text"
                  value={color.toUpperCase()}
                  readOnly
                  className="text-xs !font-[Inter] text-black dark:text-white bg-transparent border-none outline-none w-full"
                />
              </div>
              <div className="w-[30%] flex items-center justify-center text-xs !font-[Inter] text-black dark:text-white px-1 py-1 rounded-[2.003px] bg-[rgba(217,217,217,0.49)] dark:bg-gray-600">
                100%
              </div>
              <label className="w-[10%] relative cursor-pointer rounded-[2.003px] flex items-center justify-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.1365 3.41164C14.9389 3.21403 14.7044 3.05727 14.4462 2.95033C14.188 2.84338 13.9113 2.78833 13.6319 2.78833C13.3524 2.78833 13.0757 2.84338 12.8176 2.95033C12.5594 3.05727 12.3248 3.21403 12.1272 3.41164L11.04 4.49889C10.6439 4.30849 10.1984 4.24587 9.76512 4.31968C9.33185 4.3935 8.93223 4.60012 8.62152 4.91096L8.11584 5.41735C7.98406 5.54907 7.87952 5.70546 7.8082 5.8776C7.73688 6.04973 7.70018 6.23423 7.70018 6.42055C7.70018 6.60687 7.73688 6.79137 7.8082 6.96351C7.87952 7.13564 7.98406 7.29203 8.11584 7.42376L3.51577 12.0231C3.31823 12.2208 3.16156 12.4554 3.05471 12.7137C2.94787 12.9719 2.89294 13.2486 2.89307 13.5281V14.8047C2.89307 15.0304 2.98273 15.2469 3.14234 15.4065C3.30195 15.5661 3.51842 15.6558 3.74414 15.6558H5.02076C5.58486 15.6553 6.12569 15.4308 6.52432 15.0317L11.1244 10.433C11.2561 10.5648 11.4125 10.6693 11.5846 10.7407C11.7568 10.812 11.9413 10.8487 12.1276 10.8487C12.3139 10.8487 12.4984 10.812 12.6705 10.7407C12.8427 10.6693 12.9991 10.5648 13.1308 10.433L13.6372 9.92592C13.948 9.6152 14.1546 9.21558 14.2285 8.78232C14.3023 8.34906 14.2397 7.90357 14.0493 7.50745L15.1365 6.42091C15.3341 6.22333 15.4909 5.98876 15.5978 5.73059C15.7048 5.47242 15.7598 5.19572 15.7598 4.91627C15.7598 4.63683 15.7048 4.36013 15.5978 4.10196C15.4909 3.84379 15.3341 3.60922 15.1365 3.41164ZM4.31153 12.7137L8.91088 8.1136L10.5321 9.63726L5.93275 14.2373C5.79977 14.3703 5.20884 14.4305 5.02076 14.4305L4.15967 14.3964V13.5281C4.15967 13.5931 4.17851 12.8466 4.31153 12.7137Z"
                    fill="currentColor"
                  />
                </svg>
              </label>
            </div>
          </div>

          {/* Acknowledgement Type */}
          <div className="mb-6">
            <label className="block text-black dark:text-white text-sm font-medium !font-[Inter] leading-6 mb-2">
              Set Acknowledgement Type
            </label>
            <div className="flex gap-1 max-w-full flex-wrap">
              {["Single", "Both"].map((type) => (
                <label key={type} className="flex items-center gap-[6px] cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="acknowledgement"
                      value={type}
                      checked={acknowledgementType === type}
                      onChange={(e) => setAcknowledgementType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="w-[14px] h-[14px] border border-black/28 dark:border-white/40 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                      {acknowledgementType === type && (
                        <div className="w-[10px] h-[10px] bg-[#025697] rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-[#484848] dark:text-white text-xs !font-[Inter] leading-[21px]">
                    {type === "Single" ? "Single Acknowledgement" : "Single + Mass Acknowledgement"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isUpdateDisabled}
              className={`text-center cursor-pointer bg-[#025697] hover:bg-[#024080] text-white text-xs font-medium !font-[Inter] leading-[21px] rounded-[5px] min-h-[25px] w-[68px] transition-colors
                ${isUpdateDisabled ? "opacity-50 cursor-not-allowed hover:bg-[#025697]" : ""}`}
            >
              {mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
