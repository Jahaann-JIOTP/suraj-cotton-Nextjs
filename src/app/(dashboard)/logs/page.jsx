"use client";
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

  return (
    <div className="w-full bg-white p-5 h-[81vh] rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-semibold text-2xl font-inter pb-4">Logs</h1>
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
          {type === "voltage" ? (
            <img src="../../../voltage-logs.png" alt="Voltage logs" />
          ) : type === "energy" ? (
            <img src="/energy-logs.png" alt="energy logs" />
          ) : type === "power" ? (
            <img src="power-logs.png" alt="energy logs" />
          ) : (
            ""
          )}
        </div>
        {/* voltage logs buttons */}
        {type === "voltage" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[105px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=voltage&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[197px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=current&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[290px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=power_factor&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
          </>
        ) : type === "power" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[104px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=active_power&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[197px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=reactive_power&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[290px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=apparent_power&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[382px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=harmonics&page-type=${pageType}&meter_id=${meterId}&area=${area}&LT_selections=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
          </>
        ) : type === "energy" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px] top-[122px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?paramtype=active_energy&page-type=${pageType}&meter_id=${meterId}&area=${area}&lt-scheme=${ltScheme}&meter_name=${meterName}`
                )
              }
            ></button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default page;
