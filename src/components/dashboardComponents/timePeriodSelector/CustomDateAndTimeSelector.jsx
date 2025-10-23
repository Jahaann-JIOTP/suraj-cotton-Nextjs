import React from "react";

const CustomDateAndTimeSelector = ({
  intervalPeriod,
  onChange,
  hideTime = false,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFields = { [name]: value };

    // Validate time constraints when dates are the same
    if (
      intervalPeriod.startDate === intervalPeriod.endDate ||
      (name === "endDate" && value === intervalPeriod.startDate) ||
      (name === "startDate" && value === intervalPeriod.endDate)
    ) {
      if (
        (name === "startTime" && value >= intervalPeriod.endTime) ||
        (name === "endTime" && value <= intervalPeriod.startTime) ||
        name === "startDate" ||
        name === "endDate"
      ) {
        // Auto-adjust end time to be at least 30 minutes after start time
        if (name === "startTime") {
          updatedFields.endTime = addMinutes(value, 30);
        } else if (name === "endTime" && value <= intervalPeriod.startTime) {
          // If user tries to set end time before or equal to start time, adjust it
          updatedFields.endTime = addMinutes(intervalPeriod.startTime, 30);
        } else if (name === "startDate" || name === "endDate") {
          // If dates become the same due to date change, ensure time validity
          if (intervalPeriod.startTime >= intervalPeriod.endTime) {
            updatedFields.endTime = addMinutes(intervalPeriod.startTime, 30);
          }
        }
      }
    }

    onChange(updatedFields);
  };

  // Helper function to add minutes to a given time
  const addMinutes = (timeString, minutesToAdd) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${newHours}:${newMinutes}`;
  };

  // Validate end time on blur to handle manual input
  const handleEndTimeBlur = (e) => {
    if (intervalPeriod.startDate === intervalPeriod.endDate) {
      const endTime = e.target.value;
      if (endTime <= intervalPeriod.startTime) {
        const newEndTime = addMinutes(intervalPeriod.startTime, 30);
        onChange({ endTime: newEndTime });
      }
    }
  };

  return (
    <div className="flex items-start lg:items-center flex-col md:flex-row justify-center gap-5">
      <div className="flex items-start md:items-center flex-col md:flex-row gap-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor="startDate"
            className="font-raleway font-600 text-[13.22px]"
          >
            Interval:
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            style={{ width: "9rem" }}
            className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
            onChange={handleChange}
            value={intervalPeriod.startDate}
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="endDate"
            className="font-raleway font-600 text-[13.22px]"
          >
            To
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            style={{ width: "9rem" }}
            className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
            min={intervalPeriod.startDate}
            onChange={handleChange}
            value={intervalPeriod.endDate}
          />
        </div>
      </div>
      {/* Time Range */}
      {!hideTime && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <label
              htmlFor="startTime"
              className="font-raleway font-600 text-[13.22px]"
            >
              Time:
            </label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              style={{ width: "7.3rem" }}
              className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
              onChange={handleChange}
              value={intervalPeriod.startTime}
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="endTime"
              className="font-raleway font-600 text-[13.22px]"
            >
              To:
            </label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              style={{ width: "7.3rem" }}
              className="border-1 border-gray-300 dark:bg-gray-700 rounded px-1 py-[2px]"
              onChange={handleChange}
              onBlur={handleEndTimeBlur}
              value={intervalPeriod.endTime}
              // Removed the min attribute to hide the visual restriction
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateAndTimeSelector;
