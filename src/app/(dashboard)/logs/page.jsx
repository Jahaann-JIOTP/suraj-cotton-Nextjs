"use client";
import Breadcrumbs from "@/components/hooks/Breadcrumb";
import useBreadcrumb from "@/components/hooks/useBreadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";


const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ltScheme = searchParams.get("LT_selections");
  const pageType = searchParams.get("page-type");
  const [isHovered, setIsHovered] = useState(false);
  const meterId = searchParams.get("meter_id");
  const type = searchParams.get("type");
  const area = searchParams.get("area");
  const meterName = searchParams.get("meter_name");
  useBreadcrumb();

  const buttonConfigs = {
    voltage: [
      { paramtype: "voltage", top: 105 },
      { paramtype: "current", top: 197 },
      { paramtype: "power_factor", top: 290 },
    ],
    power: [
      { paramtype: "active_power", top: 104 },
      { paramtype: "reactive_power", top: 197 },
      { paramtype: "apparent_power", top: 290 },
      { paramtype: "harmonics", top: 382 },
    ],
    energy: [{ paramtype: "active_energy", top: 122 }],
  };
  const selectedButtons = buttonConfigs[type] || [];
 
  return (
    <div className="w-full bg-white p-5 h-[81vh] rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start pb-4">
        <h1 className="font-semibold text-2xl font-inter">Logs</h1>
        <Breadcrumbs />
        </div>
        <button
          onClick={() => router.back()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={` flex items-center ${
            isHovered ? "justify-center" : "justify-start"
          } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
            isHovered ? "w-[90px]" : "w-[40px]"
          }`}
          style={{
            borderRadius: isHovered ? "8px" : "50%",
          }}
        >
          <ImArrowLeft2 className="text-white shrink-0" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            Back
          </span>
        </button>
      </div>
      
      <div className="relative w-[1200px] flex items-start justify-center flex-col mx-auto">
        <div className="w-full flex items-center justify-center">
          <img src={`../../../${type}-logs.png`} alt="Voltage logs" />
        </div>
        {/* voltage logs buttons */}

        {selectedButtons.map((btn, index) => (
          <button
            key={index}
            className={`absolute w-[57px] h-[59px] cursor-pointer left-[754px]`}
            style={{ top: `${btn.top}px` }}
            onClick={() =>
              router.push(
                `/log-detail?paramtype=${btn.paramtype}&type=${type}&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default page;
