import React from 'react'

const SankeyTotalValues = ({data, lt}) => {
    // sum of all generations adn consumption 
      function calculateSums(data, totalNode) {
      let generation = 0;
      let consumption = 0;
    
      for (let i = 0; i < data.length; i++) {
        const link = data[i];
    
        // incoming → generation
        if (link.to === totalNode) {
          generation += link.value;
        }
    
        // outgoing → consumption
        if (link.from === totalNode) {
          consumption += link.value;
        }
      }
    
      return { generation, consumption };
    }
    const { generation, consumption } = calculateSums(data, lt);
  return (
    <div className="absolute bottom-3">
        <div className="border-1 flex flex-col border-gray-300 px-3 py-2 rounded gap-1">
          <span className="font-semibold">Total Generation: <span className="font-normal">{generation.toFixed(2)}</span></span>
          <span className="font-semibold">Total Consumption: <span className="font-normal">{consumption.toFixed(2)}</span></span>
        </div>
      </div>
  )
}

export default SankeyTotalValues