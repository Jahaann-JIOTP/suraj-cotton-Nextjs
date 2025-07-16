export const getDateRangeFromString = (rangeType) => {
  const today = new Date();
  const start = new Date();

  const formatDate = (date) => date.toISOString().split("T")[0];

  switch (rangeType.toLowerCase()) {
    case "today":
      break;

    case "yesterday":
      start.setDate(today.getDate() - 1);
      today.setDate(today.getDate() - 1);
      break;

    case "thisweek": {
      const day = today.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(today.getDate() + mondayOffset);
      break;
    }

    case "last7days":
      start.setDate(today.getDate() - 6);
      break;

    case "thismonth":
      start.setDate(1);
      break;

    case "last30days":
      start.setDate(today.getDate() - 29);
      break;

    case "thisyear":
      start.setMonth(0);
      start.setDate(1);
      break;

    default:
      throw new Error(
        `Invalid range type: "${rangeType}". Use one of: today, yesterday, thisWeek, last7Days, thisMonth, last30Days, or thisYear.`
      );
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(today),
  };
};
