"use client";
import React from "react";
import Link from "next/link";

import { ImArrowDown } from "react-icons/im";
import { useRouter } from "next/navigation";

const InitialSldUnit4 = () => {
  const router = useRouter();

  return (
    <div className="w-full overflow-auto">
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {/* Diagram Image */}
        <img
          src="../../../unit-4-sld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Buttons */}
        <button
          onClick={() => router.replace("/sld?unit=unit4&area=lt1")}
          className="absolute top-[362px] left-[188.5px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>
        <button
          onClick={() => router.push("/sld?unit=unit4&area=lt2")}
          className="absolute top-[362px] left-[954px] bg-gradient-to-tr from-[#426DD6]  to-[#74CCFE] p-2 rounded cursor-pointer"
        >
          <ImArrowDown size={30} className="text-white" />
        </button>

        {/* Meter Readings */}
        {/* LT1 Power House */}
        <div className="meterReadingUnit4 absolute top-[190.5px] left-[103px]">
          1228
        </div>
        <div className="meterReadingUnit4 absolute top-[211px] left-[103px]">
          1398
        </div>
        <div className="meterReadingUnit4 absolute top-[233px] left-[103px]">
          1572
        </div>

        {/* LT1 Sync Point */}
        <div className="meterReadingUnit4 absolute top-[190.5px] left-[260px]">
          1228
        </div>
        <div className="meterReadingUnit4 absolute top-[211px] left-[260px]">
          1398
        </div>
        <div className="meterReadingUnit4 absolute top-[233px] left-[260px]">
          1572
        </div>

        {/* LT2 Power House */}
        <div className="meterReadingUnit4 absolute top-[190.5px] left-[868px]">
          1228
        </div>
        <div className="meterReadingUnit4 absolute top-[211px] left-[868px]">
          1398
        </div>
        <div className="meterReadingUnit4 absolute top-[233px] left-[868px]">
          1572
        </div>

        {/* LT2 Sync Point */}
        <div className="meterReadingUnit4 absolute top-[190.5px] left-[1025.3px]">
          1228
        </div>
        <div className="meterReadingUnit4 absolute top-[211px] left-[1025.3px]">
          1398
        </div>
        <div className="meterReadingUnit4 absolute top-[233px] left-[1025.3px]">
          1572
        </div>
      </div>
    </div>
  );
};

export default InitialSldUnit4;
