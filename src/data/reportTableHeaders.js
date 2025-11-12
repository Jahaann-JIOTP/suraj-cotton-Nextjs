//----------------------Low Voltage Side Summary key &heading-----------------------
export const lowVoltageSummaryheadings = [
  { key: "Unit", label: "Unit No." },
  { key: "Total_I_C_G", label: "Total Incoming From Generation (kWh)" },
  { key: "I_C_OU", label: "Total Incoming From Other Unit (kWh)" },
  { key: "Total_Consumption", label: "Total Consumption (kWh)" },
  {
    key: "Total_Tranferred_to_OU",
    label: "Total Transferred to Other Unit (kWh)",
  },
  {
    key: "Unaccounted_Energy",
    label: "Total Unaccountable Energy (kWh)",
  },
];

//----------------------Utilization key &heading-----------------------
export const utilizationHeadings = [
  { key: "Unit", label: "Unit No." },
  {
    key: "TotalConnectedLoadPerDept",
    label: "Total Actual Connected Load (kWh/h)",
  },
  { key: "TotalAvgConsumption", label: "Total Connected Load (kWh/h)" },
  { key: "UtilizationPercent", label: "Utilization" },
];

//----------------------Production summary key &heading-----------------------
export const productionSummaryHeadings = [
  { key: "Unit", label: "Unit No." },
  { key: "TotalProduction", label: "Total No. of Bags" },
  { key: "TotalAvgCount", label: "Avg. Count" },
  { key: "TotalConsumption", label: "Total Consumption (kWh)" },
  { key: "consumptionperbag", label: "Consumption Per Bag (kWh/Bag)" },
];
