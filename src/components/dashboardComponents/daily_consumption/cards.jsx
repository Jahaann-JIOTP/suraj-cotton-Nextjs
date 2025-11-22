import React from "react";
import { MdInfoOutline } from "react-icons/md";

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
  info = "",
}) => {
  const lightingMeter = [
    "lighting internal",
    "lighting external",
    "unit 5 lighting",
  ];
  const plantMeter = ["ac_ring db 01", "ac_ring bypass"];
  const isLightingMeter = lightingMeter.includes(title.toLowerCase());
  const isPlantMeter = plantMeter.includes(title.toLowerCase());
  const isInfo = info.length > 0;

  return (
    <div className="w-full flex flex-col justify-between relative bg-white shadow-md rounded-lg border dark:bg-gray-800 border-gray-200 overflow-hidden !border-t-4 !border-t-[#1d5999]">
      {/* Info Section */}
      <div className="w-full flex items-center justify-center">
        {isInfo && (
          <div className="absolute right-2 top-2 group">
            {/* Info Button */}
            <button
              type="button"
              className="p-1.5 rounded-full bg-[#E8F5FF] cursor-pointer dark:bg-gray-700 hover:bg-[#d6ebff] dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <MdInfoOutline
                size={22}
                className="text-[#1E538D] dark:text-white"
              />
            </button>

            {/* Tooltip Content */}
            <div
              className="absolute right-0 top-10 w-64 bg-[#1D528B] dark:bg-gray-600 text-gray-200 dark:text-gray-100 
            text-sm font-inter p-2 rounded-sm shadow-xl opacity-0 scale-95 
            group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-300 z-50"
            >
              <div className="flex items-start space-x-2">
                {/* <MdInfoOutline className="text-gray-200 dark:text-[#1E538D] mt-0.5 text-[24px]" /> */}
                <div>{info}</div>
              </div>
              <div className="absolute top-[-6px] right-3 w-3 h-3 rotate-45 bg-[#1D528B] dark:bg-gray-600" />
            </div>
          </div>
        )}
        {/* Title */}
        <div className="text-center p-3      w-[70%]">
          <h2 className="inline-block text-center font-inter text-[#025697] font-semibold text-[17px] tracking-wide relative">
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
      </div>

      {/* Top section */}
      <div className="flex justify-between items-center text-sm text-gray-700 px-4 py-3">
        <div>
          <div className="font-medium  font-inter text-[#545454] dark:text-white">{`No. of ${
            isLightingMeter ? "Lighting" : isPlantMeter ? "Plants" : "Machines"
          }`}</div>
          <div className="text-[#025697]  font-inter font-semibold text-center">
            {machines}
          </div>
        </div>
        <div>
          <div className="font-medium font-inter text-[#545454] dark:text-white">
            Load Connected
          </div>
          <div className="text-[#025697] font-inter font-semibold text-center">
            {loadConnected} kW
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#E8F5FF] rounded-md mx-3 mb-3 p-4 space-y-3">
        {/* Consumption */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img
              src="/consumption.png"
              width={16}
              height={16}
              alt="Consumption"
            />
            <div className="font-medium font-inter text-[#000000]">
              Consumption
            </div>
          </div>
          <div className="text-[#025697] font-inter">
            {fmt2(consumption)} kWh
          </div>
        </div>

        {/* Average Power */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img
              src="/averagepower.png"
              width={16}
              height={16}
              alt="Average Power"
            />
            <div className="font-medium font-inter text-[#000000]">
              Average Power
            </div>
          </div>
          <div className="text-[#025697] font-inter">
            {fmt2(averagePower)} kW
          </div>
        </div>

        {/* Average Power Factor */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img
              src="/powerfactor.png"
              width={16}
              height={16}
              alt="Power Factor"
            />
            <div className="font-medium font-inter text-[#000000]">
              Average Power Factor
            </div>
          </div>
          <div className="text-[#025697] font-inter">
            {fmt2(averagePowerFactor)}
          </div>
        </div>

        {/* Average Voltage */}
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/highvoltage.png" width={16} height={16} alt="Voltage" />
            <div className="font-medium  font-inter text-[#000000]">
              Average Voltage
            </div>
          </div>
          <div className="text-[#025697]  font-inter">
            {fmt2(averageVoltage)} V
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
