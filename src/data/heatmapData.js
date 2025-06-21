// // File: data/heatmapData.js

// function getHourLabels() {
//   return ["1am", "4am", "7am", "10am", "1pm", "4pm", "7pm", "10pm"];
// }

// function getWeekLabels(mode) {
//   const now = new Date();
//   const labels = [];

//   if (mode === "daily") {
//     const day = now.toLocaleDateString("en-GB"); // e.g., 21/06/2025
//     labels.push(day);
//   } else if (mode === "weekly") {
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date(now);
//       d.setDate(now.getDate() - i);
//       labels.push(d.toLocaleDateString("en-GB"));
//     }
//   } else if (mode === "monthly") {
//     const year = now.getFullYear();
//     const month = now.getMonth();
//     const days = [1, 4, 8, 12, 16, 20, 24, 28];
//     days.forEach((day) => {
//       labels.push(`${day}/${month + 1}/${year}`);
//     });
//   } else if (mode === "yearly") {
//     return [
//       "1 Jul",
//       "18 Jul",
//       "24 Aug",
//       "20 Sep",
//       "17 Oct",
//       "13 Nov",
//       "10 Dec",
//       "6 Jan",
//       "2 Feb",
//       "1 Mar",
//       "28 Mar",
//       "24 Apr",
//       "21 May",
//       "17 Jun",
//     ];
//   }

//   return labels;
// }

// // Generate values between 800 and 2500
// function generateValue() {
//   return Math.floor(Math.random() * (2500 - 800 + 1)) + 800;
// }

// function generateHeatMapData(mode = "monthly") {
//   const hours = getHourLabels();
//   const days = getWeekLabels(mode);
//   const data = [];

//   for (const day of days) {
//     for (const hour of hours) {
//       data.push({
//         hour,
//         weekday: day,
//         value: generateValue(),
//       });
//     }
//   }

//   return data;
// }

// // Default to monthly for now
// export const heatmapData = generateHeatMapData("monthly");

// // For axis rendering
// export const xLabels = getHourLabels();
// export const yLabels = getWeekLabels("monthly");

export const dailyData = [
  { hour: "1:00 AM", date: "Today", value: 850 },
  { hour: "4:00 AM", date: "Today", value: 920 },
  { hour: "7:00 AM", date: "Today", value: 1200 },
  { hour: "10:00 AM", date: "Today", value: 1800 },
  { hour: "1:00 PM", date: "Today", value: 2100 },
  { hour: "4:00 PM", date: "Today", value: 1900 },
  { hour: "7:00 PM", date: "Today", value: 1600 },
  { hour: "10:00 PM", date: "Today", value: 1100 },
];
export const weeklyData = [
  { hour: "1:00 AM", date: "Mon 1", value: 850 },
  { hour: "4:00 AM", date: "Mon 1", value: 920 },
  { hour: "7:00 AM", date: "Mon 1", value: 1200 },
  { hour: "10:00 AM", date: "Mon 1", value: 1800 },
  { hour: "1:00 PM", date: "Mon 1", value: 2100 },
  { hour: "4:00 PM", date: "Mon 1", value: 1900 },
  { hour: "7:00 PM", date: "Mon 1", value: 1600 },
  { hour: "10:00 PM", date: "Mon 1", value: 1100 },

  { hour: "1:00 AM", date: "Tue 2", value: 900 },
  { hour: "4:00 AM", date: "Tue 2", value: 950 },
  { hour: "7:00 AM", date: "Tue 2", value: 1250 },
  { hour: "10:00 AM", date: "Tue 2", value: 1850 },
  { hour: "1:00 PM", date: "Tue 2", value: 2150 },
  { hour: "4:00 PM", date: "Tue 2", value: 1950 },
  { hour: "7:00 PM", date: "Tue 2", value: 1650 },
  { hour: "10:00 PM", date: "Tue 2", value: 1150 },

  // Add data for all 7 days...
];
export const monthlyData = [
  { hour: "1:00 AM", date: "1", value: 850 },
  { hour: "4:00 AM", date: "1", value: 920 },
  { hour: "7:00 AM", date: "1", value: 1200 },
  { hour: "10:00 AM", date: "1", value: 1800 },
  { hour: "1:00 PM", date: "1", value: 2100 },
  { hour: "4:00 PM", date: "1", value: 1900 },
  { hour: "7:00 PM", date: "1", value: 1600 },
  { hour: "10:00 PM", date: "1", value: 1100 },

  { hour: "1:00 AM", date: "4", value: 900 },
  { hour: "4:00 AM", date: "4", value: 950 },
  { hour: "7:00 AM", date: "4", value: 1250 },
  { hour: "10:00 AM", date: "4", value: 1850 },
  { hour: "1:00 PM", date: "4", value: 2150 },
  { hour: "4:00 PM", date: "4", value: 1950 },
  { hour: "7:00 PM", date: "4", value: 1650 },
  { hour: "10:00 PM", date: "4", value: 1150 },

  // Add data for all month dates with gap of 3...
];
