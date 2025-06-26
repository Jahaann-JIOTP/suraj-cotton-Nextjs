"use client";
import InitialSldUnit4 from "@/components/sldComponent/initialSldUnit4/InitialSldUnit4";
import Unit4Lt1 from "@/components/sldComponent/unit4lt1/Unit4Lt1";
import Unit4Lt2 from "@/components/sldComponent/unit4Lt2/Unit4Lt2";
import React, { useEffect, useState } from "react";
import { ImArrowDown } from "react-icons/im";

const Page = () => {
  const [isLT1, setIsLT1] = useState(false);
  const [isLT2, setIsLT2] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div className="w-full h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-4 p-5 border-[#1F5897] overflow-auto">
      <div className="relative min-w-[1250px] min-h-[500px] mx-auto">
        {isLT1 ? (
          <Unit4Lt1 setIsLT1={setIsLT1} />
        ) : isLT2 ? (
          <Unit4Lt2 setIsLT2={setIsLT2} />
        ) : (
          <InitialSldUnit4 setIsLT1={setIsLT1} setIsLT2={setIsLT2} />
        )}
      </div>
    </div>
  );
};

export default Page;
