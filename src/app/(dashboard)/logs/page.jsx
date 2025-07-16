"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use } from "react";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ltScheme = searchParams.get("lt-scheme");
  const meterId = searchParams.get("meter_id");
  const type = searchParams.get("type");
  const meterName = searchParams.get("meter-name");

  return (
    <div className="w-full bg-white p-5 h-[81vh] rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="relative w-[1300px] flex items-start  flex-col h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4">Logs</h1>
        <button
          onClick={() => router.back()}
          className="absolute top-[85px] left-[1035px] cursor-pointer z-30 w-[135px] h-[45px]"
        ></button>
        {type === "voltage" ? (
          <img src="/voltage-logs.png" alt="Voltage logs" />
        ) : type === "energy" ? (
          <img src="/energy-logs.png" alt="energy logs" />
        ) : type === "power" ? (
          <img src="power-logs.png" alt="energy logs" />
        ) : (
          ""
        )}
        {/* voltage logs buttons */}
        {type === "voltage" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[242px] cursor-pointer left-[676px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=voltage&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[350px] cursor-pointer left-[676px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=current&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[463px] cursor-pointer left-[676px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=power_factor&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
          </>
        ) : type === "power" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[190px] cursor-pointer left-[676px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=active_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[275px] cursor-pointer left-[678px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=reactive_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[375px] cursor-pointer left-[678px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=apparent_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[468px] cursor-pointer left-[678px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=harmonics&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
          </>
        ) : type === "energy" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px] top-[242px] cursor-pointer left-[676px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=active_energy&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            {/* <button
              className="absolute w-[57px] h-[59px] border-1 border-red-500 top-[375px] cursor-pointer left-[727px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=reactive_energy&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button> */}
            {/* <button
              className="absolute w-[57px] h-[59px] border-1 border-red-500 top-[495px] cursor-pointer left-[727px]"
              onClick={() =>
                router.push(`/log-detail?val=power&meter_id=${meterId}&meter-name=${meterName}`)
              }
            ></button> */}
            <div className="w-[400px] h-[70px] bg-[#D8D8D8] z-30 absolute top-[350px] left-[380px]"></div>
            <div className="w-[400px] h-[70px] bg-[#D8D8D8] z-30 absolute top-[460px] left-[380px]"></div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default page;
