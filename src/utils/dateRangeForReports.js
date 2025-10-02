export const getDateRangeFromString = (period) => {
  const today = new Date();
  let startDate, endDate;

  switch (period) {
    case "Today":
      startDate = today.toISOString().split("T")[0];
      endDate = today.toISOString().split("T")[0];
      break;

    case "Yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = yesterday.toISOString().split("T")[0];
      endDate = today.toISOString().split("T")[0]; // fixed: yesterday only
      break;
    }

    case "This Week": {
      const day = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const mondayOffset = day === 0 ? -6 : 1 - day; // shift back to Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);

      startDate = monday.toISOString().split("T")[0];
      endDate = today.toISOString().split("T")[0]; // end = today
      break;
    }

    case "This Month": {
      const formatDate = (date) => {
        const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
        return new Date(date - tzOffset).toISOString().split("T")[0];
      };
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      startDate = formatDate(firstDayOfMonth);
      endDate = formatDate(today);
      break;
    }

    default:
      startDate = today.toISOString().split("T")[0];
      endDate = today.toISOString().split("T")[0];
  }

  return { startDate, endDate };
};
