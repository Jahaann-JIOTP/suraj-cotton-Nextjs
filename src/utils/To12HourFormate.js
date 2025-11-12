export const to12HourFormat = (timeStr) => {
  if (!timeStr || !timeStr.includes(":")) return ""; // safely handle empty or invalid time

  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr) || 0; // default to 0 if missing

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};
