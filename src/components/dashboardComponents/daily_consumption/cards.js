import React from "react";
import Image from "next/image";

const pad2 = (n) => String(n ?? 0).padStart(2, "0");
const fmt2 = (n) => Number(n ?? 0).toFixed(2);

const Card = ({
  title = "—",
  machines = 0,
  loadConnected = 0,     // kWh
  consumption = 0,       // kWh
  averagePower = 0,      // kW
  averagePowerFactor = 0,
  averageVoltage = 0,    // V
}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg border dark:bg-gray-800 border-gray-200 overflow-hidden !border-t-4 !border-t-[#1d5999]">
      {/* Title */}
      <div className="text-center p-3">
        <h2 className="inline-block text-[#025697] font-semibold text-lg tracking-wide relative">
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
          <div className="font-medium text-[#545454] dark:text-white">No. of machines</div>
          <div className="text-[#025697] font-semibold text-center">{pad2(machines)}</div>
        </div>
        <div>
          <div className="font-medium text-[#545454] dark:text-white">Load Connected</div>
          <div className="text-[#025697] font-semibold text-center">{fmt2(loadConnected)} kWh</div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#E8F5FF] rounded-md mx-3 mb-3 p-4 space-y-3">
        {/* Consumption */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Image src="/consumption.png" width={16} height={16} alt="Consumption" />
            <div className="font-medium text-[#000000]">Consumption</div>
          </div>
          <div className="text-[#025697]">{fmt2(consumption)} kWh</div>
        </div>

        {/* Average Power */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Image src="/averagepower.png" width={16} height={16} alt="Average Power" />
            <div className="font-medium text-[#000000]">Average Power</div>
          </div>
          <div className="text-[#025697]">{fmt2(averagePower)} kW</div>
        </div>

        {/* Average Power Factor */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Image src="/powerfactor.png" width={16} height={16} alt="Power Factor" />
            <div className="font-medium text-[#000000]">Average Power Factor</div>
          </div>
          <div className="text-[#025697]">{fmt2(averagePowerFactor)}</div>
        </div>

        {/* Average Voltage */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Image src="/highvoltage.png" width={16} height={16} alt="Voltage" />
            <div className="font-medium text-[#000000]">Average Voltage</div>
          </div>
          <div className="text-[#025697]">{fmt2(averageVoltage)} V</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
