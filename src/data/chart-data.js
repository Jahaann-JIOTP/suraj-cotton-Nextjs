// Generate sample data for energy usage chart
export const generateEnergyData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(time.getHours() - (23 - i));
    
    data.push({
      time: time.getTime(),
      energy: Math.round(Math.random() * 100 + 300), // Cumulative energy
      energyInterval: Math.round(Math.random() * 15 + 5), // Interval energy
    });
  }
  
  return data;
};

// Generate sample data for power chart
export const generatePowerData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(time.getHours() - (23 - i));
    
    data.push({
      time: time.getTime(),
      power: Math.round(Math.random() * 50 + 200), // Power in kW
    });
  }
  
  return data;
};

// Generate sample data for voltage chart
export const generateVoltageData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(time.getHours() - (23 - i));
    
    data.push({
      time: time.getTime(),
      voltage: Math.round((Math.random() * 20 + 230) * 10) / 10, // Voltage with one decimal
    });
  }
  
  return data;
};

// Helper function to format data for charts
export const formatChartData = (rawData, xKey = 'time') => {
  return rawData.map(item => ({
    ...item,
    [xKey]: new Date(item[xKey]).getTime()
  }));
};