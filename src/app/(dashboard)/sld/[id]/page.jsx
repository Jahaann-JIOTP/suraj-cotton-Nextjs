"use client";
import React, { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const page = ({ params }) => {
  const [activeTab, setActiveTab] = useState("voltage");
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  const ltScheme = searchParams.get("lt_scheme");

  return (
    <div className="w-full bg-white p-5 rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="relative w-[1400px] flex items-start  flex-col h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4">Wapda</h1>
        {activeTab === "voltage" ? (
          <img src="../../01_volts.png" alt="" className="w-[1295px]" />
        ) : activeTab === "power" ? (
          <img src="../../Power_1.png" alt="" className="w-[1295px]" />
        ) : activeTab === "energy" ? (
          <img src="../../Energy_log1.png" alt="" className="w-[1295px]" />
        ) : (
          ""
        )}
        <button
          onClick={() => setActiveTab("voltage")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[3px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("power")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[249px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("energy")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[487px] cursor-pointer"
        ></button>
        {activeTab === "voltage" && (
          <button
            onClick={() => router.back()}
            className="absolute cursor-pointer h-[44px] w-[140px] z-30 top-[98px] left-[1150px] bg-transparent"
          ></button>
        )}
        {/* logs opener */}
        <button
          onClick={() =>
            router.push(
              `/sld/${id}/${activeTab}?lt_scheme=${ltScheme}&val=${activeTab}&meter_id=${id}`
            )
          }
          className={`bg-transparent w-[57px] h-[53px] absolute z-30 cursor-pointer`}
          style={{
            top:
              activeTab === "voltage"
                ? "516px"
                : activeTab === "power"
                ? "577px"
                : activeTab === "energy"
                ? "572px"
                : "",
            left:
              activeTab === "voltage"
                ? "36px"
                : activeTab === "power"
                ? "42px"
                : activeTab === "energy"
                ? "37.5px"
                : "",
          }}
        ></button>
      </div>
    </div>
  );
};

export default page;
