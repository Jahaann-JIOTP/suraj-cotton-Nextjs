import React from "react";

const pad2 = (n) => String(n ?? 0).padStart(2, "0");
const fmt2 = (n) => Number(n ?? 0).toFixed(2);

const Card = ({
  title,
  machines,
  loadConnected,
  consumption,
  averagePower,
  averagePowerFactor,
  averageVoltage,
}) => {
  const lightingMeter = ["lighting internal", "lighting external", "unit 5 lighting"];
  const isLightingMeter = lightingMeter.includes(title.toLowerCase())
  
  return (
    <div className="w-full bg-white shadow-md rounded-lg border dark:bg-gray-800 border-gray-200 overflow-hidden !border-t-4 !border-t-[#1d5999]">
      {/* Title */}
      <div className="text-center p-3">
        <h2 className="inline-block uppercase font-inter text-[#025697] font-semibold text-[17px] tracking-wide relative">
          {title}
          <span
            className="block h-[0.2vh] mt-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #CAD6E0 20%, #025697 50%, #CAD6E0 80%, transparent 100%)",
            }}
          />
        </h2>
      </div>

      {/* Top section */}
      <div className="flex justify-between items-center text-sm text-gray-700 px-4 py-3">
        <div>
          <div className="font-medium  font-inter text-[#545454] dark:text-white">{`No. of ${isLightingMeter?"Lighting":"Machines"}`}</div>
          <div className="text-[#025697]  font-inter font-semibold text-center">{pad2(machines)}</div>
        </div>
        <div>
          <div className="font-medium font-inter text-[#545454] dark:text-white">Load Connected</div>
          <div className="text-[#025697] font-inter font-semibold text-center">{fmt2(loadConnected)} kW</div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#E8F5FF] rounded-md mx-3 mb-3 p-4 space-y-3">
        {/* Consumption */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/consumption.png" width={16} height={16} alt="Consumption" />
            <div className="font-medium font-inter text-[#000000]">Consumption</div>
          </div>
          <div className="text-[#025697] font-inter">{fmt2(consumption)} kWh</div>
        </div>

        {/* Average Power */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/averagepower.png" width={16} height={16} alt="Average Power" />
            <div className="font-medium font-inter text-[#000000]">Average Power</div>
          </div>
          <div className="text-[#025697] font-inter">{fmt2(averagePower)} kW</div>
        </div>

        {/* Average Power Factor */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/powerfactor.png" width={16} height={16} alt="Power Factor" />
            <div className="font-medium font-inter text-[#000000]">Average Power Factor</div>
          </div>
          <div className="text-[#025697] font-inter">{fmt2(averagePowerFactor)}</div>
        </div>

        {/* Average Voltage */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/highvoltage.png" width={16} height={16} alt="Voltage" />
            <div className="font-medium  font-inter text-[#000000]">Average Voltage</div>
          </div>
          <div className="text-[#025697]  font-inter">{fmt2(averageVoltage)} V</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
