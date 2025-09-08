"use client";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import { useSearchParams, useRouter } from "next/navigation";
import config from "../../../config";
import { toast } from "react-toastify";

/* =========================
   Helpers for change detection
   ========================= */
const deepEqual = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

// Normalize current state for comparison
const buildComparableFromState = ({
  alarmName,
  location,
  subLocation,
  device,
  parameter,
  actions,
  triggerPersistChecked,
  triggerOccursChecked,
  persistSeconds,
  occurTimes,
  thresholdValue,
  thresholdComparison,
}) => {
  return {
    alarmName: (alarmName || "").trim(),
    alarmLocation: (location || "").trim(),
    alarmSubLocation: (subLocation || "").trim(),
    alarmDevice: (device || "").trim(),
    alarmParameter: (parameter || "").trim(),
    acknowledgementActions: (actions || []).map((a) => (a || "").trim()),
    alarmTriggerConfig: {
      persistenceEnabled: !!triggerPersistChecked,
      occursEnabled: !!triggerOccursChecked,
      persistenceTime: !!triggerPersistChecked ? Number(persistSeconds || 0) : 0,
      occursCount: !!triggerOccursChecked ? Number(occurTimes || 0) : 0,
      thresholds: [
        {
          operator: (thresholdComparison || ">").trim(),
          value: Number(thresholdValue || 0),
        },
      ],
    },
  };
};

// Normalize initial rowData for comparison
const buildComparableFromRowData = (rd) => {
  const alarmTriggerConfig = rd?.raw?.alarmTriggerConfig || {};
  const firstThreshold =
    (alarmTriggerConfig.thresholds && alarmTriggerConfig.thresholds[0]) || {};

  const persistenceTime = Number(alarmTriggerConfig?.persistenceTime || 0);
  const occursCount = Number(alarmTriggerConfig?.occursCount || 0);

  return {
    alarmName: (rd?.name || "").trim(),
    alarmLocation: (rd?.location || "").trim(),
    alarmSubLocation: (rd?.subLocation || "").trim(),
    alarmDevice: (rd?.device || "").trim(),
    alarmParameter: (rd?.parameter || "").trim(),
    acknowledgementActions: (rd?.actions || []).map((a) => (a || "").trim()),
    alarmTriggerConfig: {
      persistenceEnabled: persistenceTime > 0,
      occursEnabled: occursCount > 0,
      persistenceTime,
      occursCount,
      thresholds: [
        {
          operator: (firstThreshold?.operator || ">").trim(),
          value: Number(firstThreshold?.value ?? 0),
        },
      ],
    },
  };
};

