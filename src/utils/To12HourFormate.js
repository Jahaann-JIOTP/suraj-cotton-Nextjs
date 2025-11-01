export const to12HourFormat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12; // convert 0 → 12, 13 → 1, etc.
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};
