"use client";

import { useSearchParams } from "next/navigation";
import InitialSldUnit4 from "@/components/sldComponent/initialSldUnit4/InitialSldUnit4";
import Unit4Lt1 from "@/components/sldComponent/unit4lt1/Unit4Lt1";
import Unit4Lt2 from "@/components/sldComponent/unit4Lt2/Unit4Lt2";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  console.log("QUERY AREA:", area);

  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-4 p-5 border-[#1F5897] overflow-auto">
      <div className="relative min-w-[1250px] min-h-[500px] mx-auto">
        {/* {area === "unit4-lt1" ? (
          <Unit4Lt1 />
        ) : area === "lt2" ? (
          <Unit4Lt2 />
        ) : (
          <InitialSldUnit4 />
        )} */}

        {area === "lt1" ? <Unit4Lt1 /> : <InitialSldUnit4 />}
      </div>
    </div>
  );
};

export default Page;
