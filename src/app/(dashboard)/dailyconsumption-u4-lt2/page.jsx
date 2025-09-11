'use client'
import DailyConsumptionPage from '@/components/dashboardComponents/daily_consumption/DailyConsumptionPage';
import React, { useState } from 'react'
 const getCardsDataFor =  [
    { title: "Yousaf", machines: 4, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-05" },
    { title: "CARD", machines: 5, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-04" },
    { title: "COMBER", machines: 2, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-03" },
    { title: "UNI-LAP", machines: 1, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-30" },
    { title: "DRAWING FINISHER", machines: 4, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-01" },
    { title: "DRAWING BREAKER", machines: 3, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-28" },
    { title: "SPEED FRAME", machines: 6, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-02" },
    { title: "RING FRAME", machines: 7, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-08-20" },
    { title: "AUTO CONER", machines: 3, loadConnected: 0, consumption: 0, averagePower: 0, averagePowerFactor: 0, averageVoltage: 0, updatedAt: "2025-09-06" },
  ];
const U4Lt2Dailyconsumption = () => {
    const [lt2Data, setLt2Data] = useState([])
  return (
    <div className='bg-white shadow dark:bg-gray-800 rounded-md border-t-3 border-[#025697] overflow-y-auto h-full md:h-[81vh] px-4 py-3'>
        <div className=''>
            <DailyConsumptionPage pageTitle="Unit 4 - LT 2" data={getCardsDataFor}/>
        </div>
    </div>
  )
}

export default U4Lt2Dailyconsumption