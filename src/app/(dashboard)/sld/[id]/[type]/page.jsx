"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use } from "react";

const page = ({ params }) => {
  const { type } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("this is type of tab", type);
  return (
    <div className="w-full bg-white p-5 h-[81vh] rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="relative w-[1400px] flex items-start  flex-col h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4">Logs</h1>
        <button
          onClick={() => router.back()}
          className="absolute top-[90px] left-[1110px] z-30 w-[135px] h-[45px] border-1 border-red-500"
        ></button>
        {type === "voltage" ? (
          <img src="../../voltage-logs.png" alt="Voltage logs" />
        ) : type === "energy" ? (
          <img src="../../energy-logs.png" alt="energy logs" />
        ) : (
          ""
        )}
        {/* voltage logs buttons */}
        {type === "voltage" && (
          <>
            <button className="absolute w-[57px] h-[59px] border-1 border-red-500 top-[257px] left-[727px]"></button>
            <button className="absolute w-[57px] h-[59px] border-1 border-red-500 top-[375px] left-[727px]"></button>
            <button className="absolute w-[57px] h-[59px] border-1 border-red-500 top-[457px] left-[727px]"></button>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