export default function Index() {
  const [triggerPersistChecked, setTriggerPersistChecked] = useState(false);
  const [triggerOccursChecked, setTriggerOccursChecked] = useState(false);
  const [thresholdValue, setThresholdValue] = useState("");
  const [thresholdComparison, setThresholdComparison] = useState(">");
  const [alarmName, setAlarmName] = useState("");
  const [persistSecondsOptions, setPersistSecondsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});

  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const alarm = dataString ? JSON.parse(dataString) : null;
  const rowDataString = searchParams.get("rowData");
  const rowData = rowDataString ? JSON.parse(rowDataString) : null;

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [subLocations, setSubLocations] = useState({});
  const [subLocation, setSubLocation] = useState("");

  const [devices, setDevices] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [device, setDevice] = useState("");
  const [parameter, setParameter] = useState("");
  const [actions, setActions] = useState([""]);

  const priorityLabels = {
    1: "Priority 1",
    2: "Priority 2",
    3: "Priority 3",
    4: "Priority 4",
    5: "Priority 5",
  };

  // Trigger dropdown toggles
  const [showPersistDD, setShowPersistDD] = useState(false);
  const [showOccursDD, setShowOccursDD] = useState(false);

  // Selected values
  const [persistSeconds, setPersistSeconds] = useState("");
  const [occurTimes, setOccurTimes] = useState("");
  const [occurTimesOptions, setOccurTimesOptions] = useState([]);

  // Store the initial comparable snapshot for update mode
  const initialComparableRef = useRef(null);

  /* =========================
     Fetch locations & sublocations
     ========================= */
  useEffect(() => {
    const fetchMappedLocations = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/alarms/mapped-location`);
        const data = await response.json();
        const locationsData = Object.keys(data || {});
        setLocations(locationsData);

        const subLocs = {};
        locationsData.forEach((loc) => {
          subLocs[loc] = data[loc];
        });
        setSubLocations(subLocs);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchMappedLocations();
  }, []);

  /* =========================
     Fetch devices (+suffixes)
     ========================= */
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/trends/getlist`);
        const data = await response.json();
        setDevices(data || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  /* =========================
     Fetch persist seconds options
     ========================= */
  useEffect(() => {
    const fetchPersistSeconds = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/alarms/intervals`);
        const data = await response.json();
        setPersistSecondsOptions((data || []).map((x) => String(x)));
      } catch (error) {
        console.error("Error fetching persistSeconds:", error);
      }
    };
    fetchPersistSeconds();
  }, []);

  /* =========================
     Fetch occur times options
     ========================= */
  useEffect(() => {
    const fetchOccurTimes = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/alarms/time`);
        const data = await response.json();
        setOccurTimesOptions((data || []).map((x) => String(x)));
      } catch (error) {
        console.error("Error fetching occurTimes:", error);
      }
    };
    fetchOccurTimes();
  }, []);
