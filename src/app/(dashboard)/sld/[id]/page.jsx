"use client";
import React from "react";
import { useRouter } from "next/navigation";

const page = ({ param }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
    is;
  };
  return (
    <div>
      page {router.query}
      <button onClick={handleBack} className="cursor-pointer border-2">
        back
      </button>
    </div>
  );
};

export default page;
