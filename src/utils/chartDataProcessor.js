// utils/chartDataProcessor.js
export const processChartData = (apiData, chartType) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  switch (chartType) {
    case 'energy':
      return apiData.map(item => ({
        time: new Date(item.timestamp).getTime(),
        energyInterval: item.consumption,
        energy: item.sumEnergy
      }));
    // case 'activePower':
    //   return apiData.map(item => ({
    //     time: new Date(item.timestamp).getTime(),
    //     power: item.sumActivePower
    //   }));
    case 'voltage':
      return apiData.map(item => ({
        time: new Date(item.timestamp).getTime(),
        voltage: item.sumVoltage
      }));
    case 'current':
      return apiData.map(item => ({
        time: new Date(item.timestamp).getTime(),
        current: item.sumCurrent
      }));
    // case 'recEnergy':
    //   return apiData.map(item => ({
    //     time: new Date(item.timestamp).getTime(),
    //     recEnergy: item.sumRecEnergy,
    //     activePower: item.sumActivePower
    //   }));
    // case 'harmonics':
    //   return apiData.map(item => ({
    //     time: new Date(item.timestamp).getTime(),
    //     harmonics: item.sumHarmonics
    //   }));
    default:
      return [];
  }
};