// When devices arrive OR device changes, populate parameters list accordingly.
// Also keep/repair the selected `parameter` if it's valid; otherwise pick first/empty.
useEffect(() => {
  if (!device || !Array.isArray(devices) || devices.length === 0) {
    setParameters([]);
    return;
  }

  const selectedDeviceData = devices.find(d => d.meterId === device);
  const suffixes = selectedDeviceData?.suffixes || [];

  setParameters(suffixes);

  // If current parameter is not in the new suffix list, fix it.
  if (parameter) {
    if (!suffixes.includes(parameter)) {
      setParameter(suffixes[0] || "");
    }
  } else {
    // If nothing selected yet (e.g., update mode), auto-select first if available
    if (suffixes.length > 0) {
      setParameter(suffixes[0]);
    }
  }
}, [devices, device, parameter]);  // <-- important

  const handleDeviceChange = (selectedDevice) => {
    setDevice(selectedDevice);
    const selectedDeviceData = devices.find((d) => d.meterId === selectedDevice);
    setParameters(selectedDeviceData ? selectedDeviceData.suffixes || [] : []);
    setParameter("");
  };

  /* =========================
     Initialize from rowData (update mode)
     ========================= */
  useEffect(() => {
    const rs = searchParams.get("rowData");
    const rd = rs ? JSON.parse(rs) : null;

    if (rd) {
      setLocation(rd.location || "");
      setSubLocation(rd.subLocation || "");
      setDevice(rd.device || "");
      setParameter(rd.parameter || "");
      setActions(rd.actions || [""]);
      setTriggerPersistChecked(!!(rd?.raw?.alarmTriggerConfig?.persistenceTime));
      setTriggerOccursChecked(!!(rd?.raw?.alarmTriggerConfig?.occursCount));

      const alarmTriggerConfig = rd.raw?.alarmTriggerConfig || {};
      setPersistSeconds(
        alarmTriggerConfig.persistenceTime ? String(alarmTriggerConfig.persistenceTime) : ""
      );
      setOccurTimes(
        alarmTriggerConfig.occursCount ? String(alarmTriggerConfig.occursCount) : ""
      );

      const firstThreshold = alarmTriggerConfig.thresholds?.[0] || {};
      setThresholdComparison(firstThreshold.operator || ">");
      setThresholdValue(
        firstThreshold.value !== undefined ? String(firstThreshold.value) : ""
      );
      setAlarmName(rd.name || "");

      // Capture initial comparable snapshot ONCE
      if (!initialComparableRef.current) {
        initialComparableRef.current = buildComparableFromRowData(rd);
      }
    }
  }, [searchParams]);

  /* =========================
     Change detection
     ========================= */
  const currentComparable = useMemo(
    () =>
      buildComparableFromState({
        alarmName,
        location,
        subLocation,
        device,
        parameter,
        actions,
        triggerPersistChecked,
        triggerOccursChecked,
        persistSeconds,
        occurTimes,
        thresholdValue,
        thresholdComparison,
      }),
    [
      alarmName,
      location,
      subLocation,
      device,
      parameter,
      actions,
      triggerPersistChecked,
      triggerOccursChecked,
      persistSeconds,
      occurTimes,
      thresholdValue,
      thresholdComparison,
    ]
  );

  const isUpdateMode = !!(rowData && rowData.name);
  const isChanged = useMemo(() => {
    if (!isUpdateMode) return true; // In Add mode, always allow submit
    if (!initialComparableRef.current) return true;
    return !deepEqual(initialComparableRef.current, currentComparable);
  }, [isUpdateMode, currentComparable]);

  /* =========================
     Form handlers
     ========================= */
  const handleAddAction = () => setActions([...actions, ""]);
  const handleChange = (index, value) => {
    const newActions = [...actions];
    newActions[index] = value;
    setActions(newActions);
  };

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
    setSubLocation("");
    setDevice("");
    setParameter("");
  };

  const handleSubLocationChange = (selectedSubLocation) => {
    setSubLocation(selectedSubLocation);
    setDevice("");
    setParameter("");
  };

  const handleSubmit = async () => {
    if ((isUpdateMode && !isChanged) || loading) return;

    if (rowData?.name) {
      await handleUpdateAlarm();
    } else {
      await handleAddAlarm();
    }
  };

  const validateCommon = () => {
    const errors = {};
    if (!alarmName?.trim()) errors.alarmName = "Alarm Name is required.";
    if (!location) errors.location = "Location is required.";
    if (!subLocation) errors.subLocation = "Sub-Location is required.";
    if (!device) errors.device = "Device is required.";
    if (!parameter) errors.parameter = "Parameter is required.";
    if (!thresholdValue) errors.thresholdValue = "Threshold value is required.";
    if (actions.length === 0 || actions.some((a) => !a.trim())) {
      errors.actions = "At least one action is required.";
    }
    if (triggerPersistChecked && !persistSeconds) {
      errors.persistSeconds = "Please select persistence time.";
    }
    if (triggerOccursChecked && !occurTimes) {
      errors.occurTimes = "Please select occurs count.";
    }
    return errors;
  };

  const handleAddAlarm = async () => {
    if (loading) return;
    const errors = validateCommon();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const payload = {
      alarmTypeId: alarm?._id,
      alarmName: alarmName,
      alarmLocation: location,
      alarmSubLocation: subLocation,
      alarmDevice: device,
      alarmParameter: parameter,
      acknowledgementActions: actions,
      alarmTriggerConfig: {
        persistenceTime: triggerPersistChecked ? Number(persistSeconds) : 0,
        occursCount: triggerOccursChecked ? Number(occurTimes) : 0,
        thresholds: [
          {
            value: Number(thresholdValue),
            operator: thresholdComparison || ">",
          },
        ],
      },
    };

    try {
      setLoading(true);
      const response = await fetch(`${config.BASE_URL}/alarms/add-alarm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result?.message || "Alarm added successfully.");
        router.back();

        // Reset fields
        setAlarmName("");
        setLocation("");
        setSubLocation("");
        setDevice("");
        setParameter("");
        setActions([""]);
        setTriggerPersistChecked(false);
        setTriggerOccursChecked(false);
        setThresholdValue("");
        setThresholdComparison(">");
        setPersistSeconds("");
        setOccurTimes("");
      } else {
        toast.error(result?.message || "Failed to add alarm", {
          position: "top-center",
          style: { zIndex: 9999 },
        });
      }
    } catch (error) {
      console.error("Error occurred while adding the alarm:", error);
      toast.error(error?.message || "An error occurred while adding the alarm.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlarm = async () => {
    if (loading) return;
    const errors = validateCommon();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const payload = {
      alarmConfigId: rowData?._id,
      alarmTypeId: alarm?._id,
      alarmName: alarmName,
      alarmLocation: location,
      alarmSubLocation: subLocation,
      alarmDevice: device,
      alarmParameter: parameter,
      acknowledgementActions: actions,
      alarmTriggerConfig: {
        persistenceTime: triggerPersistChecked ? Number(persistSeconds) : 0,
        occursCount: triggerOccursChecked ? Number(occurTimes) : 0,
        thresholds: [
          {
            value: Number(thresholdValue),
            operator: thresholdComparison || ">",
          },
        ],
      },
    };

    try {
      setLoading(true);
      const response = await fetch(`${config.BASE_URL}/alarms/update-alarm-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result?.message || "Alarm updated successfully.");
        router.back();
      } else {
        toast.error(result?.message || "Error updating alarm.");
      }
    } catch (error) {
      console.error("Error occurred while updating the alarm:", error);
      toast.error(error?.message || "An error occurred while updating the alarm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 !h-[81vh] !min-h-[81vh] dark:bg-gray-800 rounded-[8px] bg-white !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">
      <div className="w-full flex justify-between items-start mb-3 z-1">
        <div className="text-left">
          <span className="flex items-center text-2xl text-[#626469] dark:text-white font-semibold !font-[Inter]">
            <ArrowLeft
              className="w-5 h-5 text-gray-600 cursor-pointer dark:text-white"
              onClick={() => router.back()}
            />
            <span className="ml-2">{rowData?.name ? "Update Alarm" : "Add Alarm"}</span>
          </span>
        </div>
      </div>

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

      <div className="space-y-6">
        <span className="text-[#025697] font-medium text-[22px] leading-[174%] dark:text-white">
          <b className="!font-[Inter]">Alarm Mapping Information</b>
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8%] mt-2">
          <div className="">
            <label className="text-[14px] text-black dark:text-white !font-[Inter] font-semibold">
              Alarm Name
            </label>
            <input
              type="text"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
              placeholder="Enter Alarm Name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-[#025697] dark:text-white dark:bg-gray-700 !font-[Inter]"
            />
            {formErrors.alarmName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.alarmName}</p>
            )}
          </div>

          <div>
            <SelectDropdown
              label="Location"
              options={locations}
              selectedValue={location}
              onChange={handleLocationChange}
              className={`!font-[Inter] ${formErrors.location ? "border-red-500" : ""}`}
              textColor="text-[#025697]"
              width="w-full"
            />
            {formErrors.location && (
              <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8%]">
          <div>
            <SelectDropdown
              label="Sub-Location"
              options={subLocations[location] || []}
              selectedValue={subLocation}
              onChange={handleSubLocationChange}
              className={`!font-[Inter] ${formErrors.subLocation ? "border-red-500" : ""}`}
              textColor="text-[#025697]"
              width="w-full"
            />
            {formErrors.subLocation && (
              <p className="text-red-500 text-xs mt-1">{formErrors.subLocation}</p>
            )}
          </div>

          <div>
            <SelectDropdown
              label="Device"
              options={(devices || []).map((d) => d.meterId)}
              selectedValue={device}
              onChange={handleDeviceChange}
              className={`!font-[Inter] ${formErrors.device ? "border-red-500" : ""}`}
              textColor="text-[#025697]"
              width="w-full"
            />
            {formErrors.device && (
              <p className="text-red-500 text-xs mt-1">{formErrors.device}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8%]">
          <div>
            <SelectDropdown
              label="Parameter"
              options={parameters}
              selectedValue={parameter}
              onChange={setParameter}
              className={`!font-[Inter] ${formErrors.parameter ? "border-red-500" : ""}`}
              textColor="text-[#025697]"
              width="w-full"
            />
            {formErrors.parameter && (
              <p className="text-red-500 text-xs mt-1">{formErrors.parameter}</p>
            )}
          </div>

          {/* Threshold */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-[8%] mt-2">
            <div className="w-full">
              <label className="text-[14px] text-black dark:text-white !font-[Inter] font-semibold">
                Threshold Value
              </label>
              <div className="dark:bg-gray-700 flex items-center gap-2 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs w-full">
                <select
                  className="text-[13px] text-[#025697] dark:text-white dark:bg-gray-700 border-r-1 outline-none p-2 !font-[Inter] w-[30%]"
                  value={thresholdComparison}
                  onChange={(e) => setThresholdComparison(e.target.value)}
                >
                  <option value=">">Greater than</option>
                  <option value="<">Less than</option>
                  <option value=">=">Greater than or equal to</option>
                  <option value="<=">Less than or equal to</option>
                  <option value="==">Equal to</option>
                  <option value="!=">Not equal to</option>
                </select>

                <div className="flex-1">
                  <input
                    type="number"
                    value={thresholdValue}
                    placeholder="Add value here"
                    onChange={(e) => setThresholdValue(e.target.value)}
                    className="w-full text-blue-700 bg-transparent dark:text-white dark:bg-transparent border-none outline-none text-xs p-2 !font-[Inter]"
                  />
                </div>
              </div>
            </div>

            {formErrors.thresholdValue && (
              <p className="text-red-500 text-xs mt-1">{formErrors.thresholdValue}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-2">
          <div className="w-full">
            <label className="text-[14px]  text-black dark:text-white !font-[Inter] font-semibold">
              Actions on Acknowledgement
            </label>
            <div className="flex flex-col space-y-2 w-full">
              {actions.map((action, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[86%_9%] gap-2 w-full items-center"
                >
                  <input
                    type="text"
                    placeholder="Enter Recommended Action"
                    className="dark:bg-gray-700 w-full border border-gray-300 dark:border-gray-600 pl-1 rounded-md text-[13px] text-[#025697] dark:text-white placeholder-[#025697] resize-none !font-[Inter] flex items-center justify-center min-h-[40px] py-2"
                    value={action}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                  {index === actions.length - 1 && (
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 bg-[#025697] rounded-md text-white !font-[Inter]"
                      onClick={handleAddAction}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )}
                  {formErrors.actions && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.actions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trigger Configuration */}
        <div className="space-y-4">
          <span className="text-[#025697] font-medium text-[22px] leading-[174%] dark:text-white">
            <b className="!font-[Inter]">Trigger Configuration</b>
          </span>

          <div className="space-y-3 text-sm text-gray-600 dark:text-white !font-[Inter] mt-2">
            {/* Persist row */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggerPersistChecked}
                  onChange={() => {
                    const newVal = !triggerPersistChecked;
                    setTriggerPersistChecked(newVal);
                    if (!newVal) setPersistSeconds("");
                  }}
                />
                <span>Trigger if condition persists for sec</span>
              </label>

              {persistSeconds && (
                <span className="mr-2 text-[#025697]">{persistSeconds} sec</span>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowPersistDD((v) => !v);
                    setShowOccursDD(false);
                  }}
                  className="text-[#025697] dark:text-white p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Toggle seconds dropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                  >
                    <g clipPath="url(#clip0a)">
                      <path
                        d="M10.4359 1.8937L11.2546 2.70945L6.81296 7.17289C6.74179 7.24483 6.65709 7.302 6.56374 7.34108C6.4704 7.38017 6.37024 7.40041 6.26904 7.40064C6.16784 7.40087 6.06759 7.38109 5.97407 7.34242C5.88054 7.30376 5.79559 7.24698 5.72409 7.17536L1.25989 2.73214L2.07487 1.91344L6.2649 6.08372L10.4359 1.8937Z"
                        fill="#025697"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0a">
                        <rect
                          width="9.24729"
                          height="12.1102"
                          fill="white"
                          transform="translate(12.1101) rotate(89.87)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>

                <div className="absolute left-0 top-full mt-1 !z-200 w-40">
                  {triggerPersistChecked && (
                    <SelectDropdown
                      label=""
                      options={persistSecondsOptions}
                      selectedValue={persistSeconds ? `${persistSeconds} sec` : ""}
                      onChange={(val) => {
                        const num = parseInt(val, 10);
                        setPersistSeconds(Number.isNaN(num) ? "" : String(num));
                        setShowPersistDD(false);
                      }}
                      showToggle={false}
                      labelshow={false}
                      textColor="text-[#025697]"
                      className={`!font-[Inter] ${
                        !triggerPersistChecked ? "cursor-not-allowed" : ""
                      }`}
                      open={showPersistDD}
                      onOpenChange={setShowPersistDD}
                    />
                  )}
                </div>
              </div>
              {formErrors.persistSeconds && (
                <p className="text-red-500 text-xs mt-1">{formErrors.persistSeconds}</p>
              )}
            </div>

            {/* Occurs row */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggerOccursChecked}
                  onChange={() => {
                    const newVal = !triggerOccursChecked;
                    setTriggerOccursChecked(newVal);
                    if (!newVal) setOccurTimes("");
                  }}
                />
                <span>Trigger if condition occurs times</span>
              </label>

              {occurTimes && (
                <span className="mr-2 text-[#025697]">
                  {occurTimes} {occurTimes === "1" ? "time" : "times"}
                </span>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowOccursDD((v) => !v);
                    setShowPersistDD(false);
                  }}
                  className="text-[#025697] dark:text-white p-1 rounded hover:bg-black/5 dark:hover:bg:white/5"
                  aria-label="Toggle times dropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                  >
                    <g clipPath="url(#clip0b)">
                      <path
                        d="M10.4359 1.8937L11.2546 2.70945L6.81296 7.17289C6.74179 7.24483 6.65709 7.302 6.56374 7.34108C6.4704 7.38017 6.37024 7.40041 6.26904 7.40064C6.16784 7.40087 6.06759 7.38109 5.97407 7.34242C5.88054 7.30376 5.79559 7.24698 5.72409 7.17536L1.25989 2.73214L2.07487 1.91344L6.2649 6.08372L10.4359 1.8937Z"
                        fill="#025697"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0b">
                        <rect
                          width="9.24729"
                          height="12.1102"
                          fill="white"
                          transform="translate(12.1101) rotate(89.87)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>

                <div className="absolute left-0 top-full mt-1 z-20 w-40">
                  {triggerOccursChecked && (
                    <SelectDropdown
                      label=""
                      options={occurTimesOptions}
                      selectedValue={
                        occurTimes ? `${occurTimes} ${occurTimes === "1" ? "time" : "times"}` : ""
                      }
                      onChange={(val) => {
                        const n = parseInt(val, 10);
                        setOccurTimes(Number.isNaN(n) ? "" : String(n));
                        setShowOccursDD(false);
                      }}
                      showToggle={false}
                      labelshow={false}
                      textColor="text-[#025697]"
                      className={`!font-[Inter] ${
                        !triggerOccursChecked ? "cursor-not-allowed" : ""
                      }`}
                      open={showOccursDD}
                      onOpenChange={setShowOccursDD}
                      disabled={!triggerOccursChecked}
                    />
                  )}
                </div>
              </div>
              {formErrors.occurTimes && (
                <p className="text-red-500 text-xs mt-1">{formErrors.occurTimes}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={isUpdateMode ? !isChanged || loading : loading}
            className={[
              "px-6 py-2 rounded-md text-lg",
              "bg-[#025697] text-white",
              (isUpdateMode ? !isChanged || loading : loading)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer",
            ].join(" ")}
            title={isUpdateMode && !isChanged ? "No changes to update" : ""}
          >
            {rowData?.name ? "Update Alarm" : "Add Alarm"}
          </button>
        </div>
      </div>
    </div>
  );
}
