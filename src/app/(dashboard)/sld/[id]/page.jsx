"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";

const page = ({ params }) => {
  const [activeTab, setActiveTab] = useState("voltage");
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="w-full bg-white p-5 rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="relative w-[1200px] h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4">Wapda</h1>
        {activeTab === "voltage" ? (
          <img src="../../01_volts.png" alt="" className="w-[1120px]" />
        ) : activeTab === "power" ? (
          <img src="../../Power_1.png" alt="" className="w-[1120px]" />
        ) : activeTab === "energy" ? (
          <img src="../../Energy_log1.png" alt="" className="w-[1120px]" />
        ) : (
          ""
        )}
        <button
          onClick={() => setActiveTab("voltage")}
          className="w-[202px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[7px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("power")}
          className="w-[202px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[217.5px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("energy")}
          className="w-[202px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[428px] cursor-pointer"
        ></button>
        {activeTab === "voltage" && (
          <button
            onClick={() => router.back()}
            className="absolute cursor-pointer h-[38px] w-[118px] z-30 top-[92px] left-[995px] bg-transparent"
          ></button>
        )}
        {/* logs opener */}
        <button className="border-1 border-red-500 w-[50px] h-[47px] absolute z-30 bottom-[88px] left-[31px]"></button>
      </div>
    </div>
  );
};

export default page;
